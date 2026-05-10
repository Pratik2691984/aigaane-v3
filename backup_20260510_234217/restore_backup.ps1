# RESTORE SCRIPT
# Run this to restore files from this backup

$backupFolder = Split-Path -Parent $MyInvocation.MyCommand.Path
$targetFolder = "C:\aigaane-v3-root"

Write-Host "Restoring from: $backupFolder" -ForegroundColor Cyan
Write-Host "Target: $targetFolder" -ForegroundColor Cyan

# Restore index.html
if (Test-Path "$backupFolder\index.html.backup") {
    Copy-Item "$backupFolder\index.html.backup" "$targetFolder\index.html" -Force
    Write-Host "✅ Restored index.html" -ForegroundColor Green
}

# Restore tabs folder
if (Test-Path "$backupFolder\tabs") {
    Copy-Item -Path "$backupFolder\tabs" -Destination "$targetFolder\tabs" -Recurse -Force
    Write-Host "✅ Restored tabs folder" -ForegroundColor Green
}

Write-Host "Restore complete!" -ForegroundColor Green
