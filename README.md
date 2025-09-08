# Bumpa Loyalty Frontend

React + Vite + TypeScript frontend for loyalty achievements.

## Features
- Customer dashboard: achievements, points, live updates via Laravel Echo, simulate purchase.
- Admin panel: login, users achievements table with pagination, filters, CSV export.
- State: React Query.
- UI: TailwindCSS.
- Animations: Framer Motion.
- Tests: Jest + React Testing Library.

## Environment Variables
Create a `.env` (or `.env.local`):
```
VITE_API_BASE_URL=/api
VITE_PUSHER_KEY=your_key
VITE_PUSHER_CLUSTER=mt1
```

## Scripts
Dev: `npm run dev`
Build: `npm run build`
Test: `npm test`

## Notes
Websocket requires backend Pusher config; falls back gracefully if unavailable.
