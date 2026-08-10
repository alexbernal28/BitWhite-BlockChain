# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

This is a monorepo containing **three independent sub-projects** for BitWhite, a public-tender
("licitaciones públicas") transparency platform for the Dominican Republic that anchors records on
a blockchain. There is no root `package.json`, workspace config, or build orchestration — each
sub-project has its own `package.json` and is developed/run separately from its own directory:

- `bitwhite-backend/` — Node.js/Express REST API + PostgreSQL persistence (DDD-flavored).
- `licitaciones-frontend/` — Next.js (App Router) public-facing web portal.
- `blockchain/` — Hardhat 3 Solidity project for the on-chain contracts.

The frontend and backend **are wired together**: `licitaciones-frontend/app/lib/api.ts` is a fetch-based
client (JWT stored in `localStorage` via `app/lib/session.ts`) that calls `bitwhite-backend`'s REST API
for auth, tender publishing/listing, proposal submission, and hash verification. The **blockchain**
sub-project is still unconnected — the backend does not invoke any smart contract, and integrity
verification is done purely by comparing SHA-256 hashes stored in PostgreSQL (`Tender.documentHash`,
`ProposalDocument.documentHash`) rather than anchoring them on-chain. Treat each sub-project as its
own workspace; `cd` into it before running any command below.

Each sub-project also has its own `AGENTS.md`/`CLAUDE.md` with tool-specific notes:
- `blockchain/AGENTS.md` and `blockchain/CLAUDE.md` — points to the `hardhat` and
  `hardhat-toolbox-mocha-ethers` skills for Solidity/TypeScript testing conventions.
- `licitaciones-frontend/AGENTS.md` and `licitaciones-frontend/CLAUDE.md` — warns that this Next.js
  version has breaking changes vs. training data; check `node_modules/next/dist/docs/` before
  writing Next.js code.

## bitwhite-backend

Node ESM (`"type": "module"` behavior via `import`/`export`), Express, Sequelize/PostgreSQL, JWT auth.

```bash
cd bitwhite-backend
npm install
docker-compose up -d        # starts Postgres (reads POSTGRES_* from .env)
npm run sync                 # create schemas + sync all registered Sequelize models to tables
npm run seed                 # seed the 4 roles + one demo account per role (gobierno/empresa/ciudadano)
npm run dev                  # nodemon src/server.js
npm start                    # node src/server.js
node src/infrastructure/persistence/testConnection.js   # sanity-check DB connectivity
```

No test suite exists yet (`npm test` is a placeholder that exits 1).

Config comes from a `.env` file (see `docker-compose.yml` and `infrastructure/persistence/database.js`
for the required keys: `PORT`, `NODE_ENV`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `POSTGRES_USER`,
`POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT`). `npm run seed` creates
`gobierno@bitwhite.gob.do` / `empresa@bitwhite.gob.do` / `ciudadano@bitwhite.gob.do`, all with password
`Demo1234!` — there is no self-registration flow for the `gobierno` role (per the project doc,
institutional accounts are provisioned, not self-signed-up), so the seed script is the only way to get
one.

### Architecture

The backend is organized as **one PostgreSQL schema per bounded context**, all created up front by
`infrastructure/persistence/schemas.js`:

- `auth` — `User`, `Role`, `CitizenInfo`, `CompanyInfo`
- `organizations` — `Company`, `GovernmentEntity` (still empty placeholders — not used; the `empresa`
  role's profile lives in `auth.CompanyInfo` instead, see below)
- `procurement` — `Tender`
- `proposals` — `Proposal`, `ProposalDocument`
- `blockchain` — `BlockchainTransaction` (still an empty placeholder — unused, see the on-chain note above)
- `audit` — `AuditLog`

Each model is a plain Sequelize model (`infrastructure/models/<context>/<Model>.js`) defining its
own `schema`/`tableName`, with cross-schema foreign keys expressed via `references: { model: { tableName, schema }, key }`
(e.g. `CitizenInfo.userId` and `CompanyInfo.userId` both reference `auth.users.id`). `Role.name` is
a Postgres ENUM of the four platform roles: `ciudadano`, `empresa`, `gobierno`, `administrador` —
this is the role model the rest of the domain is built around, though only the first three have any
UI/API surface today (`administrador` exists in the enum and seed list but has no portal).
`infrastructure/models/associations.js` is the single place where all Sequelize associations
(`belongsTo`/`hasMany`/etc.) are declared, and must be imported (instead of the individual model
files) anywhere the full model graph is needed — `sync.js`, `seed.js`, and every controller do this.

`src/server.js` is a real Express app: `helmet` + `cors` (restricted to `CORS_ORIGIN` /
`http://localhost:3000`) + `morgan` + JSON/urlencoded body parsing, `/uploads` served statically for
downloading submitted PDFs, routes mounted under `/api` (see `src/routes/index.js`), and a
centralized error handler (`src/middlewares/error.middleware.js`) that turns thrown `HttpError`s
(`src/services/auth.service.js`) into the right HTTP status. Auth is JWT (`src/services/token.service.js`)
+ bcrypt, with `requireAuth`/`requireRole(...)` middleware (`src/middlewares/auth.middleware.js`) gating
`gobierno`-only (create tender) and `empresa`-only (submit proposal) endpoints; `POST /api/audit/verify`
is intentionally public (no auth) since it's the citizen-facing verification flow. File uploads
(tender pliegos, proposal documents) go through `multer` (`src/middlewares/upload.middleware.js`) into
a local `uploads/` directory (gitignored), and their SHA-256 hash (`src/services/hash.service.js`) is
what gets compared during verification — nothing is anchored on a blockchain in this version.

## licitaciones-frontend

Next.js 16 (App Router) + React 19 + Tailwind CSS 4, TypeScript.

```bash
cd licitaciones-frontend
npm install
npm run dev      # next dev
npm run build    # next build
npm start        # next start
npm run lint     # eslint
```

No test suite is configured.

### Architecture

Routes live under `app/` following Next.js App Router file-based routing, one directory per portal
role that mirrors the backend's `Role` enum:

- `app/ciudadano/` — citizen-facing views
- `app/empresas/` (+ `empresas/registro/`) — company portal and registration
- `app/gobierno/` (+ `gobierno/nueva-licitacion/`) — government entity portal and tender creation
- `app/login/` (+ `login/recuperar/`) — auth screens
- `app/registro/` — citizen registration
- Static/legal pages: `politica-de-privacidad/`, `terminos-de-uso/`, `preguntas-frecuentes/`

Shared chrome lives in `app/components/Layout/` (`SiteHeader`, `SiteFooter`, `Breadcrumbs`,
`nav-config.ts` drives the nav structure) and is composed once in the root `app/layout.tsx`.
`app/components/ClientProvider.tsx` is a `'use client'` wrapper that defers rendering its children
until after mount (guards against hydration mismatches for client-only UI). `app/components/LegalPage.tsx`
is the shared layout for the legal/static pages.

`app/lib/api.ts` is the only place that calls `bitwhite-backend` (base URL from `NEXT_PUBLIC_API_URL`,
see `.env.local`, defaults to `http://localhost:5000/api`); `app/lib/session.ts` persists `{ token, user }`
to `localStorage` and exposes `getSession`/`saveSession`/`clearSession`/`portalPathForRole`. There is no
server-side session or route middleware — each page/component that needs auth (`GobiernoDashboard`,
`NuevaLicitacionForm`, the proposal form inside `EmpresasDashboard`) reads the session client-side in a
`useEffect` and renders a "please log in" state if it's missing or has the wrong role; `SiteHeader`
re-reads the session on every route change (`usePathname` as the effect dependency) to keep the
login/logout control in sync after a redirect. Pages that need both a static `metadata` export and
client-side interactivity are split into a thin server `page.tsx` + a `"use client"` component next to
it (e.g. `gobierno/page.tsx` → `GobiernoDashboard.tsx`, `gobierno/nueva-licitacion/page.tsx` →
`NuevaLicitacionForm.tsx`) — follow this pattern rather than adding `"use client"` directly to a
`page.tsx` that exports `metadata`.

## blockchain

Hardhat 3 project (Solidity 0.8.28) using `ethers` v6 and `mocha` for TS tests, TypeScript for
config/scripts.

```bash
cd blockchain
npx hardhat compile
npx hardhat test              # runs both Solidity and mocha tests
npx hardhat test solidity     # Foundry-style *.t.sol unit tests only
npx hardhat test mocha        # TypeScript/mocha integration tests only
npx hardhat test mocha --grep "<test name>"   # run a single mocha test
npx hardhat ignition deploy ignition/modules/Counter.ts                  # deploy locally
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts # deploy to Sepolia
```

Sepolia deployment needs `SEPOLIA_RPC_URL` and `SEPOLIA_PRIVATE_KEY` set via `npx hardhat keystore set <name>`
or as environment variables (see `hardhat.config.ts`).

### Architecture

Currently a from-template placeholder, not yet the platform's real tender/proposal contracts:
`contracts/Counter.sol` (+ Solidity unit test `Counter.t.sol`), a TS integration test
(`test/Counter.ts`), an Ignition deployment module (`ignition/modules/Counter.ts`), and a script
(`scripts/send-op-tx.ts`). Networks configured in `hardhat.config.ts`: `hardhatMainnet`/`hardhatOp`
(simulated), and `sepolia` (real testnet, via `SEPOLIA_RPC_URL`/`SEPOLIA_PRIVATE_KEY` config
variables). When writing/modifying tests or contracts here, use the `hardhat` and
`hardhat-toolbox-mocha-ethers` skills (see `blockchain/AGENTS.md`) — they cover the Solidity-vs-TS
test tradeoffs, `forge-std` cheatcodes, and the `network.create()` API used in this Hardhat 3 setup.
