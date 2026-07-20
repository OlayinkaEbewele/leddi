# Leddi Prime — Collections App (Frontend Rebuild)
## Product & Technical Requirements Document
**Version:** 0.1 (Draft for review)
**Scope:** Frontend-only, high-code rebuild of the Retool app, limited to the **Loans List** and **Loan Details** views
**Status:** Mock data layer now; real Hasura/Acquire/REST integration is a later phase, not this one

---

## 0. How to read this document

This is one document doing two jobs:

- **Sections 1–4 (PRD):** what we're building, for whom, and why — derived from the Retool app's actual behavior as described in the source summary.
- **Sections 5–12 (TRD):** how we're building it — architecture, data contracts, component breakdown, and the API abstraction that lets us swap mock data for real Hasura/Acquire calls later without touching UI code.

Anything not explicitly stated in the source summary is called out as an **[ASSUMPTION]** inline, so you can correct it before implementation starts.

---

## 1. Background & Problem Statement

Leddi Prime is Autochek/AFS's internal collections operations tool, currently built in Retool. Collections officers use it to find loans (mostly originating from the **Acquire** loan management system), open a loan to see the full customer/vehicle/loan picture, and take operational actions against it — logging notes, recording promises-to-pay (PTPs), requesting asset recovery, generating statements/settlement quotes, and updating loan status.

The current implementation is low-code (Retool), which is fast to iterate on but has known ceilings: limited control over performance at scale (large loan tables), limited custom interaction design, harder version control / code review, and tighter coupling to Retool's component model. The ask is to rebuild this as a **high-code React + TypeScript application**, starting with the frontend only.

**Why Loans List + Details first:** these two views are the spine of the app — every other workflow (notes, PTPs, recovery, statements, status updates) hangs off having first found and opened a loan. Admin (category management) is a small, low-traffic CRUD screen gated to a single role and is reasonably deferred without blocking value.

---

## 2. Goals

### 2.1 Goals for this phase
- Recreate the **Loans List** view: searchable, filterable, paginated table of Acquire loans with the fields collections officers rely on daily.
- Recreate the **Loan Details** view: a single-loan workspace assembling loan, customer, vehicle, and collections-activity data, plus the entry points to the action workflows (even if some actions are stubbed in this phase — see §4.3).
- Establish a **data access layer** (API client + types + mock fixtures) that mirrors the real eventual sources (Hasura GraphQL, Acquire REST, internal REST, BigQuery) closely enough that swapping mocks for live calls later is a config/adapter change, not a rewrite.
- Establish **role-based UI gating** (readonly vs. action-capable roles) as a first-class concept, even before a real auth backend exists.
- Establish **i18n (EN/FR)** as a first-class concept from the start, matching the existing app's bilingual requirement.
- Ship something that looks and feels like a serious internal ops tool: dense information, fast scanning, clear status signaling (IFRS stage colors, stale demand-notice highlighting, etc.) — not a generic CRUD scaffold.

### 2.2 Non-goals for this phase
- No real backend integration (Hasura, Acquire API, BigQuery, Infobip, Browserless, Slack). All are mocked behind the API layer.
- No Admin / loan category management screen.
- No payment-notice allocation workflow, restructuring workflow, or direct-debit/Paystack flow as *functional* features — their entry points may exist in the Loan Actions drawer (to preserve layout/IA) but open a "not yet implemented in this phase" state.
- No real authentication/SSO. A mocked "current user" with a role is sufficient (see §6.5).
- No SMS (it's disabled in the source app too).
- No PDF generation/rendering pipeline (Browserless-equivalent) — out of scope until backend phase.

---

## 3. Users & Roles

**[ASSUMPTION]** — the source summary mentions role-gating generally and names only one concrete role (`AFS_HEAD`, gated to Admin, which is out of scope here). For Loans List + Details, I'm assuming a role model along these lines, to be confirmed:

| Role | Can view loans list/details | Can take actions (notes, PTP, status update, recovery requests, etc.) | Notes |
|---|---|---|---|
| `READONLY` | Yes | No — all action buttons visible but disabled with a tooltip | Maps to "readonly_user" flag in source |
| `COLLECTIONS_OFFICER` | Yes | Yes (standard actions) | Default operational role |
| `DEAL_ADMIN` | Yes | Yes + deal-admin-only actions (e.g. "new deal admin request") | |
| `PAYMENT_ADMIN` | Yes | Yes + payment/direct-debit actions | |
| `AFS_HEAD` | Yes | Yes (superset) + Admin access | Out of scope screen, but role should still exist |

The app should treat roles as **additive flags on a user object**, not a single enum, since the source describes things like "readonly/admin/deal admin/payment admin/etc." as independent gates rather than a strict hierarchy. This needs confirming with whoever owns the real role taxonomy before backend integration, but doesn't block frontend work — we just need *a* role model to gate UI against.

**Primary persona:** Collections officer, works the loans table for hours a day, needs to scan/filter/search fast, opens loans repeatedly, takes 3–10 actions per loan over its lifecycle.

---

## 4. Functional Requirements

### 4.1 Loans List View

This is the landing view. Functional requirements, derived directly from the source summary:

**4.1.1 Table of loans**
- Server-side-paginated table (mocked as client-side pagination over a fixture set in this phase, but the API contract must look paginated — see §7.1).
- Columns **[ASSUMPTION — exact column set/order to confirm with stakeholders, but this is the explicit field list from the source]**:
  - Acquire ID
  - Loandisk ID
  - Customer name
  - Customer email (with copy-to-clipboard affordance)
  - Structure code
  - Lender
  - Classification
  - Category
  - Operational status
  - Deal status
  - IFRS stage (color-coded tag/chip)
  - Arrears balance
  - Capital balance
  - Total exposure
  - Next installment date
  - Inception date
  - Maturity date
  - Demand notice date (visually highlighted when stale — **[ASSUMPTION]** "stale" = past due by some threshold, e.g. >30 days; needs confirming)

**4.1.2 Search**
- Single search input bound to a `searchTerm`-equivalent. **[ASSUMPTION]** searches across customer name, Acquire ID, Loandisk ID, and email — the source doesn't enumerate the searched fields, only that search exists.

**4.1.3 Filters**
- IFRS filter (modal in source) — filter rows by one or more IFRS stages.
- Demand notice filter — filter to loans with stale/overdue demand notices.
- Filters and search compose (AND logic) — **[ASSUMPTION]**.

**4.1.4 Row interaction**
- Clicking a row navigates to the Loan Details view for that loan (equivalent to `open_loan_details_acquire` setting the app into the "details" viewKey). In the React app this is a route transition, not a view-key toggle (see §5.2).

**4.1.5 Tabs**
- The source mentions "loans list + payment/restructure tabs" alongside the main loans view. **[ASSUMPTION/SCOPE CUT]**: Payment notices and restructure tabs are **out of scope** for this phase per the agreed scope (Loans List + Details only). The Loans List view ships with just the loans table; tab scaffolding can exist as disabled/placeholder tabs to preserve future IA, but no functionality behind them.

### 4.2 Loan Details View

Opened by selecting a loan from the list. Assembles, per the source, a "single loan workspace." Functional requirements:

**4.2.1 Data assembled on open**
- Core Acquire loan record (status, balances, dates, structure, classification).
- Account manager info (name, email, territory — from BigQuery in source; mocked here).
- Vehicle/collateral info (make/model, dealer, tracker status).
- Customer details (contact info, next-of-kin).
- Notes (chronological log).
- Promises-to-pay (PTPs) — list with status (kept/broken/pending).
- Receipts.
- Documents (list of files attached to the loan).
- Recovery status (if a recovery request exists/has existed).
- Scorecard (**[ASSUMPTION]** — source mentions this with no further detail on shape; treat as an opaque key-value block until clarified).
- Call log (3CX-equivalent — list of recent calls, mocked).

**4.2.2 Layout**
- **[ASSUMPTION]** Tabbed or sectioned single-page layout: an overview/header strip (customer name, loan status, IFRS stage, key balances) that's always visible, with the rest organized into tabs: *Overview*, *Notes & PTPs*, *Documents*, *Vehicle*, *Recovery*, *Call Log* — modeled after the source's "many containers + tabs" description. Exact tab grouping is a design decision to finalize, not contractually specified by the source.

**4.2.3 Loan Actions drawer**
The source describes a `drawer_loan_actions` with these entry points. Each is listed with its *target functional state* in this phase:

| Action | This phase behavior |
|---|---|
| Request restructure | Opens drawer/modal UI; submit is a **mocked success** (writes to mock note/activity log, no real backend) |
| Request asset recovery | Opens modal; if loan not eligible (**[ASSUMPTION]** eligibility rule e.g. based on operational status), shows "check repossession" message instead, matching source behavior |
| Cancel asset recovery (revocation) | Mocked action, requires existing recovery request state |
| View all customer loans | Navigates to Loans List pre-filtered by customer — **[ASSUMPTION]** customer identity used as filter key |
| Return asset to customer (reclaim) | Mocked action |
| Generate statement | Opens statement modal; **mocked** response (no real Acquire/Browserless PDF call) — shows a placeholder success + disabled "Download PDF" with a note that PDF generation is a backend-phase feature |
| Generate settlement quote | Same mocked pattern as above |
| Generate termination letter | Country-gated per source — **[ASSUMPTION]** gate is `loan.country === 'NG'` or similar; mocked |
| Update status | Opens status update modal; writes to mock status-update queue, doesn't call real Acquire API |
| Direct debit activation | Out of scope per §2.2 — entry point shown, disabled with "coming soon" |
| New deal admin request | Opens modal; mocked submit |

All actions are **role-gated** per §3 and **status-gated** per source ("depend on the loan's current status") — **[ASSUMPTION]** specific status→action eligibility matrix needs confirming; for v1 I'll implement a configurable matrix (see §9.3) so rules can change without UI rewrites.

**4.2.4 Notes & auditability**
- Adding a note (general note, status-update note, receipt note) appends to the loan's note timeline. Mocked persistence (in-memory / local state for this phase — see §7.4 on mock persistence strategy).

### 4.3 Explicit feature cuts for this phase (recap)
- Admin/category management — cut.
- Payment notice allocation (pending/allocated) — cut.
- Restructuring workflow (full flow, not just the drawer entry point) — cut, entry point only.
- Direct debit / Paystack — cut, entry point only, disabled.
- Real email/WhatsApp send — cut; UI for composing can exist, "send" is mocked.
- Real PDF generation — cut; UI exists, generation is mocked.
- Slack error escalation — cut (no backend to escalate to); console/log-level error surfacing only.

---

## 5. System Architecture (TRD)

### 5.1 High-level architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React App (SPA)                       │
│                                                               │
│  ┌─────────────┐    ┌──────────────────┐    ┌─────────────┐  │
│  │   Routing    │───▶│   Page Views      │───▶│  Feature    │  │
│  │ (react-      │    │ - LoansListPage   │    │  Components │  │
│  │  router)     │    │ - LoanDetailsPage │    │  (table,    │  │
│  └─────────────┘    └──────────────────┘    │  drawer,    │  │
│                                               │  tabs, etc) │  │
│                                               └─────────────┘  │
│                              │                                │
│                              ▼                                │
│                    ┌──────────────────┐                       │
│                    │  Data layer       │                       │
│                    │  (TanStack Query  │                       │
│                    │   + API client)   │                       │
│                    └──────────────────┘                       │
│                              │                                │
│                              ▼                                │
│         ┌────────────────────────────────────┐                │
│         │     API Client Interface           │                │
│         │  (loansApi, loanDetailsApi, etc.)  │                │
│         └────────────────────────────────────┘                │
│                  │                      │                     │
│         ┌────────▼────────┐   ┌─────────▼─────────┐           │
│         │  Mock Adapter    │   │  Real Adapter      │          │
│         │  (THIS PHASE)    │   │  (FUTURE: Hasura,  │          │
│         │  in-memory       │   │  Acquire REST,     │          │
│         │  fixtures        │   │  BigQuery, etc.)   │          │
│         └─────────────────┘   └─────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

The core architectural decision driving everything else: **the rest of the app never imports the mock adapter directly.** It imports an interface (`ILoansApi`, `ILoanDetailsApi`, etc.). Today that interface is satisfied by a mock implementation; later, a real implementation satisfies the same interface. This is the direct translation of the source app's "Hasura/Acquire/REST/BigQuery" multi-source reality into something a frontend-only build can stand on without lying about the eventual shape of the data.

### 5.2 Routing

Source app uses a single Retool page with an internal `viewKey` ("loans" vs "details") rather than real URL routing. For the React rebuild, this becomes real routes — better for deep-linking, back-button behavior, and bookmarking, which collections officers will want (e.g. share a link to a specific loan):

- `/loans` — Loans List view
- `/loans/:acquireId` — Loan Details view for a given loan
- `/loans/:acquireId/:tab` — **[ASSUMPTION, nice-to-have]** deep link into a specific details tab

This is an improvement over the source behavior, not a deviation from any stated requirement — flagging it because it's a real change in mental model (page-based vs. viewKey-based) that should be confirmed as desirable.

### 5.3 Suggested tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Specified |
| Build tool | Vite | Fast HMR in Cursor, minimal config, standard for new React+TS SPAs |
| UI components | MUI (Material UI) v5/v6 | Specified. `DataGrid` (or `DataGridPro` if available) is a strong fit for the dense, filterable Loans List table |
| Routing | React Router v6 | De facto standard, pairs well with MUI |
| Server-state / data fetching | TanStack Query (React Query) | Gives caching, pagination, and loading/error states "for free" — and crucially, makes the mock→real API swap painless since it only cares about the async function signature, not what's behind it |
| Client/local state | React Context + `useState`/`useReducer` for cross-cutting concerns (current user/role, language); component-local state otherwise | No need for Redux/Zustand at this scope; revisit if state complexity grows |
| Forms | React Hook Form + Zod | For modals/drawers (note entry, status update, restructure request forms) — Zod schemas double as runtime validation and TypeScript types |
| i18n | `i18next` + `react-i18next` | Mirrors the source app's EN/FR translation-table pattern; can model `query_translation`'s `{ [key]: { en, fr } }` shape directly as JSON resource files |
| Date handling | `date-fns` | Lightweight, works cleanly with MUI date components |
| Mock data layer | Local TypeScript fixture modules + an in-memory "mock API" with artificial latency (`setTimeout`) | Keeps mocks realistic (loading states actually show) without needing a mock server process |
| Icons | MUI Icons or `lucide-react` | Either is fine; MUI Icons is the more consistent default given MUI is the system |

**[ASSUMPTION]** I'm not introducing a mock server (e.g. MSW — Mock Service Worker) in v1 to keep setup simple, but flagging it: if the team wants the mock layer to behave more like real network requests (visible in browser dev tools, interceptable, closer to the eventual real fetches), MSW is a very natural upgrade and wouldn't require changing the API client interface at all — only swapping what's behind it. Worth deciding now since it changes folder structure slightly.

### 5.4 Project structure

```
src/
  app/
    routes.tsx
    App.tsx
    providers.tsx          # QueryClientProvider, ThemeProvider, I18nProvider, UserContext
  features/
    loans-list/
      LoansListPage.tsx
      components/
        LoansTable.tsx
        LoansFilters.tsx
        IfrsStageChip.tsx
        DemandNoticeBadge.tsx
      hooks/
        useLoansQuery.ts
    loan-details/
      LoanDetailsPage.tsx
      components/
        LoanHeaderSummary.tsx
        LoanActionsDrawer.tsx
        tabs/
          OverviewTab.tsx
          NotesAndPtpsTab.tsx
          DocumentsTab.tsx
          VehicleTab.tsx
          RecoveryTab.tsx
          CallLogTab.tsx
        modals/
          StatusUpdateModal.tsx
          RestructureRequestModal.tsx
          GenerateStatementModal.tsx
          SettlementQuoteModal.tsx
          AssetRecoveryModal.tsx
      hooks/
        useLoanDetailsQuery.ts
        useLoanActions.ts
  api/
    types.ts                # Shared domain types (Loan, LoanDetails, Note, Ptp, etc.)
    client/
      ILoansApi.ts           # Interfaces
      ILoanDetailsApi.ts
      ILoanActionsApi.ts
    mock/
      mockLoansApi.ts
      mockLoanDetailsApi.ts
      mockLoanActionsApi.ts
      fixtures/
        loans.fixtures.ts
        loanDetails.fixtures.ts
      mockNetwork.ts         # artificial latency / error simulation helper
    index.ts                 # Wires up which adapter (mock vs real) is active — single swap point
  auth/
    UserContext.tsx
    roles.ts
    useCanPerformAction.ts
  i18n/
    en.json
    fr.json
    i18n.ts
  theme/
    theme.ts                 # MUI theme: colors incl. IFRS stage palette, typography
  components/                # Shared/generic components not tied to a feature
    CopyableText.tsx
    StatusTag.tsx
  utils/
    formatCurrency.ts
    formatDate.ts
```

---

## 6. Domain Model & Types

Translating the source's data sources into TypeScript domain types. These are the contracts the mock adapter must satisfy today and the real adapter must satisfy later — this is the most important section to get right early, since UI components will be written against these shapes.

### 6.1 Core `Loan` (list row)

```typescript
export type IfrsStage = 'STAGE_1' | 'STAGE_2' | 'STAGE_3';

export interface LoanListItem {
  acquireId: string;
  loandiskId: string;
  customerName: string;
  customerEmail: string;
  structureCode: string;
  lender: string;
  classification: string;
  category: string;
  operationalStatus: string;     // [ASSUMPTION] free-text/enum TBD from real Acquire values
  dealStatus: string;            // [ASSUMPTION] same caveat
  ifrsStage: IfrsStage;
  arrearsBalance: number;
  capitalBalance: number;
  totalExposure: number;
  nextInstallmentDate: string;   // ISO date
  inceptionDate: string;
  maturityDate: string;
  demandNoticeDate: string | null;
  isDemandNoticeStale: boolean;  // derived, but exposed pre-computed for the UI
  currency: string;              // [ASSUMPTION] not mentioned in source; needed for formatting
}
```

### 6.2 `LoanDetails` (assembled workspace)

```typescript
export interface LoanDetails extends LoanListItem {
  accountManager: AccountManager | null;
  vehicle: VehicleInfo | null;
  customer: CustomerDetails;
  notes: LoanNote[];
  ptps: PromiseToPay[];
  receipts: Receipt[];
  documents: LoanDocument[];
  recovery: RecoveryStatus | null;
  scorecard: Record<string, unknown> | null; // [ASSUMPTION] opaque until shape is confirmed
  callLog: CallLogEntry[];
  country: string; // for termination-letter country gate
}

export interface AccountManager {
  name: string;
  email: string;
  territory: string;
}

export interface VehicleInfo {
  make: string;
  model: string;
  plateNumber: string;
  dealerName: string;
  trackerStatus: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN'; // [ASSUMPTION]
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  nextOfKin: { name: string; phone: string; relationship: string } | null;
}

export interface LoanNote {
  id: string;
  type: 'GENERAL' | 'STATUS_UPDATE' | 'RECEIPT'; // [ASSUMPTION] from source's note-type queries
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface PromiseToPay {
  id: string;
  amount: number;
  promisedDate: string;
  status: 'PENDING' | 'KEPT' | 'BROKEN';
  createdAt: string;
}

export interface Receipt {
  id: string;
  amount: number;
  receivedAt: string;
  reference: string;
}

export interface LoanDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  url: string; // mock: a placeholder/data URL
}

export interface RecoveryStatus {
  requestedAt: string;
  status: 'REQUESTED' | 'APPROVED' | 'CANCELLED' | 'COMPLETED'; // [ASSUMPTION]
  reason: string | null;
}

export interface CallLogEntry {
  id: string;
  phoneNumber: string;
  direction: 'INBOUND' | 'OUTBOUND';
  durationSeconds: number;
  occurredAt: string;
}
```

### 6.3 Filters & pagination contract

```typescript
export interface LoansListQuery {
  page: number;
  pageSize: number;
  searchTerm?: string;
  ifrsStages?: IfrsStage[];
  demandNoticeStaleOnly?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
```

### 6.4 API client interfaces

```typescript
export interface ILoansApi {
  listLoans(query: LoansListQuery): Promise<PaginatedResult<LoanListItem>>;
}

export interface ILoanDetailsApi {
  getLoanDetails(acquireId: string): Promise<LoanDetails>;
}

export interface ILoanActionsApi {
  addNote(acquireId: string, note: Pick<LoanNote, 'type' | 'content'>): Promise<LoanNote>;
  addPtp(acquireId: string, ptp: Pick<PromiseToPay, 'amount' | 'promisedDate'>): Promise<PromiseToPay>;
  requestStatusUpdate(acquireId: string, newStatus: string, reason: string): Promise<void>;
  requestAssetRecovery(acquireId: string, reason: string): Promise<RecoveryStatus>;
  cancelAssetRecovery(acquireId: string): Promise<void>;
  requestRestructure(acquireId: string, payload: RestructureRequestPayload): Promise<void>;
  generateStatement(acquireId: string, dateRange: { from: string; to: string }): Promise<{ mocked: true }>;
  generateSettlementQuote(acquireId: string): Promise<{ mocked: true }>;
  generateTerminationLetter(acquireId: string): Promise<{ mocked: true }>;
}

export interface RestructureRequestPayload {
  reason: string;
  proposedTerms: string; // [ASSUMPTION] real shape TBD — source doesn't detail restructure fields
}
```

### 6.5 Current user / role context

```typescript
export type Role = 'READONLY' | 'COLLECTIONS_OFFICER' | 'DEAL_ADMIN' | 'PAYMENT_ADMIN' | 'AFS_HEAD';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  roles: Role[];        // additive, per §3
  isReadonly: boolean;  // derived convenience flag, mirrors source's readonly_user
}
```

In this phase, `CurrentUser` is provided by a hardcoded/mock context provider with a dev-only role switcher (a small UI control, visible only in non-production builds) so the team can preview the UI under each role without needing real auth — directly mirroring the source app's environment banner concept (§6.6).

### 6.6 Environment awareness

Source app shows a visible banner when not in production and labels "Live" vs "Staging" in the sidebar. **[ASSUMPTION — straightforward to carry over]**: implement via a `VITE_APP_ENV` build-time env var, rendered as a banner component (`<EnvironmentBanner />`) shown whenever `VITE_APP_ENV !== 'production'`.

---

## 7. Mock Data Layer Design

This is the part that most directly answers "mock now, structure for real later."

### 7.1 Pagination realism

Even though there's no real server, `mockLoansApi.listLoans()` should **actually slice** an in-memory fixture array according to `page`/`pageSize`/filters/search, and return `totalCount` reflecting the *filtered* set — not the full fixture set. This matters because the `LoansTable` component (esp. if built on MUI `DataGrid` in server-pagination mode) needs to behave correctly against `totalCount` regardless of whether the count comes from a mock array length or a real Hasura aggregate — and we want to catch pagination bugs now, not after the real API lands.

### 7.2 Fixture volume

**[ASSUMPTION]** Recommend ~150–300 fixture loan rows, generated programmatically (not hand-written) with realistic-looking but clearly fake data (e.g. via `@faker-js/faker`), covering:
- A spread across all IFRS stages
- A mix of stale and non-stale demand notices
- At least a handful of loans with full detail richness (notes, PTPs, documents, recovery history) to make the Details view meaningful to demo, and some "thin" loans with minimal data to test empty states

### 7.3 Latency & error simulation

`mockNetwork.ts` should wrap every mock call with:
- Configurable artificial delay (e.g. 300–800ms randomized) so loading skeletons/spinners are actually exercised during development — a common gap when mocks resolve instantly.
- An optional simulated-failure mode (e.g. behind a dev-only toggle or a fixture loan ID that always 404s) so error states aren't an afterthought.

### 7.4 Mock persistence strategy

Actions like "add note" or "request status update" need to feel real within a session. **[ASSUMPTION]**: hold mutated state in an in-memory store (a simple module-level array/map, or wrapped in a tiny Zustand store if that's cleaner) that the mock API reads/writes — so adding a note in the Details view actually shows up in that loan's note list without a page reload, but resets on full app reload. This is sufficient for frontend demo/dev purposes and explicitly **not** meant to simulate real durability.

### 7.5 The swap point

```typescript
// src/api/index.ts
import { mockLoansApi } from './mock/mockLoansApi';
import { mockLoanDetailsApi } from './mock/mockLoanDetailsApi';
import { mockLoanActionsApi } from './mock/mockLoanActionsApi';
// FUTURE: import { realLoansApi } from './real/realLoansApi'; etc.

const USE_MOCKS = true; // FUTURE: import.meta.env.VITE_USE_MOCKS === 'true'

export const loansApi: ILoansApi = USE_MOCKS ? mockLoansApi : (null as never /* realLoansApi */);
export const loanDetailsApi: ILoanDetailsApi = USE_MOCKS ? mockLoanDetailsApi : (null as never);
export const loanActionsApi: ILoanActionsApi = USE_MOCKS ? mockLoanActionsApi : (null as never);
```

Every feature component imports `loansApi`/`loanDetailsApi`/`loanActionsApi` from `src/api/index.ts` — **never** from the mock files directly. This single-file swap point is the whole point of the exercise: when the backend phase starts, this file (plus writing the `real*Api` implementations against Hasura/Acquire/REST) is most of the integration work; feature components shouldn't need to change.

---

## 8. UI/UX Requirements

### 8.1 Visual language for status & risk signaling

The source app leans heavily on color and visual emphasis to let officers scan fast:
- **IFRS stage** → colored chip/tag (e.g. Stage 1 = green/neutral, Stage 2 = amber, Stage 3 = red) — **[ASSUMPTION]** exact mapping TBD with design, but the *pattern* (color-coded risk tier) is explicit in the source.
- **Stale demand notice** → visually distinguished row/cell (e.g. red text, warning icon) — explicit in source ("highlighting when stale").
- **Copy-to-clipboard** on customer email — explicit in source; small affordance (icon button) next to the email value, with a brief confirmation (toast or icon swap) on click.

### 8.2 Density & performance

This is a daily-use ops tool for officers scanning many loans — the table should default to a dense MUI density setting, support a high `pageSize` (e.g. 25/50/100 options), and avoid layout patterns that sacrifice scanability for visual flourish. **[ASSUMPTION, design judgment]**: this is the single biggest UX risk in a "high-code rebuild" — it's easy to accidentally make the new version feel more spacious/consumer-product-like than the dense Retool original that power users are fast in. Recommend reviewing actual Retool screenshots (not available in the source summary) before finalizing the table design.

### 8.3 Role-gated actions — interaction pattern

Per source: "Most of these actions are role-gated... and also depend on the loan's current status." **[ASSUMPTION]** recommended pattern: disabled (not hidden) buttons for role/status-ineligible actions, with a tooltip explaining why ("Requires Deal Admin role" / "Not available for loans in Closed status") — this is generally better UX than hiding controls, since it teaches the officer the system's rules rather than leaving them wondering why an action isn't there.

### 8.4 Bilingual support

Every user-facing string goes through `react-i18next`, structured to mirror the source's `query_translation.data[key][lang]` pattern — i.e. flat or lightly-nested translation keys, not deeply nested component-specific trees, so the eventual real translations table (if it stays a Hasura-driven dynamic translation source rather than static JSON) can map onto the same keys.

---

## 9. Business Logic Requirements

### 9.1 Derived/computed fields (mirroring source's "Transformers")

The source relies on Retool Transformers to shape data for display. In the React app these become pure utility functions / selectors, colocated near usage or in `src/utils/`:

- `isDemandNoticeStale(demandNoticeDate, asOf)` → boolean
- `getIfrsStageColor(stage)` → theme color token
- `formatCurrency(amount, currencyCode)`
- `parseCustomerName(...)` / similar display normalizers — **[ASSUMPTION]** exact transformation rules not specified in source; implement straightforward formatting now, revisit if real data reveals edge cases (e.g. corporate vs. individual borrower name formats).

### 9.2 Filtering logic

`acquire_loans_where_query`-equivalent: in the mock layer, filtering happens in-memory; in TRD terms, this logic should be written as a pure function `filterLoans(loans, query): LoanListItem[]` so it's trivially testable and trivially replaceable later by a real GraphQL `where` clause builder — same shape of responsibility, different execution engine.

### 9.3 Action eligibility matrix

Per §4.2.3, recommend a small declarative config rather than scattering `if` statements through components:

```typescript
type ActionKey = 'REQUEST_RESTRUCTURE' | 'REQUEST_RECOVERY' | 'CANCEL_RECOVERY' | 'GENERATE_STATEMENT' | /* ... */;

interface ActionEligibilityRule {
  requiresAnyRole: Role[];
  allowedOperationalStatuses?: string[]; // undefined = no status restriction
}

export const actionEligibility: Record<ActionKey, ActionEligibilityRule> = {
  REQUEST_RESTRUCTURE: { requiresAnyRole: ['COLLECTIONS_OFFICER', 'DEAL_ADMIN', 'AFS_HEAD'] },
  REQUEST_RECOVERY: { requiresAnyRole: ['COLLECTIONS_OFFICER', 'DEAL_ADMIN', 'AFS_HEAD'], allowedOperationalStatuses: ['DEFAULTED', 'DELINQUENT'] },
  // ... [ASSUMPTION] full matrix TBD with collections ops stakeholders
};
```

This makes the (currently unknown) real eligibility rules a **data change**, not a **code change**, once confirmed.

---

## 10. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Loans table should remain responsive (interaction <100ms) with mock pagination up to the fixture volume in §7.2; no virtualization needed yet at this scale, but `DataGrid`'s built-in virtualization handles it for free regardless |
| Accessibility | MUI components are reasonably accessible by default; ensure custom components (status chips, copy-to-clipboard) have proper `aria-label`s and keyboard support |
| Browser support | **[ASSUMPTION]** modern evergreen browsers only (Chrome/Edge/Firefox/Safari, last 2 versions) — internal tool, no legacy requirement stated or implied |
| Responsiveness | **[ASSUMPTION]** Source app has a mobile header treatment (`header.rsx` "sticky header on mobile"), implying some mobile awareness. Recommend: desktop-first (this is a power-user ops tool, primarily used on laptops/desktops), but don't actively break on tablet-width screens. Full mobile optimization is likely not worth the investment unless officers genuinely work from phones — worth confirming. |
| Code quality | TypeScript `strict` mode on; ESLint + Prettier configured from project start; no `any` in domain types layer |
| Testing | **[ASSUMPTION, recommended baseline]** Unit tests (Vitest) for pure logic (`filterLoans`, eligibility matrix, formatters); component tests (React Testing Library) for `LoansTable` and `LoanActionsDrawer` at minimum, given they're the highest-traffic/highest-complexity components |

---

## 11. Open Questions / Items Needing Confirmation

Consolidating every **[ASSUMPTION]** flagged above into one list for fast review:

1. Exact role taxonomy beyond `AFS_HEAD` — names, and whether additive-flags model is correct.
2. Exact Loans List column set/order, and whether any columns are missing from the list above.
3. Search field scope (which fields the search box actually matches against).
4. "Stale" demand notice threshold (days).
5. Whether filters compose as AND or allow OR groupings.
6. Whether Loan Details should be tabbed, and if so, the exact tab grouping.
7. Asset recovery eligibility rule (which operational statuses qualify).
8. Termination letter country gate — exact condition.
9. Full action × role × status eligibility matrix (only partially knowable from source).
10. `scorecard` data shape — totally unspecified in source.
11. Whether real-feeling network mocking (MSW) is wanted now vs. plain async functions.
12. Mobile/responsive bar — is this ever used on tablets/phones in practice?
13. Restructure request form fields (source gives no detail on what a restructure request actually captures).
14. Whether route-based navigation (`/loans/:acquireId`) is an acceptable/desired change from the source's single-page `viewKey` model (flagged as a likely-welcome improvement, not a neutral one).

None of these block starting implementation — they block *finishing* specific components, and several (1, 9, 10, 13) are exactly the kind of thing worth a short conversation with the collections ops team before backend integration regardless.

---

## 12. Phasing / Suggested Build Order

1. **Scaffold**: Vite + React + TS + MUI theme + routing + i18n shell + mock API swap point (empty implementations returning fixture stubs).
2. **Domain types & fixtures**: lock down §6 types, generate fixture data (§7.2).
3. **Loans List**: table, search, filters, pagination — fully functional against mocks.
4. **Loan Details — read path**: header summary + all tabs rendering assembled mock data, no actions yet.
5. **Loan Details — actions**: Loan Actions drawer + modals, wired to mock action API with in-memory persistence (§7.4).
6. **Role gating pass**: apply `actionEligibility` matrix + dev-only role switcher across both views.
7. **Polish pass**: empty states, error states, loading states, copy-to-clipboard, responsive check, accessibility pass.

This order front-loads the highest-uncertainty, highest-value screen (Loans List) and defers the most speculative parts (action eligibility specifics, scorecard shape) to when there's more surface area to make informed guesses against.