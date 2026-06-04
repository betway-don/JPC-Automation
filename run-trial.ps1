# run-trial.ps1
# Trial: 2 test commands (1 test each) to verify merged blob report works correctly.
# Each run writes to its own subdir so the blob reporter can't wipe the previous run's data.
# All blobs are then collected into blob-all/ and merged into a single HTML report.

$ErrorActionPreference = "Continue"

if (Test-Path "blob-all")          { Remove-Item -Recurse -Force "blob-all" }
if (Test-Path "playwright-report") { Remove-Item -Recurse -Force "playwright-report" }
New-Item -ItemType Directory -Force "blob-all" | Out-Null

# --- Run 1: ZA Hamburger Menu - just HM-001 ---
Write-Host "`n[TRIAL Run 1] ZA Hamburger Menu - HM-001" -ForegroundColor Cyan
$env:BLOB_OUTPUT_DIR = "blob-runs\run-001"
npx playwright test "src/regions/ZA/tests/modules/hamBurgerMenu/hamBurgerMenu.spec.ts" `
    --config=playwright.ZA.config.ts `
    --grep "HM-001"
Get-ChildItem "blob-runs\run-001" -Filter "*.zip" -ErrorAction SilentlyContinue |
    Move-Item -Destination "blob-all\report-01-ZA-HM.zip" -Force
Write-Host "  -> blob-all\report-01-ZA-HM.zip" -ForegroundColor DarkGray

# --- Run 2: GH Hamburger Menu - just T1 ---
Write-Host "`n[TRIAL Run 2] GH Hamburger Menu - T1" -ForegroundColor Cyan
$env:BLOB_OUTPUT_DIR = "blob-runs\run-002"
npx playwright test "src/regions/GH/tests/modules/hamBurgerMenu/hamBurgerMenu.spec.ts" `
    --config=playwright.GH.config.ts `
    --grep "\bT1\b"
Get-ChildItem "blob-runs\run-002" -Filter "*.zip" -ErrorAction SilentlyContinue |
    Move-Item -Destination "blob-all\report-02-GH-HM.zip" -Force
Write-Host "  -> blob-all\report-02-GH-HM.zip" -ForegroundColor DarkGray

$env:BLOB_OUTPUT_DIR = $null

# --- Show collected blobs ---
Write-Host "`n========== Blob files collected ==========" -ForegroundColor Magenta
Get-ChildItem "blob-all" -Filter "*.zip" | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor White }
$blobCount = (Get-ChildItem "blob-all" -Filter "*.zip").Count
Write-Host "  Total: $blobCount zip(s)" -ForegroundColor White

if ($blobCount -lt 2) {
    Write-Host "  WARNING: Expected 2 blobs, got $blobCount. Some runs may have failed." -ForegroundColor Yellow
}

# --- Merge ---
Write-Host "`n========== Merging reports ==========" -ForegroundColor Magenta
npx playwright merge-reports --reporter html -c playwright.merge.config.ts blob-all

Write-Host "`nDone! Report at: playwright-report/index.html" -ForegroundColor Green
