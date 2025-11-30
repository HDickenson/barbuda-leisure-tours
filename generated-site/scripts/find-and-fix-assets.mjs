import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'
import { Client as MCPClient } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

// Optional: sharp for compression, handled gracefully if not available
let sharp = null
try {
  const m = await import('sharp')
  sharp = m.default || m
} catch (e) {
  // sharp not available or failed to load; continue without compression
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')

const ORIGIN = 'https://www.barbudaleisure.com'
const ENGINE = (process.env.ASSETS_ENGINE || getArg('--engine') || 'http').toLowerCase()
const REMOTE_RE = /https?:\/\/(?:www\.)?barbudaleisure\.com\/(wp-content\/[\w\-/%.]+\.(?:png|jpe?g|webp|svg|gif|avif))/gi

/**
 * Recursively walk a directory and collect files with specific extensions
 */
async function walk(dir, exts, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    // Skip heavy or irrelevant folders
    if (e.isDirectory()) {
      if (['.next', 'node_modules', '.git', '.vercel', 'images'].includes(e.name)) continue
      await walk(path.join(dir, e.name), exts, out)
    } else {
      const ext = path.extname(e.name).toLowerCase()
      if (exts.includes(ext)) out.push(path.join(dir, e.name))
    }
  }
  return out
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

function toLocalPathFromUrl(urlPath) {
  // urlPath starts with 'wp-content/...'
  const rel = path.join('images', urlPath.replace(/\\/g, '/'))
  return {
    relWebPath: '/' + rel.replace(/\\/g, '/'),
    absPath: path.join(PUBLIC_DIR, rel),
  }
}

async function fetchBuffer(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const arrayBuf = await res.arrayBuffer()
  return Buffer.from(arrayBuf)
}

async function compressIfLarge(absPath) {
  if (!sharp) return { compressed: false }
  try {
    const stat = await fs.stat(absPath)
    if (stat.size < 1_000_000) return { compressed: false } // <1MB fine

    const ext = path.extname(absPath).toLowerCase()
    const base = absPath.slice(0, -ext.length)

    if (ext === '.jpg' || ext === '.jpeg') {
      const tmp = base + '.tmp.jpg'
      await sharp(absPath).jpeg({ quality: 80 }).toFile(tmp)
      await fs.rename(tmp, absPath)
      return { compressed: true, method: 'jpeg:80' }
    }
    if (ext === '.png') {
      const tmp = base + '.tmp.png'
      await sharp(absPath).png({ compressionLevel: 8 }).toFile(tmp)
      await fs.rename(tmp, absPath)
      return { compressed: true, method: 'png:8' }
    }
    // For others, skip for now
    return { compressed: false }
  } catch (e) {
    return { compressed: false, error: e.message }
  }
}

async function collectRemoteUrls() {
  const targets = [
    path.join(ROOT, 'app'),
    path.join(ROOT, 'components'),
    path.join(PUBLIC_DIR, 'css'),
  ]
  const exts = ['.ts', '.tsx', '.js', '.jsx', '.css', '.html']
  const files = []
  for (const t of targets) {
    try {
      const f = await walk(t, exts)
      files.push(...f)
    } catch {}
  }

  const urlSet = new Set()

  for (const f of files) {
    const text = await fs.readFile(f, 'utf8')
    let m
    while ((m = REMOTE_RE.exec(text)) !== null) {
      const urlPath = m[1]
      urlSet.add(`${ORIGIN}/${urlPath}`)
    }
  }

  // Merge from images.json if present
  try {
    const imgJsonPath = path.join(ROOT, 'images.json')
    const json = JSON.parse(await fs.readFile(imgJsonPath, 'utf8'))
    for (const u of json.images || []) {
      const match = u.match(/https?:\/\/(?:www\.)?barbudaleisure\.com\/(wp-content\/.+)/)
      if (match) urlSet.add(`${ORIGIN}/${match[1]}`)
    }
  } catch {}

  return Array.from(urlSet)
}

function getArg(name) {
  const idx = process.argv.indexOf(name)
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1]
  return null
}

async function collectViaMCP() {
  // Optionally navigate key pages and capture network requests via MCP
  const routes = (process.env.TARGET_ROUTES?.split(',').map(s => s.trim()).filter(Boolean)) || [
    '/', '/about', '/tours', '/reviews', '/faq'
  ]
  const urls = new Set()
  const transport = new StdioClientTransport({ command: 'npx', args: ['-y', 'chrome-devtools-mcp@latest', '--headless=true', '--isolated=true'] })
  const client = new MCPClient({ name: 'find-and-fix-assets', version: '1.0.0' }, { capabilities: {} })
  await client.connect(transport)
  try {
    for (const r of routes) {
      const pageUrl = new URL(r, ORIGIN).toString()
      await client.callTool({ name: 'chrome-devtools__new_page', arguments: {} })
      await client.callTool({ name: 'chrome-devtools__navigate_page', arguments: { type: 'url', url: pageUrl, timeout: 15000 } })
      await new Promise(res => setTimeout(res, 1200))
      const net = await client.callTool({ name: 'chrome-devtools__list_network_requests', arguments: {} })
      const items = Array.isArray(net?.content) ? net.content : []
      let reqs = []
      if (items.length === 1 && items[0].type === 'text') {
        try { reqs = JSON.parse(items[0].text) } catch { reqs = [] }
      } else if (items.length) {
        reqs = items
      }
      for (const req of reqs) {
        const href = req.url || req?.request?.url
        if (!href) continue
        const m = href.match(/https?:\/\/(?:www\.)?barbudaleisure\.com\/(wp-content\/.+)/)
        if (m) urls.add(`${ORIGIN}/${m[1]}`)
      }
    }
  } finally {
    await transport.close()
  }
  return Array.from(urls)
}

async function downloadAll(urls) {
  const results = []
  for (const url of urls) {
    const m = url.match(/https?:\/\/(?:www\.)?barbudaleisure\.com\/(wp-content\/.+)/)
    if (!m) continue
    const { relWebPath, absPath } = toLocalPathFromUrl(m[1])
    try {
      await ensureDir(path.dirname(absPath))
      const buf = await fetchBuffer(url)
      await fs.writeFile(absPath, buf)
      const comp = await compressIfLarge(absPath)
      results.push({ url, savedAs: relWebPath, ok: true, comp })
    } catch (e) {
      results.push({ url, error: e.message, ok: false })
    }
  }
  return results
}

async function replaceReferences() {
  const targets = [
    path.join(ROOT, 'app'),
    path.join(ROOT, 'components'),
    path.join(PUBLIC_DIR, 'css'),
  ]
  const exts = ['.ts', '.tsx', '.js', '.jsx', '.css', '.html']
  let files = []
  for (const t of targets) {
    try { files.push(...await walk(t, exts)) } catch {}
  }

  let totalReplacements = 0
  for (const f of files) {
    let text = await fs.readFile(f, 'utf8')
    let changed = false
    text = text.replace(REMOTE_RE, (_m, p1) => {
      changed = true
      return `/${path.posix.join('images', p1.replace(/\\/g, '/'))}`
    })
    if (changed) {
      await fs.writeFile(f, text, 'utf8')
      totalReplacements++
    }
  }
  return totalReplacements
}

async function main() {
  console.log('🔎 Collecting remote asset URLs...')
  let urls = await collectRemoteUrls()
  if (ENGINE === 'mcp') {
    console.log('🧠 Using MCP to discover additional assets via network capture...')
    try {
      const extra = await collectViaMCP()
      const merged = new Set([...(urls || []), ...extra])
      urls = Array.from(merged)
    } catch (e) {
      console.warn('MCP discovery failed, continuing without it:', e.message)
    }
  }
  console.log(`Found ${urls.length} unique remote assets to fetch`)

  console.log('⬇️  Downloading assets and compressing large files...')
  const results = await downloadAll(urls)
  const ok = results.filter(r => r.ok).length
  const fail = results.length - ok
  const compressed = results.filter(r => r.ok && r.comp && r.comp.compressed).length
  console.log(`Downloaded: ${ok}, Failed: ${fail}, Compressed: ${compressed}`)

  console.log('✏️  Rewriting references to local /images paths...')
  const replacements = await replaceReferences()
  console.log(`Updated ${replacements} files with local image references`)

  // Write a small report
  const reportPath = path.join(ROOT, 'asset-fix-report.json')
  await fs.writeFile(reportPath, JSON.stringify({
    when: new Date().toISOString(),
    urlsCount: urls.length,
    downloaded: ok,
    failed: fail,
    compressed,
    node: process.version,
    platform: `${os.platform()}-${os.arch()}`
  }, null, 2))
  console.log(`📝 Report written to ${path.relative(ROOT, reportPath)}`)
}

main().catch((e) => {
  console.error('Asset fix script failed:', e)
  process.exit(1)
})
