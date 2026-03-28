# Word Clock MVP — Design Spec

## Context

Build a QLOCKTWO-inspired word clock as a React + TypeScript web app. This MVP solves the core product questions (time logic, grid rendering, typography, transitions) before any native macOS screensaver work. The output is a polished fullscreen browser experience and a set of reusable, portable pure-logic modules.

Reference: `docs/image.png` (QLOCKTWO Classic, black, showing "IT IS HALF PAST SEVEN")

## Decisions

| Decision           | Choice                                     | Rationale                                              |
| ------------------ | ------------------------------------------ | ------------------------------------------------------ |
| Where to build     | `apps/web/src/`                            | Option A — fast, extract later if needed               |
| Font               | Geist Mono (`geist/font/mono`)             | Monospaced for even grid, geometric, clean             |
| Corner minute dots | Skip for MVP                               | Simplify scope                                         |
| Debug panel        | Skip for MVP (Phase 4)                     | Build Phases 1-3 first                                 |
| Styling            | Tailwind + CSS custom properties           | Tailwind for layout, custom props for glow/transitions |
| Grid rendering     | CSS Grid, one `<span>` per letter          | Simple, individually addressable                       |
| Time polling       | Every 15s, re-render only on phrase change | Efficient, no visual jitter                            |

## Architecture

Four layers, no coupling between logic and UI:

```
Date ──→ resolveTimeWords() ──→ WordKey[]
              │
              ▼
WordKey[] + layout ──→ resolveActiveCells() ──→ Set<CellId>
              │
              ▼
Set<CellId> ──→ ClockBoard ──→ ClockCell[] (CSS Grid)
```

### Layer 1: Time Engine (`src/core/time/`)

**`minuteRules.ts`** — Data-driven lookup table mapping 5-minute bucket → relation + word keys.

```ts
type MinuteRule = { relation: "PAST" | "TO" | "OCLOCK"; words: WordKey[] };
const MINUTE_RULES: Record<number, MinuteRule> = {
  0: { relation: "OCLOCK", words: [] },
  5: { relation: "PAST", words: ["MINUTE_FIVE"] },
  10: { relation: "PAST", words: ["MINUTE_TEN"] },
  15: { relation: "PAST", words: ["QUARTER"] },
  20: { relation: "PAST", words: ["TWENTY"] },
  25: { relation: "PAST", words: ["TWENTY", "MINUTE_FIVE"] },
  30: { relation: "PAST", words: ["HALF"] },
  35: { relation: "TO", words: ["TWENTY", "MINUTE_FIVE"] },
  40: { relation: "TO", words: ["TWENTY"] },
  45: { relation: "TO", words: ["QUARTER"] },
  50: { relation: "TO", words: ["MINUTE_TEN"] },
  55: { relation: "TO", words: ["MINUTE_FIVE"] },
};
```

**`hourWords.ts`** — Maps hour (1-12) to `WordKey`.

**`resolveTimeWords.ts`** — Pure function:

- Input: `Date`
- Output: `WordKey[]`
- Logic: floor minutes to 5-min bucket → lookup minute rule → determine display hour (current for PAST/OCLOCK, next for TO) → normalize to 12h → assemble `["IT", "IS", ...minuteWords, relation, hourWord, ??"OCLOCK"]`

### Layer 2: Layout Model (`src/core/layout/`)

**`types.ts`** — `WordKey`, `WordPlacement`, `CellId` types.

**`englishClassic.ts`** — Grid rows + word placement coordinates:

```ts
export const GRID = [
  "ITLISASAMPM",
  "ACQUARTERDC",
  "TWENTYFIVEX",
  "HALFSTENFTO",
  "PASTERUNINE",
  "ONESIXTHREE",
  "FOURFIVETWO",
  "EIGHTELEVEN",
  "SEVENTWELVE",
  "TENSEOCLOCK",
] as const;

export const WORDS: Record<WordKey, WordPlacement> = {
  IT: { row: 0, start: 0, end: 1 },
  IS: { row: 0, start: 3, end: 4 },
  QUARTER: { row: 1, start: 2, end: 8 },
  TWENTY: { row: 2, start: 0, end: 5 },
  MINUTE_FIVE: { row: 2, start: 6, end: 9 },
  HALF: { row: 3, start: 0, end: 3 },
  MINUTE_TEN: { row: 3, start: 5, end: 7 },
  TO: { row: 3, start: 9, end: 10 },
  PAST: { row: 4, start: 0, end: 3 },
  HOUR_NINE: { row: 4, start: 7, end: 10 },
  HOUR_ONE: { row: 5, start: 0, end: 2 },
  HOUR_SIX: { row: 5, start: 3, end: 5 },
  HOUR_THREE: { row: 5, start: 6, end: 10 },
  HOUR_FOUR: { row: 6, start: 0, end: 3 },
  HOUR_FIVE: { row: 6, start: 4, end: 7 },
  HOUR_TWO: { row: 6, start: 8, end: 10 },
  HOUR_EIGHT: { row: 7, start: 0, end: 4 },
  HOUR_ELEVEN: { row: 7, start: 5, end: 10 },
  HOUR_SEVEN: { row: 8, start: 0, end: 4 },
  HOUR_TWELVE: { row: 8, start: 5, end: 10 },
  HOUR_TEN: { row: 9, start: 0, end: 2 },
  OCLOCK: { row: 9, start: 5, end: 10 },
};
```

**`resolveActiveCells.ts`** — Pure function:

- Input: `WordKey[]`, word placements
- Output: `Set<CellId>` where `CellId = "${row}:${col}"`

### Layer 3: UI Components (`src/components/`)

**`WordClock.tsx`** — Orchestrator. Uses `useCurrentTime` hook → `resolveTimeWords` → `resolveActiveCells` → passes `Set<CellId>` to `ClockBoard`.

**`ClockBoard.tsx`** — Renders the 10x11 CSS Grid. Maps each grid row/col to a `ClockCell`. Props: grid rows, active cell set.

**`ClockCell.tsx`** — Single letter. Props: `char`, `active`. Applies active/inactive styling with CSS transition (200ms on `color`, `opacity`, `text-shadow`).

### Layer 4: Hooks (`src/hooks/`)

**`useCurrentTime.ts`** — Returns `WordKey[]`. Internally:

- `setInterval` every 15 seconds
- Computes `resolveTimeWords(new Date())`
- Only updates state when the stringified word array changes (avoids unnecessary re-renders)

### Styling

- **Background**: `bg-black` or `bg-zinc-950`
- **Active letters**: `text-white` + subtle `text-shadow: 0 0 8px rgba(255,255,255,0.3)`
- **Inactive letters**: `text-zinc-800` (barely visible, like the reference)
- **Transition**: `transition-all duration-200` on each cell
- **Layout**: Board centered with `flex items-center justify-center min-h-screen`. Board itself is square, sized by `min(vw, vh)` with padding.
- **Font**: Geist Mono, uppercase, generous tracking (`tracking-[0.3em]` or similar), tuned `leading` for square cell proportions.
- **No visible chrome**: Strip existing header, theme toggle, etc.

### Routing

Replace `apps/web/src/routes/index.tsx` content with `<WordClock />`. Keep TanStack Router in place (no reason to remove it), just make the single route render the clock fullscreen.

Strip the header from `__root.tsx`.

### Testing

Vitest unit tests in `apps/web/src/tests/`:

**`resolveTimeWords.test.ts`** — All 12 five-minute buckets + edge cases:

- `07:00` → `[IT, IS, HOUR_SEVEN, OCLOCK]`
- `07:05` → `[IT, IS, MINUTE_FIVE, PAST, HOUR_SEVEN]`
- `07:15` → `[IT, IS, QUARTER, PAST, HOUR_SEVEN]`
- `07:30` → `[IT, IS, HALF, PAST, HOUR_SEVEN]`
- `07:35` → `[IT, IS, TWENTY, MINUTE_FIVE, TO, HOUR_EIGHT]`
- `07:55` → `[IT, IS, MINUTE_FIVE, TO, HOUR_EIGHT]`
- `00:00` → `[IT, IS, HOUR_TWELVE, OCLOCK]`
- `12:00` → `[IT, IS, HOUR_TWELVE, OCLOCK]`
- `12:35` → `[IT, IS, TWENTY, MINUTE_FIVE, TO, HOUR_ONE]`
- `23:55` → `[IT, IS, MINUTE_FIVE, TO, HOUR_TWELVE]`

**`resolveActiveCells.test.ts`** — Validates correct cell coordinates, no out-of-bounds.

## Out of Scope

- Corner minute dots
- Debug/dev panel
- Multi-language
- Native macOS screensaver
- Electron/Tauri packaging
- Settings panel
- Backend/persistence

## Verification

1. `bun test` — all unit tests pass
2. `bun run dev` (in `apps/web/`) — clock renders in browser
3. Visual check: correct phrase for current time, inactive letters barely visible, active letters bright white
4. Resize browser window — board stays square and centered
5. Wait for 5-minute boundary — phrase transitions smoothly
