# JPC-Automation — Test Architecture

Playwright + TypeScript end-to-end framework for JackpotCity, structured as a layered
Page Object Model so that **every selector lives in exactly one place** and tests read as
business intent. One product, four regional sites (ZA / GH / MW / TZ) that share ~90% of the
codebase; regional differences are expressed as small, explicit overrides — never copies.

## Layers (top = closest to the test runner)

```
playwright.<REGION>.config.ts          # per-region runner; sets JPC_REGION + baseURL
        │
src/regions/<REGION>/tests/**.spec.ts  # thin entry points — just call a shared suite
        │
src/common/tests/*Suite.shared.ts      # the actual test cases (orchestration + assertions)
        │   ── uses ONLY Page Object / Component members, never raw selectors ──
src/common/pages/*.ts                  # Page Objects — each extends BasePage and owns a `loc` map
src/common/components/*.ts             # Component Objects for cross-page widgets (login/sign-up modals)
        │
src/common/locators/sel.ts             # selector builders (css/role/text/…) — the locator vocabulary
src/regions/<REGION>/locators.ts       # that region's selector OVERRIDES (only where it differs)
```

## Where selectors live — the single source of truth

Selectors are **typed code**, declared with the builders in `src/common/locators/sel.ts`
(`css`, `id`, `role`, `text`, `label`, `placeholder`, `title`, `xpath`, plus `first`/`at`/
`within`/`or`/`withText`). Each Page Object declares them once, in its `build('<group>', { … })`
map:

```ts
export class HeaderPage extends BasePage {
  readonly locators: Record<string, Locator>;
  constructor(page: Page, safeActions: SafeActions) {
    super(page, safeActions);
    this.locators = this.build('header', {
      menuButton:  first(role('button', { name: 'menu' })),
      loginCTA:    first(role('button', { name: 'Login' })),
      searchInput: first(css('#search')),
    });
  }
  async clickLoginCTA() { await this.safeActions.safeClick('loginCTA', this.locators.loginCTA); }
}
```

To change a selector you edit **one entry, in one file**. There is no JSON store and no
separate locator registry — open the Page Object and you see every selector and every action
for that page together.

## Regional differences — one override file per region

A region only declares the keys where its markup actually differs, in
`src/regions/<REGION>/locators.ts`:

```ts
export const ghOverrides: RegionOverrides = {
  search: {
    // GH search tiles are image-only; the name is on the card aria-label, not a text caption.
    searchGameTitle: css('[role="dialog"] a.game-card[href*="sea=true"][aria-label]:visible'),
  },
};
```

`BasePage.build()` merges the active region's overrides (chosen by `JPC_REGION`) over the base
map automatically. ZA is the base, so `zaOverrides` is empty. When a difference is *structural*
rather than a renamed selector (a feature is absent, or a flow differs), it is handled explicitly,
not via overrides:
- **Absent feature** → the shared test self-skips: `test.skip(await x.count() === 0, '… not in this region')`.
- **Different flow/layout** → a region-specific Page Object subclass (e.g. `regions/GH/pages/GamePage.ts`
  overrides `navigate()`) or a region-specific suite (e.g. `regions/GH/.../ghHomePage.spec.ts`).

## The one rule (enforced)

**No raw selector strings in `*.shared.ts` test files** — no `page.locator(...)`,
`getByRole/getByText/...`, or `pageObject.locators.x.locator(...)` chains. Every element a test
touches is reached through a Page Object getter / action / assertion, or a Component Object. The
guard test `src/regions/ZA/tests/modules/_architecture/architecture.guard.spec.ts` fails the build
if a raw selector appears in a shared suite. (`explorer.shared.ts` is exempt — it is a crawler.)

Inside Page Objects the convention is: **static selectors go in the `loc` map**; only
parameterised/composed locators (e.g. `navItem(id)`, `accountOption(name)`) are built in methods.

## Test suites: regression + smoke

Two flavours of test run share the same Page Objects:

- **Regression** — the full functional suites (`*NewSuite.shared.ts`), one per page/feature, called
  by the thin specs in `src/regions/<REGION>/tests/modules/<module>/`.
- **Smoke** — a curated fast pass over business-critical paths, in
  `src/common/tests/smokePriorityNewSuite.shared.ts` and `smokeSecondaryNewSuite.shared.ts`, wired
  per region under `tests/modules/smoke/`. Smoke **reuses the existing Page Object methods** (no new
  locators, no duplicated logic); every test title carries a `[smoke][priority]` / `[smoke][secondary]`
  tag so it can be filtered with `--grep "\[smoke\]"`.

Conventions used across both:
- **Region gating** — `const notIn = (...r) => !r.includes(process.env.JPC_REGION || 'ZA')`, then
  `test.skip(notIn('ZA'), '… ZA only')` for region-specific features (City Rewards, Stackpot, Blog =
  ZA; first/last name = ZA & MW; Preferred Language = TZ; etc.).
- **Account gating** — `test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', …)` on logged-in tests.
- **Un-automatable** — real-money wagers, irreversible RG locks (cooling-off / self-exclusion / set
  limit), FICA/Sumsub, real-OTP reset and restricted-account-only prompts are `test.fixme`'d **with a
  reason**, so they read as "known manual" rather than silently missing.

## Running & reporting (`runner.js`)

`runner.js` is the entry point for real runs. It executes a suite per region, captures the Playwright
JSON results, and renders a **PDF report + named screenshots** via the bundled Chromium:

```
reports/<timestamp>/<suite>/<REGION>/
    <REGION>-<suite>-report.pdf        # pass/fail table with status, time, error, embedded screenshot
    screenshots/<NNN>_<test title>.png # one per test, named by test case
```

```bash
node runner.js --suite=smoke --region=all          # or: npm run report:smoke
node runner.js --suite=regression --region=za      # one region
```

Suite→tests is resolved by **path** (smoke = the `smoke` dir; regression = all `modules/*` except
`smoke`, `_architecture`, `explorer`) to avoid regex escaping. Run folders older than 7 days are
pruned on each invocation. Logged-in suites run with `workers: 1` so parallel logins don't collide
on the shared account.

## Validation

- `npx -p typescript tsc -p tsconfig.json` — type-checks the whole project (no emit). Run this
  before committing; it catches missing destructures, bad selector options, etc.
  (`playwright --list` only transpiles — it does **not** type-check.)
- `npx playwright test --config=playwright.<REGION>.config.ts` — runs a region's suites.
- The architecture guard scans every `*NewSuite.shared.ts` (smoke included) for raw selectors.

## Removed features

**Limits** and **Update Password** were deleted (POs, suites, region specs, fixture wiring). Discovery
showed Update Password has no entry point in the current account UI, and the old suites only ever
"passed" because their `ScreenshotHelper` / `safeHighlight` helpers swallow failures. Re-introduce only
after a fresh discovery pass that confirms a real, assertable surface.

## Adding a new region (e.g. the TZ template)

1. `playwright.TZ.config.ts` sets `process.env.JPC_REGION = 'TZ'` and the baseURL.
2. `src/regions/TZ/locators.ts` exports `tzOverrides` (start empty).
3. `src/regions/TZ/fixtures/jackpotCityFixture.ts` wires the common Page Objects (+ any TZ subclasses).
4. `src/regions/TZ/json-data/JackpotCityData.json` holds TZ test data (credentials, etc.).
5. `src/regions/TZ/tests/modules/**/*.spec.ts` are thin specs that call the shared suites.
6. Run discovery, then add only the override keys / skips / subclasses where TZ actually differs.
