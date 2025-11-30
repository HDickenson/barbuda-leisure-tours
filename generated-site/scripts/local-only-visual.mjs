import fs from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer'

const LOCAL = process.env.LOCAL_ORIGIN || 'http://localhost:3001'
const OUTDIR = path.join(process.cwd(), 'visual', 'local-qc')
const ROUTES = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/reviews',
  '/tours',
  '/blog',
  '/blog/discover-the-enchanting-island-of-barbuda',
  '/blog/best-time-visit-barbuda',
  '/blog/stingray-city-conservation',
  '/blog/photography-tips-caribbean',
  '/tours/airplane-adventure',
  '/tours/already-in-barbuda',
  '/tours/barbuda-beach-escape',
  '/tours/barbuda-sky-sea-adventure',
  '/tours/discover-barbuda-by-air',
  '/tours/discover-barbuda-by-sea',
  '/tours/excellence-barbuda-by-sea',
  '/tours/helicopter-adventure',
  '/tours/shared-boat-charter',
  '/tours/yacht-adventure',
]

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function main() {
  await ensureDir(OUTDIR)
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 })

  const report = []

  for (const route of ROUTES) {
    const safe = route.replace(/\//g, '_') || 'home'
    try {
      const url = new URL(route, LOCAL).toString()
      console.log(`Capturing ${route}...`)
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
      const buf = await page.screenshot({ fullPage: false })
      await fs.writeFile(path.join(OUTDIR, `${safe}.png`), buf)
      report.push({ route, url, success: true })
      console.log(`✓ ${route}`)
    } catch (e) {
      report.push({ route, error: e.message })
      console.error(`✗ ${route}: ${e.message}`)
    }
  }

  await browser.close()
  await fs.writeFile(
    path.join(OUTDIR, 'report.json'),
    JSON.stringify(
      {
        when: new Date().toISOString(),
        local: LOCAL,
        routes: ROUTES,
        results: report,
      },
      null,
      2
    )
  )
  console.log(`\nLocal QC report saved to visual/local-qc/report.json`)
  console.log(`Screenshots saved to visual/local-qc/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
