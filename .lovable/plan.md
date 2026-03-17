

# Improvement Plan for artsybrands

## What We'll Build

### 1. Currency Toggle (Naira/Dollar)
Create a `CurrencyContext` that stores the active currency (NGN or USD) and an exchange rate. Add a toggle button in the Navbar so users can switch between ₦ and $. A `formatPrice` helper will convert and format prices throughout the app. All price displays across ProductCard, ProductDetail, CartDrawer, Checkout, and admin Products page will use this context.

### 2. Admin Product Management in Naira
Update the admin Products page so that price input/display is explicitly in Naira (₦). Add a "₦" prefix label to the price field and ensure the table shows ₦-formatted prices. Prices are already stored in Naira in the database, so no data migration is needed.

### 3. Contact Page Updates
- **Address**: Change to "EN 104, Federal Lowcost Housing Estate, Kuje, FCT, Nigeria"
- **Phone**: Change to "09068087189"
- **Email**: Keep hello@artsybrands.com (or update if requested)

### 4. UI/UX Improvements
Based on a full scan of the site:

- **Navbar**: Add the currency toggle (small ₦/$ switch) alongside the cart icon
- **Footer**: Add social media icon links (Instagram, Twitter/X, Facebook) and update contact info to match the new address/phone
- **Homepage hero**: Add a subtle scroll-down indicator (animated chevron) so users know to scroll
- **Collections page**: Add a "back to all collections" breadcrumb when viewing a specific collection
- **Product Detail**: Improve mobile image gallery with swipe indicators
- **Cart Drawer**: Add a "Continue Shopping" button when cart has items
- **Checkout**: Add a "Back to Cart" link for easy navigation
- **Newsletter form in Footer**: Show a success toast on submit instead of silently doing nothing
- **Loading states**: Replace plain "Loading..." text with skeleton loaders on product grids

## Technical Details

### Files to Create
- `src/context/CurrencyContext.tsx` — Context with currency state, exchange rate (hardcoded default ~1600 NGN/USD), toggle function, and `formatPrice(priceInNaira)` helper

### Files to Modify
- `src/components/Navbar.tsx` — Add currency toggle button
- `src/components/ProductCard.tsx` — Use `formatPrice` from currency context
- `src/pages/ProductDetail.tsx` — Use `formatPrice`
- `src/components/CartDrawer.tsx` — Use `formatPrice`, add "Continue Shopping" button
- `src/pages/Checkout.tsx` — Use `formatPrice`
- `src/pages/admin/Products.tsx` — Add ₦ prefix to price input, format table prices in Naira
- `src/pages/Contact.tsx` — Update address, phone
- `src/components/Footer.tsx` — Update contact info, add social links, toast on newsletter
- `src/pages/Index.tsx` — Add scroll indicator to hero
- `src/pages/Collections.tsx` — Add breadcrumb navigation
- `src/main.tsx` or `src/App.tsx` — Wrap app with `CurrencyProvider`

### Currency Toggle Approach
- Store prices in DB as Naira (no change)
- Default display: Naira
- When toggled to USD: divide by exchange rate constant (e.g., 1600)
- The toggle is a simple visual conversion — Paystack checkout always charges in Naira regardless of display currency

