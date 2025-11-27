# 🎨 CargoRapido Grayscale - Quick Reference Guide

## 📋 Quick Color Classes

### **Backgrounds**
```jsx
bg-cr-white          // #FFFFFF - Main page background
bg-primary-50        // #FAFAFA - Subtle section background
bg-primary-100       // #F5F5F5 - Card/element background
bg-primary-200       // #E5E5E5 - Hover states
bg-gradient-elegant  // White → Light → Medium gradient
bg-gradient-dark     // Dark gray gradient (CTAs)
```

### **Text**
```jsx
text-cr-dark         // #2B2B2B - Headlines, important text
text-primary-700     // #5A5A5A - Body text, descriptions
text-primary-600     // #8A8A8A - Secondary text
text-cr-medium       // #B3B3B3 - Muted text
text-cr-white        // #FFFFFF - Text on dark backgrounds
text-primary-200     // #D4D4D4 - Text on dark gradients
```

### **Borders**
```jsx
border-primary-200   // #E5E5E5 - Subtle borders
border-primary-300   // #D4D4D4 - Medium borders
border-cr-dark       // #2B2B2B - Strong borders
```

### **Shadows**
```jsx
shadow-elegant       // Standard card shadow
shadow-elegant-lg    // Medium elevation
shadow-elegant-xl    // High elevation (modals)
```

### **Interactive**
```jsx
bg-cr-dark hover:bg-accent-hover  // Primary buttons
bg-primary-100 hover:bg-primary-200  // Secondary backgrounds
border-primary-200 hover:border-primary-300  // Hover borders
```

---

## 🎯 Common Patterns

### **Page Header**
```jsx
<div>
  <h1 className="text-3xl font-bold text-cr-dark">Page Title</h1>
  <p className="text-primary-700 mt-2">Description text</p>
</div>
```

### **Primary Button**
```jsx
<button className="bg-cr-dark text-cr-white px-8 py-4 rounded-lg
                   hover:bg-accent-hover shadow-elegant-lg
                   transition-all">
  Click Me
</button>
```

### **Secondary Button**
```jsx
<button className="bg-cr-white text-cr-dark px-8 py-4 rounded-lg
                   border-2 border-primary-300 hover:bg-primary-50
                   shadow-elegant transition-all">
  Cancel
</button>
```

### **Card Component**
```jsx
<div className="bg-cr-white rounded-xl shadow-elegant
                border border-primary-200 p-6
                hover:shadow-elegant-lg transition-all">
  <h3 className="text-xl font-semibold text-cr-dark mb-2">Card Title</h3>
  <p className="text-primary-700">Card description text goes here</p>
</div>
```

### **Stat Display**
```jsx
<div className="bg-primary-50 rounded-lg p-6">
  <p className="text-sm text-primary-700">Label</p>
  <p className="text-4xl font-bold text-cr-dark">50K+</p>
</div>
```

### **Icon with Background**
```jsx
<div className="w-12 h-12 bg-primary-100 rounded-full
                flex items-center justify-center">
  <IconComponent size={24} className="text-cr-dark" />
</div>
```

### **Form Field**
```jsx
<div>
  <label className="block text-sm font-medium text-primary-700 mb-2">
    Label Text
  </label>
  <input
    type="text"
    className="input" // Keep existing input classes
    placeholder="Enter text"
  />
</div>
```

### **Hero Section**
```jsx
<section className="bg-gradient-elegant py-20 px-4">
  <h1 className="text-5xl font-bold text-cr-dark">Hero Title</h1>
  <p className="text-xl text-primary-700 mt-4">Hero description</p>
  <button className="bg-cr-dark text-cr-white mt-8">
    Get Started
  </button>
</section>
```

### **Navigation**
```jsx
<nav className="bg-cr-white/95 border-b border-primary-200
                shadow-elegant backdrop-blur-sm">
  <div className="flex items-center">
    <span className="text-cr-dark font-bold">CargoRapido</span>
  </div>
</nav>
```

### **Footer**
```jsx
<footer className="bg-cr-dark text-primary-300
                   border-t border-primary-800">
  <p className="text-cr-white">Company Name</p>
  <p className="text-primary-300">Description</p>
</footer>
```

---

## ⚠️ Semantic Colors (Keep These!)

```jsx
// Success / Active / Completed
bg-green-100 text-green-600
bg-green-50 text-green-700

// Warning / Pending / In Progress
bg-yellow-100 text-yellow-600
bg-yellow-50 text-yellow-700

// Error / Cancelled / Rejected
bg-red-100 text-red-600
bg-red-50 text-red-700

// Special / Busy
bg-orange-100 text-orange-600
```

---

## 🚫 Colors to Avoid

```jsx
❌ text-blue-600, text-green-600, text-purple-600
✅ Use: text-cr-dark

❌ bg-blue-100, bg-green-100, bg-purple-100
✅ Use: bg-primary-100

❌ from-blue-500 to-blue-600
✅ Use: bg-gradient-dark

❌ text-gray-800 (for headings)
✅ Use: text-cr-dark

❌ text-gray-500 (for descriptions)
✅ Use: text-primary-700
```

---

## 📊 Color Decision Tree

```
Need background color?
├─ Main page → bg-cr-white
├─ Section → bg-primary-50
├─ Card → bg-primary-100
├─ CTA → bg-cr-dark
└─ Hero → bg-gradient-elegant

Need text color?
├─ Heading → text-cr-dark
├─ Body text → text-primary-700
├─ Secondary → text-primary-600
├─ On dark bg → text-cr-white or text-primary-200
└─ Muted → text-cr-medium

Need border?
├─ Subtle → border-primary-200
├─ Medium → border-primary-300
└─ Strong → border-cr-dark

Need shadow?
├─ Card → shadow-elegant
├─ Hover → shadow-elegant-lg
└─ Modal → shadow-elegant-xl

Status indicator?
├─ Success → Keep green
├─ Warning → Keep yellow
├─ Error → Keep red
└─ Neutral → Use grayscale
```

---

## 🎨 Before & After Examples

### Example 1: Card
```jsx
// BEFORE
<div className="bg-white shadow-lg border border-gray-200">
  <h3 className="text-gray-800">Title</h3>
  <p className="text-gray-600">Description</p>
  <button className="bg-blue-600 text-white">Click</button>
</div>

// AFTER
<div className="bg-cr-white shadow-elegant border border-primary-200">
  <h3 className="text-cr-dark">Title</h3>
  <p className="text-primary-700">Description</p>
  <button className="bg-cr-dark text-cr-white">Click</button>
</div>
```

### Example 2: Stat Display
```jsx
// BEFORE
<div className="bg-blue-50 p-4">
  <p className="text-gray-500">Users</p>
  <p className="text-2xl font-bold text-blue-600">10K</p>
</div>

// AFTER
<div className="bg-primary-50 p-4">
  <p className="text-primary-700">Users</p>
  <p className="text-2xl font-bold text-cr-dark">10K</p>
</div>
```

### Example 3: Icon
```jsx
// BEFORE
<div className="bg-green-100 p-3 rounded-full">
  <IconComponent className="text-green-600" />
</div>

// AFTER
<div className="bg-primary-100 p-3 rounded-full">
  <IconComponent className="text-cr-dark" />
</div>
```

---

## 💡 Pro Tips

1. **Headings always use** `text-cr-dark`
2. **Body text always uses** `text-primary-700`
3. **Primary CTAs always use** `bg-cr-dark`
4. **Cards always use** `shadow-elegant`
5. **Keep semantic colors** for status (green/yellow/red)
6. **Icons on light backgrounds** use `text-cr-dark`
7. **Icon backgrounds** use `bg-primary-100`
8. **Hover states** typically darken by one shade

---

## 🔧 Tailwind Config Reference

```javascript
// frontend/tailwind.config.js
colors: {
  'cr-white': '#FFFFFF',
  'cr-light': '#D4D4D4',
  'cr-medium': '#B3B3B3',
  'cr-dark': '#2B2B2B',
  primary: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    500: '#B3B3B3',
    700: '#5A5A5A',
    900: '#2B2B2B',
  },
  accent: {
    DEFAULT: '#2B2B2B',
    hover: '#1a1a1a',
  }
}
```

---

## ✅ Checklist for New Components

- [ ] Headings use `text-cr-dark`
- [ ] Body text uses `text-primary-700`
- [ ] Background uses grayscale colors
- [ ] Borders use `border-primary-200` or `border-primary-300`
- [ ] Shadows use `shadow-elegant` variants
- [ ] Primary buttons use `bg-cr-dark`
- [ ] Icons use `text-cr-dark` or `text-primary-700`
- [ ] Semantic colors preserved for status

---

**Quick Reference Version 1.0**
**Last Updated:** November 14, 2025
**Status:** Complete
