#!/bin/bash
cd "$(dirname "$0")"

echo "Capturing fresh screenshots for all pages..."

npx playwright screenshot --full-page --viewport-size=1920,1080 http://localhost:3000/ visual-regression/home-local-new.png
echo "✓ Home"

npx playwright screenshot --full-page --viewport-size=1920,1080 http://localhost:3000/reviews visual-regression/reviews-local-new.png
echo "✓ Reviews"

npx playwright screenshot --full-page --viewport-size=1920,1080 http://localhost:3000/our-blog visual-regression/blog-local-new.png
echo "✓ Blog"

npx playwright screenshot --full-page --viewport-size=1920,1080 http://localhost:3000/faq visual-regression/faq-local-new.png
echo "✓ FAQ"

npx playwright screenshot --full-page --viewport-size=1920,1080 http://localhost:3000/tours/discover-barbuda-by-air visual-regression/tour-detail-local-new.png
echo "✓ Tour Detail"

npx playwright screenshot --full-page --viewport-size=1920,1080 http://localhost:3000/terms-and-conditions visual-regression/terms-local-new.png
echo "✓ Terms"

npx playwright screenshot --full-page --viewport-size=1920,1080 http://localhost:3000/refund_returns visual-regression/cancellation-local-new.png
echo "✓ Cancellation"

echo ""
echo "All screenshots captured!"
echo ""
echo "Checking dimensions:"
for f in visual-regression/*-local-new.png; do
  file "$f" | grep -o '[0-9]* x [0-9]*'
done
