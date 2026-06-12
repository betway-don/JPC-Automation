# JPC-Automation — Test Architecture

Playwright + TypeScript end-to-end framework for JackpotCity, structured as a layered
Page Object Model so that **selectors live in exactly one place** and tests read as
business intent.

## Layers

```
playwright.<REGION>.config.ts        # per-region runner (ZA / GH / MW / TZ)
        │
src/regions/<REGION>/tests/**.spec.ts  # thin entry points — call a shared suite
        │
src/common/tests/*NewSuite.shared.ts   # the test cases (orchestration + assertions)
        │  ── uses only Page Object / Component members, never raw selectors ──
src/common/pages/*.ts                  # Page Objects  (extend BasePage)
src/common/components/*.ts             # Component Objects for cross-page widgets
        │
src/global/locators/locators.json      # the locator store (the ONLY place CSS/role text lives)
src/global/utils/file-utils/*          # locator loading + resolution
```

## The one rule

**No raw selectors in `*.shared.ts` test files.** That means none of:
`page.locator(...)`, `page.getByRole/getByText/getByLabel/getByPlaceholder/getByTitle(...)`,
or `pageObject.locators.x.locator(...)` chains.

Every element a test touches is reached through a Page Object getter, a Component Object,
or a Page Object action/assertion method. This is enforced by
`src/common/tests/architecture.guard.spec.ts`, which fails the build if a raw selector
appears in a shared suite.

Why: when a selector changes, it changes in one file (the locator store or the Page Object),
never across dozens of tests; and tests stay readable as behaviour
(`gamePage.playNowButton`, `gamePage.isFullscreen()`) rather than CSS.

## Page Objects

- Extend `BasePage`, which provides shared navigation/state (`goto`, `isDarkTheme`) and
  reusable assertions (`expectImageLoaded`, `expectScrollsRight`).
- Load their locator group from the store via the locator map (`locators.json`).
- Expose three kinds of public members:
  - **getters** — named `Locator`s (`get playNowButton()`, `get gameFrame()`).
  - **actions** — interactions (`openShareModal()`, `navigate()`, `accountOption(name)`).
  - **state probes** — `isFullscreen()`, `isDarkTheme()`.
- Tests perform `expect(...)` against those members; assertions stay in the tests.

## Component Objects

Cross-page widgets are modelled once under `src/common/components/` and reused by any suite
that surfaces them, so a change is made in a single place for every suite:
- `LoginModal` — the login dialog (fields, submit, error feedback, register/forgot links).
- `SignUpModal` — the two-step registration dialog, its multi-step flow, and the test-data
  generators (`makeSaId`, `randomMobile`, `uniqueEmail`).

They are injected via fixtures (`loginModal`, `signUpModal` in `jackpotCityFixture`).

## Enforcement

`src/regions/ZA/tests/modules/_architecture/architecture.guard.spec.ts` scans every
`*NewSuite.shared.ts` file and fails the run if a raw selector
(`page.locator`/`getBy*`/`*.locators.x.locator(...)`) appears in it. All eleven ZA NewSuites
pass this guard. `explorer.shared.ts` is exempt — it is a site crawler, selector-driven by design.

`page.evaluate(...)` DOM probes (theme class, image `naturalWidth`, scroll position) and
page-level operations (`page.goto`, `page.waitForURL`, `page.reload`) are NOT selectors and
remain in tests.

## Regions

`ZA` is the lead region and runs the hardened `*NewSuite` suites. `GH / MW / TZ` share the
same codebase and currently run the legacy `*.shared` suites; they migrate to the NewSuite
pattern as their region test cases are confirmed. Region-specific data (credentials, URLs)
lives under `src/regions/<REGION>/`.

## Locator store conventions

`locators.json` is keyed by group → array of `{ key, type, value, options?, nth? }`.
`type` is one of `css | role | text | id | xpath | label | title | placeholder | locator`.
Prefer stable hooks (`element-name=…`, ids, `aria-label`) over Tailwind class chains or
SVG `path[d^=…]` fragments.

## Running

```
npm run test:za   # or test:gh / test:mw / test:tz
```
Run outputs (reports, screenshots, traces) are gitignored; only source is committed.
