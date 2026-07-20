# Leddi Prime — PRD/TRD Patch Notes (v0.3)

Addendum to v0.1 (original PRD) and v0.2 (screenshot-based patch). This patch is based on
a screen recording walking through a real loan's Details page — it resolves most of the
open questions v0.2 raised about that page (§5, §7.4–7.6) and replaces several guesses
with exact, observed structure. As before: doesn't replace the earlier docs, only
corrects what's wrong and adds what's new. Where v0.2 conflicts with this patch, **this
patch wins** for anything related to the Loan Details page.

---

## 1. Resolves v0.2 §7.1 — IFRS Status field shape

**Answered.** In the real Repayment Info section, `IFRS Status` renders as a plain
numeric badge (observed value: `0`), shown as a small neutral gray pill — not a
stage-name tag, not the `STAGE_1/2/3` enum v0.1 originally proposed. v0.2's loosened type
(`string | number | null`) was the right call — **lock it down further now**: model it as
`ifrsStatus: number | null`, rendered as a small neutral badge. The `1+` blue badge seen
in the Loans table screenshot (v0.2 §3) is consistent with this — it's likely the same
numeric field, just styled with an accent color when greater than zero to draw attention
in the dense table view, vs. neutral styling here on the detail page. Recommend: one
shared `<IfrsStatusBadge value={number | null} />` component, used in both places, with a
prop or internal rule for "neutral when 0/null, accent-colored when truthy."

## 2. Resolves v0.2 §7.4 — bottom tabs are confirmed, and they're not what v0.1 guessed

**v0.1 guessed:** Notes & PTPs / Documents / Vehicle / Recovery / Call Log.
**Actual, confirmed via recording:** **Schedule, Payments, Promises, Notes, Files,
Receipts, Call Logs** — seven tabs, not five, sitting in their own bordered panel below
all 7 stacked sections (confirmed: sections are always visible, tabs are a strictly
separate content zone underneath — this resolves the second half of v0.2 §7.4 too).

This replaces v0.1's tab list. "Promises" is the product's own term for what v0.1 called
PTPs — keep `PromiseToPay` as the TS type name (already-written code doesn't need
renaming) but use "Promises" as the user-facing tab label, matching the real app's
vocabulary rather than the internal PTP abbreviation.

### Tab-by-tab confirmed structure:

**Schedule** (default-active tab) — a transaction ledger table, NOT a calendar/schedule
view despite the name. Columns: `#` (row number), Type (colored tag — observed values:
`CONVTAKEONCRBAL`, `BTR-CONVTAKEONCRBAL`, `INS`, `REC_CASH`, `BTR-REC_CASH`, `BTR-INS` —
these look like transaction-type codes, each getting its own deterministic tag color),
Effective Date (sortable, shown with ↑ indicator), Post Date (sortable), Narrative (free
text, often a structured description like "STRUCTURE TRANSFER IN (ARREARS) NG-03" or a
payment reference like "44541501_PAYMENT"), Amount (currency, signed — negative values
shown for outflows/reversals), Arrears Balance (currency, running balance, signed). Header
row has: an "Arrears Balance" / "Loan Balance" toggle (presumably switches which running
balance column displays — **[NEW OPEN QUESTION]**, not fully confirmed which toggle state
was active during the recording), "Advanced Filter," and "Refresh." This is clearly a
paginated/scrollable long table (rows observed well past #27) — should use the same
DataGrid pattern as Loans/Payment Notices, not a plain HTML table.

**Payments** — NOT a table. A **vertical timeline**: one row per month, each with a small
circular marker connected by a vertical line, showing `{Month} {Year} - NGN {amount}`
(e.g. "Jun 2026 - NGN 49,700", "Dec 2025 - NGN 248,500"). Ordered most-recent-first.
This is a distinct UI pattern from every other tab in the app — recommend a small
dedicated `PaymentsTimeline` component (MUI Timeline component is a natural fit) rather
than forcing it into the shared DataGrid pattern used elsewhere.

**Promises** — a table (confirmed small/simple, 1 result shown in the recording, with a
"1 result" footer count rather than full pagination — though that may just reflect this
particular loan having one promise on record, not a different pagination pattern).
Columns: ID, Captured By, Due Date, Promised Amount, PTP Status (tag — observed value
`PENDING`), Status Time. Header has a **"Capture PTP"** action button (top right, spans
all tabs in this section it seems, not Promises-specific — **[NEW OPEN QUESTION]**, the
recording shows "Capture PTP" present in the header even while other tabs were active, so
confirm whether this action is global-to-the-tab-strip or specifically tied to Promises)
and a "Reload" button.

**Notes** — the richest tab. Has:
- A rich-text editor toolbar: paragraph-style dropdown ("Normal"), Bold, Italic,
  Underline, Strikethrough, Blockquote, Code, Text Color, Highlight, Ordered List,
  Unordered List, Indent, Outdent, Link, Image, Clear Formatting.
- A **"Select Channel"** dropdown, marked as a **required field** (validation message
  "This field is required" observed when empty) — this is the note's communication
  channel (likely EMAIL / WHATSAPP / INTERNAL / SMS-disabled, matching the original PRD's
  multi-channel note concept from v0.1 §6.2, now confirmed as a real required selector
  rather than an assumed `LoanNote.type` enum).
- An **"Add Note"** primary button.
- Below the editor: **sub-tabs** "Prime Notes" / "Nest Comments" — meaning notes are
  scoped per-app (Prime's own notes vs. comments originating from the Nest recovery app)
  — this is a real cross-app data relationship, not something v0.1 anticipated at all.
- The notes feed itself shows, per note: author name (italicized), timestamp with explicit
  timezone (e.g. "Tue Jun 23 2026 08:11:44 GMT+0100 (West Africa Time)"), a slash-separated
  metadata line (observed: "/ EMAIL / ccc" — likely channel / some secondary tag), and the
  full note body, which can itself be a long structured document (the observed example is
  a complete demand-notice email draft with a subject-like heading and several paragraphs).

This significantly upgrades v0.1's flat `LoanNote { type, content, createdBy, createdAt }`
model — recommend extending it: add `channel: string` (required, matches Select Channel),
`appSource: 'PRIME' | 'NEST'` (or similar, matches the Prime Notes / Nest Comments split),
and treat `content` as rich text (HTML or a structured doc format) rather than plain
string, since the editor is a full rich-text toolbar, not a plain textarea.

**Files** — tab exists, not opened in the recording. **No confirmed structure.** Build per
v0.1's original `LoanDocument` model (id, fileName, fileType, uploadedAt, url) as a
placeholder until a real walkthrough of this tab is available.

**Receipts** — tab exists, not opened in the recording. **No confirmed structure.** Build
per v0.1's original `Receipt` model (id, amount, receivedAt, reference) as a placeholder,
same caveat as Files.

**Call Logs** — tab exists, not opened in the recording. **No confirmed structure.** Build
per v0.1's original `CallLogEntry` model (id, phoneNumber, direction, durationSeconds,
occurredAt) as a placeholder, same caveat.

## 3. Resolves v0.2 §5 — exact section names, order, and content (replaces the guess)

**Confirmed order, top to bottom** (this is the actual order observed scrolling through
the page, replacing v0.1 §4.2.2's tab-based guess and refining v0.2 §5's section list):

1. **(unnamed header region, mostly scrolled past)** — three status tags side by side:
   Operational Status (`ACTIVE`, green), Deal Status (`ACTIVE`, green), Loan Category
   (`Uncategorized`, yellow) — **[NEW OPEN QUESTION]** whether this row has its own
   section heading (e.g. "Statuses") above the part the recording captured, since the
   very top of the page wasn't visible in the recording. v0.1/v0.2 both assumed a
   "Statuses" section heading exists — keep that assumption, just flag it's still not
   directly confirmed by a screenshot/frame.
2. Directly below the status tags: **Last 6 Months Payment History** — NOT in a separate
   section, it's part of the same status block. Renders as six month-abbreviation tags
   (Jan, Feb, Mar, Apr, May, Jun observed, all green = on-track in this example) with the
   caption "Last 6 Months Payment History" beneath them. **Confirms v0.1/v0.2's "defaulted
   months in red" requirement** — just confirms the visual form (small rounded tags, not
   a calendar grid) and that it's always exactly 6 tags, most-recent-month-last (Jan→Jun
   chronological order, not reverse).
3. Same block also includes, to the right of the payment-history tags: **Last Payment**
   (amount + date, e.g. "NGN 49,700.00 / Mon, Jun 01, 2026"), **Arrears Balance** (signed
   currency, e.g. "− NGN 262,367.76"), **Total Paid** (currency, e.g. "NGN 3,813,055.00").
   This entire block (status tags + 6-month history + last payment + arrears + total
   paid) is one cohesive "Statuses" section, exactly matching v0.1/v0.2's original
   description — just now with exact field formats and layout confirmed.
4. **Customer Details** — confirmed fields: Actor ID, Full Name, Phone Number (editable —
   not directly confirmed as inline-editable in this recording, but a pencil/edit icon
   pattern appears elsewhere in this section for related sub-blocks, see below), Address,
   Business Name, Email, Birthday, City (tag-styled, e.g. "lagos" in green). Plus two
   structured sub-blocks: **Alternative phone numbers** (list + "New Number" and "Delete /
   Edit Numbers" actions) and **Alternative emails** (list + "New email" action), and
   **Alternative addresses** (list + "New address" action). This is substantially richer
   than v0.1's flat `CustomerDetails` type — the "alternative contact info as its own
   manageable list" pattern wasn't anticipated at all.
5. **Account Manager Details** — Name, Email, Territory (tag-styled), Territory
   Supervisor. Observed all "Not Available" for this particular loan — confirms this
   section needs a clean empty/unavailable state, not just optimistic field rendering.
6. **Car Details** — Car ID, Car (make/model/year as one string, e.g. "TOYOTA COROLLA
   2008"), VIN, Value (currency), Body Type (tag), Reg. Number.
7. **Loan Commercials** — **[NEW, not in v0.1 or v0.2 at all]** — Migrated (Yes/No tag),
   Interest Rate (%), Interest Type (tag, e.g. "Fixed"), Structure Code (tag), Loan Term
   (months), Remaining Term (months). This is a distinct section from "Loan Details" —
   v0.2 had conflated these; they're separate per the real app.
8. **Repayment Info** — IFRS Status (numeric badge, see §1 above), Next Installment
   (date), Installment (currency amount), Capital Balance (currency), Total Exposure
   (currency), 1st Installment Date (date), Installment Day (ordinal day-of-month, e.g.
   "17th"), Arrears Balance (currency, signed — appears again here, redundant with the
   Statuses block, which is fine, real apps repeat key numbers), Days in Arrears (integer
   + "Day(s)"), Last Demand Notice (date).
9. **Settlement Quote** — has its own header-right action: **"Generate Quote"**. Body
   shows an info-styled empty state when none exists: **"No Settlement Quote Found!"**
   (blue info banner with icon) — confirms v0.1's drawer action and this section are
   likely the same underlying feature surfaced in two places (the section shows
   current/most-recent state; the drawer action — and this section's own "Generate Quote"
   button — both trigger generation). Resolves v0.2 §7.6: they're the same feature, not
   two distinct ones — implement once, reference from both surfaces.
10. **Loan Details** — Acquire ID, Origination ID, Classification (tag), Maturity date,
    Last status change date, Loandisk ID, Source (tag, e.g. "ONLINE"), Inception Date,
    Residual balance. Also displays, top-right of this section specifically: a **PTP
    Rate** percentage (e.g. "100%" in green) — a computed metric, not a stored field;
    likely `keptPromises / totalPromises` or similar — **[NEW OPEN QUESTION]** exact
    calculation unconfirmed, model as a precomputed number from the mock layer for now.

This section ordering (Statuses → Customer → Account Manager → Car → Loan Commercials →
Repayment Info → Settlement Quote → Loan Details) is **the confirmed real order** and
should be treated as authoritative, superseding both v0.1's guessed tab grouping and
v0.2's restated-but-not-yet-fully-ordered section list. Note **Loan Details is last**,
not first/early as both prior docs assumed — it functions more like a compact technical
reference block at the bottom of the page than a headline section.

## 4. New — sidebar account block has functional controls beyond the role chips

The recording shows, below the role chips (already covered in v0.2 §6), two controls not
previously documented:
- **"Update Release Timestamp"** — a green button.
- **"Force Refresh?"** — a labeled checkbox/toggle.

**[NEW OPEN QUESTION]** — exact purpose of both unconfirmed from this recording alone
(no interaction with either was shown). Best-guess based on naming: likely dev/ops utility
controls (cache-busting, forcing a data resync) rather than end-user collections features.
**Decision for this phase:** render both in the sidebar in the correct position (matching
the real layout), wire them to no-op mock handlers, and flag clearly that their real
behavior needs confirming before they do anything meaningful.

## 5. Updated open questions list (additive to v0.2 §7)

1. ~~IFRS Status field shape~~ — **RESOLVED**, see §1.
2. ~~Bottom tabs identity~~ — **RESOLVED**, see §2.
3. ~~Settlement Quote: section vs. drawer action~~ — **RESOLVED** (same feature), see §3.9.
4. **NEW:** Does the Statuses block have its own visible section heading? (top of page
   wasn't captured in the recording)
5. **NEW:** Schedule tab's "Arrears Balance / Loan Balance" toggle — confirm what each
   state actually changes in the table.
6. **NEW:** Is "Capture PTP" specific to the Promises tab, or a persistent action across
   the whole tab strip?
7. **NEW:** Notes' "Select Channel" — confirm the full list of channel options.
8. **NEW:** Notes' "Prime Notes" vs "Nest Comments" — confirm whether Nest Comments are
   read-only (pulled from the Nest app) or also editable from within Prime.
9. **NEW:** PTP Rate calculation — confirm the formula.
10. **NEW:** "Update Release Timestamp" / "Force Refresh?" — confirm real purpose/behavior.
11. **Still open from v0.2:** Repayment Info section now has a full confirmed field list
    (§3.8 above) — this resolves v0.2 §7.5's "exact field list needed," consider closed.
12. **Still open from v0.2 §7.3:** tag color-hashing rule — recording doesn't add new
    evidence either way, still unresolved.
13. Files, Receipts, Call Logs tab structures — still completely unconfirmed; building as
    placeholders per §2 above until a walkthrough of those specific tabs is available.

---

## 6. Summary of type changes required (action items)

- `LoanListItem` / detail-level type: lock `ifrsStatus: number | null` (not
  string-or-number) per §1.
- New shared component: `IfrsStatusBadge`.
- Rename tab label "PTPs" → "Promises" in UI copy (keep `PromiseToPay` as the type name).
- Extend `LoanNote`: add `channel: string`, `appSource: 'PRIME' | 'NEST'`; treat `content`
  as rich text, not plain string.
- New type: `PaymentTimelineEntry { month: string; year: number; amount: number }` for the
  Payments tab's vertical timeline (distinct from `Receipt`).
- New type: `ScheduleEntry { rowNumber: number; type: string; effectiveDate: string;
  postDate: string; narrative: string; amount: number; arrearsBalance: number }` for the
  Schedule tab's ledger table.
- `CustomerDetails`: add structured sub-lists — `alternativePhoneNumbers: { number: string;
  label?: string }[]`, `alternativeEmails: string[]`, `alternativeAddresses: string[]` —
  each needs add/edit/delete mock actions.
- New section type/fields: `LoanCommercials { migrated: boolean; interestRate: number;
  interestType: string; structureCode: string; loanTermMonths: number;
  remainingTermMonths: number }` — distinct from the existing `LoanDetails` fields.
- `RepaymentInfo` (placeholder from v0.2) — now has a confirmed field list, see §3.8;
  promote from "TBD shape" to a locked interface.
- Add `ptpRate: number` (0–100) to the loan-details-level type, sourced from mock data for
  now per the open calculation question (§5.9).
- `CurrentUser` or a new sidebar-state concern: add mock state/handlers for
  `updateReleaseTimestamp()` and a `forceRefresh: boolean` toggle — no-op for now.