# apply-organized-kb.ps1
# Puts the organized KB into the main kb\ folder and QUARANTINES (moves, never deletes)
# the old artifacts into kb\_quarantine_old\. Safe + reversible: nothing is deleted.
#
# HOW TO RUN (either way):
#   - Right-click this file -> "Run with PowerShell", OR
#   - In a terminal:  powershell -ExecutionPolicy Bypass -File apply-organized-kb.ps1
#
# If your project lives elsewhere, edit $Kb below.

$ErrorActionPreference = "Stop"
$Kb = "C:\Users\kyu3\Claude\Projects\pmf3\kb"
$Zip = Join-Path $Kb "kb-organized.zip"
$Quar = Join-Path $Kb "_quarantine_old"

Write-Host "=== Apply organized KB ===" -ForegroundColor Cyan
Write-Host "KB folder: $Kb"

if (-not (Test-Path $Kb))  { throw "KB folder not found: $Kb  (edit `$Kb at the top of this script)" }
if (-not (Test-Path $Zip)) { throw "kb-organized.zip not found in $Kb. Save it there first, then re-run." }

# 1) Unpack the 45 organized skills + KB-INDEX.md + ORGANIZE-REPORT.md into kb\ (overwrites the
#    two nav files if they already exist; the 45 skill folders are new).
Write-Host "`n[1/2] Unpacking organized skills into kb\ ..." -ForegroundColor Cyan
Expand-Archive -Path $Zip -DestinationPath $Kb -Force
$skillCount = (Get-ChildItem -Path $Kb -Directory | Where-Object { $_.Name -like "kb-*" }).Count
Write-Host "      unpacked. kb-* skill folders now present: $skillCount"

# 2) Quarantine the old / superseded artifacts (MOVE, not delete).
Write-Host "`n[2/2] Quarantining old files into _quarantine_old\ ..." -ForegroundColor Cyan
if (-not (Test-Path $Quar)) { New-Item -ItemType Directory -Path $Quar | Out-Null }

# Items considered "old": the input zip, the redundant organized zip (after unpack),
# and the un-organized hooks pair (its copies under pmf3\skills\ are left untouched).
$old = @("kb-mechanized.zip", "kb-organized.zip", "kb-hooks-score", "kb-hooks-write")
foreach ($name in $old) {
    $src = Join-Path $Kb $name
    if (Test-Path $src) {
        $dst = Join-Path $Quar $name
        if (Test-Path $dst) { Remove-Item $dst -Recurse -Force }   # clear a stale prior quarantine copy only
        Move-Item -Path $src -Destination $Quar
        Write-Host "      quarantined: $name"
    } else {
        Write-Host "      (skip, not found): $name"
    }
}

Write-Host "`nDone. Main KB = the kb-*-write / kb-*-score folders + KB-INDEX.md + ORGANIZE-REPORT.md." -ForegroundColor Green
Write-Host "Old files are in: $Quar  (review, then delete whenever you're ready)." -ForegroundColor Green
