const fs = require('fs');

const file = 'src/pages/DecorativeItems.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix all remaining translation keys that are treated as strings
const fixes = [
  // Mobile search placeholder
  ['placeholder="t(\'decorativeItems.searchPlaceholder\')"', 'placeholder={t(\'decorativeItems.searchPlaceholder\')}'],
  // Filter text
  ['<span className="hidden sm:inline">t(\'decorativeItems.filters\')</span>', '<span className="hidden sm:inline">{t(\'decorativeItems.filters\')}</span>'],
  // No products message
  ['<p className="text-muted-foreground">t(\'decorativeItems.noProducts\')</p>', '<p className="text-muted-foreground">{t(\'decorativeItems.noProducts\')}</p>'],
  // Filters header
  ['>t(\'decorativeItems.filters\')<', '>{t(\'decorativeItems.filters\')}<'],
  // Sort By
  ['>t(\'decorativeItems.sortBy\')<', '>{t(\'decorativeItems.sortBy\')}<'],
  // Featured
  ['>t(\'decorativeItems.featured\')<', '>{t(\'decorativeItems.featured\')}<'],
  // Price Low to High
  ['>t(\'decorativeItems.priceLowToHigh\')<', '>{t(\'decorativeItems.priceLowToHigh\')}<'],
  // Price High to Low
  ['>t(\'decorativeItems.priceHighToLow\')<', '>{t(\'decorativeItems.priceHighToLow\')}<'],
  // Price Range
  ['>t(\'decorativeItems.priceRange\')<', '>{t(\'decorativeItems.priceRange\')}<'],
];

fixes.forEach(([oldText, newText]) => {
  content = content.replace(new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText);
});

// Fix the showing count - this one is more complex
content = content.replace(
  /t\('decorativeItems\.showing'\) \{filteredProducts\.length\} \{filteredProducts\.length !== 1 \? t\('decorativeItems\.items'\) : t\('decorativeItems\.item'\)\}/g,
  "{t('decorativeItems.showing')} {filteredProducts.length} {filteredProducts.length !== 1 ? t('decorativeItems.items') : t('decorativeItems.item')}"
);

fs.writeFileSync(file, content, 'utf8');
console.log('✅ DecorativeItems.tsx translation keys fixed!');
