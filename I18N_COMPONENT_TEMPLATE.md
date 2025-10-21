# 🔧 Component Translation Template

Use this template to translate any component in the Venkat Express application.

## Step 1: Import useTranslation

Add this import at the top of your component file:

```tsx
import { useTranslation } from 'react-i18next';
```

## Step 2: Initialize Hook

Inside your component function:

```tsx
const YourComponent = () => {
  const { t } = useTranslation();
  
  // ... rest of your component
};
```

## Step 3: Replace Hardcoded Text

### Before:
```tsx
<h1>Track Your Order</h1>
<p>Enter your order number to track</p>
<button>Submit</button>
```

### After:
```tsx
<h1>{t('trackOrder.trackYourOrder')}</h1>
<p>{t('trackOrder.enterOrderNumber')}</p>
<button>{t('common.submit')}</button>
```

## Step 4: Add Keys to Translation Files

### src/i18n/locales/en.json
```json
{
  "trackOrder": {
    "trackYourOrder": "Track Your Order",
    "enterOrderNumber": "Enter your order number to track"
  }
}
```

### src/i18n/locales/hi.json
```json
{
  "trackOrder": {
    "trackYourOrder": "अपना ऑर्डर ट्रैक करें",
    "enterOrderNumber": "ट्रैक करने के लिए अपना ऑर्डर नंबर दर्ज करें"
  }
}
```

### src/i18n/locales/te.json
```json
{
  "trackOrder": {
    "trackYourOrder": "మీ ఆర్డర్‌ను ట్రాక్ చేయండి",
    "enterOrderNumber": "ట్రాక్ చేయడానికి మీ ఆర్డర్ నంబర్ నమోదు చేయండి"
  }
}
```

### src/i18n/locales/ta.json
```json
{
  "trackOrder": {
    "trackYourOrder": "உங்கள் ஆர்டரைக் கண்காணிக்கவும்",
    "enterOrderNumber": "கண்காணிக்க உங்கள் ஆர்டர் எண்ணை உள்ளிடவும்"
  }
}
```

### src/i18n/locales/kn.json
```json
{
  "trackOrder": {
    "trackYourOrder": "ನಿಮ್ಮ ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    "enterOrderNumber": "ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ನಿಮ್ಮ ಆರ್ಡರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ"
  }
}
```

### src/i18n/locales/ml.json
```json
{
  "trackOrder": {
    "trackYourOrder": "നിങ്ങളുടെ ഓർഡർ ട്രാക്ക് ചെയ്യുക",
    "enterOrderNumber": "ട്രാക്ക് ചെയ്യാൻ നിങ്ങളുടെ ഓർഡർ നമ്പർ നൽകുക"
  }
}
```

## Common Patterns

### 1. Simple Text Replacement
```tsx
// Before
<span>Welcome</span>

// After
<span>{t('common.welcome')}</span>
```

### 2. Placeholder Attributes
```tsx
// Before
<input placeholder="Enter your name" />

// After
<input placeholder={t('form.enterName')} />
```

### 3. Button Labels
```tsx
// Before
<button>Add to Cart</button>

// After
<button>{t('products.addToCart')}</button>
```

### 4. Conditional Text
```tsx
// Before
{isLoading ? "Loading..." : "Submit"}

// After
{isLoading ? t('common.loading') : t('common.submit')}
```

### 5. Links and Navigation
```tsx
// Before
<Link to="/about">About Us</Link>

// After
<Link to="/about">{t('header.aboutUs')}</Link>
```

### 6. Currency Display
```tsx
// Before
<span>₹{price}</span>

// After
<span>{t('common.currency')}{price}</span>
```

## Translation Key Naming Convention

Use this format: `section.specificKey`

### Examples:
- `header.trackOrder` - Header navigation items
- `footer.contactUs` - Footer links
- `home.heroTitle` - Home page hero section
- `products.allProducts` - Product page
- `cart.emptyCart` - Cart page
- `payment.paymentDetails` - Payment page
- `common.save` - Common UI elements used everywhere

## Checklist

When translating a component, ensure:

- [ ] All hardcoded text is replaced with `t()` calls
- [ ] Keys are added to ALL 6 language files (en, hi, te, ta, kn, ml)
- [ ] Keys follow naming convention `section.specificKey`
- [ ] Tested language switching works
- [ ] No TypeScript errors
- [ ] No console warnings about missing keys

## Example: Complete Component Translation

### Before:
```tsx
const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button>Add to Cart</button>
      <button>Add to Wishlist</button>
    </div>
  );
};
```

### After:
```tsx
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{t('common.currency')}{product.price}</p>
      <button>{t('products.addToCart')}</button>
      <button>{t('products.addToWishlist')}</button>
    </div>
  );
};
```

## Pro Tips

1. **Reuse Common Keys**: Use `common.*` keys for buttons, labels that appear everywhere
2. **Group Related Keys**: Keep page-specific translations together
3. **Be Descriptive**: Use clear key names like `signIn` not `btn1`
4. **Test Early**: Switch languages frequently while developing
5. **Use English First**: Always add English translation first, then others

## Need Help?

- Check existing translated components: `Header.tsx`, `Footer.tsx`, `AccountLanguage.tsx`
- Refer to `I18N_IMPLEMENTATION_GUIDE.md` for detailed documentation
- Use `I18N_QUICK_REFERENCE.md` for quick lookups

---

**Happy Translating! 🌐**
