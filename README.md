# ssn-front

React 19 front end for SSN. It talks to the Rails app's JSON API (`/api/v1`, branch `api_v1` of `../ssn`).

Stack: Vite 8, TypeScript, React Router 8, TanStack Query 5, Tailwind CSS v4 with the Rails app's badges and Phosphor icons.

## Run it locally

1. Rails, in `../ssn`: `bin/dev` (port 3000). The database runs in Docker (`docker start ssn-db-1`).
2. Here: `npm install`, then `npm run dev` and open http://localhost:5173.

Vite proxies `/api` to Rails, so the browser makes same-origin requests. Copy `.env.example` to `.env.local` to point
the proxy elsewhere (`VITE_PROXY_TARGET`) or to turn on Google sign-in (`VITE_GOOGLE_CLIENT_ID`, the same OAuth
client id as the Rails app; add http://localhost:5173 to its authorized JavaScript origins).

## How it talks to the API

- `POST /api/v1/session` (email, password) or `POST /api/v1/session/google` (One Tap credential) returns a token,
  kept in localStorage and sent as `Authorization: Bearer …`. It lasts 12 hours and stops working when the password
  changes or the user is locked.
- Every request sees the signed-in user's sede. Super admins pick another one in the sidebar; it travels in the
  `X-Headquarter-Id` header.
- Served from another origin (production), set `VITE_API_URL` here and `API_CORS_ORIGINS` on the Rails side.

## Screens

Sign in, guards (list and detail with services), services (today's guard, pending services of other guards, search,
detail), health facilities (with search), churches, and the sede switcher for super admins. All read-only for now.
