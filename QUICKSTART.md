# NutriFitness MVP — Quick Start Checklist

## 1. Bootstrap the Next.js project (5 min)

```bash
npx create-next-app@latest nutrifitness --typescript --tailwind --app --src-dir no
cd nutrifitness
npm install @supabase/supabase-js framer-motion
npm install --save-dev @types/node
```

## 2. Install Google Fonts in layout.tsx
- Bebas Neue (display headings)
- DM Sans (body copy)
Both from `next/font/google` — zero layout shift, self-hosted by Next.js.

## 3. Supabase setup (10 min)
1. Go to supabase.com → New Project → "nutrifitness"
2. Run the SQL from PROMPT.md → SQL Editor
3. Import your CSV: Table Editor → products → Import CSV
4. Copy URL + anon key → paste into `.env.local`

## 4. Image folder setup
```
public/
  logo.png           ← your logo (dark bg version)
  logo-white.png     ← white version for dark navbar
  products/
    [slug].jpg       ← one image per product, named by slug
```
Slug = the `slug` column in your CSV (e.g. `cornetto-croissant-keto-50g`)

## 5. Paste the code
Copy everything from CODE.ts into the corresponding files.

## 6. Push to GitHub + deploy
```bash
git init
git add .
git commit -m "NutriFitness MVP"
git remote add origin https://github.com/you/nutrifitness-mvp.git
git push -u origin main
```
Then in Vercel: Import from GitHub → Add env vars → Deploy.

## 6. What's NOT connected yet (to add later)
- [ ] Supabase Auth (user accounts — login UI is done, just needs `supabase.auth.signInWithPassword()`)
- [ ] Cart → Orders table
- [ ] Payment (Stripe or Sumup)
- [ ] Email (Resend or Supabase Edge Functions)
- [ ] Product reviews

## Images performance checklist
- [ ] All product images are `.jpg` or `.webp` under 200KB
- [ ] Use `width` + `height` props on every `<Image>`
- [ ] First 4 products have `priority={true}`
- [ ] `next.config.js` has `formats: ['image/avif', 'image/webp']`

## About "Antigravity"
If you meant the **Antigravity UI** animation library or a specific CSS framework,
install it on top of this stack: `npm install antigravity` (or whatever the package is).
This Next.js base is framework-agnostic — any component library drops in cleanly.
