# Barbuda Leisure - Complete Design Specification

**Extracted:** 2025-11-14
**Source:** https://www.barbudaleisure.com
**Method:** Puppeteer Browser Automation

---

## 🎨 Color Palette

### Primary Brand Colors
- **Aqua/Cyan**: `#30BBD8` `rgb(48, 187, 216)` - Primary brand color, buttons, backgrounds
- **Pink**: `#F5B6D3` - Section backgrounds ("Why Choose Us")
- **Navy**: `#001D46` - Footer gradient, dark sections
- **Dark Gray**: `#32373c` - Headers, badges, dark UI elements

### Text Colors
- **White**: `#FFFFFF` - Primary text on colored backgrounds
- **Black**: `#000000` - Body text, headings
- **Gray 200**: `#A7A7A7` - Navigation, muted text
- **Gray 400**: `#7A7A7A` - Secondary text

---

## 📝 Typography

### Font Families (in order of usage)
1. **Leckerli One** - Hero headings (5em, weight: 300)
2. **Lexend** - Subheadings (1.3em, weight: 600)
3. **Lexend Deca** - Section titles (2em, weight: 600)
4. **Open Sans** - Buttons, body text (14px, weight: 600-700)
5. **Roboto** - Cards, UI elements (weight: 500-600)
6. **Lato** - Footer headings (20px, weight: 800)
7. **Roboto Slab** - Typography variant
8. **IBM Plex Sans** - Additional body text

### Typography Scale
- **Hero H1**: 5em, Leckerli One, weight 300, white
- **Section H2**: 2em, Lexend Deca, weight 600
- **Subheadings**: 1.3em, Lexend, weight 600
- **Buttons**: 14px, Open Sans, weight 700, uppercase
- **Body**: 16px, Open Sans, weight 400

---

## 🖼️ Hero Section - Background Slideshow

### Slideshow Configuration
- **Type**: Elementor Background Slideshow (Swiper)
- **Total Slides**: 3 rotating images
- **Transition**: 10s linear transform, fade effect
- **Images**:
  1. `DSC3121-scaled.jpg`
  2. `The-Catamaran-As-It-Rests-on-one-of-Barbudas-beachs.webp`
  3. `Pink-Beach-North-scaled.jpg`

### Hero Section Styling
```css
{
  background: radial-gradient(at 50% 50%, #30BBD870 28%, #30BBD8 100%);
  min-height: 100vh;
  padding-top: 0%;
  padding-bottom: 15%;
  position: relative;
}
```

### Hero Content Box
```css
{
  background: linear-gradient(to right, rgba(48,187,216,0.95), rgba(128,222,234,0.95));
  padding: 48px;
  border-radius: 16px;
  box-shadow: 18px 30px 61px 50px rgba(0,0,0,0.1);
  backdrop-filter: blur(8px);
  transition: transform 0.8s;
}

.hero-box:hover {
  transform: translateY(-50px);
}
```

---

## 📐 Section Structure

### Section 1: Hero with Slideshow
- **Background**: Aqua `rgb(48, 187, 216)` with slideshow overlay
- **Height**: 626px
- **Padding**: 29px 35px 39px
- **Contains**: 4 containers, 6 columns, 22 widgets
- **Wave Divider**: White (#FFFFFF) at bottom, height 200px

### Section 2: Featured Tours
- **Background**: White
- **Padding**: 75px 0
- **Layout**: 4-column grid
- **Card Styles**:
  ```css
  {
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.15);
    transition: 0.8s;
  }

  .tour-card:hover {
    filter: brightness(112%) saturate(110%);
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.25);
  }
  ```

### Section 3: Why Choose Us (Pink Section)
- **Background**: `#F5B6D3`
- **Background Image**: BarbudaLeisureTours-7.jpg with filters
- **Filters**:
  ```css
  {
    filter: brightness(111%) contrast(163%) saturate(0%) blur(0.5px) hue-rotate(257deg);
  }
  ```
- **Min Height**: 450px
- **Padding**: 150px 20px
- **Wave Divider**: Pink (#F5B6D3) at top, height 60px

### Section 4: Premier Experience (Footer)
- **Background**: `linear-gradient(181deg, #30BBD8 0%, #001D46 84%)`
- **Filters**:
  ```css
  {
    filter: brightness(132%) contrast(130%) saturate(0%) blur(0.4px);
  }
  ```
- **Padding**: 150px top, 50px bottom
- **Wave Divider**: Cyan with transparency (#30BBD817) at top, height 120px

---

## 〰️ Wave Dividers

### Specifications
1. **Hero Bottom Divider**:
   - Color: White (#FFFFFF)
   - Height: 200px
   - Width: calc(200% + 1.3px)
   - Position: Absolute bottom

2. **Pink Section Top Divider**:
   - Color: Pink (#F5B6D3)
   - Height: 60px
   - Width: calc(100% + 1.3px)
   - Position: Absolute top

3. **Footer Top Divider**:
   - Color: Transparent Cyan (#30BBD817)
   - Height: 120px
   - Width: calc(165% + 1.3px)
   - Position: Absolute top

### SVG Path
```html
<svg viewBox="0 0 1200 120" preserveAspectRatio="none">
  <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
</svg>
```

---

## 🎠 Carousels

### Blog Posts Carousel
- **Type**: Swiper
- **Slides**: 2
- **Images**:
  1. `Allesandra-370x247.jpg`
  2. `DSCF5666-2-370x247.jpg`
- **Auto-play**: Yes
- **Loop**: Yes
- **Transition**: Slide

---

## 🎯 Buttons

### Primary Button
```css
{
  background: #30BBD8;
  color: #FFFFFF;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  padding: 15px 20px;
  border-radius: 8px;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #001D46;
  box-shadow: 0px 5px 15px rgba(0,0,0,0.3);
}
```

---

## 🖼️ Images

### All Images from Homepage

1. **Logo**: `BlackBarbuda-Leisure-Day-Tours-2-Colour.webp` (150px width)
2. **Hero Slideshow**:
   - `DSC3121-scaled.jpg`
   - `The-Catamaran-As-It-Rests-on-one-of-Barbudas-beachs.webp`
   - `Pink-Beach-North-scaled.jpg`
3. **Tour Cards**:
   - `BarbudaLeisureTours-3-2-300x300.jpg` (Discover by Sea)
   - `BarbudaLeisureTours-7-300x300.jpg` (Discover by Air)
   - `BarbudaLeisureTours-15-300x300.jpg` (Private Charter Air)
   - `Allesandra-300x200.jpg` (Private Charter Sea)
4. **Blog Carousel**:
   - `Allesandra-370x247.jpg`
   - `DSCF5666-2-370x247.jpg`

### Image Base URL
`https://www.barbudaleisure.com/wp-content/uploads/`

---

## 📱 Responsive Breakpoints

- **Desktop**: 1920px+ (full design)
- **Laptop**: 1366px (standard viewport)
- **Tablet**: 768px (2-column grid)
- **Mobile**: 375px (single column, stacked)

---

## ✨ Animations & Transitions

### Hover Effects
- **Tour Cards**: brightness(112%), saturate(110%), 800ms transition
- **Hero Box**: translateY(-50px), 800ms transition
- **Buttons**: background color change, shadow increase, 300ms

### Carousel Transitions
- **Slideshow**: 10s linear transform
- **Blog Carousel**: Slide effect, auto-play

---

## 🎨 Icon Circles (Why Choose Us)

```css
{
  width: 64px;
  height: 64px;
  background: #30BBD8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.icon-circle svg {
  width: 32px;
  height: 32px;
  color: #FFFFFF;
}
```

---

## 📋 Implementation Checklist

- [x] Color palette configured in Tailwind
- [x] All Google Fonts loaded
- [x] Hero section with gradient overlay
- [x] Wave dividers with correct colors
- [x] Pink "Why Choose Us" section
- [x] Footer gradient cyan to navy
- [ ] **Hero background slideshow** (3 images rotating)
- [ ] **Blog posts carousel** (2 images)
- [ ] Hover animations on tour cards
- [ ] Icon circles with cyan background
- [ ] Responsive breakpoints
- [ ] All images optimized and loaded

---

## 🔧 Next Implementation Steps

1. **Add Hero Slideshow**:
   - Install Swiper.js or use CSS animation
   - Implement 3-image rotation with fade
   - Add 10s transition timing

2. **Add Blog Carousel**:
   - Implement Swiper component
   - Add 2 blog images
   - Configure auto-play

3. **Fix Section Backgrounds**:
   - Ensure pink section has correct image overlay
   - Apply all filter effects
   - Test gradient overlays

4. **Optimize Images**:
   - Download all images locally
   - Optimize for web (WebP format)
   - Implement lazy loading

---

**Generated:** 2025-11-14 via Puppeteer extraction
**Source Files:** `bl-new-site/extractors/output/puppeteer-extraction/`
