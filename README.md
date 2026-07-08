# Alex Brown — Portfolio (`operators-lab`)

Mechanical engineering portfolio. Case studies from Navy operations, coastal
fluid dynamics, phase-change materials, mechatronics, and bio-inspired
thermal systems.

## Stack

- Vite + React 19
- React Router 7
- Tailwind CSS 3
- Framer Motion for micro-interactions
- lucide-react for iconography
- @react-three/fiber + drei for STL viewers

## Scripts

```bash
npm install
npm run dev      # start Vite dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # ESLint
```

## Architecture at a glance

- `src/shared/AppShell.jsx` — single background + navigation layer used by
  every route. Home, About, and each `/projects/*` page render inside this
  shell so chrome stays consistent as you navigate.
- `src/shared/ui.jsx` — shared design system primitives (`Glass`,
  `PageHero`, `SectionTitle`, `Chip`, `MetricBox`, `ProjectPager`,
  `ProjectCTA`, `BackToProjects`). Every project page composes these.
- `src/content/*` — content lives in plain JS modules:
  - `projects.js` — project catalog (grid + detail routing)
  - `timeline.js` — experience timeline + volunteering
  - `siteConfig.js` — brand, nav, hero copy
- `src/pages/projects/*` — hand-built case-study pages that use the shared
  UI kit.
- `src/pages/ProjectDetail.jsx` — data-driven fallback for entries in
  `projects.js` that don't have a hand-built page yet.

## Adding a new project

1. Add an entry to `src/content/projects.js` with a unique `id`.
2. (Optional) Create `src/pages/projects/YourProject.jsx` using the shared
   `PageHero`, `Container`, `Glass`, `MetricBox`, `ProjectPager`, and
   `ProjectCTA` primitives — see `TernaryAdder.jsx` for a template.
3. Register the route in `src/App.jsx` and add the id to the
   `CUSTOM_ROUTES` set in `src/components/Projects.jsx` for hover-prefetch.
4. If you skip step 2, the entry will render via `ProjectDetail.jsx`.

## Design tokens

Palette lives in `tailwind.config.js` under `brand.*`, `accent.*`,
`surface.*`, and `line.*`. Prefer these tokens over raw Tailwind color
utilities — it keeps the site cohesive as content evolves.
