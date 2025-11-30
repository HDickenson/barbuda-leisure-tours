import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

let sharp = null
try {
  const m = await import('sharp')
  sharp = m.default || m
} catch (e) {
  console.error('Sharp is required for compression. Install it and retry.')
  process.exit(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')

const exts = new Set(['.jpg', '.jpeg', '.png'])

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.isDirectory()) {
      if (['.next', 'node_modules', '.git', '.vercel'].includes(e.name)) continue
      await walk(path.join(dir, e.name), out)
    } else {
      const ext = path.extname(e.name).toLowerCase()
      if (exts.has(ext)) out.push(path.join(dir, e.name))
    }
  }
  return out
}

async function compress(absPath) {
  const ext = path.extname(absPath).toLowerCase()
  const base = absPath.slice(0, -ext.length)
  if (ext === '.jpg' || ext === '.jpeg') {
    const tmp = base + '.tmp.jpg'
    await sharp(absPath).jpeg({ quality: 80 }).toFile(tmp)
    await fs.rename(tmp, absPath)
    return 'jpeg:80'
  }
  if (ext === '.png') {
    const tmp = base + '.tmp.png'
    await sharp(absPath).png({ compressionLevel: 8 }).toFile(tmp)
    await fs.rename(tmp, absPath)
    return 'png:8'
  }
}

async function main() {
  const files = await walk(PUBLIC_DIR)
  let total = 0, saved = 0
  for (const f of files) {
    const stat = await fs.stat(f)
    if (stat.size >= 1_000_000) { // >= 1MB
      const before = stat.size
      const method = await compress(f)
      const after = (await fs.stat(f)).size
      total++
      saved += Math.max(0, before - after)
      console.log(`Compressed: ${path.relative(PUBLIC_DIR, f)} via ${method} | ${(before/1_000_000).toFixed(2)}MB -> ${(after/1_000_000).toFixed(2)}MB`)
    }
  }
  console.log(`Done. Compressed ${total} images. Saved ${(saved/1_000_000).toFixed(2)} MB`)
}

main().catch(e => { console.error(e); process.exit(1) })
