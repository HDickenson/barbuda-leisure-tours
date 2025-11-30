/**
 * Example: Agent writes code to automate browser tasks
 * 
 * This is what code would look like when an LLM writes it
 * to interact with Chrome DevTools MCP in a code execution environment.
 * 
 * The agent discovers tools by exploring ./servers/ directory,
 * then writes code using those tools. Data stays in the sandbox;
 * only console.log output goes back to the agent.
 */

import * as chrome from '../servers/chrome-devtools/index.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Example 1: Take screenshots of multiple pages
 * 
 * Agent task: "Screenshot the top 5 pages of the site"
 */
export async function screenshotTopPages() {
  const pages = [
    'https://www.barbudaleisure.com/',
    'https://www.barbudaleisure.com/tours',
    'https://www.barbudaleisure.com/tours/antigua',
    'https://www.barbudaleisure.com/tours/barbuda',
    'https://www.barbudaleisure.com/about'
  ];
  
  await chrome.newPage({});
  
  for (let i = 0; i < pages.length; i++) {
    const url = pages[i];
    const filename = `page-${i + 1}.png`;
    
    await chrome.navigatePage({ 
      type: 'url',
      url,
      timeout: 10000
    });
    
    await chrome.takeScreenshot({
      format: 'png',
      fullPage: true,
      filePath: `./workspace/${filename}`
    });
    
    console.log(`✓ Screenshot saved: ${filename}`);
  }
  
  console.log(`Done! ${pages.length} screenshots saved to ./workspace/`);
}

/**
 * Example 2: Find slow network requests
 * 
 * Agent task: "Find which resources are loading slowly"
 */
export async function findSlowResources() {
  const url = 'https://www.barbudaleisure.com';
  
  await chrome.newPage({});
  await chrome.navigatePage({ 
    type: 'url',
    url,
    timeout: 15000
  });
  
  // Get all network requests
  const requests = await chrome.listNetworkRequests({});
  
  // Filter in code (not in context!)
  const slowRequests = requests
    .filter(req => req.duration > 1000)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);
  
  console.log(`Found ${slowRequests.length} slow requests (>1s):`);
  for (const req of slowRequests) {
    console.log(`  ${req.duration}ms - ${req.url}`);
  }
  
  // Calculate stats
  const totalSize = requests.reduce((sum, r) => sum + (r.responseSize || 0), 0);
  const avgDuration = requests.reduce((sum, r) => sum + (r.duration || 0), 0) / requests.length;
  
  console.log(`\nStats:`);
  console.log(`  Total requests: ${requests.length}`);
  console.log(`  Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Average duration: ${avgDuration.toFixed(0)}ms`);
}

/**
 * Example 3: Check for console errors
 * 
 * Agent task: "Are there any JavaScript errors on the site?"
 */
export async function checkConsoleErrors() {
  const urls = [
    'https://www.barbudaleisure.com/',
    'https://www.barbudaleisure.com/tours',
    'https://www.barbudaleisure.com/about'
  ];
  
  const results = [];
  
  await chrome.newPage({});
  
  for (const url of urls) {
    await chrome.navigatePage({ 
      type: 'url',
      url,
      timeout: 10000
    });
    
    const messages = await chrome.listConsoleMessages({});
    const errors = messages.filter(msg => msg.type === 'error');
    const warnings = messages.filter(msg => msg.type === 'warning');
    
    results.push({
      url,
      errors: errors.length,
      warnings: warnings.length,
      topErrors: errors.slice(0, 3).map(e => e.text)
    });
  }
  
  console.log('Console Error Report:');
  for (const result of results) {
    console.log(`\n${result.url}`);
    console.log(`  Errors: ${result.errors}`);
    console.log(`  Warnings: ${result.warnings}`);
    if (result.topErrors.length > 0) {
      console.log(`  Top errors:`);
      result.topErrors.forEach(err => console.log(`    - ${err}`));
    }
  }
}

/**
 * Example 4: Compare live vs local
 * 
 * Agent task: "Compare the local dev server to production"
 */
export async function compareLiveVsLocal() {
  const routes = ['/tours', '/about', '/contact'];
  const results = [];
  
  await chrome.newPage({});
  
  for (const route of routes) {
    console.log(`Checking ${route}...`);
    
    // Check live
    await chrome.navigatePage({ 
      type: 'url',
      url: `https://www.barbudaleisure.com${route}`,
      timeout: 10000
    });
    
    const liveMessages = await chrome.listConsoleMessages({});
    const liveRequests = await chrome.listNetworkRequests({});
    
    await chrome.takeScreenshot({
      format: 'png',
      fullPage: true,
      filePath: `./workspace/live-${route.replace(/\//g, '-')}.png`
    });
    
    // Check local
    await chrome.navigatePage({
      type: 'url',
      url: `http://localhost:3000${route}`,
      timeout: 10000
    });
    
    const localMessages = await chrome.listConsoleMessages({});
    const localRequests = await chrome.listNetworkRequests({});
    
    await chrome.takeScreenshot({
      format: 'png',
      fullPage: true,
      filePath: `./workspace/local-${route.replace(/\//g, '-')}.png`
    });
    
    // Compare (all data processing happens here, not in context)
    const liveErrors = liveMessages.filter(m => m.type === 'error').length;
    const localErrors = localMessages.filter(m => m.type === 'error').length;
    
    const liveSize = liveRequests.reduce((sum, r) => sum + (r.responseSize || 0), 0);
    const localSize = localRequests.reduce((sum, r) => sum + (r.responseSize || 0), 0);
    
    results.push({
      route,
      live: {
        errors: liveErrors,
        requests: liveRequests.length,
        size: liveSize
      },
      local: {
        errors: localErrors,
        requests: localRequests.length,
        size: localSize
      }
    });
  }
  
  console.log('\nComparison Report:');
  console.log('─'.repeat(70));
  console.log('Route               | Live Errors | Local Errors | Live Size | Local Size');
  console.log('─'.repeat(70));
  
  for (const r of results) {
    const liveMB = (r.live.size / 1024 / 1024).toFixed(2);
    const localMB = (r.local.size / 1024 / 1024).toFixed(2);
    console.log(
      `${r.route.padEnd(18)} | ${r.live.errors.toString().padStart(11)} | ` +
      `${r.local.errors.toString().padStart(12)} | ${liveMB.padStart(9)} MB | ${localMB.padStart(10)} MB`
    );
  }
  
  // Save detailed report
  await fs.writeFile(
    './workspace/comparison-report.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n✓ Detailed report saved to ./workspace/comparison-report.json');
}

/**
 * Example 5: Performance trace with insights
 * 
 * Agent task: "Run a performance analysis and get Core Web Vitals"
 */
export async function performanceTrace() {
  const url = 'https://www.barbudaleisure.com';
  
  await chrome.newPage({});
  await chrome.navigatePage({ 
    type: 'url',
    url,
    timeout: 15000
  });
  
  console.log('Starting performance trace...');
  await chrome.performanceStartTrace({});
  
  // Reload to capture full trace
  await chrome.navigatePage({
    type: 'reload',
    ignoreCache: true
  });
  
  const trace = await chrome.performanceStopTrace({});
  
  console.log('\nPerformance Metrics:');
  console.log(`  LCP: ${trace.lcp || 'N/A'}`);
  console.log(`  FID: ${trace.fid || 'N/A'}`);
  console.log(`  CLS: ${trace.cls || 'N/A'}`);
  
  if (trace.insights && trace.insights.length > 0) {
    console.log(`\nPerformance Insights (${trace.insights.length}):`);
    for (const insight of trace.insights.slice(0, 5)) {
      console.log(`  - ${insight.title}: ${insight.description}`);
    }
  }
  
  // Save full trace
  await fs.writeFile(
    './workspace/performance-trace.json',
    JSON.stringify(trace, null, 2)
  );
  
  console.log('\n✓ Full trace saved to ./workspace/performance-trace.json');
}

// The agent would call these functions based on the task
// For example:
// await findSlowResources();
// await checkConsoleErrors();
// await compareLiveVsLocal();
