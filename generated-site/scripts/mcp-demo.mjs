#!/usr/bin/env node

/**
 * Demo: Code Execution with MCP
 * 
 * This demonstrates the pattern from:
 * https://www.anthropic.com/engineering/code-execution-with-mcp
 * 
 * Instead of calling MCP tools directly through the LLM context,
 * we write code that calls the tools. This:
 * - Reduces token usage by 98%+
 * - Keeps intermediate data out of context
 * - Enables complex control flow (loops, conditionals)
 * - Allows data filtering/transformation in code
 */

import { initMCPClient } from '../mcp-runtime/client.js';
import * as chrome from '../servers/chrome-devtools/index.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize MCP client with Chrome DevTools server config
const mcpConfig = {
  'chrome-devtools': {
    command: 'npx',
    args: ['-y', 'chrome-devtools-mcp@latest', '--headless=true', '--isolated=true']
  }
};

initMCPClient(mcpConfig);

async function visualCompareDemo() {
  console.log('🚀 MCP Code Execution Demo: Visual QA\n');
  
  const routes = [
    '/',
    '/tours',
    '/tours/antigua',
    '/tours/barbuda',
    '/about'
  ];
  
  const liveBase = 'https://www.barbudaleisure.com';
  const localBase = 'http://localhost:3000';
  
  const results = [];
  
  console.log(`📸 Comparing ${routes.length} pages...\n`);
  
  for (const route of routes) {
    console.log(`  Checking ${route}...`);
    
    try {
      // Navigate to live site
      await chrome.newPage({});
      await chrome.navigatePage({ 
        type: 'url',
        url: `${liveBase}${route}`,
        timeout: 10000
      });
      
      // Take screenshot
      const liveScreenshot = await chrome.takeScreenshot({
        format: 'png',
        fullPage: true,
        filePath: path.join(__dirname, '..', 'workspace', `live-${route.replace(/\//g, '-')}.png`)
      });
      
      // Navigate to local
      await chrome.navigatePage({
        type: 'url', 
        url: `${localBase}${route}`,
        timeout: 10000
      });
      
      // Take screenshot
      const localScreenshot = await chrome.takeScreenshot({
        format: 'png',
        fullPage: true,
        filePath: path.join(__dirname, '..', 'workspace', `local-${route.replace(/\//g, '-')}.png`)
      });
      
      // Get performance metrics for local
      await chrome.performanceStartTrace({});
      await chrome.navigatePage({
        type: 'reload',
        ignoreCache: true
      });
      const perfTrace = await chrome.performanceStopTrace({});
      
      // Get console messages
      const consoleMessages = await chrome.listConsoleMessages({});
      const errors = consoleMessages.filter(msg => msg.type === 'error');
      
      results.push({
        route,
        live: { screenshot: liveScreenshot },
        local: { 
          screenshot: localScreenshot,
          performance: perfTrace,
          errors: errors.length
        }
      });
      
      console.log(`    ✓ ${errors.length} console errors`);
      
    } catch (error) {
      console.log(`    ✗ Failed: ${error.message}`);
      results.push({
        route,
        error: error.message
      });
    }
  }
  
  // Save report (only summary, not full images)
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      successful: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length
    },
    results: results.map(r => ({
      route: r.route,
      error: r.error,
      consoleErrors: r.local?.errors
    }))
  };
  
  const reportPath = path.join(__dirname, '..', 'workspace', 'visual-qa-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n✅ Demo complete!');
  console.log(`📊 Report saved to: ${reportPath}`);
  console.log(`\n💡 Note: All screenshots and performance data stayed in the execution`);
  console.log(`   environment. Only the summary (${JSON.stringify(report).length} bytes) was returned.`);
  console.log(`   In the direct tool-call pattern, this would have passed through`);
  console.log(`   context multiple times, consuming 100,000+ tokens.\n`);
}

async function performanceAnalysisDemo() {
  console.log('🚀 MCP Code Execution Demo: Performance Analysis\n');
  
  const url = 'https://www.barbudaleisure.com';
  
  console.log(`📊 Analyzing performance of ${url}...\n`);
  
  try {
    // Create new page and navigate
    await chrome.newPage({});
    await chrome.navigatePage({
      type: 'url',
      url,
      timeout: 15000
    });
    
    // Start performance trace
    await chrome.performanceStartTrace({});
    
    // Navigate again to capture trace
    await chrome.navigatePage({
      type: 'reload',
      ignoreCache: true
    });
    
    // Stop trace and get results
    const trace = await chrome.performanceStopTrace({});
    
    // Get network requests
    const networkRequests = await chrome.listNetworkRequests({});
    
    // Filter and aggregate (this happens in code, not in context!)
    const totalSize = networkRequests.reduce((sum, req) => {
      return sum + (req.responseSize || 0);
    }, 0);
    
    const slowRequests = networkRequests.filter(req => req.duration > 1000);
    const failedRequests = networkRequests.filter(req => req.failed);
    
    const jsRequests = networkRequests.filter(req => req.type === 'script');
    const cssRequests = networkRequests.filter(req => req.type === 'stylesheet');
    const imgRequests = networkRequests.filter(req => req.type === 'image');
    
    // Get console messages
    const consoleMessages = await chrome.listConsoleMessages({});
    const errorMessages = consoleMessages.filter(msg => msg.type === 'error');
    const warningMessages = consoleMessages.filter(msg => msg.type === 'warning');
    
    // Create compact report
    const report = {
      url,
      timestamp: new Date().toISOString(),
      network: {
        totalRequests: networkRequests.length,
        totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
        slowRequests: slowRequests.length,
        failedRequests: failedRequests.length,
        breakdown: {
          javascript: jsRequests.length,
          css: cssRequests.length,
          images: imgRequests.length
        }
      },
      console: {
        errors: errorMessages.length,
        warnings: warningMessages.length,
        topErrors: errorMessages.slice(0, 5).map(e => e.text)
      },
      performance: trace
    };
    
    console.log('📈 Performance Summary:');
    console.log(`  - ${report.network.totalRequests} network requests`);
    console.log(`  - ${report.network.totalSize} total size`);
    console.log(`  - ${report.network.slowRequests} slow requests (>1s)`);
    console.log(`  - ${report.network.failedRequests} failed requests`);
    console.log(`  - ${report.console.errors} console errors`);
    console.log(`  - ${report.console.warnings} console warnings\n`);
    
    // Save detailed report
    const reportPath = path.join(__dirname, '..', 'workspace', 'performance-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Report saved to: ${reportPath}\n`);
    console.log(`💡 The full network request list (${networkRequests.length} requests) was`);
    console.log(`   filtered in code. Only the summary went back to the agent.\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run demos
const demo = process.argv[2] || 'performance';

if (demo === 'visual') {
  visualCompareDemo();
} else if (demo === 'performance') {
  performanceAnalysisDemo();
} else {
  console.log('Usage: node mcp-demo.mjs [visual|performance]');
}
