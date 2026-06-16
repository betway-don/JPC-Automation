# run-tests-ZA.ps1
# Runs all ZA region test cases.
# Results are stored in: JPC Execution Results\ZA\
# Usage: .\run-tests-ZA.ps1

$ErrorActionPreference = "Continue"

$script:ResultsBase = "JPC Execution Results\ZA"

# Cleanup previous ZA run outputs
if (Test-Path "$script:ResultsBase\blob-runs")         { Remove-Item -Recurse -Force "$script:ResultsBase\blob-runs" }
if (Test-Path "$script:ResultsBase\blob-all")          { Remove-Item -Recurse -Force "$script:ResultsBase\blob-all" }
if (Test-Path "$script:ResultsBase\playwright-report") { Remove-Item -Recurse -Force "$script:ResultsBase\playwright-report" }
New-Item -ItemType Directory -Force "$script:ResultsBase\blob-all" | Out-Null

$script:i = 1

function Run-Test {
    param($Label, $SpecFile, $Config, $Grep)
    Write-Host "`n$Label" -ForegroundColor Cyan
    $runDir = "$script:ResultsBase\blob-runs\run-$($script:i.ToString('D3'))"
    $env:BLOB_OUTPUT_DIR = $runDir
    npx playwright test $SpecFile --config=$Config --grep $Grep
    $zipName = "report-$($script:i.ToString('D3'))-$($Label -replace '[\[\] ]+','-').zip"
    Get-ChildItem $runDir -Filter "*.zip" -ErrorAction SilentlyContinue |
        Move-Item -Destination "$script:ResultsBase\blob-all\$zipName" -Force
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

$env:BLOB_OUTPUT_DIR = $null

# ==============================================================================
# MERGE ALL BLOBS INTO ONE ZA REPORT
# ==============================================================================
Write-Host "`n========== Blob files collected (ZA) ==========" -ForegroundColor Magenta
Get-ChildItem "$script:ResultsBase\blob-all" -Filter "*.zip" | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor White }
Write-Host "  Total: $((Get-ChildItem "$script:ResultsBase\blob-all" -Filter '*.zip').Count) zip(s)" -ForegroundColor White

Write-Host "`n========== Generating ZA Merged Report ==========" -ForegroundColor Magenta
$env:PLAYWRIGHT_HTML_REPORT = "$script:ResultsBase\playwright-report"
npx playwright merge-reports --reporter html -c playwright.merge.config.ts "$script:ResultsBase\blob-all"
$env:PLAYWRIGHT_HTML_REPORT = $null

Write-Host "`nDone! ZA report at: $script:ResultsBase\playwright-report\index.html" -ForegroundColor Green
Write-Host "Opening report on port 9323..." -ForegroundColor Green
npx playwright show-report "$script:ResultsBase\playwright-report" --port 9323
