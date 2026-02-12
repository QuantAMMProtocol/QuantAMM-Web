# QuantAMM Web App

Frontend for QuantAMM product discovery, documentation/fact sheets, and simulation workflows.

The app is built with React + TypeScript + Vite and uses both:
- GraphQL (Apollo) for Balancer data
- REST (RTK Query) for app/backend operations such as simulations, docs, prices, and audit logging

## Prerequisites

- Node.js `20.x` (matches CI)
- npm `10+` (or compatible with your Node install)

## Quick Start

1. Install dependencies

```bash
npm ci
```

2. Create local env file

```bash
cp env.local.template .env.local
```

3. Fill in required values in `.env.local` (see variables below)
4. Run the app

```bash
npm run dev
```

Default local URL: `http://localhost:5173`

## Environment Variables

Create `.env.local` from `env.local.template`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_BASE_URL` | Yes | Base URL for REST endpoints used by RTK Query services |
| `VITE_GRAPH_TARGET` | Yes | GraphQL endpoint used by Apollo + GraphQL codegen |
| `VITE_USE_STUBS_DATA` | Optional | Enables/disables stub product list flow in hooks |
| `AG_GRID_LICENCE_KEY` | Required for enterprise features | AG Grid/AG Charts enterprise license key |

Notes:
- Never commit `.env.local`.
- `npm run codegen` reads `.env.local` via `dotenv_config_path=.env.local`.

## Scripts

- `npm run dev`: start Vite dev server
- `npm run start`: same as `dev`
- `npm run build`: type-check (`tsc`) + production Vite build
- `npm run preview`: preview production build locally
- `npm run lint`: ESLint with strict warning policy (`--max-warnings 0`)
- `npm run format`: Prettier write on `src/`
- `npm run test`: run Vitest once
- `npm run test:watch`: run Vitest in watch mode
- `npm run test:coverage`: run tests with V8 coverage output
- `npm run codegen`: regenerate GraphQL types/hooks from `src/queries/*.graphql`

## Project Structure

Top-level frontend source is in `src/`, and the repo follows a mostly feature-first structure.

### High-level layout

| Path | Responsibility |
| --- | --- |
| `src/index.tsx` | Runtime entry point; wires Apollo provider, Redux provider, and router |
| `src/App.tsx` | Main app shell; layout/menu, global bootstrapping, route outlet host |
| `src/routes.tsx` | Route graph (`createBrowserRouter`) and page-level composition |
| `src/routeComponents.ts` | Lazy imports for route-level code splitting |
| `src/app/` | Store, typed hooks, app-level Redux plumbing |
| `src/features/` | Domain features (UI, slice logic, feature-local utils/tests) |
| `src/services/` | Shared RTK Query services and service helpers |
| `src/queries/` | Apollo client + GraphQL operation documents |
| `src/__generated__/` | GraphQL codegen output (generated types/hooks) |
| `src/hooks/` | Cross-feature hooks for data fetch/transform orchestration |
| `src/utils/` | Generic utilities not owned by a single feature |
| `src/test/setup.ts` | Global test setup for Vitest |
| `public/prerun_sims/` | Static MessagePack files used for pre-run simulation data |

### Product/domain structure under `src/features`

| Path | What it owns |
| --- | --- |
| `src/features/simulationRunner/` | Simulation wizard orchestration, run controls, import/export, run-status flow |
| `src/features/simulationRunConfiguration/` | Pool/token selection, update-rule parameters, pre-run configuration state |
| `src/features/simulationResults/` | Result summaries, visualisations, breakdown tables, compare/save flows |
| `src/features/productExplorer/` | Product listing, filtering, sorting, pagination, explorer state |
| `src/features/productDetail/` | Product detail page, sidebar/content panels, product modal actions |
| `src/features/coinData/` | Coin data page, current price polling, coin-level state |
| `src/features/documentation/` | Documentation pages, fact sheets, landing/TOS/ineligible flows |
| `src/features/shared/` | Shared graphs, tables, and explanatory content components |
| `src/features/themes/` | Theme slice and AG Grid theme integration |

### Typical module pattern inside a feature

Common pattern in this repo:
- `FeaturePage.tsx` style containers for major screens
- `featureSlice.ts` for feature state and reducers
- `*Service.ts` for feature-specific RTK Query APIs
- `*.ts` utilities for transforms/view-model logic
- `*.test.ts` / `*.test.tsx` colocated near logic being tested

This keeps UI, state, and logic near their domain ownership while still allowing shared hooks/services across features.

## App Architecture Overview

### Runtime composition

Runtime boot sequence:
1. `src/index.tsx` mounts React root
2. Wraps app with `ApolloProvider`
3. Wraps app with Redux `Provider`
4. Mounts `RouterProvider` with route config from `src/routes.tsx`

`src/App.tsx` then provides:
- App-level layout (`antd` `Layout`, header/menu/content)
- App bootstrap side effects (for example, price history load and simulation initialization when entering simulation routes)
- Route outlet rendering via `<Outlet />`

### Routing architecture

- Routes are centralized in `src/routes.tsx`.
- Route components are lazy-loaded through `src/routeComponents.ts` to keep initial bundle size smaller.
- Route groups include:
  - landing/company/research/contact/docs pages
  - product explorer and product detail routes
  - simulation runner and simulation result comparison routes
  - fact-sheet and simulator-example routes
- `src/routeErrorBoundary.tsx` handles router-level errors.

### State architecture and ownership

Redux Toolkit store is in `src/app/store.ts`.

Core state slices:
- `simConfig`: simulation pool/time/rule configuration state
- `simRunner`: simulation wizard step/run status and active run breakdowns
- `simResults`: result-focused state (comparison, chart/breakdown selections)
- `docs`: documentation-related state
- `productExplorer`: explorer filters/search/sort/tab/page-level state
- `currentPrices`: current token pricing state
- `theme`: UI theme state

In the same store, RTK Query API slices are registered for:
- simulation execution
- coin price retrieval
- documentation retrieval
- product and filter retrieval
- financial analysis
- audit logging

### Data access and integration boundaries

There are three primary data paths:

1. GraphQL via Apollo
- Client: `src/queries/apolloClient.ts`
- Operations: `src/queries/*.graphql`
- Generated types/hooks: `src/__generated__/graphql-types.ts`

2. REST via RTK Query
- Feature-local example: `src/features/simulationRunner/simulationRunnerService.ts`
- Shared service examples: `src/services/productRetrievalService.ts`, `src/services/financialAnalysisService.ts`, `src/services/auditLogService.ts`
- Most requests include CSRF token propagation from cookie helpers

3. Local static runtime assets
- Precomputed simulation data loaded from `public/prerun_sims/*.msgpack`

### Simulation workflow architecture

The simulation product flow is split across:
- `simulationRunConfiguration` for building pool config
- `simulationRunner` for run orchestration and step transitions
- `simulationResults` for post-run analysis and visual output

Runner step model (managed by `simRunner.simulationRunnerCurrentStepIndex`):
- `0`: options
- `1`: pool constituent selection
- `2`: time range
- `3`: hooks
- `4`: final review
- `5`: run progress/state view
- `6`: results summary
- `7`: save-to-compare view

Execution path:
1. UI triggers `createRunSimulationsThunk` (`simulationRunButtonLogic.ts`)
2. Thunk initializes ranges and pools in runner state
3. Calls `runSimulation` RTK Query mutation per pool/time range
4. Converts API response into snapshots + analysis payload
5. Dispatches success/failure reducers (`addSimRunResults`, `completeRun`, `failRun`)
6. Completes run and advances to results step

### UI and styling architecture

- UI components primarily use Ant Design primitives
- Data-heavy tables/charts use AG Grid and AG Charts enterprise modules
- Styling uses a mix of CSS modules (`*.module.css`) and Sass modules (`*.module.scss`)
- Feature folders generally keep style modules next to owning components

## Testing

Current test stack:
- Vitest
- Testing Library (`@testing-library/*`)
- Coverage via `@vitest/coverage-v8`

Configuration: `vite.config.ts`

Important current convention:
- Vitest environment is `node` by default.
- Most current tests focus on pure logic (reducers, utilities, view-model logic).
- If you add DOM-heavy component tests, prefer file-level jsdom override:

```ts
// @vitest-environment jsdom
```

Run specific test file:

```bash
npx vitest run src/features/simulationRunner/simulationRunButton.test.ts
```

## Linting, Formatting, and Type Safety

- TypeScript is strict (`strict: true` and additional unused/fallthrough checks).
- ESLint uses type-aware rules (`@typescript-eslint/*-type-checked`).
- Prettier config is in `.prettierrc`.

Recommended pre-PR local check:

```bash
npm run lint
npm run test
npm run build
```

## GraphQL Codegen Workflow

1. Update queries in `src/queries/*.graphql`
2. Ensure `.env.local` has correct `VITE_GRAPH_TARGET`
3. Run:

```bash
npm run codegen
```

Generated output:
- `src/__generated__/graphql-types.ts`

## CI and Branch Quality Gates

GitHub Actions workflow: `.github/workflows/tests.yml`

Current CI jobs on PRs to `main` and pushes to `main`:
- Lint
- Test
- Build

To enforce merge blocking on CI:
1. Go to GitHub repo settings
2. `Branches` -> branch protection rule for `main`
3. Enable `Require status checks to pass before merging`
4. Select required checks from this workflow (e.g. `Lint`, `Test`, `Build`)

## Common Developer Tasks

### Add a new route/page

1. Create feature/page component under `src/features/...`
2. Add lazy export in `src/routeComponents.ts`
3. Register route in `src/routes.tsx`

### Add a new REST endpoint

1. Add/extend an RTK Query service in `src/services` or feature-local service
2. Register reducer + middleware in `src/app/store.ts` (if new API slice)
3. Use generated hook in feature component/hook

### Add a new Redux slice

1. Create slice in relevant `src/features/...`
2. Add reducer to `src/app/store.ts`
3. Add selectors + tests near the slice

## Troubleshooting

### Build fails with missing module path

If files were moved during refactors, check relative imports first (especially CSS module imports).

### Tests pass locally but fail in CI

- Re-run `npm ci` to align dependency tree with lockfile
- Run `npm run lint && npm run test && npm run build` locally
- Confirm no generated or local-only files are accidentally required

### GraphQL codegen issues

- Validate `VITE_GRAPH_TARGET` in `.env.local`
- Ensure query files are valid under `src/queries/*.graphql`

---

If you are new to this codebase, start with:
1. `src/routes.tsx`
2. `src/app/store.ts`
3. `src/features/simulationRunner/` and `src/features/simulationRunConfiguration/`

Those files give the fastest understanding of routing, global state, and the main workflow engine in this app.
