# Portfolio

Personal portfolio of **Amirhossein Nematkhah** — Mechatronics Engineer.

Live on GitHub Pages: [A-Nematkhah.github.io](https://a-nematkhah.github.io/) (or project path `/Portfolio/` depending on repo name).

## Stack

- React 19 + TypeScript + Vite
- TanStack Router / Start (SPA prerender for static hosting)
- Tailwind CSS
- Supabase (projects CMS + auth for `/admin`)
- Framer Motion

## Getting started

```bash
# copy env and fill Supabase keys
cp .env.example .env

npm install
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build (`dist/client`) |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Deploy

Push to `main` triggers `.github/workflows/deploy.yml` → GitHub Pages.

Required repository secrets:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Admin

Sign in at `/admin`. Project add/edit/delete controls appear on the public site when the signed-in user has the `admin` role in Supabase `user_roles`.

## Seed catalog into Supabase (optional)

Apply migrations (schema + seed) so the static project catalog lives in the DB:

```bash
# with Supabase CLI linked to your project
supabase db push
```

Or run `supabase/migrations/20260728120000_seed_static_projects.sql` in the SQL editor.
After seeding, the UI prefers DB rows and dedupes against the local catalog by title.

## CV PDF

```bash
npm run generate:cv   # writes public/cv.pdf
```
