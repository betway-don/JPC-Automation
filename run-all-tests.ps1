# run-all-tests.ps1
# Runs all specified test cases across ZA, GH, MW, and TZ regions.
# Each run writes blobs to its own subdir (blob-runs\run-NNN) so the blob reporter
# never wipes a previous run's data. All blobs are collected into blob-all\ and
# merged into a single HTML report at playwright-report\index.html.
# Usage: .\run-all-tests.ps1

$ErrorActionPreference = "Continue"

if (Test-Path "blob-runs")         { Remove-Item -Recurse -Force "blob-runs" }
if (Test-Path "blob-all")          { Remove-Item -Recurse -Force "blob-all" }
if (Test-Path "playwright-report") { Remove-Item -Recurse -Force "playwright-report" }
New-Item -ItemType Directory -Force "blob-all" | Out-Null

$i = 1

function Run-Test {
    param($Label, $SpecFile, $Config, $Grep)
    Write-Host "`n$Label" -ForegroundColor Cyan
    $runDir = "blob-runs\run-$($i.ToString('D3'))"
    $env:BLOB_OUTPUT_DIR = $runDir
    npx playwright test $SpecFile --config=$Config --grep $Grep
    $zipName = "report-$($i.ToString('D3'))-$($Label -replace '[\[\] ]+','-').zip"
    Get-ChildItem $runDir -Filter "*.zip" -ErrorAction SilentlyContinue |
        Move-Item -Destination "blob-all\$zipName" -Force
    $script:i++
}

# ==============================================================================
# ZA REGION
# ==============================================================================
Write-Host "`n========== ZA Region ==========" -ForegroundColor Magenta

Run-Test "[ZA] Hamburger Menu" `
    "src/regions/ZA/tests/modules/hamBurgerMenu/hamBurgerMenu.spec.ts" `
    "playwright.ZA.config.ts" `
    'HM-'

Run-Test "[ZA] Header" `
    "src/regions/ZA/tests/modules/header/header.spec.ts" `
    "playwright.ZA.config.ts" `
    '\b(T1|T2|T3|T4|T5|T6|T8|T9|T10|T11|T12|T13|T15|T16|T17)\b'

Run-Test "[ZA] Login" `
    "src/regions/ZA/tests/modules/login/login.spec.ts" `
    "playwright.ZA.config.ts" `
    '\b(T1|T2|T3|T4|T5|T6|T9|T10|T11|T15|T16|T17|T18|T19|T20|T21)\b'

Run-Test "[ZA] Signup" `
    "src/regions/ZA/tests/modules/signup/signUp.spec.ts" `
    "playwright.ZA.config.ts" `
    '\b(T1|T2|T3|T4|T8|T9|T10|T11|T14|T15|T16|T17|T18|T19|T20|T21|T22|T23|T26|T27|T28|T29|T30|T31|T32|T39|T43|T44)\b'

Run-Test "[ZA] Transaction History" `
    "src/regions/ZA/tests/modules/transactionHistory/transactionHistory.spec.ts" `
    "playwright.ZA.config.ts" `
    '\b(T1|T3|T4|T5|T6|T7|T8|T9|T10|T11|T12|T13|T14|T15|T18|T20|T22|T38|T39|T40|T50)\b'

# ==============================================================================
# GH REGION
# ==============================================================================
Write-Host "`n========== GH Region ==========" -ForegroundColor Magenta

Run-Test "[GH] Hamburger Menu" `
    "src/regions/GH/tests/modules/hamBurgerMenu/hamBurgerMenu.spec.ts" `
    "playwright.GH.config.ts" `
    '\b(T1|T10|T11|T12|T15|T16|T17|T18|T19|T21|T25|T29|T31|T34|T35|T36|T36_1|T36_2|T38|T40_1|T41|T42|T43|T44|T45|T46|T47|T48)\b'

Run-Test "[GH] Header" `
    "src/regions/GH/tests/modules/header/header.spec.ts" `
    "playwright.GH.config.ts" `
    '\b(T8|T9|T10|T11|T12|T13|T15|T16|T17)\b'

Run-Test "[GH] Login" `
    "src/regions/GH/tests/modules/login/login.spec.ts" `
    "playwright.GH.config.ts" `
    '\b(T1|T2|T3|T4|T5|T6|T9|T10|T11|T15|T16|T17|T18|T19|T20|T21)\b'

Run-Test "[GH] Signup" `
    "src/regions/GH/tests/modules/signup/signUp.spec.ts" `
    "playwright.GH.config.ts" `
    '\b(T1|T2|T3|T4|T8|T9|T10|T11|T14|T15|T16|T17|T18|T19|T20|T21|T22|T23|T24|T25|T43|T44)\b'

Run-Test "[GH] Transaction History" `
    "src/regions/GH/tests/modules/transactionHistory/transactionHistory.spec.ts" `
    "playwright.GH.config.ts" `
    '\b(T1|T3|T4|T5|T6|T7|T8|T9|T10|T11|T12|T13|T14|T15|T18|T20|T22|T38|T39|T40|T50)\b'

# ==============================================================================
# MW REGION
# ==============================================================================
Write-Host "`n========== MW Region ==========" -ForegroundColor Magenta

Run-Test "[MW] Hamburger Menu" `
    "src/regions/MW/tests/modules/hamBurgerMenu/hamBurgerMenu.spec.ts" `
    "playwright.MW.config.ts" `
    '\b(T1|T10|T11|T12|T15|T16|T17|T18|T19|T21|T25|T29|T31|T34|T35|T36|T36_1|T36_2|T38|T40_1|T42|T43|T44|T45|T46|T47|T48)\b'

Run-Test "[MW] Header" `
    "src/regions/MW/tests/modules/header/header.spec.ts" `
    "playwright.MW.config.ts" `
    '\b(T8|T9|T11|T12|T13|T15|T16|T17)\b'

Run-Test "[MW] Login" `
    "src/regions/MW/tests/modules/login/login.spec.ts" `
    "playwright.MW.config.ts" `
    '\b(T1|T2|T3|T4|T5|T6|T9|T10|T11|T15|T16|T17|T18|T19|T20|T21)\b'

Run-Test "[MW] Signup" `
    "src/regions/MW/tests/modules/signup/signUp.spec.ts" `
    "playwright.MW.config.ts" `
    '\b(T1|T2|T3|T4|T8|T9|T10|T11|T14|T15|T16|T17|T18|T19|T20|T21|T22|T23|T26|T27|T28|T29|T30|T32|T43|T44)\b'

Run-Test "[MW] Transaction History" `
    "src/regions/MW/tests/modules/transactionHistory/transactionHistory.spec.ts" `
    "playwright.MW.config.ts" `
    '\b(T1|T3|T4|T5|T6|T7|T8|T9|T10|T11|T13|T14|T15|T18|T20|T38|T39|T40|T50)\b'

# ==============================================================================
# TZ REGION
# ==============================================================================
Write-Host "`n========== TZ Region ==========" -ForegroundColor Magenta

Run-Test "[TZ] Hamburger Menu" `
    "src/regions/TZ/tests/modules/hamBurgerMenu/hamBurgerMenu.spec.ts" `
    "playwright.TZ.config.ts" `
    '\b(T1|T10|T11|T12|T15|T16|T17|T18|T19|T21|T25|T26|T27|T28|T29|T30|T31|T32|T34|T35|T36|T36_1|T36_2|T40_1|T42|T43|T44|T45|T46|T47|T48|T49)\b'

Run-Test "[TZ] Header" `
    "src/regions/TZ/tests/modules/header/header.spec.ts" `
    "playwright.TZ.config.ts" `
    '\b(T8|T9|T11|T12|T13|T15|T16|T17)\b'

Run-Test "[TZ] Login" `
    "src/regions/TZ/tests/modules/login/login.spec.ts" `
    "playwright.TZ.config.ts" `
    '\b(T1|T2|T3|T4|T5|T6|T9|T10|T11|T15|T16|T17|T18|T19|T20|T21)\b'

Run-Test "[TZ] Signup" `
    "src/regions/TZ/tests/modules/signup/signUp.spec.ts" `
    "playwright.TZ.config.ts" `
    '\b(T1|T2|T3|T4|T8|T9|T10|T11|T14|T18|T19|T23|T39|T40|T41|T42|T44)\b'

Run-Test "[TZ] Transaction History" `
    "src/regions/TZ/tests/modules/transactionHistory/transactionHistory.spec.ts" `
    "playwright.TZ.config.ts" `
    '\b(T1|T3|T4|T5|T6|T7|T8|T9|T10|T11|T12|T13|T14|T15|T38)\b'

$env:BLOB_OUTPUT_DIR = $null

# ==============================================================================
# MERGE ALL BLOBS INTO ONE REPORT
# ==============================================================================
Write-Host "`n========== Blob files collected ==========" -ForegroundColor Magenta
Get-ChildItem "blob-all" -Filter "*.zip" | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor White }
Write-Host "  Total: $((Get-ChildItem 'blob-all' -Filter '*.zip').Count) zip(s)" -ForegroundColor White

Write-Host "`n========== Generating Single Merged Report ==========" -ForegroundColor Magenta
npx playwright merge-reports --reporter html -c playwright.merge.config.ts blob-all

Write-Host "`nDone! Single report at: playwright-report/index.html" -ForegroundColor Green
Write-Host "Opening report..." -ForegroundColor Green
npx playwright show-report --port 9323
