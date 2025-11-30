import puppeteer from 'puppeteer';

async function testToursPage(url, label) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing: ${label}`);
  console.log(`📍 URL: ${url}`);
  console.log('='.repeat(60));
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const results = {
    url,
    label,
    success: false,
    error: null,
    data: {}
  };
  
  try {
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully!\n');
    
    // Get page title
    const title = await page.title();
    console.log(`📄 Page Title: ${title}`);
    results.data.title = title;
    
    // Get H1
    const h1Text = await page.$eval('h1', el => el.textContent.trim()).catch(() => 'Not found');
    console.log(`📌 H1: ${h1Text}`);
    results.data.h1 = h1Text;
    
    // Get hero section
    const heroExists = await page.$('section') !== null;
    console.log(`🎨 Hero Section: ${heroExists ? '✅ Found' : '❌ Missing'}`);
    results.data.heroExists = heroExists;
    
    // Count category sections
    const categorySections = await page.$$eval('h2', headings => 
      headings.filter(h => {
        const style = window.getComputedStyle(h);
        return style.fontFamily.includes('Leckerli') || h.className.includes('leckerli');
      }).length
    ).catch(() => 0);
    console.log(`📦 Category Sections: ${categorySections}`);
    results.data.categorySections = categorySections;
    
    // Count tour cards
    const tourCards = await page.$$eval('a[href*="/tours/"]', links => 
      links.filter(link => {
        const href = link.getAttribute('href');
        return href && href !== '/tours' && href !== '/tours/';
      }).length
    ).catch(() => 0);
    console.log(`🎫 Tour Cards: ${tourCards}`);
    results.data.tourCards = tourCards;
    
    // Get category names
    const categories = await page.$$eval('h2', headings => 
      headings
        .filter(h => {
          const style = window.getComputedStyle(h);
          return style.fontFamily.includes('Leckerli') || h.className.includes('leckerli');
        })
        .map(h => h.textContent.trim())
    ).catch(() => []);
    console.log(`\n📋 Categories Found (${categories.length}):`);
    categories.forEach(cat => console.log(`   - ${cat}`));
    results.data.categories = categories;
    
    // Get tour titles
    const tourTitles = await page.$$eval('h3, h4', headings => 
      headings
        .filter(h => {
          const text = h.textContent.trim();
          const parent = h.closest('a[href*="/tours/"]');
          return parent && text.length > 5;
        })
        .map(h => h.textContent.trim())
    ).catch(() => []);
    console.log(`\n🎯 Tour Titles (${tourTitles.length}):`);
    tourTitles.forEach(title => console.log(`   - ${title}`));
    results.data.tourTitles = tourTitles;
    
    // Check for images
    const imageCount = await page.$$eval('img', imgs => imgs.length).catch(() => 0);
    console.log(`\n🖼️  Images: ${imageCount}`);
    results.data.imageCount = imageCount;
    
    // Check for broken images
    const brokenImages = await page.$$eval('img', imgs => 
      imgs.filter(img => !img.complete || img.naturalHeight === 0).length
    ).catch(() => 0);
    console.log(`${brokenImages > 0 ? '⚠️' : '✅'} Broken Images: ${brokenImages}`);
    results.data.brokenImages = brokenImages;
    
    // Check for prices
    const priceElements = await page.$$eval('p, span, div', elements => 
      elements.filter(el => {
        const text = el.textContent;
        return text && (text.includes('$') || text.toLowerCase().includes('from'));
      }).length
    ).catch(() => 0);
    console.log(`\n💰 Price Elements: ${priceElements}`);
    results.data.priceElements = priceElements;
    
    // Check for badges
    const badgeCount = await page.$$eval('span.absolute, div.badge, span.badge', badges => badges.length).catch(() => 0);
    console.log(`🏷️  Badges: ${badgeCount}`);
    results.data.badgeCount = badgeCount;
    
    // Capture console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Capture JavaScript errors
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (jsErrors.length > 0) {
      console.log(`\n❌ JavaScript Errors: ${jsErrors.length}`);
      jsErrors.forEach(err => console.log(`   - ${err}`));
      results.data.jsErrors = jsErrors;
    } else {
      console.log(`\n✅ No JavaScript Errors`);
      results.data.jsErrors = [];
    }
    
    // Take screenshot
    const screenshotName = `${label.toLowerCase().replace(/\s+/g, '-')}-screenshot.png`;
    await page.screenshot({ 
      path: screenshotName,
      fullPage: true 
    });
    console.log(`\n📸 Screenshot saved: ${screenshotName}`);
    results.data.screenshot = screenshotName;
    
    results.success = true;
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    results.error = error.message;
  } finally {
    await browser.close();
  }
  
  return results;
}

function generateComparisonReport(vercelResults, wpResults) {
  console.log('\n\n');
  console.log('═'.repeat(80));
  console.log('📊 COMPARISON REPORT: VERCEL vs WORDPRESS');
  console.log('═'.repeat(80));
  
  if (!vercelResults.success) {
    console.log(`\n❌ Vercel test failed: ${vercelResults.error}`);
  }
  
  if (!wpResults.success) {
    console.log(`\n❌ WordPress test failed: ${wpResults.error}`);
  }
  
  if (!vercelResults.success || !wpResults.success) {
    console.log('\n⚠️  Cannot generate comparison due to test failures.\n');
    return;
  }
  
  const v = vercelResults.data;
  const w = wpResults.data;
  
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│ CONTENT COMPARISON                                          │');
  console.log('└─────────────────────────────────────────────────────────────┘\n');
  
  // Page Title
  console.log(`📄 Page Title:`);
  console.log(`   Vercel:    "${v.title}"`);
  console.log(`   WordPress: "${w.title}"`);
  console.log(`   Match: ${v.title === w.title ? '✅' : '❌'}\n`);
  
  // H1
  console.log(`📌 H1 Text:`);
  console.log(`   Vercel:    "${v.h1}"`);
  console.log(`   WordPress: "${w.h1}"`);
  console.log(`   Match: ${v.h1 === w.h1 ? '✅' : '❌'}\n`);
  
  // Tour Cards Count
  console.log(`🎫 Tour Cards:`);
  console.log(`   Vercel:    ${v.tourCards}`);
  console.log(`   WordPress: ${w.tourCards}`);
  console.log(`   Match: ${v.tourCards === w.tourCards ? '✅' : '❌'}\n`);
  
  // Categories
  console.log(`📋 Categories:`);
  console.log(`   Vercel:    ${v.categories.length} categories`);
  console.log(`   WordPress: ${w.categories.length} categories`);
  
  const categoriesMatch = JSON.stringify(v.categories.sort()) === JSON.stringify(w.categories.sort());
  console.log(`   Match: ${categoriesMatch ? '✅' : '❌'}`);
  
  if (!categoriesMatch) {
    console.log(`\n   Vercel Categories:`);
    v.categories.forEach(cat => console.log(`      - ${cat}`));
    console.log(`\n   WordPress Categories:`);
    w.categories.forEach(cat => console.log(`      - ${cat}`));
  }
  console.log();
  
  // Tour Titles
  console.log(`🎯 Tour Titles:`);
  console.log(`   Vercel:    ${v.tourTitles.length} tours`);
  console.log(`   WordPress: ${w.tourTitles.length} tours`);
  
  const titlesMatch = JSON.stringify(v.tourTitles.sort()) === JSON.stringify(w.tourTitles.sort());
  console.log(`   Match: ${titlesMatch ? '✅' : '❌'}`);
  
  if (!titlesMatch) {
    const vercelOnly = v.tourTitles.filter(t => !w.tourTitles.includes(t));
    const wpOnly = w.tourTitles.filter(t => !v.tourTitles.includes(t));
    
    if (vercelOnly.length > 0) {
      console.log(`\n   ➕ Tours only on Vercel:`);
      vercelOnly.forEach(t => console.log(`      - ${t}`));
    }
    
    if (wpOnly.length > 0) {
      console.log(`\n   ➖ Tours only on WordPress:`);
      wpOnly.forEach(t => console.log(`      - ${t}`));
    }
  }
  console.log();
  
  // Images
  console.log(`🖼️  Images:`);
  console.log(`   Vercel:    ${v.imageCount} images (${v.brokenImages} broken)`);
  console.log(`   WordPress: ${w.imageCount} images (${w.brokenImages} broken)`);
  console.log(`   Broken Images: ${v.brokenImages === 0 && w.brokenImages === 0 ? '✅ None' : '⚠️  Check screenshots'}\n`);
  
  // Prices
  console.log(`💰 Price Elements:`);
  console.log(`   Vercel:    ${v.priceElements}`);
  console.log(`   WordPress: ${w.priceElements}`);
  console.log(`   Match: ${Math.abs(v.priceElements - w.priceElements) <= 2 ? '✅' : '❌'}\n`);
  
  // JavaScript Errors
  console.log(`🐛 JavaScript Errors:`);
  console.log(`   Vercel:    ${v.jsErrors.length} errors`);
  console.log(`   WordPress: ${w.jsErrors.length} errors`);
  console.log(`   Status: ${v.jsErrors.length === 0 ? '✅ Clean' : '⚠️  Has errors'}\n`);
  
  // Overall Assessment
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│ OVERALL ASSESSMENT                                          │');
  console.log('└─────────────────────────────────────────────────────────────┘\n');
  
  const checks = [
    { name: 'Page Title', pass: v.title === w.title },
    { name: 'H1 Text', pass: v.h1 === w.h1 },
    { name: 'Tour Cards Count', pass: v.tourCards === w.tourCards },
    { name: 'Categories', pass: categoriesMatch },
    { name: 'Tour Titles', pass: titlesMatch },
    { name: 'No Broken Images', pass: v.brokenImages === 0 },
    { name: 'No JS Errors', pass: v.jsErrors.length === 0 }
  ];
  
  const passed = checks.filter(c => c.pass).length;
  const total = checks.length;
  const percentage = Math.round((passed / total) * 100);
  
  checks.forEach(check => {
    console.log(`   ${check.pass ? '✅' : '❌'} ${check.name}`);
  });
  
  console.log(`\n   Score: ${passed}/${total} (${percentage}%)`);
  
  if (percentage >= 90) {
    console.log(`\n   🎉 EXCELLENT - Design requirements met!`);
  } else if (percentage >= 75) {
    console.log(`\n   ✅ GOOD - Minor differences acceptable`);
  } else if (percentage >= 50) {
    console.log(`\n   ⚠️  NEEDS REVIEW - Several differences found`);
  } else {
    console.log(`\n   ❌ SIGNIFICANT DIFFERENCES - Review required`);
  }
  
  console.log('\n' + '═'.repeat(80) + '\n');
}

(async () => {
  console.log('\n🚀 DETERMINISTIC TOURS PAGE COMPARISON\n');
  
  // Test Local barbuda-local
  const vercelResults = await testToursPage(
    'http://localhost:3002/tours',
    'Local barbuda-local'
  );
  
  // Small delay between tests
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test WordPress
  const wpResults = await testToursPage(
    'https://www.barbudaleisure.com/our-tours/',
    'WordPress Original'
  );
  
  // Generate comparison report
  generateComparisonReport(vercelResults, wpResults);
  
  console.log('✅ Comparison Complete!\n');
})();
