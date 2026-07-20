# Leddi Prime — PRD/TRD Patch Notes (v0.2)

Addendum to "Leddi Prime — Collections App, Frontend Rebuild, v0.1." This does **not**
replace the original document — the architecture decisions in §5 (mock/real swap point),
§6 base type patterns, §7 (mock data strategy), and §10 (NFRs) still hold. This patch
corrects the parts that were **[ASSUMPTION]**-flagged in v0.1 and turned out to be wrong
or incomplete, now that a real screenshot of the live app is available. Each item below
references the v0.1 section it corrects.

---

## 1. Corrects §1 (Background) — Leddi is a suite, not a single app

**Was assumed:** Leddi Prime is "the app." **Actually:** Leddi Prime is one of several
apps reachable from a shared top-level sidebar:

| App | Purpose |
|---|---|
| **Prime** (Collections App) | This PRD's subject — loan collections operations |
| **Nest M** | Recovery (Manager view) |
| **Nest V** | Recovery (Vendor view) |
| **Mist** | Disposal App — for recovered vehicles |
| **Paper** | Payment Notification |
| **X** | Requests management app |

**Decision for this phase (confirmed with stakeholder):** the other five apps appear in
the sidebar as **non-functional nav placeholders only** — visible, labeled, with their
icons, but not wired to any route/page yet. This preserves the real IA (so the sidebar
doesn't need restructuring later) without expanding build scope. Cursor prompt below
reflects this.

**Implication for routing (§5.2):** the route structure needs a top-level app segment
even though only one app is functional, e.g. `/prime/loans/:acquireId` rather than bare
`/loans/:acquireid`, so the other five apps have an obvious place to land later without
a path-structure migration. **This changes the routes specified in v0.1 §5.2** — treat
that section as superseded by this note.

---

## 2. Corrects §4.1.5 (Tabs) — the tab set was a guess; it's now exact

v0.1 guessed at payment/restructure tabs being out of scope and used placeholder-only
tabs. **The real app has seven tabs**, all peers of each other under Prime, each with
filters and a table:

1. **Loans**
2. **Payment Notices** — itself split into two sub-tabs: **Pending** and **Allocated**
   (same column set, different row actions — see §4 below)
3. **PTP** (Promise to Pay)
4. **Restructure Requests**
5. **Status Updates**
6. **Settled Deals**
7. **My deal admin requests**

**Decision for this phase:** Loans tab is fully functional (per the detailed column spec
in §3 below). The other six tabs are **built as real tab destinations with real table
shells**, but can run on the same mock-table component pattern with placeholder/empty
fixture data where a full column spec hasn't been given yet (PTP, Restructure Requests,
Status Updates, Settled Deals, My deal admin requests still need their column lists —
flagging as a new open question, see §7). **Payment Notices** now has a confirmed column
spec (§4 below) and should be built with real fixture data, not a placeholder.

This **supersedes v0.1 §4.1.5**, which assumed payment/restructure tabs were cuttable.
They're not — they're real IA, just with varying data-readiness right now.

---

## 3. Corrects §4.1.1 (Loans table columns) — exact column list + exact formats

v0.1's column list was close but not exact, and didn't specify tag-vs-plain-text styling
or date formats. Replace v0.1 §4.1.1 with this:

| Column | Display type | Notes |
|---|---|---|
| Acquire ID | Plain text | Format observed as `loanId:secondaryId` (e.g. `005304:004281`) — **[NEW ASSUMPTION]** treat as a single composite string field for now, confirm if it's actually two separate IDs joined for display |
| Structure Code | Tag/chip, colored | Color appears to vary by code prefix/country (NG-20 green, KE-03 blue, UG-01 blue, NG-12 purple, NG-25 yellow/amber, NG-07 green) — **[NEW ASSUMPTION]** the mapping looks like it may be per-country or per-code-hash rather than a fixed palette; treat as "deterministic color per distinct code value" (hash the string to a palette index) unless told otherwise |
| Lender | Plain text | Often empty in sample data — render gracefully empty, not "null"/"undefined" |
| Classification | Tag/chip, colored | e.g. `NG RIDEHAIL_MIG` (green), `KE DISC_MIG` (red/pink), `UG VEHFIN_MIG` (orange), `NG VEHFIN` (green) — same "deterministic color per value" treatment as Structure Code |
| Loan Category | Tag/chip, colored | e.g. `Uncategorized` (yellow), `Normal` (red/pink) — same deterministic-color treatment |
| Loandisk ID | Plain text | Frequently `None` — render literal "None" as shown, don't blank it out (matches source display behavior) |
| Operational Status | Tag/chip, colored, two-line | Top line is the tag (`ACTIVE` green, `MISSEDPAYMENT` yellow/amber), **second line below it is a date** (e.g. "Wed, Aug 07, 2024") — **[NEW]** this date wasn't in v0.1's flat model; it needs its own field, see §5 |
| Deal Status | Tag/chip, colored | `ACTIVE` green observed; presumably other values exist |
| IFRS Status | Tag/chip OR dash OR numeric badge | Observed states: `-` (dash, presumably "not yet staged" or "stage not applicable"), and a blue numeric pill `1+` — **[NEW ASSUMPTION]** the `1+` badge likely represents a count of something (overdue installments? flags?) rather than a literal IFRS stage label — this contradicts v0.1's `IfrsStage = 'STAGE_1' | 'STAGE_2' | 'STAGE_3'` enum model. **Flagging as the most important open question in this patch** — see §7, item 1. |
| Customer | Plain text (truncated) | Names are long and get cut off with ellipsis in the real UI — confirms a fixed/constrained column width is correct, not a flex-to-content width |
| Car | Plain text | **[NEW]** not in v0.1's `LoanListItem` type at all — needs adding |
| Arrears Balance | Currency | |
| Capital Balance | Currency | **[NEW]** v0.1 had this; confirmed correct |
| Total Exposure | Currency | |
| Instalment Date | Date, format `E, MMM dd, y` (e.g. "Wed, Aug 07, 2024") | **[NEW]** v0.1 called this "next installment date" with bare ISO format — now confirmed exact display format string, useful directly as a `date-fns` format pattern |
| Inception Date | Date, same format | |
| Maturity Date | Date, same format | |
| Demand Notice | — | Column listed but not visibly populated in the sample screenshot rows (all show blank/dash in that region) — keep as a column, treat as frequently-null |
| Email | Plain text, copy-to-clipboard | Confirms v0.1's copy-to-clipboard requirement (§8.1) — still correct, just now confirmed as its own trailing column rather than inline with Customer |

**Net effect on §6.1 `LoanListItem` type:** needs `car: string`, an `operationalStatusDate`
(or restructure `operationalStatus` into `{ status: string; asOfDate: string }`), and the
`ifrsStatus` field needs to change shape — see open question §7.1 below before finalizing
the type. Don't lock the IFRS field type until that's answered; model it loosely
(`ifrsStatus: string | number | null`) in the interim so the UI doesn't need a rewrite
once it's confirmed.

**Filters above the tab bar — corrects v0.1 §4.1.3:** the real filter bar (shared across
all 7 tabs, sits above the tab strip, not per-tab) has: Select Country, Classification,
Structure Code, Select Statuses, Select Loan Category, Start Date–End Date. This is a
materially larger filter set than v0.1's "IFRS filter modal + demand notice filter" guess.
Below the tab strip, *within* the Loans tab specifically, there's also a loan-ID-scoped
search dropdown ("Search by Loan ID") paired with a free-text search ("Search for customer
name, loan ID, or loan hash"), plus a separate **Demand Notice Filter** dropdown and an
**IFRS Status** filter — so demand-notice and IFRS filtering are still tab-local, but
country/classification/structure-code/status/category/date-range are global-to-the-tab-bar.

**New requirement, not in v0.1 at all:** *"Tables should have 10 items per page, and by
default be filtered by country unless the user is an admin."* This is a real,
stakeholder-given business rule — add as v0.2 requirement: default page size is fixed at
10 (not the 25/50/100 options v0.1 §8.2 suggested — **that NFR is now superseded for page
size**, though larger options can still exist as a user override if desired), and the
country filter defaults to the current user's assigned country/territory unless
`isAdmin`-equivalent, in which case it defaults to unfiltered/all-countries. This needs a
`country` field on `CurrentUser` that v0.1 §6.5 didn't include — add it.

---

## 4. New — Payment Notices column spec (not in v0.1 at all)

Both **Pending** and **Allocated** sub-tabs share the same column set:

| Column | Type |
|---|---|
| ID | Plain text |
| Acquire ID | Plain text |
| Customer | Plain text |
| Created At | Date/datetime |
| Created By | Plain text |
| Country | Plain text or tag |
| Product | Plain text |
| Type | Plain text or tag |
| Amount | Currency |
| Paid At | Date/datetime |
| Loan Status | Tag |
| Narrative | Plain text |
| Reference | Plain text |

**Pending tab only** gets row-level actions (not present on Allocated rows):
- **Confirm payment**
- **Delete**
- **Edit payment details**

This directly supersedes v0.1 §4.3's blanket statement that "payment notice allocation
workflow... cut, entry point only" — the Payment Notices tab is now in-scope with real
columns and real (mocked) row actions, not a disabled stub.

---

## 5. New — Loan Details: confirmed section structure (replaces v0.1 §4.2.2's guess)

v0.1 guessed at a tabbed layout with sections like Overview/Notes & PTPs/Documents/etc.
**The real structure is different and is now specified exactly:**

The Loan Details view is a **single scrollable page divided into named sections**, in
this order, with **tabs anchored at the bottom** of the page (not at the top, and not
gating section visibility — needs clarifying, see §7.4):

1. **Statuses** — operational status, deal status, loan category; **last 6 months'
   payment history rendered as a row of tags/chips, one per month, with defaulted months
   shown in red**; last payment (amount + date); arrears balance; total paid.
2. **Customer Details** — customer info, with **phone number and email specifically
   editable inline** (not just displayed) — this is a new, real requirement v0.1 didn't
   have at all: v0.1's `CustomerDetails` type was read-only.
3. **Account Manager Details** — matches v0.1's `AccountManager` concept, now confirmed
   as its own visually distinct section rather than folded into a generic "Overview."
4. **Car Details** — roughly matches v0.1's `VehicleInfo`, renamed to match the app's own
   language ("Car" is the term used in both this section and the Loans table column —
   recommend renaming `VehicleInfo` → `CarDetails` and `vehicle` → `car` throughout for
   consistency with the product's actual vocabulary, not a synonym).
5. **Loan Details** — the core loan record fields (structure, classification, dates,
   balances) — previously implicit in v0.1's flattened `LoanDetails extends LoanListItem`;
   now confirmed as its own explicit visual section, which argues for *not* flattening in
   the UI layer even if the type still extends for convenience.
6. **Repayment Info** — **[NEW]** not explicitly modeled in v0.1 at all. Likely overlaps
   with `PromiseToPay`/`Receipt` data but as a dedicated section — needs its exact field
   list confirmed (flagged §7.5).
7. **Settlement Quote** — v0.1 had "generate settlement quote" only as a Loan Actions
   drawer action (§4.2.3); it's now also a persistent **section** on the details page
   (presumably showing the most recent quote, if any, with the generate action still
   available from here or from the actions drawer) — needs clarifying whether this
   section and the drawer action are the same feature shown twice or distinct (flagged
   §7.6).

**This is a structural correction to v0.1 §4.2.2**, which proposed *tabs as the primary
organizing device* for sections. The real app uses **stacked sections on one page**, with
tabs serving some other, still-unclear purpose at the bottom (possibly: Notes / PTPs /
Documents / Recovery / Call Log — the things v0.1 *did* correctly anticipate as
tab-worthy, just attached to the wrong part of the layout). Recommend: build the 7
sections as the primary page content per the spec above, and treat "tabs at the bottom"
as a second content zone for the kind of activity-log content (notes, PTPs, documents,
call log) that v0.1 already modeled in §6.2 — this reconciles both inputs without
contradicting either.

---

## 6. Corrects §6.5 (Role model) — roles are real now, not hypothetical

v0.1 proposed five guessed role names. **The real roles, visible directly in the
screenshot's role-tag list**, are:

- `DEAL ADMIN`
- `COLLECTIONS ADMIN AFS`
- `COLLECTIONS OFFICER AFS`
- `AFS HEAD`
- `PAYMENT ADMIN`
- `I SYSTEMS ADMIN`

This **replaces** the v0.1 §3 role table's invented `READONLY` / `COLLECTIONS_OFFICER` /
`DEAL_ADMIN` / `PAYMENT_ADMIN` / `AFS_HEAD` set. Update `Role` type accordingly:

```typescript
export type Role =
  | 'DEAL_ADMIN'
  | 'COLLECTIONS_ADMIN_AFS'
  | 'COLLECTIONS_OFFICER_AFS'
  | 'AFS_HEAD'
  | 'PAYMENT_ADMIN'
  | 'I_SYSTEMS_ADMIN';
```

Note there is **no visible `READONLY` role** in the real data — v0.1 invented this to
have *some* non-privileged role to gate against. **Open question** (§7.2): is there a
genuinely read-only role elsewhere, or does every real user have at least one
action-capable role, meaning the "disabled button with tooltip" pattern (v0.1 §8.3) needs
a different default-deny condition (e.g. absence of the specific role the action
requires, rather than a dedicated readonly flag)?

The user block in the sidebar confirms v0.1's general design instinct (avatar + name +
email + roles-as-chips) was directionally right — that part of the design-shell prompt
from the previous session doesn't need correction, just confirmation: **each role renders
as its own colored chip**, and the colors look like they follow the same
"deterministic-color-per-distinct-value" pattern as the table tags (DEAL ADMIN green,
COLLECTIONS ADMIN AFS purple, COLLECTIONS OFFICER AFS orange, AFS HEAD yellow, PAYMENT
ADMIN green, I SYSTEMS ADMIN purple) — reuse the same color-hashing utility for both
table-value tags and role tags rather than building two separate systems.

---

## 7. New open questions (additive to v0.1 §11, not replacing it)

1. **IFRS Status field shape** — is it a stage enum, a count badge, or does it vary by
   context (dash when not applicable, numeric badge when some condition is met)? This is
   the single highest-priority unknown since it affects a core type.
2. **Is there a real read-only role?** Or is gating purely "has/lacks the specific role an
   action requires," with no user ever being fully action-incapable?
3. **Color-hashing rule for tags** — confirm whether tag colors are: (a) a fixed mapping
   keyed by known values, (b) a hash-to-palette function for arbitrary values, or (c)
   something semantic we're not seeing (e.g. per-country). Matters for whether new/unseen
   values (a new Structure Code never seen before) get a stable color.
4. **Bottom tabs on Loan Details** — confirm these are Notes/PTPs/Documents/Recovery/Call
   Log (v0.1's guess) rather than something else; and confirm tabs don't gate/hide the 7
   sections above them (i.e., sections are always visible, tabs are an *additional* zone).
5. **Repayment Info section** — exact field list needed; currently unspecified.
6. **Settlement Quote: section vs. drawer action** — same feature surfaced twice, or two
   different things (e.g. section = history/most-recent-quote display, drawer = the
   generate action itself)?
7. **Column specs for PTP, Restructure Requests, Status Updates, Settled Deals, My deal
   admin requests tabs** — only Loans and Payment Notices have confirmed column lists so
   far; the other four tabs are being built with placeholder data until specified.
8. **Composite Acquire ID** — confirm whether `005304:004281`-style IDs are one field or
   two joined for display (matters for the type and for what gets copied/searched).

---

## 8. Summary of type changes required (action items, not prose)

- `Role` — replace enum values per §6 above.
- `CurrentUser` — add `country: string` and (pending §7.2) reconsider whether `isReadonly`
  is still a meaningful derived flag or should be replaced by "has zero action-granting
  roles" logic.
- `LoanListItem` — add `car: string`; restructure `operationalStatus` to carry its
  associated date; loosen `ifrsStatus`/`ifrsStage` typing until §7.1 is resolved; confirm
  `acquireId` composite-string handling per §7.8.
- `CustomerDetails` — `phone` and `email` need to support an edit/save flow, not just
  display — this likely means the Loan Details page needs local form state + a mocked
  "update customer contact" action added to `ILoanActionsApi`.
- New section-specific types likely needed: `PaymentHistoryMonth` (month label + paid/
  defaulted status, for the 6-month tag row), `RepaymentInfo` (shape TBD, §7.5),
  `SettlementQuote` (shape TBD, §7.6).
- `LoansListQuery` — add `country`, `classification`, `structureCode`, `statuses[]`,
  `loanCategory`, `dateRange` to match the real global filter bar (§3); default `pageSize`
  to 10 per the new business rule.