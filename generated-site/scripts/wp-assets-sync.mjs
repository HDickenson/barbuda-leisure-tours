import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import * as cheerio from 'cheerio'
import { Client as MCPClient } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const ORIGIN = process.env.TARGET_ORIGIN || 'https://www.barbudaleisure.com'
const ENGINE = (process.env.ASSETS_ENGINE || getArg('--engine') || 'http').toLowerCase()
const CRAWL_DISCOVER = (process.env.CRAWL_DISCOVER || '0') === '1'
const MAX_PAGES = Number(process.env.MAX_PAGES || 40)
const MAX_DEPTH = Number(process.env.MAX_DEPTH || 2)
const ROOT = path.resolve(path.join(process.cwd()))
const PUBLIC_DIR = path.join(ROOT, 'public')
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'wordpress-assets-manifest.json')

const DEFAULT_ROUTES = (
  process.env.TARGET_ROUTES?.split(',').map(s => s.trim()).filter(Boolean) || [
    '/',
    '/about',
    '/reviews',
    '/faq',
    '/contact',
    '/original',
    '/original-about',
    '/original-blog',
    '/original-faq',
    '/original-reviews',
    '/original-tours',
  ]
)

function getArg(name) {
  const idx = process.argv.indexOf(name)
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1]
  return null
}

const WP_HOST_RE = /^https?:\/\/([^\/]*barbudaleisure\.com)(\/.*)$/i
const SAME_HOST_RE = /^https?:\/\/([^\/]*barbudaleisure\.com)(\/.*)?$/i

const ASSET_TYPES = {
  css: ['.css'],
  js: ['.js'],
  fonts: ['.woff', '.woff2', '.ttf', '.otf', '.eot'],
  images: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'],
}

function classify(urlPath) {
  const ext = path.extname(urlPath).toLowerCase()
  for (const [type, exts] of Object.entries(ASSET_TYPES)) {
    if (exts.includes(ext)) return type
  }
  return 'assets'
}

function localPathFor(urlPath, type) {
  // urlPath like /wp-content/plugins/elementor/assets/css/frontend.min.css
  const clean = urlPath.replace(/^\//, '')
  const base = path.join(type, clean.replace(/^wp-content\//, 'wp-content/'))
  const abs = path.join(PUBLIC_DIR, base)
  const web = '/' + base.replace(/\\/g, '/')
  return { abs, web }
}

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }) }

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'

async function fetchBuffer(url) {
  const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  return { buf, contentType: res.headers.get('content-type') || '' }
}

function extractUrlsFromCss(cssText, baseUrl) {
  const urls = new Set()
  // @import url("...") and url('...')
  const re = /@import\s+url\(([^)]+)\)|url\(([^)]+)\)/g
  let m
  while ((m = re.exec(cssText)) !== null) {
    const raw = (m[1] || m[2] || '').trim().replace(/^['"]|['"]$/g, '')
    if (!raw) continue
    // resolve relative to baseUrl
    try {
      const abs = new URL(raw, baseUrl).toString()
      if (WP_HOST_RE.test(abs)) urls.add(abs)
    } catch {}
  }
  return Array.from(urls)
}

async function downloadOne(url, results) {
  const m = url.match(WP_HOST_RE)
  if (!m) return null
  const u = new URL(url)
  const urlPath = u.pathname // drop query for local path stability
  const type = classify(urlPath)
  const { abs, web } = localPathFor(urlPath, type)
  try {
    await ensureDir(path.dirname(abs))
    const { buf, contentType } = await fetchBuffer(url)
    await fs.writeFile(abs, buf)
    results.push({ url, local: web, type, ok: true, size: buf.length, contentType })
    return { url, local: web, type, abs, contentType }
  } catch (e) {
    results.push({ url, error: e.message, ok: false })
    return null
  }
}

async function processCss(url, absPath, results, queue) {
  try {
    const cssText = await fs.readFile(absPath, 'utf8')
    const refs = extractUrlsFromCss(cssText, url)
    for (const ref of refs) queue.add(ref)
  } catch (e) {
    results.push({ url, cssParseError: e.message })
  }
}

async function crawlRoutes(routes) {
  const results = []
  const discoveredAssets = new Set()

  const useMCP = ENGINE === 'mcp'
  let mcp = null
  if (useMCP) {
    const transport = new StdioClientTransport({ command: 'npx', args: ['-y', 'chrome-devtools-mcp@latest', '--headless=true', '--isolated=true'] })
    const client = new MCPClient({ name: 'wp-assets-sync', version: '1.0.0' }, { capabilities: {} })
    await client.connect(transport)
    mcp = { client, transport }
  }

  // Page crawl queue (BFS)
  const seenPages = new Set()
  const queue = []
  for (const r of routes) queue.push({ url: new URL(r, ORIGIN).toString(), depth: 0 })

  function addPage(href, currentUrl, depth) {
    try {
      const abs = new URL(href, currentUrl).toString()
      if (!SAME_HOST_RE.test(abs)) return
      const u = new URL(abs)
      // ignore admin, wp-json, feeds, query-heavy endpoints
      if (u.pathname.startsWith('/wp-json')) return
      if (u.pathname.startsWith('/wp-admin')) return
      // ignore preview/draft URLs
      if (u.searchParams.has('preview') || u.searchParams.has('preview_id')) return
      if (u.searchParams.has('elementor-preview')) return
      if (u.pathname.includes('/draft') || u.pathname.includes('/preview')) return
      if (u.searchParams.get('post_status') === 'draft') return
      if (u.pathname.match(/\.(xml|pdf|zip|rar|7z)$/i)) return
      // normalize: drop hash
      u.hash = ''
      const key = u.toString()
      if (!seenPages.has(key) && seenPages.size < MAX_PAGES && depth <= MAX_DEPTH) {
        seenPages.add(key)
        queue.push({ url: key, depth })
      }
    } catch {}
  }

  while (queue.length) {
    const { url, depth } = queue.shift()
    if (depth > MAX_DEPTH) continue
    try {
      if (useMCP) {
        // Use Chrome DevTools MCP to navigate and collect network assets
        await mcp.client.callTool({ name: 'chrome-devtools__new_page', arguments: {} })
        await mcp.client.callTool({ name: 'chrome-devtools__navigate_page', arguments: { type: 'url', url, timeout: 15000 } })
        // Small wait to allow late-loading assets
        await new Promise(r => setTimeout(r, 1500))
        const net = await mcp.client.callTool({ name: 'chrome-devtools__list_network_requests', arguments: {} })
        const items = Array.isArray(net?.content) ? net.content : []
        // Items may be returned as text or json content; normalize
        let reqs = []
        if (items.length === 1 && items[0].type === 'text') {
          try { reqs = JSON.parse(items[0].text) } catch { reqs = [] }
        } else if (items.length) {
          reqs = items
        }
        for (const req of reqs) {
          const href = req.url || req?.request?.url
          if (!href) continue
          try {
            const abs = new URL(href, url).toString()
            if (WP_HOST_RE.test(abs)) discoveredAssets.add(abs)
          } catch {}
        }

        if (CRAWL_DISCOVER) {
          // Try to discover links via snapshot
          const snap = await mcp.client.callTool({ name: 'chrome-devtools__take_snapshot', arguments: {} })
          const content = snap?.content?.[0]?.text
          if (content) {
            try {
              const tree = JSON.parse(content)
              const hrefs = []
              const stack = Array.isArray(tree?.elements) ? [...tree.elements] : []
              while (stack.length) {
                const el = stack.pop()
                if (el?.attributes?.href) hrefs.push(el.attributes.href)
                if (el?.children) stack.push(...el.children)
              }
              for (const h of hrefs) addPage(h, url, depth + 1)
            } catch {}
          }
        }

        results.push({ page: url, ok: true, depth, assets: Array.from(discoveredAssets).length, engine: 'mcp' })
        continue
      }
      const res = await fetch(url, { headers: { 'user-agent': UA } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const html = await res.text()
  const $ = cheerio.load(html)
      // Stylesheets (regular and preload)
      $('link[rel="stylesheet"][href], link[rel="preload"][as="style"][href]').each((_, el) => {
        const href = $(el).attr('href')
        try {
          const abs = new URL(href, url).toString()
          if (WP_HOST_RE.test(abs)) discoveredAssets.add(abs)
        } catch {}
      })
      // Scripts
      $('script[src]').each((_, el) => {
        const src = $(el).attr('src')
        try {
          const abs = new URL(src, url).toString()
          if (WP_HOST_RE.test(abs)) discoveredAssets.add(abs)
        } catch {}
      })
      // Images
      $('img[src]').each((_, el) => {
        const src = $(el).attr('src')
        try {
          const abs = new URL(src, url).toString()
          if (WP_HOST_RE.test(abs)) discoveredAssets.add(abs)
        } catch {}
      })
      // Picture/srcset and img srcset
      $('source[srcset], img[srcset]').each((_, el) => {
        const srcset = ($(el).attr('srcset') || '')
        for (const part of srcset.split(',')) {
          const u = part.trim().split(' ')[0]
          if (!u) continue
          try {
            const abs = new URL(u, url).toString()
            if (WP_HOST_RE.test(abs)) discoveredAssets.add(abs)
          } catch {}
        }
      })
      // Inline style background-images
      $('[style]').each((_, el) => {
        const style = ($(el).attr('style') || '')
        const re = /background(?:-image)?:[^;]*url\(([^)]+)\)/gi
        let m
        while ((m = re.exec(style)) !== null) {
          const raw = (m[1] || '').trim().replace(/^['"]|['"]$/g, '')
          try {
            const abs = new URL(raw, url).toString()
            if (WP_HOST_RE.test(abs)) discoveredAssets.add(abs)
          } catch {}
        }
      })

      if (CRAWL_DISCOVER) {
        $('a[href]').each((_, el) => {
          addPage($(el).attr('href'), url, depth + 1)
        })
      }

      results.push({ page: url, ok: true, depth, assets: Array.from(discoveredAssets).length })
    } catch (e) {
      results.push({ page: url, ok: false, depth, error: e.message })
    }
  }

  if (mcp?.transport) await mcp.transport.close()

  // BFS over assets (download and parse CSS for deeper assets)
  const queueAssets = new Set(discoveredAssets)
  const processed = new Set()
  const downloads = []

  while (queueAssets.size) {
    const [url] = queueAssets
    queueAssets.delete(url)
    if (processed.has(url)) continue
    processed.add(url)

    const saved = await downloadOne(url, downloads)
    if (!saved) continue
    if (saved.type === 'css') {
      await processCss(url, saved.abs, downloads, queueAssets)
    }
  }

  // Persist/merge manifest
  let existing = { downloadedAt: new Date().toISOString(), source: ORIGIN, cssFiles: 0, jsFiles: 0, results: [] }
  try { existing = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8')) } catch {}
  const merged = {
    downloadedAt: new Date().toISOString(),
    source: ORIGIN,
    cssFiles: downloads.filter(d => d.type === 'css' && d.ok).length,
    jsFiles: downloads.filter(d => d.type === 'js' && d.ok).length,
    results: downloads,
  }
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(merged, null, 2))
  console.log(`Saved manifest to ${path.relative(ROOT, MANIFEST_PATH)}`)
  return { pageResults: results, downloads }
}

function buildRewriteMap(downloads) {
  const map = new Map()
  for (const d of downloads) {
    if (d.ok) map.set(d.url, d.local)
  }
  return map
}

async function rewriteLocalReferences(map) {
  const targets = [
    path.join(ROOT, 'app'),
    path.join(ROOT, 'components'),
    path.join(PUBLIC_DIR, 'css'),
  ]
  const exts = ['.ts', '.tsx', '.js', '.jsx', '.css', '.html']
  async function walk(dir, out = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const e of entries) {
      if (e.isDirectory()) {
        if (['.next', 'node_modules', '.git', '.vercel'].includes(e.name)) continue
        await walk(path.join(dir, e.name), out)
      } else if (exts.includes(path.extname(e.name))) {
        out.push(path.join(dir, e.name))
      }
    }
    return out
  }

  let changedFiles = 0
  for (const base of targets) {
    try {
      const files = await walk(base)
      for (const f of files) {
        let text = await fs.readFile(f, 'utf8')
        let changed = false
        for (const [remote, local] of map.entries()) {
          if (text.includes(remote)) {
            text = text.split(remote).join(local)
            changed = true
          }
          // also replace remote without query string variant
          try {
            const u = new URL(remote)
            const noQuery = `${u.origin}${u.pathname}`
            if (text.includes(noQuery)) {
              text = text.split(noQuery).join(local)
              changed = true
            }
          } catch {}
        }
        if (changed) {
          await fs.writeFile(f, text, 'utf8')
          changedFiles++
        }
      }
    } catch {}
  }
  return changedFiles
}

async function main() {
  console.log(`Scanning routes from ${ORIGIN} ...`)
  const { downloads } = await crawlRoutes(DEFAULT_ROUTES)
  const map = buildRewriteMap(downloads)
  console.log(`Downloaded ${downloads.filter(d => d.ok).length} assets, rewriting references...`)
  const changed = await rewriteLocalReferences(map)
  console.log(`Updated ${changed} local files to reference local assets`)
  console.log('Done.')
}

main().catch(e => { console.error(e); process.exit(1) })
