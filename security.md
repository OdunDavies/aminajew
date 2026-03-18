# Security Audit

_Date: 2026-03-18_

## Scope
Reviewed the React frontend, route protection, client auth usage, backend functions, and database security signals for:
- exposed API keys
- unprotected routes/endpoints
- missing auth checks
- unsanitised or weakly validated inputs

## Executive Summary
- **No private API keys are exposed in the frontend codebase.**
- **Admin UI access is protected** in both the frontend and database layer.
- **Main risks are in public write flows**: contact submissions and payment-related backend functions accept unauthenticated input with limited validation and no visible abuse protection.
- **Platform security warning:** leaked password protection is currently disabled.

---

## Findings

### 1) Public payment endpoints have weak server-side validation
**Severity:** High  
**Where:**
- `supabase/functions/initialize-payment/index.ts`
- `supabase/functions/verify-payment/index.ts`
- `supabase/config.toml`

**What I found**
- `initialize-payment` and `verify-payment` are configured with `verify_jwt = false`, so they are callable without authentication.
- That is acceptable for guest checkout, but both endpoints trust request payloads too much.
- `initialize-payment` only checks that `email` and `amount` exist.
- `verify-payment` only checks that `reference` exists.
- There is no schema validation for:
  - email format
  - amount bounds / numeric validity
  - metadata shape and size
  - callback URL origin / allowlist
  - reference format

**Risk**
- Abuse/spam against payment initialization and verification endpoints.
- Malformed payloads reaching external payment APIs.
- Callback URL tampering or unexpected redirect destinations if arbitrary values are accepted.
- Higher operational cost/noise from unauthenticated automated requests.

**Recommendation**
- Add strict server-side schema validation (for example with Zod).
- Enforce amount minimum/maximum and numeric checks.
- Allow only trusted callback URL origins.
- Validate `reference` against expected length/pattern.
- Add rate limiting or abuse protection for public endpoints.

---

### 2) Contact form accepts public input with no meaningful validation or anti-spam controls
**Severity:** Medium  
**Where:**
- `src/pages/Contact.tsx`
- `contact_submissions` RLS policy: `WITH CHECK (true)` for public insert

**What I found**
- The contact form inserts directly into the database from the client.
- Validation is limited to native HTML required/email checks.
- No client-side schema validation, trimming, length limits, normalization, honeypot, CAPTCHA, or rate limiting.
- Database policy allows anyone to insert contact submissions.

**Risk**
- Spam, junk submissions, database bloat, and abuse by bots.
- Oversized or malformed content can still be submitted.

**Recommendation**
- Add schema validation with explicit max lengths.
- Trim and normalize input before insert.
- Add anti-spam protection (honeypot, CAPTCHA, or rate limiting).
- Consider moving writes behind a backend function to centralize validation.

---

### 3) Checkout input is weakly validated before payment initialization
**Severity:** Medium  
**Where:**
- `src/pages/Checkout.tsx`

**What I found**
- The checkout form only checks presence of `name`, `email`, and `address` on the client.
- No validation for:
  - email format beyond browser defaults
  - phone format/length
  - name/address max length
  - unexpected whitespace or malformed values
- The client forwards user-controlled metadata to the public payment initialization function.

**Risk**
- Bad data quality in orders/customers.
- Increased chance of malformed payment metadata or abuse payloads.

**Recommendation**
- Add a shared validation schema for checkout fields.
- Enforce max lengths and trimming before submission.
- Re-validate the same fields on the server before calling the payment provider.

---

### 4) Leaked password protection is disabled
**Severity:** Medium  
**Source:** platform security scan / linter

**What I found**
- The authentication system currently has leaked password protection disabled.

**Risk**
- Users may be allowed to use passwords known from public breaches.

**Recommendation**
- Enable leaked password protection in the authentication settings.

---

### 5) Public insert RLS policy is intentionally open, but creates abuse exposure
**Severity:** Low / Medium  
**Where:**
- `contact_submissions` insert policy (`WITH CHECK (true)`)

**What I found**
- The database linter flags an always-true RLS policy.
- In this codebase, it appears intentional so anonymous visitors can submit the contact form.

**Risk**
- Anyone on the internet can insert rows, including bots.

**Recommendation**
- Keep only if public contact submission is required.
- Add anti-spam controls and validation to reduce abuse.

---

## Checked Areas With No Critical Issue Found

### Exposed API keys
- **No private secret keys found in frontend code.**
- `PAYSTACK_SECRET_KEY` is only used in backend functions via environment secrets.
- The client uses a **publishable/anon key** and backend URL, which is expected for browser-side SDK usage and is **not** a secret.

### Admin route protection
**Where:**
- `src/App.tsx`
- `src/components/admin/AdminGuard.tsx`
- `src/hooks/useAuth.ts`
- `src/pages/admin/AdminLogin.tsx`

**What I found**
- `/admin` is protected by `AdminGuard`.
- Admin status is checked from the `user_roles` table, not from `localStorage` or hardcoded values.
- Non-admin users are redirected away.
- Backend RLS policies also restrict admin-managed tables to admins.

**Assessment**
- This is the correct pattern and is **not** an exposed route issue.

### XSS / dangerous HTML sinks
**What I found**
- No obvious user-input XSS sink in app code.
- `SEO.tsx` injects JSON-LD via `textContent` + `JSON.stringify`, which is relatively safe for its current use.
- A `dangerouslySetInnerHTML` usage exists in `src/components/ui/chart.tsx`, but this appears to be internal component styling rather than rendering user content.

**Assessment**
- No clear exploitable unsanitised HTML rendering issue was identified from the reviewed code.

---

## Notable Hardening Opportunities
- Add server-side validation to all backend functions handling public input.
- Add rate limiting / abuse protection to public endpoints.
- Add file upload restrictions (size/type checks) in admin product uploads.
- Consider centralizing public writes behind validated backend functions instead of direct client inserts.
- Add automated tests for auth-protected admin flows and public form validation.

---

## Priority Fix Order
1. Harden `initialize-payment` and `verify-payment` with strict server-side validation and abuse protection.
2. Harden the contact form with validation + anti-spam controls.
3. Enable leaked password protection.
4. Tighten checkout field validation for better data integrity.
