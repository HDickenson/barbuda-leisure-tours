import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import cssnano from 'cssnano'

const ROOT = process.cwd()
const PUBLIC_DIR = path.join(ROOT, 'public')
const CSS_DIR = path.join(PUBLIC_DIR, 'css')
const OUT_DIR = path.join(CSS_DIR, 'build')
const REM_DIR = path.join(OUT_DIR, 'remainders')
const THRESHOLD = Number(process.env.CSS_SHARED_THRESHOLD || 3) // rule must appear in >= N files

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }) }

function ruleSignature(node) {
  if (node.type === 'rule') {
    const decls = []
    node.walkDecls(d => { decls.push(`${d.prop.trim()}:${d.value.trim()}`) })
    decls.sort()
    return `R|${node.selector}|${decls.join(';')}`
  }
  if (node.type === 'atrule') {
    const params = node.params || ''
    if (node.name === 'media') {
      const inner = []
      node.walkRules(r => {
        const d = []
        r.walkDecls(x => d.push(`${x.prop.trim()}:${x.value.trim()}`))
        d.sort()
        inner.push(`R|${r.selector}|${d.join(';')}`)
      })
      inner.sort()
      return `A|media|${params}|${inner.join('|')}`
    }
    // keep other at-rules as-is
    return `A|${node.name}|${params}`
  }
  return null
}

async function readCssFiles() {
  const files = []
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const e of entries) {
      if (e.isDirectory()) {
        await walk(path.join(dir, e.name))
      } else if (e.name.endsWith('.css')) {
        files.push(path.join(dir, e.name))
      }
    }
  }
  try { await walk(CSS_DIR) } catch {}
  return files
}

async function parseRules(file) {
  const text = await fs.readFile(file, 'utf8')
  const root = postcss.parse(text, { from: file })
  const sigs = []
  root.walk(node => {
    const sig = ruleSignature(node)
    if (sig) sigs.push(sig)
  })
  return { file, sigs, root }
}

async function buildShared() {
  await ensureDir(OUT_DIR)
  await ensureDir(REM_DIR)
  const files = await readCssFiles()
  const parsed = []
  for (const f of files) parsed.push(await parseRules(f))

  const freq = new Map()
  for (const p of parsed) {
    const seen = new Set()
    for (const s of p.sigs) {
      if (seen.has(s)) continue
      seen.add(s)
      freq.set(s, (freq.get(s) || 0) + 1)
    }
  }

  // Collect shared signatures
  const shared = new Set()
  for (const [s, n] of freq.entries()) {
    if (n >= THRESHOLD) shared.add(s)
  }

  // Reconstruct shared CSS from first occurrence
  const sharedRoot = postcss.root()
  for (const p of parsed) {
    p.root.walk(node => {
      const sig = ruleSignature(node)
      if (sig && shared.has(sig)) {
        sharedRoot.append(node.clone())
        shared.delete(sig) // keep single copy
      }
    })
    if (shared.size === 0) break
  }

  // Write remainders per file
  for (const p of parsed) {
    const remRoot = postcss.root()
    p.root.walk(node => {
      const sig = ruleSignature(node)
      if (sig && !freq.has(sig)) return
      if (sig && freq.get(sig) < THRESHOLD) remRoot.append(node.clone())
    })
    const outPath = path.join(REM_DIR, path.basename(p.file))
    await fs.writeFile(outPath, remRoot.toResult().css, 'utf8')
  }

  // Minify and write shared.css
  const result = await postcss([cssnano()]).process(sharedRoot.toResult().css, { from: undefined })
  await fs.writeFile(path.join(OUT_DIR, 'shared.css'), result.css, 'utf8')
  console.log(`Shared CSS written to ${path.relative(ROOT, path.join(OUT_DIR, 'shared.css'))}`)
}

buildShared().catch(e => { console.error(e); process.exit(1) })
