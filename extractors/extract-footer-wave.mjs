import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to site...');
  await page.goto('https://www.barbudaleisure.com', { waitUntil: 'networkidle2', timeout: 60000 });

  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 2000));

  // Extract footer SVG waves
  const footerWaves = await page.evaluate(() => {
    const footer = document.querySelector('.ekit-template-content-footer');
    if (!footer) return { error: 'Footer not found' };

    const waves = [];
    const shapes = footer.querySelectorAll('.elementor-shape');

    shapes.forEach((shape, index) => {
      const svg = shape.querySelector('svg');
      if (!svg) return;

      const paths = [];
      svg.querySelectorAll('path').forEach(path => {
        paths.push({
          d: path.getAttribute('d'),
          fill: path.getAttribute('fill'),
          opacity: path.getAttribute('opacity'),
          className: path.getAttribute('class')
        });
      });

      const computedStyle = window.getComputedStyle(shape);
      const svgStyle = window.getComputedStyle(svg);

      waves.push({
        index,
        viewBox: svg.getAttribute('viewBox'),
        pathCount: paths.length,
        paths: paths,
        shapeClass: shape.className,
        position: shape.classList.contains('elementor-shape-bottom') ? 'bottom' : 'top',
        height: computedStyle.height,
        fill: paths[0]?.fill || svgStyle.fill
      });
    });

    return waves;
  });

  console.log('Footer waves found:', footerWaves.length);
  footerWaves.forEach((w, i) => {
    console.log(`  Wave ${i}: ${w.position}, ${w.pathCount} paths, viewBox: ${w.viewBox}`);
  });

  // Save to file
  fs.writeFileSync('output/footer-waves.json', JSON.stringify(footerWaves, null, 2));
  console.log('Saved to output/footer-waves.json');

  await browser.close();
})();
