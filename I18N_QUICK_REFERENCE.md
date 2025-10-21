# 🌐 I18N Quick Reference Guide

## Quick Start

### 1. Use in Component
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('header.trackOrder')}</h1>;
}
```

### 2. Change Language
```tsx
const { i18n } = useTranslation();
i18n.changeLanguage('hi'); // Switch to Hindi
```

### 3. Get Current Language
```tsx
const { i18n } = useTranslation();
console.log(i18n.language); // 'en', 'hi', 'te', etc.
```

## Available Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| hi | Hindi | हिन्दी |
| te | Telugu | తెలుగు |
| ta | Tamil | தமிழ் |
| kn | Kannada | ಕನ್ನಡ |
| ml | Malayalam | മലയാളം |

## Translation Key Structure

```
common.*          - Common UI elements
header.*          - Header navigation
footer.*          - Footer content
bottomNav.*       - Mobile bottom navbar
home.*            - Home page
dashboard.*       - Dashboard/Account
accountLanguage.* - Language selection page
products.*        - Product pages
cart.*            - Shopping cart
payment.*         - Payment page
auth.*            - Authentication
orders.*          - Order management
account.*         - Account pages
services.*        - Services page
about.*           - About page
trackOrder.*      - Order tracking
location.*        - Location selector
wishlist.*        - Wishlist
notifications.*   - Notifications
addresses.*       - Address management
validation.*      - Form validation
messages.*        - Success/Error messages
```

## Common Keys

### UI Elements
```tsx
t('common.loading')      // "Loading..."
t('common.save')         // "Save"
t('common.cancel')       // "Cancel"
t('common.delete')       // "Delete"
t('common.edit')         // "Edit"
t('common.search')       // "Search"
t('common.currency')     // "₹"
```

### Header
```tsx
t('header.searchPlaceholder')  // "Search for Indian food..."
t('header.trackOrder')         // "Track Order"
t('header.wishlist')           // "Wishlist"
t('header.account')            // "Account"
t('header.signIn')             // "Sign In"
t('header.shopProducts')       // "Shop Products"
```

### Footer
```tsx
t('footer.tagline')            // "Premium global shopping..."
t('footer.contactUs')          // "Contact Us"
t('footer.privacyPolicy')      // "Privacy Policy"
```

## Examples

### Button with Translation
```tsx
<button>{t('common.save')}</button>
```

### Input Placeholder
```tsx
<input placeholder={t('header.searchPlaceholder')} />
```

### Conditional Text
```tsx
{user ? t('header.account') : t('header.signIn')}
```

### With Variables (if needed)
```tsx
// In translation file:
// "welcome": "Welcome, {{name}}!"

t('welcome', { name: 'John' })  // "Welcome, John!"
```

## Testing Checklist

- [ ] All languages display correctly
- [ ] Language persists after refresh
- [ ] No console errors
- [ ] All text is translated (no hardcoded strings)
- [ ] Fallback to English works

## Adding New Translation

1. Add key to `en.json`:
```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

2. Add to all other language files (`hi.json`, `te.json`, etc.)

3. Use in component:
```tsx
{t('mySection.myKey')}
```

## Troubleshooting

**Text not changing?**
- Check key exists in all language files
- Verify component uses `useTranslation()`
- Clear browser cache

**Missing translation?**
- Check for typos in key name
- Verify JSON syntax is correct
- Falls back to English if missing

---

**Quick Access:** `/account/language` - Language Switcher Page
