# ChaosFlow Frontend

Visual pipeline builder and live monitoring UI for ChaosFlow.

**Stack:** React 18, TypeScript (strict), Vite, React Flow (@xyflow/react), React Router,
TanStack Query, Zustand, React Hook Form + Zod, Tailwind CSS, MSW, Vitest + Testing Library.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs on http://localhost:5173.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit and component tests |
| `npm run gen:api` | Generate API types from the backend OpenAPI spec |

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:8000`) |
| `VITE_WS_URL` | WebSocket base URL (e.g. `ws://localhost:8000`) |
| `VITE_USE_MOCK` | `true` uses MSW mock API, `false` uses the real backend |

## Mock vs real API

- **Mock** (default for development): set `VITE_USE_MOCK=true`. MSW intercepts requests and the
  run log stream is simulated. Log in with any email and the password `password123`
  (emails starting with `admin` get the admin role).
- **Real API**: set `VITE_USE_MOCK=false`, make sure the backend is running and allows CORS for
  the frontend origin, then restart the dev server.

After the backend publishes its OpenAPI spec, run `npm run gen:api` and align the types in
`src/types` and the calls in `src/api` with `src/api/schema.d.ts`.

## Folder structure

```
src/
├── api/                 # Axios client and endpoint functions
├── components/
│   ├── layout/          # AppLayout (sidebar, header, theme toggle)
│   └── ui/              # Button, Input, Select, Modal, Toaster, Table, Badge, Skeleton, EmptyState
├── features/
│   ├── auth/            # Login, Register, Forgot/Reset password
│   ├── dashboard/
│   ├── pipeline-builder/# Canvas, palette, custom nodes, dynamic config form
│   ├── pipelines/       # Pipelines list
│   └── runs/            # Run details and live logs (WebSocket)
├── mocks/               # MSW handlers
├── routes/              # Router and ProtectedRoute
├── store/               # Zustand stores (auth, theme, toast)
├── test/                # Vitest setup
├── types/               # Shared TypeScript types
└── utils/               # Pure logic: pipeline converter, connection rules, schema validation
```

## Pipeline Builder notes

- The canvas state converts to and from the shared pipeline JSON (`nodes` + `edges`) in
  `src/utils/pipelineConverter.ts`.
- Connection rules (sources have outputs only, sinks have inputs only, no cycles, no duplicate
  edges) live in `src/utils/connectionRules.ts`.
- The config form is generated from each plugin's JSON Schema (`GET /plugins`) and validated by
  `src/utils/schemaForm.ts`.
- Shortcuts: `Ctrl+S` save, `Ctrl+Z` undo, `Ctrl+Y` / `Ctrl+Shift+Z` redo.
- Node positions are not part of the contract, so nodes are arranged in columns when a pipeline
  is opened.