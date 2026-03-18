
Fix the route-scroll UX so any internal page navigation, including footer links like “About”, lands at the top of the new page automatically.

What I’ll build
- Add a small route listener component that watches the current pathname.
- On every route change, call `window.scrollTo({ top: 0, left: 0, behavior: "auto" })`.
- Mount it once inside the router so it applies across the storefront.

Why this is the right fix
- The app currently uses client-side routing, so page navigation changes content without resetting scroll position.
- That’s why clicking “About” from the footer keeps you near the bottom of the page.

Files involved
- `src/App.tsx` — wire in the scroll restoration behavior.
- Possibly a new helper like `src/components/ScrollToTop.tsx` if I keep the logic clean and reusable.

Implementation approach
- Use React Router’s `useLocation()` to detect navigation.
- Trigger scroll reset when `pathname` changes.
- Keep the behavior global so it fixes footer links, navbar links, collection/product navigation, and other internal route changes consistently.

UX notes
- I’ll use immediate scroll reset rather than smooth scrolling, so the new page feels like a normal page load.
- This will make the site feel more polished and predictable, especially on mobile and long pages.

Validation
- Test from the footer on long pages like Home/Checkout → click About/Contact/FAQ → confirm the new page opens at the top.
- Also verify product-to-product and collection navigation still feels natural.
