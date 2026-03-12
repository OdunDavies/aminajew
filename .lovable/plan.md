

# Updated Admin Dashboard / CRM Plan

This extends the previously approved CRM plan by adding **Product Management** to the admin dashboard.

## What's New: Product Management

### Database Change
- Add a `products` table in Supabase to replace the hardcoded `src/data/products.ts` array
- Columns: `id`, `name`, `price`, `category` (enum: rings, necklaces, bracelets, earrings), `material`, `description`, `image`, `images` (text[]), `is_new`, `is_best_seller`, `sizes` (text[]), `created_at`
- RLS: public read access, admin-only write access via `has_role()`
- Seed table with existing product data from `products.ts`

### New Admin Page
- `/admin/products` — **Products Management**
  - Table listing all products with image thumbnail, name, category, price, status badges
  - "Add Product" button opens a form dialog (name, price, category, material, description, image URLs, sizes, new/bestseller toggles)
  - Edit and Delete actions per row
  - Delete confirmation dialog

### Storefront Migration
- Replace static imports from `data/products.ts` with Supabase queries (via React Query)
- Update `Collections.tsx`, `ProductDetail.tsx`, `Index.tsx`, and `ProductCard.tsx` to fetch from the `products` table
- Keep the same `Product` TypeScript interface

## Full Implementation Order
1. Enable Lovable Cloud (Supabase) — create all tables including `products`
2. Set up auth, `profiles`, `user_roles`, `has_role()` function
3. Build AdminLayout + AdminGuard + AdminLogin
4. Build Dashboard, Customers, Leads, Orders, Contacts, **Products**, Analytics pages
5. Migrate storefront to fetch products from Supabase
6. Connect Contact form to `contact_submissions` table
7. Seed initial admin user + product data

