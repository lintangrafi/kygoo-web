# Testing & Quality Assurance Guide

## Unit Testing

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:ci

# Run tests for specific file
npm test -- ContactForm

# Run with coverage
npm test -- --coverage
```

### Test Coverage Goals

- **Lines**: 50%+ (initial), 70%+ (ideal)
- **Branches**: 50%+ (initial), 70%+ (ideal)
- **Functions**: 50%+ (initial), 70%+ (ideal)
- **Statements**: 50%+ (initial), 70%+ (ideal)

### Writing Tests

Create test files with `.test.tsx` or `.spec.tsx` extension next to components:

```
src/components/
  ├── ContactForm.tsx
  └── ContactForm.test.tsx
```

Example test structure:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('renders form fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
  })

  it('validates email field', async () => {
    render(<ContactForm />)
    const emailInput = screen.getByLabelText(/Email/i)
    
    fireEvent.change(emailInput, { target: { value: 'invalid' } })
    fireEvent.blur(emailInput)
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { 
      target: { value: 'John Doe' } 
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
  })
})
```

## Type Checking

```bash
# Run TypeScript type check
npm run type-check

# Watch mode
npm run type-check -- --watch
```

Fix type errors before committing:

```bash
# Show all type errors
npx tsc --noEmit

# Fix auto-fixable errors
npx eslint --fix
```

## Linting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Performance & Bundle Analysis

### Build Analysis

```bash
# Analyze bundle size
ANALYZE=true npm run build

# This generates an interactive visualization showing:
# - Bundle size breakdown
# - Largest dependencies
# - Opportunities to reduce size
```

### Performance Metrics

Check Core Web Vitals:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

View in:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Web Vitals extension](https://chrome.google.com/webstore/detail/web-vitals)
- Application → Lighthouse in Chrome DevTools

## Code Quality Checklist

Before committing:

- [ ] TypeScript type check passes: `npm run type-check`
- [ ] Linter passes: `npm run lint`
- [ ] Tests pass: `npm test`
- [ ] No console errors/warnings
- [ ] Accessibility issues addressed
- [ ] Mobile responsiveness verified
- [ ] Performance acceptable (LCP < 2.5s)

### Pre-commit Hook

Automatically run checks:

```bash
npx husky install
npx husky add .husky/pre-commit "npm run type-check && npm run lint && npm test -- --bail"
```

## Common Quality Issues & Fixes

### Issue: Missing TypeScript Types
**Error**: `Type 'any' implicitly`
**Fix**: Add proper types to function parameters and returns

```typescript
// ❌ Bad
const handleChange = (e) => {
  setFormData(e.target.value)
}

// ✅ Good
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(e.target.value)
}
```

### Issue: Unused Imports
**Error**: `'React' is declared but never used`
**Fix**: Remove unused imports

```typescript
// ❌ Bad
import React from 'react'
import { useState } from 'react'

// ✅ Good
import { useState } from 'react'
```

### Issue: Missing Dependencies in useEffect
**Warning**: `useEffect missing dependencies`
**Fix**: Add all dependencies or use useCallback

```typescript
// ❌ Bad
useEffect(() => {
  fetchData()
}, [])  // fetchData is a dependency!

// ✅ Good
useEffect(() => {
  const fetchData = async () => { ... }
  fetchData()
}, [])
```

### Issue: Unhandled Promise Rejection
**Error**: `Unhandled promise rejection`
**Fix**: Add error handling

```typescript
// ❌ Bad
fetchData().then(setData)

// ✅ Good
fetchData()
  .then(setData)
  .catch(setError)
```

## Browser Compatibility

Tested and supported:

- Chrome 96+
- Firefox 95+
- Safari 15+
- Edge 96+

Check compatibility:
```bash
npx browserslist
```

## Accessibility Testing

### Automated Testing

```bash
npx axe-core ./src
```

### Manual Testing

1. **Keyboard Navigation**: Tab through entire app
2. **Screen Reader**: Test with NVDA/JAWS
3. **Color Contrast**: Check all text meets WCAG AA standards
4. **Focus States**: All interactive elements visible when focused

### Common Accessibility Issues & Fixes

```typescript
// ❌ Bad - Missing labels
<input type="email" />

// ✅ Good - Proper label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ❌ Bad - Unlabeled buttons
<button>×</button>

// ✅ Good - Descriptive label
<button aria-label="Close dialog">×</button>

// ❌ Bad - Missing alt text
<img src="photo.jpg" />

// ✅ Good - Descriptive alt
<img src="photo.jpg" alt="Team photo at office" />
```

## Continuous Integration

### GitHub Actions

Automatically runs on:
- Push to main/develop
- Pull requests

View status:
```bash
# GitHub Actions dashboard
https://github.com/username/kygoo-web/actions
```

### Local CI Simulation

```bash
# Run the same checks as CI
npm run type-check
npm run lint
npm run test:ci
npm run build
```

## Monitoring Production Issues

### Error Tracking (Sentry Integration - Optional)

```typescript
// In app/layout.tsx
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### Performance Monitoring

- Vercel Analytics: https://vercel.com/dashboard
- Google Analytics: Configure NEXT_PUBLIC_GA_ID
- Web Vitals: Monitor LCP, FID, CLS

## Troubleshooting

### Tests Failing in CI but Pass Locally

```bash
# Run in CI mode locally
npm run test:ci

# Check Node version matches
node --version
# Should match .nvmrc or engines in package.json
```

### Performance Degradation

```bash
# Analyze bundle
ANALYZE=true npm run build

# Check for new large dependencies
npm ls [package-name]

# Compare bundle over time
# Use GitHub Actions workflow artifacts
```

### Type Checking Errors on Deploy

```bash
# Ensure types are correct
npm run type-check

# Fix all issues
npx tsc --noEmit --skipLibCheck false
```

## Resources

- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Performance Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG Accessibility Standards](https://www.w3.org/WAI/WCAG21/quickref/)
