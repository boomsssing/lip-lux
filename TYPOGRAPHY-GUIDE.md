# 🎨 Typography System - LipLux By Jay

## 📚 Font Families

### **Playfair Display** (Headings)
- **Usage:** All headings (H1-H6), titles, hero text
- **Style:** Elegant serif font
- **Weights:** 400, 500, 600, 700, 800
- **Character:** Luxurious, sophisticated, timeless

### **Poppins** (Body Text)
- **Usage:** Body text, paragraphs, descriptions
- **Style:** Modern sans-serif
- **Weights:** 300, 400, 500, 600, 700
- **Character:** Clean, readable, friendly

### **Montserrat** (Accents)
- **Usage:** Buttons, navigation, labels, badges
- **Style:** Geometric sans-serif
- **Weights:** 300, 400, 500, 600, 700, 800
- **Character:** Bold, modern, professional

---

## 📏 Fluid Typography Scale

### What is Fluid Typography?
Font sizes that automatically adjust based on screen size using CSS `clamp()` function. This ensures perfect readability on all devices without media queries!

### Size Scale:

| Name | CSS Variable | Min Size | Preferred | Max Size | Usage |
|------|-------------|----------|-----------|----------|-------|
| **3XL** | `--fs-3xl` | 3rem | 2.5rem + 2.5vw | 5rem | Hero titles, main headings |
| **2XL** | `--fs-2xl` | 2.5rem | 2rem + 2.5vw | 4rem | Section headings |
| **XL** | `--fs-xl` | 2rem | 1.6rem + 2vw | 3rem | H3, large text |
| **LG** | `--fs-lg` | 1.5rem | 1.3rem + 1vw | 2rem | H4, prices |
| **MD** | `--fs-md` | 1.125rem | 1rem + 0.625vw | 1.5rem | H5, lead text |
| **Base** | `--fs-base` | 1rem | 0.95rem + 0.25vw | 1.125rem | Body text |
| **SM** | `--fs-sm` | 0.875rem | 0.8rem + 0.375vw | 1rem | Small text, buttons |
| **XS** | `--fs-xs` | 0.75rem | 0.7rem + 0.25vw | 0.875rem | Tiny text, labels |

---

## 📐 Line Heights

| Variable | Value | Usage |
|----------|-------|-------|
| `--lh-tight` | 1.2 | Headings, titles |
| `--lh-normal` | 1.5 | Body text |
| `--lh-relaxed` | 1.75 | Paragraphs, descriptions |

---

## 🔤 Letter Spacing

| Variable | Value | Usage |
|----------|-------|-------|
| `--ls-tight` | -0.025em | Large headings |
| `--ls-normal` | 0 | Body text |
| `--ls-wide` | 0.025em | Buttons, navigation |
| `--ls-wider` | 0.05em | All caps text |

---

## 🎯 Typography Classes

### Heading Styles
```html
<h1>Main Hero Title</h1>          <!-- 3rem - 5rem -->
<h2>Section Heading</h2>           <!-- 2.5rem - 4rem -->
<h3>Subsection Title</h3>          <!-- 2rem - 3rem -->
<h4>Card Title</h4>                <!-- 1.5rem - 2rem -->
<h5>Small Heading</h5>             <!-- 1.125rem - 1.5rem -->
<h6>Tiny Heading</h6>              <!-- 1rem - 1.125rem -->
```

### Utility Classes
```html
<!-- Display Text (Extra Large) -->
<div class="display-text">Glossy Vibes, Timeless Beauty</div>

<!-- Accent Text (Uppercase, Spaced) -->
<span class="accent-text">New Arrival</span>

<!-- Lead Paragraph -->
<p class="lead">Discover our luxurious collection...</p>

<!-- Small Text -->
<small>Terms and conditions apply</small>
<span class="text-sm">Small text</span>
<span class="text-xs">Extra small text</span>
```

---

## 🎨 Component Typography

### Navigation
- **Font:** Montserrat
- **Size:** --fs-sm (0.875rem - 1rem)
- **Weight:** 500
- **Transform:** Uppercase
- **Spacing:** --ls-wide

### Buttons
- **Font:** Montserrat
- **Size:** --fs-sm
- **Weight:** 600
- **Transform:** Uppercase
- **Spacing:** --ls-wide

### Product Names
- **Font:** Playfair Display
- **Size:** --fs-md
- **Weight:** 600
- **Line Height:** --lh-tight

### Prices
- **Font:** Montserrat
- **Size:** --fs-lg
- **Weight:** 700
- **Spacing:** --ls-tight

### Hero Title
- **Font:** Playfair Display
- **Size:** --fs-3xl (3rem - 5rem)
- **Weight:** 800
- **Line Height:** --lh-tight
- **Spacing:** --ls-tight

### Hero Subtitle
- **Font:** Poppins
- **Size:** --fs-md
- **Weight:** 300
- **Line Height:** --lh-relaxed

---

## 📱 Responsive Behavior

### Mobile (320px - 768px)
- Hero title: **3rem**
- Section headings: **2.5rem**
- Body text: **1rem**
- Buttons: **0.875rem**

### Tablet (768px - 1024px)
- Hero title: **~4rem** (scales smoothly)
- Section headings: **~3rem**
- Body text: **~1.05rem**
- Buttons: **~0.9rem**

### Desktop (1024px+)
- Hero title: **5rem**
- Section headings: **4rem**
- Body text: **1.125rem**
- Buttons: **1rem**

---

## 💡 Best Practices

### DO ✅
- Use heading hierarchy (H1 → H2 → H3)
- Apply Playfair Display for elegance
- Use Montserrat for emphasis
- Keep body text in Poppins
- Maintain consistent spacing
- Use fluid typography variables

### DON'T ❌
- Skip heading levels
- Mix too many font families
- Use fixed pixel sizes
- Ignore line height
- Overcrowd text
- Use all caps for long text

---

## 🎯 Usage Examples

### Product Card
```html
<div class="product-card">
    <h3 class="product-name">Rose Blush Gloss</h3>
    <span class="product-category">Glossy</span>
    <p class="product-description">Beautiful rose-tinted gloss...</p>
    <span class="product-price">GH₵ 45.00</span>
</div>
```

### Hero Section
```html
<section class="hero">
    <h1 class="hero-title">Glossy Vibes, Timeless Beauty</h1>
    <p class="hero-subtitle">Discover our luxurious collection...</p>
    <button class="btn btn-primary">Shop Now</button>
</section>
```

### Section Header
```html
<div class="section-header">
    <h2>Our Collection</h2>
    <p>Luxe lip glosses crafted for perfection</p>
</div>
```

---

## 🔧 Customization

### Change Font Sizes
Edit in `css/style.css`:
```css
:root {
    --fs-3xl: clamp(3rem, 2.5rem + 2.5vw, 5rem);
    /* Adjust min, preferred, and max values */
}
```

### Change Font Families
```css
:root {
    --font-heading: 'Your Heading Font', serif;
    --font-body: 'Your Body Font', sans-serif;
    --font-accent: 'Your Accent Font', sans-serif;
}
```

### Add New Font Weights
Update Google Fonts link in HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;900&display=swap">
```

---

## 🌟 Typography Features

### Smooth Scaling
- ✅ No jarring jumps between breakpoints
- ✅ Perfectly readable at any screen size
- ✅ Maintains visual hierarchy
- ✅ Optimized for mobile and desktop

### Performance
- ✅ Font preloading for faster load times
- ✅ Font-display: swap for better UX
- ✅ Optimized font weights loaded
- ✅ Antialiasing for crisp text

### Accessibility
- ✅ Sufficient contrast ratios
- ✅ Readable font sizes (minimum 16px)
- ✅ Proper line heights for readability
- ✅ Clear visual hierarchy

---

## 📊 Typography Hierarchy

```
Hero Title (--fs-3xl)
    ↓
Section Headings (--fs-2xl)
    ↓
Subsection Titles (--fs-xl)
    ↓
Card Titles (--fs-lg)
    ↓
Body Text (--fs-base)
    ↓
Small Text (--fs-sm)
    ↓
Tiny Labels (--fs-xs)
```

---

**Beautiful, responsive typography that scales perfectly! 💄✨**
