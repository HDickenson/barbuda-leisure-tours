import fs from 'node:fs/promises'
import path from 'node:path'

async function main() {
  const root = process.cwd()
  const manifestPath = path.join(root, '.next', 'prerender-manifest.json')
  const outDir = path.join(root, 'visual')
  const outPath = path.join(outDir, 'routes.json')
  try {
    const txt = await fs.readFile(manifestPath, 'utf8')
    const m = JSON.parse(txt)
    const routes = Object.keys(m.routes || {}).filter(r => r !== '/_not-found')
    await fs.mkdir(outDir, { recursive: true })
    await fs.writeFile(outPath, JSON.stringify(routes, null, 2))
    console.log(`WROTE ${outPath} with ${routes.length} routes`)
  } catch (e) {
    console.error('Failed to generate routes from manifest:', e.message)
    process.exit(1)
  }
}

main()
