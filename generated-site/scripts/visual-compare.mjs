import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import puppeteer from 'puppeteer'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
// Optional MCP client (code execution pattern)
import { Client as MCPClient } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

let ORIGIN = process.env.TARGET_ORIGIN || getArg('--origin') || 'https://www.barbudaleisure.com'
let LOCAL = process.env.LOCAL_ORIGIN || getArg('--local') || 'http://localhost:3000'
const ENGINE = (process.env.VISUAL_ENGINE || getArg('--engine') || 'puppeteer').toLowerCase()
const FULLPAGE = parseBool(process.env.FULLPAGE ?? getArg('--fullpage') ?? 'true')
const OUTDIR = path.join(process.cwd(), 'visual')
function parseRoutesArg() {
  const fileArg = getArg('--routes-file')
  if (fileArg) {
    try {
      const p = path.isAbsolute(fileArg) ? fileArg : path.join(process.cwd(), fileArg)
      const txt = fs.readFile(p, 'utf8')
      // Note: return a promise so caller can await
      return txt.then(t => JSON.parse(t)).then(arr => Array.isArray(arr) ? arr.map(s => String(s)).filter(Boolean) : [])
    } catch {}
  }
  const inline = process.env.TARGET_ROUTES || getArg('--routes')
  if (inline) {
    return inline.split(',').map(s => s.trim()).filter(Boolean)
  }
  return [
    '/', '/original', '/original-about', '/original-tours', '/original-blog', '/original-faq', '/original-reviews',
    '/about', '/faq', '/reviews'
  ]
}
const ROUTES = parseRoutesArg()

function getArg(name) {
  const idx = process.argv.indexOf(name)
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1]
  return null
}

function parseBool(v) {
  if (typeof v === 'boolean') return v
  const s = String(v).trim().toLowerCase()
  return s === '1' || s === 'true' || s === 'yes' || s === 'on'
}

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }) }

async function toPng(buffer) {
  return new Promise((resolve, reject) => {
    const png = new PNG({ filterType: 4 })
    png.parse(buffer, (err, data) => err ? reject(err) : resolve(data))
  })
}

function cropPng(src, width, height) {
  // Crop from top-left to the given width/height
  const w = Math.min(width, src.width)
  const h = Math.min(height, src.height)
  const out = new PNG({ width: w, height: h })
  const srcStride = src.width * 4
  const dstStride = w * 4
  for (let y = 0; y < h; y++) {
    const srcStart = y * srcStride
    const srcEnd = srcStart + dstStride
    src.data.copy(out.data, y * dstStride, srcStart, srcEnd)
  }
  return out
}

async function screenshot(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
  const buf = await page.screenshot({ fullPage: FULLPAGE })
  return buf
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url, { method: 'HEAD' })
      if (r.ok) return true
    } catch {}
    await new Promise(r => setTimeout(r, 1000))
  }
  return false
}

// --- MCP helpers -----------------------------------------------------------
async function connectMCPChrome() {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', 'chrome-devtools-mcp@latest', '--headless=true', '--isolated=true']
  })
  const client = new MCPClient(
    { name: 'visual-compare', version: '1.0.0' },
    { capabilities: {} }
  )
  await client.connect(transport)
  return { client, transport }
}

async function mcpNavigate(client, url) {
  await client.callTool({ name: 'chrome-devtools__new_page', arguments: {} })
  await client.callTool({ name: 'chrome-devtools__resize_page', arguments: { width: 1366, height: 900 } })
  await client.callTool({ name: 'chrome-devtools__navigate_page', arguments: { type: 'url', url, timeout: 15000 } })
}

async function mcpScreenshotToFile(client, filePath, opts = {}) {
  // chrome-devtools saves to file if filePath is provided
  await ensureDir(path.dirname(filePath))
  await client.callTool({ name: 'chrome-devtools__take_screenshot', arguments: { filePath, fullPage: FULLPAGE, format: 'png', ...opts } })
  // Retry read a few times to handle async file write timing
  let lastErr
  for (let i = 0; i < 5; i++) {
    try {
      const buf = await fs.readFile(filePath)
      return buf
    } catch (e) {
      lastErr = e
      await new Promise(r => setTimeout(r, 250))
    }
  }
  throw lastErr
}

async function main() {
  const ROUTE_LIST = await Promise.resolve(parseRoutesArg())
  await ensureDir(path.join(OUTDIR, 'live'))
  await ensureDir(path.join(OUTDIR, 'local'))
  await ensureDir(path.join(OUTDIR, 'diff'))

  // Ensure local server is reachable; try swapping localhost -> 127.0.0.1 if needed
  if (!(await waitForServer(LOCAL))) {
    try {
      const u = new URL(LOCAL)
      const candidates = []
      // Try 127.0.0.1 if localhost
      if (u.hostname === 'localhost') {
        const u2 = new URL(LOCAL)
        u2.hostname = '127.0.0.1'
        candidates.push(u2.toString())
      }
      // Probe local IPv4 interfaces (e.g., 192.168.x.x)
      const nets = os.networkInterfaces()
      for (const addrs of Object.values(nets)) {
        for (const addr of addrs || []) {
          if (addr.family === 'IPv4' && !addr.internal) {
            const u3 = new URL(LOCAL)
            u3.hostname = addr.address
            candidates.push(u3.toString())
          }
        }
      }
      // Deduplicate
      const seen = new Set()
      for (const cand of candidates) {
        if (seen.has(cand)) continue
        seen.add(cand)
        if (await waitForServer(cand)) {
          LOCAL = cand
          break
        }
      }
    } catch {}
  }

  const useMCP = ENGINE === 'mcp'
  let browser = null
  let page = null
  let mcp = null
  if (!useMCP) {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
    page = await browser.newPage()
    await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 })
  } else {
    mcp = await connectMCPChrome()
  }

  const report = []

  for (const route of ROUTE_LIST) {
    const safe = route.replace(/\//g, '_') || 'home'
    try {
      const liveUrl = new URL(route, ORIGIN).toString()
      const localUrl = new URL(route, LOCAL).toString()

      console.log(`Processing ${route}`)
      console.log(`  Live:  ${liveUrl}`)
      console.log(`  Local: ${localUrl}`)

      let liveBuf, localBuf
      let liveSkipped = false
      
      // Capture live site (with fallback on failure)
      if (!useMCP) {
        try {
          liveBuf = await screenshot(page, liveUrl)
        } catch (e) {
          console.warn(`  ⚠ Live capture failed: ${e.message}`)
          liveSkipped = true
        }
      } else {
        const livePath = path.join(OUTDIR, 'live', `${safe}.png`)
        try {
          await mcpNavigate(mcp.client, liveUrl)
          liveBuf = await mcpScreenshotToFile(mcp.client, livePath)
        } catch (e) {
          console.warn(`  ⚠ Live capture failed: ${e.message}`)
          liveSkipped = true
        }
      }

      // Always capture local
      if (!useMCP) {
        localBuf = await screenshot(page, localUrl)
      } else {
        const localPath = path.join(OUTDIR, 'local', `${safe}.png`)
        await mcpNavigate(mcp.client, localUrl)
        localBuf = await mcpScreenshotToFile(mcp.client, localPath)
      }

      // Save screenshots
      if (liveBuf) await fs.writeFile(path.join(OUTDIR, 'live', `${safe}.png`), liveBuf)
      await fs.writeFile(path.join(OUTDIR, 'local', `${safe}.png`), localBuf)

      // If live was skipped, report local-only capture
      if (liveSkipped) {
        const img2 = await toPng(localBuf)
        report.push({ 
          route, 
          liveSkipped: true, 
          local: { width: img2.width, height: img2.height }
        })
        console.log(`${route}: local-only (live capture unavailable)`)
        continue
      }

      const img1 = await toPng(liveBuf)
      const img2 = await toPng(localBuf)

      let width = img1.width
      let height = img1.height
      let a = img1
      let b = img2
      let cropped = false
      if (img1.width !== img2.width || img1.height !== img2.height) {
        // Crop both to the common area to enable a meaningful diff
        width = Math.min(img1.width, img2.width)
        height = Math.min(img1.height, img2.height)
        a = cropPng(img1, width, height)
        b = cropPng(img2, width, height)
        cropped = true
      }

      const diff = new PNG({ width, height })
      const mismatched = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 })
      const mismatchPct = +(100 * mismatched / (width * height)).toFixed(2)
      await fs.writeFile(path.join(OUTDIR, 'diff', `${safe}.png`), PNG.sync.write(diff))

      report.push({ route, mismatched, mismatchPct, width, height, cropped, original: { live: { width: img1.width, height: img1.height }, local: { width: img2.width, height: img2.height } } })
      console.log(`${route}: ${mismatchPct}% diff`)
    } catch (e) {
      report.push({ route, error: e.message })
      console.error(`Failed route ${route}:`, e.message)
    }
  }

  if (browser) await browser.close()
  if (mcp?.transport) await mcp.transport.close()
  await fs.writeFile(path.join(OUTDIR, 'visual-report.json'), JSON.stringify({
    when: new Date().toISOString(),
    origin: ORIGIN,
    local: LOCAL,
    engine: useMCP ? 'mcp' : 'puppeteer',
    routes: ROUTE_LIST,
    results: report
  }, null, 2))
  console.log('Visual compare report saved to visual/visual-report.json')
}

main().catch(e => { console.error(e); process.exit(1) })
