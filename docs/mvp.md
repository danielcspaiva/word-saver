Design Doc: TS MVP for QLOCKTWO-Inspired Word Clock

1. Overview

This MVP is a TypeScript-based prototype of a typographic word clock inspired by QLOCKTWO.

It is not a true macOS screensaver yet.

Its purpose is to solve the hardest product questions first:
• word-clock time logic
• letter-grid modeling
• highlighting behavior
• typography and spacing
• transitions
• fullscreen / kiosk-like presentation

The MVP should feel visually close to the intended final product, while staying fast to build and easy to iterate on.

The output of this phase should be:
• a polished local/browser app
• a reusable time engine
• a reusable layout model
• a renderer that can later inform a native macOS implementation

⸻

2. Goals

Primary goals
• Build a visually convincing word clock in TypeScript
• Resolve time into words correctly at 5-minute intervals
• Render a QLOCKTWO-style letter grid
• Highlight active letters cleanly
• Support a fullscreen presentation mode
• Make the core logic portable and testable

Secondary goals
• Make it easy to tweak fonts, spacing, glow, colors, and transitions
• Establish a clean data model for future native porting
• Create a strong “design lab” for the product

Non-goals for MVP
• No native macOS screensaver integration
• No Electron/Tauri packaging in V1 unless trivial
• No multi-language support yet
• No settings panel beyond maybe a dev control panel
• No backend
• No persistence requirements

⸻

3. Why this MVP exists

The native macOS screensaver is not the right place to discover:
• whether the layout feels premium
• whether the typography works
• whether the time phrasing feels right
• whether the transitions feel elegant
• whether the board proportions look correct

Those should be solved first in a fast iteration environment.

This MVP is the fastest way to get something real and visually high quality using existing TS/React skills.

⸻

4. Recommended stack

Preferred stack
• React
• TypeScript
• Vite
• CSS Modules, Tailwind, or plain CSS
• optional: Framer Motion for subtle transitions

Why
• fast startup
• minimal framework overhead
• ideal for a single-screen visual app
• easy fullscreen presentation
• easy typography/layout iteration
• easy future wrapping if desired

Not recommended for MVP
• Next.js, unless you specifically want a marketing site in the same repo
• Electron as the starting point
• Tauri as the starting point
• canvas/WebGL unless needed later

This product is mostly layout + state, so standard DOM rendering is enough for the MVP.

⸻

5. Product concept

The app displays time as illuminated words inside a fixed grid of letters.

Examples:
• IT IS SEVEN O’CLOCK
• IT IS TEN PAST THREE
• IT IS QUARTER TO EIGHT
• IT IS HALF PAST SIX

The board is the product.

It should feel:
• quiet
• geometric
• premium
• minimal
• architectural
• object-like, not app-like

Inactive letters are visible but subdued. Active letters glow or brighten clearly.

⸻

6. MVP user experience

6.1 Main screen

The MVP opens directly into a single-screen clock view with:
• centered square board
• dark background
• dim inactive letters
• bright active letters
• responsive sizing
• no visible chrome by default

6.2 Fullscreen mode

The app should support fullscreen easily, either through:
• browser fullscreen API
• a clean UI toggle
• or simply a layout that already works beautifully in a fullscreen browser window

6.3 Update behavior

The clock updates automatically based on current system time.

Recommended behavior:
• compute current phrase every second or every 15 seconds
• only visually transition when the active phrase changes

6.4 Optional dev overlay

During MVP, it is useful to have a hidden or toggled dev overlay to:
• simulate time manually
• test all minute buckets quickly
• toggle theme constants
• inspect active words

This does not need to be part of the final visual experience.

⸻

7. Functional requirements

7.1 Time resolution

Support:
• current local system time
• English word-clock phrases
• 5-minute intervals
• floor to the current 5-minute bucket

Examples:
• 7:00 → IT IS SEVEN O’CLOCK
• 7:05 → IT IS FIVE PAST SEVEN
• 7:15 → IT IS QUARTER PAST SEVEN
• 7:30 → IT IS HALF PAST SEVEN
• 7:35 → IT IS TWENTY FIVE TO EIGHT
• 7:55 → IT IS FIVE TO EIGHT

7.2 Grid rendering

Render a fixed character grid where:
• every row has equal length
• every letter is individually addressable
• highlighted words map to precise character positions

7.3 Highlighting

The app must:
• know which words are active
• translate those words into active grid cells
• render those cells with active styling
• leave all others inactive

7.4 Responsive layout

The board must:
• stay square
• stay centered
• scale with viewport size
• preserve visual rhythm and spacing

7.5 Transitions

When the phrase changes, the board should update with a subtle transition.

Recommended MVP:
• opacity/color transition on letters
• no dramatic movement
• no over-animation

⸻

8. Non-functional requirements
   • simple startup
   • fast rendering
   • visually stable
   • easy to test
   • easy to tweak
   • architecture should not assume English forever
   • logic should be deterministic and unit-testable

⸻

9. Architecture

The MVP should be split into 4 layers.

9.1 Time engine

Pure TypeScript that converts a Date into semantic word keys.

Example output:

["IT", "IS", "HALF", "PAST", "SEVEN"]

This layer should contain no UI code.

9.2 Layout definition

Defines:
• the board rows
• the word placement coordinates
• the semantic word keys used by the engine

This should be entirely data-driven.

9.3 Active cell resolution

Converts active word keys into active cell coordinates.

This layer bridges logic and rendering.

9.4 UI renderer

React components that:
• render the board
• style cells
• handle transitions
• handle fullscreen presentation
• optionally expose a debug mode

⸻

10. Data model

10.1 Grid definition

A fixed list of strings:

export const ENGLISH_CLASSIC_GRID = [
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
] as const

10.2 Word keys

Use semantic keys, not raw text, so the system stays future-proof.

Example:

export type WordKey =
| "IT"
| "IS"
| "MINUTE_FIVE"
| "MINUTE_TEN"
| "QUARTER"
| "TWENTY"
| "HALF"
| "PAST"
| "TO"
| "HOUR_ONE"
| "HOUR_TWO"
| "HOUR_THREE"
| "HOUR_FOUR"
| "HOUR_FIVE"
| "HOUR_SIX"
| "HOUR_SEVEN"
| "HOUR_EIGHT"
| "HOUR_NINE"
| "HOUR_TEN"
| "HOUR_ELEVEN"
| "HOUR_TWELVE"
| "OCLOCK";

10.3 Word placements

Each key maps to row and column span.

export type WordPlacement = {
row: number;
start: number;
end: number;
};

Then:

export const ENGLISH_CLASSIC_WORDS: Record<WordKey, WordPlacement> = {
IT: { row: 0, start: 0, end: 1 },
IS: { row: 0, start: 3, end: 4 },
QUARTER: { row: 1, start: 2, end: 8 },
// ...
};

10.4 Active cells

The renderer should consume a set of active cell IDs like:

type CellId = `${number}:${number}`;

This makes UI rendering simple and efficient.

⸻

11. Time-to-words logic

11.1 Input
• Date

11.2 Output
• WordKey[]

11.3 Logic steps 1. get local hours and minutes 2. floor minute to 5-minute bucket 3. determine phrase words 4. determine displayed hour 5. normalize to 12-hour format 6. prepend IT and IS 7. append hour word and optional OCLOCK

11.4 Minute phrase table

Recommended to keep this data-driven:

const MINUTE_RULES: Record<
number,
{ relation: "PAST" | "TO" | "OCLOCK"; words: WordKey[] }

> = {
> 0: { relation: "OCLOCK", words: [] },
> 5: { relation: "PAST", words: ["MINUTE_FIVE"] },
> 10: { relation: "PAST", words: ["MINUTE_TEN"] },
> 15: { relation: "PAST", words: ["QUARTER"] },
> 20: { relation: "PAST", words: ["TWENTY"] },
> 25: { relation: "PAST", words: ["TWENTY", "MINUTE_FIVE"] },
> 30: { relation: "PAST", words: ["HALF"] },
> 35: { relation: "TO", words: ["TWENTY", "MINUTE_FIVE"] },
> 40: { relation: "TO", words: ["TWENTY"] },
> 45: { relation: "TO", words: ["QUARTER"] },
> 50: { relation: "TO", words: ["MINUTE_TEN"] },
> 55: { relation: "TO", words: ["MINUTE_FIVE"] },
> };

11.5 Edge cases

Must test:
• 00:00 → TWELVE O’CLOCK
• 12:00 → TWELVE O’CLOCK
• 12:35 → TWENTY FIVE TO ONE
• 23:55 → FIVE TO TWELVE

⸻

12. UI design direction

12.1 Composition

The board should dominate the screen without touching the edges.

Recommended:
• center both vertically and horizontally
• use the shorter viewport dimension to define size
• keep generous outer margins

12.2 Letter rendering

Each letter should be an individually renderable element.

Options:
• one <span> per letter inside a CSS grid
• one flex row per line
• CSS grid is preferred

Each cell should know:
• its character
• whether it is active
• its position

12.3 Typography

Typography is the product.

Desired feel:
• geometric sans
• narrow-ish or clean monoline forms
• generous tracking
• premium spacing
• no default “web app” vibe

You may prototype with:
• system sans first
• then swap to a bundled font if needed

The choice should prioritize:
• clarity
• elegance
• even rhythm
• strong inactive/active contrast

12.4 Color and style

Recommended MVP palette:
• near-black or dark navy background
• muted gray inactive letters
• bright white active letters
• subtle glow only if it adds quality

The glow should not feel gamer-ish or neon-heavy unless intentionally stylized.

12.5 Transitions

Letter state changes should animate via:
• color
• opacity
• text-shadow

Recommended duration:
• 150ms to 300ms

Avoid constant motion.

⸻

13. Component structure

Suggested components:

src/
app/
App.tsx
components/
WordClock.tsx
ClockBoard.tsx
ClockCell.tsx
DebugPanel.tsx
core/
time/
resolveTimeWords.ts
minuteRules.ts
hourWords.ts
layout/
englishClassic.ts
resolveActiveCells.ts
types.ts
hooks/
useCurrentTime.ts
useFullscreen.ts
styles/
globals.css
clock.css
tests/
resolveTimeWords.test.ts
resolveActiveCells.test.ts

⸻

14. Suggested responsibilities

resolveTimeWords.ts

Pure function:
• input: Date
• output: WordKey[]

resolveActiveCells.ts

Pure function:
• input: WordKey[], layout
• output: Set<CellId>

useCurrentTime.ts

Hook that:
• tracks current time
• re-evaluates periodically
• only triggers phrase updates when needed

ClockBoard.tsx

Renders:
• rows
• cells
• active/inactive states

ClockCell.tsx

Receives:
• character
• active state

Applies:
• styling
• transitions

DebugPanel.tsx

Optional:
• lets you set hour/minute manually
• toggle real time / simulated time
• cycle all phrase states

⸻

15. UX details for MVP

Default mode
• show the current system time
• clean full-window clock
• no controls visible

Dev mode
• activated with a keypress or local flag
• overlay should allow:
• test a specific time
• view active words
• cycle minute buckets

Fullscreen
• optional fullscreen button for testing
• keyboard shortcut support is a plus

⸻

16. Testing plan

16.1 Unit tests

resolveTimeWords

Test every 5-minute bucket plus edge cases.

Examples:
• 07:00
• 07:05
• 07:10
• 07:15
• 07:25
• 07:30
• 07:35
• 07:45
• 07:55
• 00:00
• 12:00
• 23:55

resolveActiveCells

Test that:
• correct cells are activated
• no out-of-bounds positions exist
• highlighted text matches intended words

16.2 Visual/manual tests

Check:
• scaling on narrow screens
• scaling on large desktop monitors
• full-window appearance
• phrase transitions
• no visual jitter when time updates

⸻

17. Implementation phases

Phase 1: pure logic

Build:
• types
• grid definition
• word placements
• time resolver
• tests

Success:
• CLI/log output can correctly produce phrases from a given Date

Phase 2: basic UI

Build:
• clock board renderer
• active/inactive cells
• responsive square layout

Success:
• browser app visually renders correct phrase

Phase 3: polish

Add:
• transitions
• better typography
• spacing tuning
• theme tuning

Success:
• app looks intentional and premium

Phase 4: dev tooling

Add:
• time simulation
• debug overlay
• fullscreen toggle

Success:
• easy to visually inspect all states quickly

Phase 5: optional packaging

Optionally wrap later with:
• Tauri
• Electron

Only after the web MVP feels complete

⸻

18. Future path to native screensaver

The MVP should be built so that its key concepts can transfer cleanly to a native implementation later.

What should survive the port:
• semantic word keys
• layout model
• time resolution rules
• theme constants
• visual proportions
• transition philosophy

What likely gets rewritten:
• React components
• DOM/CSS rendering
• fullscreen/browser behavior

This is okay. The MVP is not throwaway if the core models are well designed.

⸻

19. Risks

Risk 1: looks too webby

A technically correct implementation can still look like a generic React project.

Mitigation:
• invest in spacing, font choice, proportions, and restraint

Risk 2: overengineering

It is easy to prematurely optimize for themes, languages, plugins, etc.

Mitigation:
• one layout
• one theme
• one polished board
• clean but simple abstractions

Risk 3: logic leaks into UI

If phrase logic gets mixed into React components, the future native port becomes harder.

Mitigation:
• keep all phrase resolution pure and separate

⸻

20. V1 acceptance criteria

The TS MVP is done when:
• it correctly displays English word-clock time in 5-minute intervals
• it renders a polished letter grid with active highlighting
• it looks good in a fullscreen browser window
• it scales well across common desktop sizes
• it has tests for time resolution
• the core logic is isolated from the UI
• it is strong enough visually and structurally to serve as the blueprint for the native screensaver

⸻

21. Short implementation summary for the agent

Build a React + TypeScript + Vite MVP of a QLOCKTWO-style word clock.

Prioritize:
• data-driven layout
• pure time resolution logic
• clean grid rendering
• responsive square composition
• premium typography/spacing
• subtle transitions

Do not prioritize:
• native integration
• packaging
• settings complexity
• multiple languages

The MVP should function as both:
• a polished standalone prototype
• the design/system reference for a later native macOS screensaver
