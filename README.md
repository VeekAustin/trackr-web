# Trackr

A personal progress log. Create your own categories — teaching, dev work, forex trading, a course, anything — and log what you did under them, with a title, optional notes, and a date. Unlike a to-do app, Trackr records what you've already done, building a history of effort over time rather than a plan for later.

Live site: `https://trackr-web-sigma.vercel.app`
Backend repo: [trackr-api](https://github.com/VeekAustin/trackr-api)

## Features

- Sign up / log in, with your data kept private to your account
- Create your own tracks (name + color)
- Log dated entries against a track, including backfilling past days
- Delete a track or entry (deleting a track removes its entries too)
- Form validation with clear, field-level error messages
- Loading, empty, and error states on every screen
- Cached, auto-refetching data via React Query — no manual reload needed after an action

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Server state | TanStack Query (React Query) |
| Auth state | React Context |
| Forms & validation | React Hook Form + Zod |
| Testing | Vitest, React Testing Library |
| Hosting | Vercel |

## Project structure

```
src/
  app/
    dashboard/     # main authenticated view
    login/         # login page
    signup/        # signup page
    components/    # UI components, ProtectedRoute, QueryProvider
    error.tsx       # global error boundary
  context/         # AuthContext
  hooks/           # useTracks, useEntries (React Query)
  lib/             # apiFetch client, Zod schemas
```

## Getting started

```bash
git clone https://github.com/VeekAustin/trackr-web.git
cd trackr-web
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

(Point this at a running [trackr-api](https://github.com/VeekAustin/trackr-api) instance — local or deployed.)

Run it:

```bash
npm run dev     # dev server at localhost:3000
npm run build   # production build
npm start       # run the production build
npm test        # run the test suite
```

## Testing

```bash
npm test
```

Covers:
- `LoginPage` — validation errors, successful login, server-error display
- `TrackForm` — submission, empty-input handling, input clearing, pending state

Auth and API calls are mocked in component tests, so the suite runs without a live backend.

## Deployment

Hosted on Vercel, auto-deploying from `main`. `NEXT_PUBLIC_API_URL` is set in Vercel's project settings and points at the deployed [trackr-api](https://github.com/VeekAustin/trackr-api) instance on Render.