# Elementor to Next.js/Vercel Transformer

Transform extracted Elementor pages into Next.js components ready for deployment on Vercel.

## What It Does

This transformer converts:
- ✅ **Elementor sections** → Next.js `<section>` components with Tailwind CSS
- ✅ **Elementor columns** → Responsive grid layouts
- ✅ **Elementor widgets** → React components (heading, text, image, button, cards)
- ✅ **Styling** → Tailwind CSS utility classes
- ✅ **Content** → Separate JSON files for easy editing

## Generated Output

### `/pages` Directory
Contains Next.js page components (`.tsx` files) for each extracted page:
- `about-us.tsx`
- `our-tours.tsx`
- `ready-to-explore-barbuda.tsx`
- etc.

### `/data` Directory
Contains JSON content files for each page (`.json` files):
- `about-us.json`
- `our-tours.json`
- etc.

## Usage

### 1. Run the Transformation

```bash
npm run build
node dist/cli.js <input-dir> <output-dir>
```

Example:
```bash
node dist/cli.js ../../extractors/elementor/output ./output
```

### 2. Integrate into Next.js Project

#### Option A: Copy into existing Next.js project

```bash
# Copy page components
cp output/pages/*.tsx your-nextjs-project/src/app/

# Copy content data
cp output/data/*.json your-nextjs-project/src/data/
```

#### Option B: Create new Next.js project

```bash
# Create Next.js project with Tailwind
npx create-next-app@latest barbuda-leisure --typescript --tailwind --app

# Copy files
cp output/pages/*.tsx barbuda-leisure/src/app/
cp output/data/*.json barbuda-leisure/src/data/
```

### 3. Deploy to Vercel

```bash
cd your-nextjs-project
vercel
```

## Component Examples

### Tour Cards (ha-card widget)
```tsx
<div className="bg-white rounded-lg shadow-lg overflow-hidden">
  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
    Popular
  </div>
  <Image src="..." alt="..." width={800} height={400} />
  <div className="p-6">
    <h3 className="text-xl font-bold mb-2">Discover Barbuda by Air</h3>
    <p className="text-gray-600 mb-4">...</p>
    <a href="..." className="inline-block px-4 py-2 bg-blue-600 text-white rounded">
      Learn More
    </a>
  </div>
</div>
```

### Headings
```tsx
<h2 className="text-2xl font-bold mb-4">
  Your Tour Review
</h2>
```

### Text Content
```tsx
<div
  className="prose prose-lg"
  dangerouslySetInnerHTML={{ __html: `...` }}
/>
```

### Images
```tsx
<Image
  src="https://..."
  alt="..."
  width={800}
  height={600}
  className="w-full h-auto rounded-lg"
/>
```

## Customization

### Modify Tailwind Classes
Edit the component files directly to adjust styling:

```tsx
// Change from:
<div className="bg-blue-600">

// To:
<div className="bg-purple-600">
```

### Update Content
Edit the JSON files in `/data` directory and update your components to load from them:

```tsx
import pageData from '@/data/our-tours.json';

export default function OurToursPage() {
  return (
    <main>
      <h1>{pageData.title}</h1>
      {/* ... */}
    </main>
  );
}
```

### Add Custom Components
The transformer references UI components from `@/components/ui/`:
- `Button`
- `Heading`
- etc.

Create these components in your Next.js project or replace with your own.

## Supported Widgets

- ✅ **heading** - Headings with customizable HTML tags
- ✅ **text-editor** - Rich text content
- ✅ **image** - Optimized Next.js images
- ✅ **button** - Styled buttons with links
- ✅ **ha-card** - Happy Addons card components (tours, features, etc.)
- ✅ **metform** - Form placeholders (needs integration)

## Next Steps

1. **Add Navigation** - Create a header/navigation component
2. **Add Footer** - Create a footer component
3. **Style Refinement** - Adjust Tailwind classes to match your design
4. **Forms Integration** - Connect metform widgets to your form handling
5. **Images Optimization** - Configure Next.js `next.config.js` for external images
6. **SEO** - Add metadata and Open Graph tags
7. **Analytics** - Add Vercel Analytics or Google Analytics

## Configuration

### Next.js Image Domains

Add this to `next.config.js`:

```js
module.exports = {
  images: {
    domains: ['www.barbudaleisure.com'],
  },
}
```

### Tailwind Configuration

Ensure your `tailwind.config.js` includes:

```js
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // For prose classes
  ],
}
```

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Other Platforms

The generated Next.js components work on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Self-hosted

## Troubleshooting

### Images not loading
- Add image domains to `next.config.js`
- Check image URLs are accessible

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check that all utility classes are valid
- Use JIT mode for arbitrary values like `pt-[80px]`

### Missing components
- Create placeholder components in `@/components/ui/`
- Or remove the imports if not using those widgets

## License

MIT
