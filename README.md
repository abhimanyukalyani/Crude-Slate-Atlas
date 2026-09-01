# Crude Slate Atlas

The world's ~103 mb/d of atmospheric distillation capacity, sorted by who owns it and what it can
actually digest — crude slates, Nelson complexity, and the refineries that set the price of a barrel.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Vite + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first tokens, light/dark) |
| Motion | Framer Motion — scroll reveals, page transitions, animated counters and charts |
| Charts | Hand-authored SVG, animated via Framer Motion |
| Data | Supabase (Postgres), pulled into a build-time snapshot |
| Hosting | Cloudflare Pages |

## How the data works

Supabase is the source of truth. The site does **not** query it at runtime — `npm run data:pull`
pulls the tables into `src/generated/atlas.json`, which is committed and imported directly. That
keeps the deployed site fully static (fast, cacheable at the edge, no runtime database dependency)
while still letting the dataset be edited as ordinary database rows.

To change a figure: update the row in Supabase, run `npm run data:pull`, commit the regenerated
snapshot, and push. Cloudflare rebuilds automatically.

Schema and seed data live in `supabase/migrations/`. Tables:

- `regions`, `slates` — reference lists, including the colour token each region maps to
- `countries` — national nameplate capacity, crude slate and notes
- `refineries` — individual plants, with Nelson complexity where published
- `crude_grades` — API gravity and sulphur for traded grades
- `sources` — citations

All tables are read-only to the anon role via row-level security.

## Local development

```bash
npm install
npm run dev
```

The app runs entirely from the committed snapshot, so no environment variables are needed for
development or for building.

To refresh the snapshot from Supabase, copy `.env.example` to `.env` and fill in the keys:

```bash
npm run data:pull
```

If Supabase is unreachable, `node scripts/bootstrap-snapshot.mjs` regenerates the same snapshot
from the migration SQL instead.

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Typecheck, build to `dist/`, write `sitemap.xml` |
| `npm run preview` | Serve the production build |
| `npm run lint` | oxlint |
| `npm run data:pull` | Refresh `src/generated/atlas.json` from Supabase |

## Deploying to Cloudflare Pages

Connect the repository in the Cloudflare dashboard and use:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 22

No environment variables are required for the build. `public/_redirects` routes every path to
`index.html` so client-side routing survives a hard refresh, and `public/_headers` sets
immutable caching on hashed assets.

Set `SITE_ORIGIN` at build time if the site is served from a custom domain, so `sitemap.xml` and
`robots.txt` point at the right host.

## Structure

```
src/
  components/        chrome, motion primitives, data table
    charts/          scatter, region stack, capacity bars, barrel yield
  content/regions.ts editorial copy for the region essays
  generated/         atlas.json — the committed data snapshot
  lib/atlas.ts       typed accessors and derived selectors
  pages/             home, atlas, regions, refineries, country, methodology
scripts/             data pull, snapshot bootstrap, sitemap
supabase/migrations/ schema and seed
```

## Accessibility and motion

Every animation is gated on `prefers-reduced-motion`; with it set, content renders in place and
counters show final values. Tables are sortable by keyboard, the theme control is a labelled radio
group, and the theme is applied before first paint to avoid a flash.
