import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import * as cheerio from 'cheerio'
import http from 'node:http'
import https from 'node:https'

function getArg(name) {
  const idx = process.argv.indexOf(name)
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1]
  return null
}

const ORIGIN = process.env.TARGET_ORIGIN || getArg('--origin') || 'https://www.barbudaleisure.com'
let LOCAL = process.env.LOCAL_ORIGIN || getArg('--local') || 'http://localhost:3001'
const OUTDIR = path.join(process.cwd(), 'visual')
const routesArg = process.env.TARGET_ROUTES || getArg('--routes')
const ROUTES = (
  routesArg?.split(',').map(s => s.trim()).filter(Boolean) || [
    '/', '/about', '/faq', '/reviews', '/tours',
    '/tours/discover-barbuda-by-air',
    '/tours/discover-barbuda-by-sea',
    '/tours/barbuda-sky-sea-adventure',
    '/tours/barbuda-beach-escape',
    '/tours/excellence-barbuda-by-sea',
    '/tours/shared-boat-charter',
    '/tours/helicopter-adventure',
    '/tours/yacht-adventure',
    '/tours/airplane-adventure'
  ]
)

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }) }

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url, { method: 'HEAD' })
      if (r.ok) return true
    } catch {}
    await new Promise(r => setTimeout(r, 500))
  }
  return false
}

async function resolveLocalOrigin() {
  if (await waitForServer(LOCAL)) return LOCAL
  try {
    const u = new URL(LOCAL)
    const candidates = []
    if (u.hostname === 'localhost') {
      const u2 = new URL(LOCAL); u2.hostname = '127.0.0.1'; candidates.push(u2.toString())
    }
    const nets = os.networkInterfaces()
    for (const addrs of Object.values(nets)) {
      for (const addr of addrs || []) {
        if (addr.family === 'IPv4' && !addr.internal) {
          const u3 = new URL(LOCAL); u3.hostname = addr.address; candidates.push(u3.toString())
        }
      }
    }
    const seen = new Set()
    for (const cand of candidates) {
      if (seen.has(cand)) continue
      seen.add(cand)
      if (await waitForServer(cand)) return cand
    }
  } catch {}
  return LOCAL
}

function extractFeatures(html) {
  const $ = cheerio.load(html)
  const textLen = $('body').text().replace(/\s+/g, ' ').trim().length
  const imgs = $('img').length
  const links = $('a').length
  const h1 = $('h1').length
  const stylesheets = $('link[rel="stylesheet"]').length
  const scripts = $('script[src]').length
  // Collect hero and gallery heuristics
  const heroImg = $('img[alt*="hero" i], img[alt*="header" i]').length
  const galleries = $('[class*="gallery" i], [data-gallery], figure:has(img)')?.length || 0
  // Hash-like fingerprint: top 10 most frequent class names
  const classCounts = {}
  $('[class]').each((_, el) => {
    const cls = ($(el).attr('class') || '').split(/\s+/).filter(Boolean)
    for (const c of cls) classCounts[c] = (classCounts[c] || 0) + 1
  })
  const classTop = Object.entries(classCounts).sort((a,b)=>b[1]-a[1]).slice(0,10)
  return { textLen, imgs, links, h1, stylesheets, scripts, heroImg, galleries, classTop }
}

function diffFeatures(live, local) {
  const keys = new Set([...Object.keys(live), ...Object.keys(local)])
  const deltas = {}
  for (const k of keys) {
    if (k === 'classTop') {
      deltas[k] = { live: live[k], local: local[k] }
    } else {
      deltas[k] = { live: live[k], local: local[k], delta: (local[k] ?? 0) - (live[k] ?? 0) }
    }
  }
  return deltas
}

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const client = urlObj.protocol === 'https:' ? https : http
    const req = client.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHtml(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
  })
}

async function main() {
  await ensureDir(OUTDIR)
  LOCAL = await resolveLocalOrigin()
  const report = []

  for (const route of ROUTES) {
    const liveUrl = new URL(route, ORIGIN).toString()
    const localUrl = new URL(route, LOCAL).toString()
    try {
      const [liveHtml, localHtml] = await Promise.all([
        fetchHtml(liveUrl),
        fetchHtml(localUrl)
      ])
      const liveFeat = extractFeatures(liveHtml)
      const localFeat = extractFeatures(localHtml)
      const deltas = diffFeatures(liveFeat, localFeat)

      report.push({ route, liveUrl, localUrl, ok: true, deltas })
      console.log(`${route}: OK (imgs: ${liveFeat.imgs}->${localFeat.imgs}, textLen Δ ${localFeat.textLen - liveFeat.textLen})`)
    } catch (e) {
      report.push({ route, liveUrl, localUrl, ok: false, error: e.message })
      console.error(`${route}: FAIL - ${e.message}`)
    }
  }

  await fs.writeFile(path.join(OUTDIR, 'dom-report.json'), JSON.stringify({
    when: new Date().toISOString(),
    origin: ORIGIN,
    local: LOCAL,
    routes: ROUTES,
    results: report
  }, null, 2))
  console.log('DOM compare report saved to visual/dom-report.json')
}

main().catch(e => { console.error(e); process.exit(1) })
