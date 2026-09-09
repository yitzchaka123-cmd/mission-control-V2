# Feature Specification: Docs and Files

**Feature Branch**: `019-docs-files`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §3.16, §3.17 · Depends on: 002, 003, 011

## Why this feature exists

Two honest views of the owner's documents: **Docs** lists what his connected accounts hold,
and **Files** shows the real folder tree of the workspace on his PC. The governing
constraint is that **file contents never leave the machine**.

v1's audit was blunt about both: *"Docs / Files can't open anything."* That is acceptable
only if the UI says so plainly — which is what this spec requires until ask-your-docs exists.

## User Scenarios & Testing

### User Story 1 — He can see what his office can see (Priority: P2)

Issac opens Docs. He sees which sources are connected, what is in them, and which are walled.

**Acceptance Scenarios**:
1. **Given** Docs, **When** loaded, **Then** a sources column lists All documents plus each
   real source; the first real source is "This PC · Hermes workspace".
2. **Given** no connected account, **When** shown, **Then** "Connect an account" is **locked
   with a reason**, not a dead button.
3. **Given** a Personal-only file, **When** listed, **Then** it carries a **Walled** badge and
   is unreachable from business rooms (011 User Story 4).
4. **Given** a file card, **When** it cannot be opened, **Then** the UI says why — *contents
   never leave the PC* — rather than presenting a card that does nothing when clicked.
5. **Given** a deep link, **When** followed, **Then** the named card is highlighted.

---

### User Story 2 — The real folder tree, read-only (Priority: P2)

**Acceptance Scenarios**:
1. **Given** Files, **When** loaded, **Then** it shows the real workspace tree from the PC —
   **read-only**, depth **4**, **400** entries, skipping dotfiles and `node_modules`, with
   sizes and modified times, and a "truncated" flag when limits are hit.
2. **Given** search, **When** used, **Then** matching files keep their parent folders visible.
3. **Given** the PC has not reported, **When** shown, **Then** it says so honestly rather than
   showing an empty tree.
4. **Given** a file's details, **When** opened, **Then** it states plainly: "This file lives
   on your PC — its contents never leave the machine."

### Edge Cases

- The workspace moves → the tree reports the new root; it does not show a stale one.
- A folder exceeds the entry cap → truncation is flagged, never silent.
- A source is disconnected → its files disappear from Docs with a plain note, not an error.
- A walled file appears in a business room's search → it does not. The wall is applied before
  results are built.

## Requirements

### Functional Requirements

- **FR-001**: Docs MUST list only real sources; unavailable actions MUST be locked with reasons.
- **FR-002**: Personal-walled files MUST be badged and unreachable from business rooms.
- **FR-003**: A card that cannot be opened MUST say why. **No dead ends** (003 FR-007).
- **FR-004**: Files MUST walk the workspace read-only with the stated limits and refresh every
  **10 minutes** on change (002 FR-013).
- **FR-005**: Search MUST preserve parent-folder context.
- **FR-006**: File contents MUST NOT be transmitted off the PC.
- **FR-007**: Honest empty states MUST distinguish "no files" from "the PC hasn't reported".
- **FR-008**: Layout MUST stack on phones and sit side-by-side on desktop.
- **FR-009**: Per-agent document permissions MUST be stated where they apply.

### Key Entities

- **Doc source** — name, kind, account, connected state, count.
- **Doc file** — name, kind, source, modified, access list, walled flag.
- **File node** — name, kind, size, modified, children, truncated flag.

## Success Criteria

- **SC-001**: Every listed source and file is real; nothing is sample data unlabelled.
- **SC-002**: No file content ever leaves the PC — verified at the transport layer.
- **SC-003**: Every non-actionable card explains itself. Zero dead ends.
- **SC-004**: "No files" and "PC hasn't reported" are never conflated.

## Assumptions

- Google Drive and Zoho WorkDrive sources arrive with their connections (011) and are
  scheduled with them.
- **Ask-your-docs** (retrieval over connected sources with citations, Personal walled) and
  **source-restricted answering** (locking a room to approved sources — e.g. the shul's
  halacha sites — with cited answers) are specified in FEATURES §3.16 and scheduled after
  Milestone 1. They are the reason this feature exists at all, and must not be forgotten.

## Must not repeat (from the 2026-09-02 audit)

*"Docs / Files can't open anything" presented as a working screen · cards that look
clickable and are not.*
