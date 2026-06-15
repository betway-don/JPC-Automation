# JPC-Automation

End-to-end test automation for **JackpotCity** online casino, built with **Playwright + TypeScript**.

One product runs as four regional sites that share ~90% of their behaviour, so the suite is
written **once** and run per region:

| Region | Site | Config |
| --- | --- | --- |
| ZA (base) | jackpotcity.co.za | `playwright.ZA.config.ts` |
| GH | jackpotcitycasino.com.gh | `playwright.GH.config.ts` |
| MW | jackpotcitycasino.mw | `playwright.MW.config.ts` |
| TZ | en.jackpotcitycasino.co.tz | `playwright.TZ.config.ts` |

## Setup

```bash
npm install
npx playwright install                                  # one-time: browsers
```

## Run + report (the usual way)

`runner.js` runs a **suite** (`regression` or `smoke`) across one or more regions and produces a
PDF + named screenshots per region. This is what you use for "run the smoke checks" / "run the
regression for region X" requests.

```bash
npm run report:smoke                                    # smoke, all regions (za, gh, tz)
npm run report:regression                               # regression, all regions

node runner.js --suite=smoke      --region=za           # one region, smoke
node runner.js --suite=regression --region=gh           # one region, regression
node runner.js --suite=smoke      --region=za --grep="SP-LOG-001"   # narrow to one/few tests
node runner.js --suite=smoke      --region=za --workers=4           # run in parallel (see note)
```

Any flag the runner doesn't own (`--suite/--region/--grep/--spec/--mode`) is **passed through to
Playwright** and overrides the region config — so `--workers=N`, `--retries=N`, `--headed`,
`--timeout=N` all work. On **`--workers`**: raise it for **logged-out** suites
(home/search/promotions/signup) for a big speed-up; keep it at **1** for **logged-in** suites (Tlog,
Deposit, City Rewards, game hamburger) because they share one test account and parallel logins
collide / get rate-limited.

Output lands under `reports/` in exactly this shape, and run folders older than **7 days** are
pruned automatically:

```
reports/<YYYY-MM-DD_HH-mm-ss>/<suite>/<REGION>/
    <REGION>-<suite>-report.pdf        # printable pass/fail table — status, time, error, screenshot
    screenshots/<NNN>_<test title>.png # one image per test, named by test case
```

What each suite means:
- **smoke** = the curated priority + secondary checks in `tests/modules/smoke` (tagged `[smoke]`).
- **regression** = every functional module suite *except* `smoke`, `_architecture`, `explorer`.

`--region=all` runs **za, gh, tz**. MW is geo-blocked from our location, so attempt it only
explicitly with `--region=mw`.

## Run directly with Playwright (ad-hoc / debugging)

```bash
npx playwright test --config=playwright.ZA.config.ts                                       # a whole region
npx playwright test --config=playwright.GH.config.ts src/regions/GH/tests/modules/header   # one suite
npx playwright test --config=playwright.ZA.config.ts --grep "\[smoke\]"                    # only smoke tests
npx -p typescript tsc -p tsconfig.json                  # type-check everything (no emit) — run before committing
```

## How it's organised

```
src/common/        region-agnostic engine
  pages/            Page Objects — one per page; each owns its selectors in a `build()` map
  components/        Component Objects for cross-page widgets (login / sign-up modals)
  tests/            *Suite.shared.ts — the actual test cases (no raw selectors live here)
                    + smokePriorityNewSuite / smokeSecondaryNewSuite — thin smoke layer reusing the POs
  locators/sel.ts   the selector builders (css/role/text/…)
  actions/, utils/

src/regions/<R>/   per-region wiring
  locators.ts       selector OVERRIDES — only where this region's markup differs
  fixtures/          Playwright fixtures that construct the Page Objects
  pages/             region-specific Page Object subclasses (only when a flow differs)
  json-data/         region test data (credentials, etc.)
  tests/modules/     thin specs that call the shared suites (incl. modules/smoke/)

runner.js          test runner + PDF/screenshot report builder (see "Run + report")
reports/           generated reports, gitignored, pruned after 7 days
```

**Golden rule:** a selector is defined in exactly one place — a Page Object's `build()` map
(or a region override). Tests never contain raw selectors. See **[ARCHITECTURE.md](./ARCHITECTURE.md)**
for the full model, the enforced rules, and how to add a region.

## Region status

- **ZA** — base region, fully discovered. **GH / TZ** — live-discovered; they share ~90% with ZA
  but their home page is a content/SEO landing page (own `Gh/TzHomePage` + spec), search tiles are
  image-only (one override), and TZ adds Low Data / Sitemap nav. **MW** — code-complete but the live
  site is geo-blocked (HTTP 403) from our location, so it can't be validated here.
- **Limits & Update Password** were removed: discovery showed Update Password has no entry point in
  the current account UI, and the old suites only "passed" because their screenshot/highlight helpers
  swallowed errors. Don't re-add them without a fresh discovery pass.

## Notes for whoever picks this up

- Set `JPC_ACCOUNT_RESTRICTED=1` to skip logged-in tests when no verified account is available.
  Login otherwise works; if a logged-in test fails on a `depositCTA` timeout it's usually the site's
  intermittent "Network error" banner — retries (configured) ride it out.
- The architecture guard (`src/regions/ZA/tests/modules/_architecture`) fails the build if a raw
  selector sneaks into a shared suite (smoke suites included).
- Logged-in tests run serially (`workers: 1`) to avoid concurrent logins colliding on the one shared
  account. Unsafe/irreversible checks (real wagers, RG cooling-off / self-exclusion, FICA, real OTP)
  are intentionally `test.fixme`'d with the reason.
