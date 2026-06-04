# run-all-tests.ps1
# Runs all specified test cases across ZA, GH, MW, and TZ regions.
# Each run saves a blob file (no overwriting). A single merged HTML report is
# generated at the end in ./merged-report/index.html
# Usage: .\run-all-tests.ps1

$ErrorActionPreference = "Continue"

# Clean up previous blob files so the final report only contains this run
if (Test-Path "blob-report") {
    Remove-Item -Recurse -Force "blob-report"
}
if (Test-Path "merged-report") {
    Remove-Item -Recurse -Force "merged-report"
}

# ==============================================================================
# ZA REGION
# ==============================================================================
Write-Host "`n========== ZA Region ==========" -ForegroundColor Magenta

Write-Host "[ZA] Hamburger Menu (HM-001 to HM-032, HM-LI-001 to HM-LI-025)..." -ForegroundColor Cyan
npx playwright test "src/regions/ZA/tests/modules/hamBurgerMenu/hamBurgerMenu.spec.ts" --config=playwright.ZA.config.ts --grep 'HM-' --reporter=blob --reporter=list

Write-Host "`n[ZA] Header (Logged Out T1-T6, Logged In T8-T17)..." -ForegroundColor Cyan
npx playwright test "src/regions/ZA/tests/modules/header/header.spec.ts" --config=playwright.ZA.config.ts --grep '\b(T1|T2|T3|T4|T5|T6|T8|T9|T10|T11|T12|T13|T15|T16|T17)\b' --reporter=blob --reporter=list

Write-Host "`n[ZA] Login..." -ForegroundColor Cyan
npx playwright test "src/regions/ZA/tests/modules/login/login.spec.ts" --config=playwright.ZA.config.ts --grep '\b(T1|T2|T3|T4|T5|T6|T9|T10|T11|T15|T16|T17|T18|T19|T20|T21)\b' --reporter=blob --reporter=list

Write-Host "`n[ZA] Signup..." -ForegroundColor Cyan
npx playwright test "src/regions/ZA/tests/modules/signup/signUp.spec.ts" --config=playwright.ZA.config.ts --grep '\b(T1|T2|T3|T4|T8|T9|T10|T11|T14|T15|T16|T17|T18|T19|T20|T21|T22|T23|T26|T27|T28|T29|T30|T31|T32|T39|T43|T44)\b' --reporter=blob --reporter=list

Write-Host "`n[ZA] Transaction History..." -ForegroundColor Cyan
npx playwright test "src/regions/ZA/tests/modules/transactionHistory/transactionHistory.spec.ts" --config=playwright.ZA.config.ts --grep '\b(T1|T3|T4|T5|T6|T7|T8|T9|T10|T11|T12|T13|T14|T15|T18|T20|T22|T38|T39|T40|T50)\b' --reporter=blob --reporter=list

# ==============================================================================
# GH REGION
# ==============================================================================
Write-Host "`n========== GH Region ==========" -ForegroundColor Magenta

Write-Host "[GH] Hamburger Menu (Logged Out T1/T10-T25, Logged In T29-T48)..." -ForegroundColor Cyan
npx playwright test "src/regions/GH/tests/modules/hamBurgerMenu/hamBurgerMenu.spec.ts" --config=playwright.GH.config.ts --grep '\b(T1|T10|T11|T12|T15|T16|T17|T18|T19|T21|T25|T29|T31|T34|T35|T36|T36_1|T36_2|T38|T40_1|T41|T42|T43|T44|T45|T46|T47|T48)\b' --reporter=blob --reporter=list

Write-Host "`n[GH] Header (Logged In T8-T17)..." -ForegroundColor Cyan
npx playwright test "src/regions/GH/tests/modules/header/header.spec.ts" --config=playwright.GH.config.ts --grep '\b(T8|T9|T10|T11|T12|T13|T15|T16|T17)\b' --reporter=blob --reporter=list

Write-Host "`n[GH] Login..." -ForegroundColor Cyan
npx playwright test "src/regions/GH/tests/modules/login/login.spec.ts" --config=playwright.GH.config.ts --grep '\b(T1|T2|T3|T4|T5|T6|T9|T10|T11|T15|T16|T17|T18|T19|T20|T21)\b' --reporter=blob --reporter=list

Write-Host "`n[GH] Signup..." -ForegroundColor Cyan
npx playwright test "src/regions/GH/tests/modules/signup/signUp.spec.ts" --config=playwright.GH.config.ts --grep '\b(T1|T2|T3|T4|T8|T9|T10|T11|T14|T15|T16|T17|T18|T19|T20|T21|T22|T23|T24|T25|T43|T44)\b' --reporter=blob --reporter=list

Write-Host "`n[GH] Transaction History..." -ForegroundColor Cyan
npx playwright test "src/regions/GH/tests/modules/transactionHistory/transactionHistory.spec.ts" --config=playwright.GH.config.ts --grep '\b(T1|T3|T4|T5|T6|T7|T8|T9|T10|T11|T12|T13|T14|T15|T18|T20|T22|T38|T39|T40|T50)\b' --reporter=blob --reporter=list

# ==============================================================================
# MW REGION
# ==============================================================================
Write-Host "`n========== MW Region ==========" -ForegroundColor Magenta

Write-Host "[MW] Hamburger Menu (Logged Out T1/T10-T25, Logged In T29-T48)..." -ForegroundColor Cyan
npx playwright test "src/regions/MW/tests/modules/hamBurgerMenu/hamBurgerMenu.spec.ts" --config=playwright.MW.config.ts --grep '\b(T1|T10|T11|T12|T15|T16|T17|T18|T19|T21|T25|T29|T31|T34|T35|T36|T36_1|T36_2|T38|T40_1|T42|T43|T44|T45|T46|T47|T48)\b' --reporter=blob --reporter=list

Write-Host "`n[MW] Header (Logged In T8-T17, no T10)..." -ForegroundColor Cyan
npx playwright test "src/regions/MW/tests/modules/header/header.spec.ts" --config=playwright.MW.config.ts --grep '\b(T8|T9|T11|T12|T13|T15|T16|T17)\b' --reporter=blob --reporter=list

Write-Host "`n[MW] Login..." -ForegroundColor Cyan
npx playwright test "src/regions/MW/tests/modules/login/login.spec.ts" --config=playwright.MW.config.ts --grep '\b(T1|T2|T3|T4|T5|T6|T9|T10|T11|T15|T16|T17|T18|T19|T20|T21)\b' --reporter=blob --reporter=list

Write-Host "`n[MW] Signup..." -ForegroundColor Cyan
npx playwright test "src/regions/MW/tests/modules/signup/signUp.spec.ts" --config=playwright.MW.config.ts --grep '\b(T1|T2|T3|T4|T8|T9|T10|T11|T14|T15|T16|T17|T18|T19|T20|T21|T22|T23|T26|T27|T28|T29|T30|T32|T43|T44)\b' --reporter=blob --reporter=list

Write-Host "`n[MW] Transaction History..." -ForegroundColor Cyan
npx playwright test "src/regions/MW/tests/modules/transactionHistory/transactionHistory.spec.ts" --config=playwright.MW.config.ts --grep '\b(T1|T3|T4|T5|T6|T7|T8|T9|T10|T11|T13|T14|T15|T18|T20|T38|T39|T40|T50)\b' --reporter=blob --reporter=list

# ==============================================================================
# TZ REGION
# ==============================================================================
Write-Host "`n========== TZ Region ==========" -ForegroundColor Magenta

Write-Host "[TZ] Hamburger Menu (Logged Out T1/T10-T28, Logged In T29-T49)..." -ForegroundColor Cyan
npx playwright test "src/regions/TZ/tests/modules/hamBurgerMenu/hamBurgerMenu.spec.ts" --config=playwright.TZ.config.ts --grep '\b(T1|T10|T11|T12|T15|T16|T17|T18|T19|T21|T25|T26|T27|T28|T29|T30|T31|T32|T34|T35|T36|T36_1|T36_2|T40_1|T42|T43|T44|T45|T46|T47|T48|T49)\b' --reporter=blob --reporter=list

Write-Host "`n[TZ] Header (Logged In T8-T17, no T10)..." -ForegroundColor Cyan
npx playwright test "src/regions/TZ/tests/modules/header/header.spec.ts" --config=playwright.TZ.config.ts --grep '\b(T8|T9|T11|T12|T13|T15|T16|T17)\b' --reporter=blob --reporter=list

Write-Host "`n[TZ] Login..." -ForegroundColor Cyan
npx playwright test "src/regions/TZ/tests/modules/login/login.spec.ts" --config=playwright.TZ.config.ts --grep '\b(T1|T2|T3|T4|T5|T6|T9|T10|T11|T15|T16|T17|T18|T19|T20|T21)\b' --reporter=blob --reporter=list

Write-Host "`n[TZ] Signup..." -ForegroundColor Cyan
npx playwright test "src/regions/TZ/tests/modules/signup/signUp.spec.ts" --config=playwright.TZ.config.ts --grep '\b(T1|T2|T3|T4|T8|T9|T10|T11|T14|T18|T19|T23|T39|T40|T41|T42|T44)\b' --reporter=blob --reporter=list

Write-Host "`n[TZ] Transaction History..." -ForegroundColor Cyan
npx playwright test "src/regions/TZ/tests/modules/transactionHistory/transactionHistory.spec.ts" --config=playwright.TZ.config.ts --grep '\b(T1|T3|T4|T5|T6|T7|T8|T9|T10|T11|T12|T13|T14|T15|T38)\b' --reporter=blob --reporter=list

# ==============================================================================
# MERGE ALL BLOBS INTO ONE REPORT
# ==============================================================================
Write-Host "`n========== Generating Single Merged Report ==========" -ForegroundColor Magenta
npx playwright merge-reports --reporter=html --output=merged-report ./blob-report

Write-Host "`nDone! Single report at: merged-report/index.html" -ForegroundColor Green
Write-Host "Opening report..." -ForegroundColor Green
npx playwright show-report merged-report
