# Mobile Responsiveness Testing Guide

## Breakpoints Used in Kygoo Group

```typescript
// Tailwind CSS breakpoints (in use)
sm : 640px    // Small phones
md : 768px    // Tablets  
lg : 1024px   // Desktops
xl : 1280px   // Large desktops
2xl: 1536px   // Extra large screens
```

## Device Viewport Sizes to Test

### Min-Width (Mobile-First Approach)

| Device Type | Viewport Width | Viewport Height |
|-------------|---|---|
| iPhone SE | 375px | 667px |
| iPhone 14 | 390px | 844px |
| iPhone Pro Max | 430px | 932px |
| Samsung A50 | 360px | 800px |
| iPad Mini | 768px | 1024px |
| iPad Air | 820px | 1180px |
| Laptop | 1024px | 768px |
| Desktop | 1440px | 900px |
| Large Desktop | 1920px | 1080px |

## Browser DevTools Testing

### Chrome/Edge DevTools

1. Open DevTools: `F12` or `Ctrl+Shift+I`
2. Click device toggle: `Ctrl+Shift+M` or icon in toolbar
3. Select device from dropdown
4. Test critical interactions:
   - Tap buttons/links
   - Scroll pages
   - Resize viewport (manually)

### Firefox DevTools

1. Open DevTools: `F12`
2. Click Responsive Design Mode: `Ctrl+Shift+M`
3. Select device or custom dimensions
4. Test interactions

### Safari DevTools

1. Enable Developer Menu: Preferences → Advanced → Show Develop menu
2. Develop → Enter Responsive Design Mode
3. Select device
4. Test

## Critical Pages to Test

All these pages must be tested on each breakpoint:

### Public Pages
- [ ] Homepage (/)
- [ ] Studio (/studio)
- [ ] Photobooth (/photobooth)
- [ ] Digital (/digital)
- [ ] Coffee (/coffee)
- [ ] Contact (/contact)

### Auth Pages
- [ ] Login (/auth/login)
- [ ] Register (/auth/register)
- [ ] Password Reset (/auth/reset-password)

### Admin Pages (Must be responsive for tablet support)
- [ ] Dashboard (/admin)
- [ ] Content Manager (/admin/content)
- [ ] Orders (/admin/orders)
- [ ] Analytics (/admin/analytics)
- [ ] Settings (/admin/settings)

### Form Pages (Most Critical for Mobile)
- [ ] Studio Booking Form (inline & full-page)
- [ ] Photobooth Event Form (inline & full-page)
- [ ] Digital Inquiry Form (inline & full-page)
- [ ] Coffee Form (Order & Reservation)
- [ ] Contact Form (inline & full-page)

## Responsive Testing Checklist

### Mobile (320px - 640px)

- [ ] Text is readable (min 16px font on inputs)
- [ ] Touch targets are > 44x44px (finger-friendly)
- [ ] Single column layout where appropriate
- [ ] Navigation is accessible (hamburger or bottom nav)
- [ ] Forms are not too wide (max 100% width)
- [ ] Images scale properly
- [ ] Horizontal scrolling NOT present
- [ ] Padding/margins are appropriate
- [ ] Modals/dialogs full height if needed
- [ ] No content hidden due to viewport

**Test by:**
```bash
# Start dev server
npm run dev

# Open Chrome DevTools (F12 or Cmd+Opt+I)
# Click device toggle (Cmd+Shift+M or icon
# Select iPhone 12 or similar
# Test all interactions
```

### Tablet (641px - 1023px)

- [ ] Takes advantage of wider screen
- [ ] Two-column layouts where applicable
- [ ] Tables are readable (not truncated)
- [ ] Grid layouts display correctly
- [ ] Touch targets remain > 44x44px
- [ ] Keyboard works [Tab through all interactive elements]
- [ ] Orientation changes work (portrait ↔ landscape)

**Test by:**
```bash
# In DevTools, select iPad or custom 768x1024
# Test portrait and landscape (rotate or resize)
# Verify all content visible without horizontal scroll
```

### Desktop (1024px+)

- [ ] Multi-column layouts utilize space
- [ ] Hover states work (not on touch)
- [ ] Dropdowns and menus function
- [ ] Sufficient whitespace without feeling sparse
- [ ] Maximum width limits prevent line length issues

**Test by:**
```bash
# Resize browser window or use monitor at native resolution
# Verify links have :hover states
# Check hover states don't block content
```

## Critical Mobile Interactions to Verify

### Forms
- [ ] Input fields accept text input
- [ ] Dropdowns open and close
- [ ] Radio buttons can be selected
- [ ] Checkboxes toggle properly
- [ ] Submit buttons are tappable
- [ ] Error messages display correctly
- [ ] Success messages appear after submission
- [ ] No keyboard getting stuck
- [ ] Form input type gives correct keyboard (email = @, tel = numbers)

### Navigation
- [ ] All pages accessible from menu
- [ ] Mobile menu opens/closes
- [ ] Back button works
- [ ] Links navigate correctly
- [ ] No dead links

### Scrolling & Performance
- [ ] Page scrolls smoothly
- [ ] No jank or stuttering
- [ ] Images load properly
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts during load (CLS < 0.1)

### Keyboard (especially important for accessib ility)
- [ ] All interactive elements reachable via Tab
- [ ] Form fields can be filled with keyboard
- [ ] Submit forms with Enter key
- [ ] Close modals with Escape key
- [ ] Focus visible (not hidden)

## Automated Mobile Testing

### Using Playwright (for E2E testing)

```bash
# Install
npm install -D @playwright/test

# Run mobile tests
npx playwright test --headed

# Test specific mobile device
npx playwright test --headed --project "iPhone 12"
```

Example test file:
```typescript
import { test, expect, devices } from '@playwright/test'

test.describe('Mobile Responsiveness', () => {
  test.use({ ...devices['iPhone 12'] })

  test('Contact form works on mobile', async ({ page }) => {
    await page.goto('/contact')
    
    // Find form
    const form = page.locator('form')
    expect(form).toBeVisible()
    
    // Fill form
    await page.fill('[name="name"]', 'John Doe')
    await page.fill('[name="email"]', 'john@example.com')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Verify success
    expect(page.locator('text=successfully')).toBeVisible()
  })
})
```

### Using Lighthouse CI

```bash
# Install
npm install -g @lhci/cli@latest lhci

# Run audit
lhci autorun

# View results
lhci open
```

## Common Mobile Issues & Fixes

### Issue: Text Too Small on Mobile
```typescript
// ❌ Bad - Fixed size
<h1 className="text-2xl">Title</h1>

// ✅ Good - Responsive size
<h1 className="text-lg md:text-2xl lg:text-3xl">Title</h1>

// Or use clamp()
<h1 className="text-[clamp(1.5rem, 5vw, 3rem)]">Title</h1>
```

### Issue: Too Wide on Mobile
```typescript
// ❌ Bad - No max width
<div className="w-full px-4">...</div>

// ✅ Good - Respects mobile
<div className="w-full max-w-6xl mx-auto px-4">...</div>
```

### Issue: Touch Targets Too Small
```typescript
// ❌ Bad - Hard to tap
<button className="px-2 py-1">Click</button>

// ✅ Good - Easy to tap (44x44px minimum)
<button className="px-4 py-3 md:px-3 md:py-2">Click</button>
```

### Issue: Horizontal Scroll on Mobile
```typescript
// ❌ Bad - Causes horizontal scroll
<div className="flex gap-4 overflow-hidden">
  {items.map(item => <div className="min-w-max">...</div>)}
</div>

// ✅ Good - Fits mobile width
<div className="overflow-x-auto">
  <div className="flex gap-4 min-w-full">
    {items.map(item => <div>...</div>)}
  </div>
</div>
```

### Issue: Images Don't Scale
```typescript
// ❌ Bad - Fixed size
<img src="photo.jpg" width={400} height={300} />

// ✅ Good - Responsive
<img 
  src="photo.jpg" 
  width={400} 
  height={300} 
  className="w-full h-auto max-w-md"
/>
```

## Performance on Mobile

### Key Metrics
- **FCP** (First Contentful Paint): < 3.0s
- **LCP** (Largest Contentful Paint): < 4.0s  
- **CLS** (Cumulative Layout Shift): < 0.25

### Test Performance
```bash
# Lighthouse audit in DevTools
# DevTools → Lighthouse → Mobile

# Or CLI
npm install -g lighthouse
lighthouse https://kygoo.group --view
```

## Real Device Testing

### Using BrowserStack (paid)
- Test on 2000+ real devices
- Located all over the world
- Good for final verification before launch

### Using Your Own Devices
1. Connect phone via USB
2. Open your dev server on LAN
3. Navigate to `http://[your-ip]:3000`
4. Test fully

### Network Throttling (simulate slow networks)

In Chrome DevTools:
1. Open DevTools
2. Network tab
3. Throttle: Slow 4G / Fast 3G
4. Reload page
5. Verify still usable

## Accessibility on Mobile

- [ ] Text is readable without zooming
- [ ] Touch targets > 44x44px
- [ ] Check with screen reader (VoiceOver on iOS)
- [ ] High color contrast for readability
- [ ] No content requires hover to access
- [ ] Keyboard navigation works completely

## Testing Orientation Changes

```typescript
// Listen for orientation changes
import { useState, useEffect } from 'react'

export function ResponsiveComponent() {
  const [orientation, setOrientation] = useState('portrait')

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    return () => window.removeEventListener('orientationchange', handleOrientationChange)
  }, [])

  return <div>Current: {orientation}</div>
}
```

Test by:
1. Open page on mobile device
2. Rotate device 90 degrees
3. Check layout adjusts smoothly
4. Verify no content lost

## Sign-Off Checklist

Before considering mobile complete:

- [ ] All critical pages tested on: iPhone (375px), Tablet (768px), Desktop (1440px)
- [ ] All forms work on mobile
- [ ] Navigation accessible on mobile
- [ ] No horizontal scrolling
- [ ] Images properly scaled
- [ ] Touch targets > 44x44px
- [ ] Performance acceptable (LCP < 4s on 4G)
- [ ] Accessibility verified
- [ ] Orientation changes work
- [ ] No console errors/warnings

## Resources

- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Material Design Best Practices](https://material.io/design/platform-guidance/android-bars.html)
- [Apple HIG Mobile Design](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Web Vitals](https://web.dev/vitals/)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Lighthouse Docs](https://developers.google.com/web/tools/lighthouse)
