# Backup Verification Script for Gil Hameever (PowerShell)
# Generated: 2025-01-26 07:22:31

Write-Host "🔍 Verifying Gil Hameever System Backup..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$BACKUP_DIR = "backup\20251026_072231"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Write-Host "📅 Backup Date: $TIMESTAMP" -ForegroundColor Green
Write-Host "📁 Backup Directory: $BACKUP_DIR" -ForegroundColor Green
Write-Host ""

# Check if backup directory exists
if (-not (Test-Path $BACKUP_DIR)) {
    Write-Host "❌ Backup directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backup directory exists" -ForegroundColor Green

# Check database backup
$dbBackup = "$BACKUP_DIR\database\complete_schema_backup.sql"
if (Test-Path $dbBackup) {
    Write-Host "✅ Complete database schema backup found" -ForegroundColor Green
    $dbSize = (Get-Item $dbBackup).Length
    $dbSizeFormatted = "{0:N2} KB" -f ($dbSize / 1KB)
    Write-Host "   📊 Database backup size: $dbSizeFormatted" -ForegroundColor Yellow
} else {
    Write-Host "❌ Database schema backup missing!" -ForegroundColor Red
}

# Check source code backup
$srcBackup = "$BACKUP_DIR\source_code"
if (Test-Path $srcBackup) {
    Write-Host "✅ Source code backup found" -ForegroundColor Green
    $srcSize = (Get-ChildItem $srcBackup -Recurse | Measure-Object -Property Length -Sum).Sum
    $srcSizeFormatted = "{0:N2} MB" -f ($srcSize / 1MB)
    Write-Host "   📊 Source code size: $srcSizeFormatted" -ForegroundColor Yellow
    
    # Count files
    $fileCount = (Get-ChildItem $srcBackup -Recurse -File).Count
    Write-Host "   📄 Files backed up: $fileCount" -ForegroundColor Yellow
} else {
    Write-Host "❌ Source code backup missing!" -ForegroundColor Red
}

# Check configuration backup
$configBackup = "$BACKUP_DIR\config"
if (Test-Path $configBackup) {
    Write-Host "✅ Configuration files backup found" -ForegroundColor Green
    $configFiles = (Get-ChildItem $configBackup -File).Count
    Write-Host "   📄 Configuration files: $configFiles" -ForegroundColor Yellow
} else {
    Write-Host "❌ Configuration backup missing!" -ForegroundColor Red
}

# Check documentation
$docBackup = "$BACKUP_DIR\documentation\BACKUP_README.md"
if (Test-Path $docBackup) {
    Write-Host "✅ Backup documentation found" -ForegroundColor Green
    $docSize = (Get-Item $docBackup).Length
    $docSizeFormatted = "{0:N2} KB" -f ($docSize / 1KB)
    Write-Host "   📊 Documentation size: $docSizeFormatted" -ForegroundColor Yellow
} else {
    Write-Host "❌ Backup documentation missing!" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 Backup Summary:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

# Calculate total backup size
$totalSize = (Get-ChildItem $BACKUP_DIR -Recurse | Measure-Object -Property Length -Sum).Sum
$totalSizeFormatted = "{0:N2} MB" -f ($totalSize / 1MB)
Write-Host "📦 Total backup size: $totalSizeFormatted" -ForegroundColor Green

# Count total files
$totalFiles = (Get-ChildItem $BACKUP_DIR -Recurse -File).Count
Write-Host "📄 Total files backed up: $totalFiles" -ForegroundColor Green

Write-Host ""
Write-Host "🔒 Security Check:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

# Check for sensitive data in backup
$apiKeysFound = $false
$passwordsFound = $false

try {
    $apiKeySearch = Select-String -Path "$BACKUP_DIR\*" -Pattern "sk-" -Quiet
    if ($apiKeySearch) {
        $apiKeysFound = $true
    }
} catch {
    # Ignore errors
}

try {
    $passwordSearch = Select-String -Path "$BACKUP_DIR\*" -Pattern "password" -Quiet
    if ($passwordSearch) {
        $passwordsFound = $true
    }
} catch {
    # Ignore errors
}

if ($apiKeysFound) {
    Write-Host "⚠️  WARNING: Potential API keys found in backup!" -ForegroundColor Yellow
} else {
    Write-Host "✅ No obvious API keys found in backup" -ForegroundColor Green
}

if ($passwordsFound) {
    Write-Host "⚠️  WARNING: Potential passwords found in backup!" -ForegroundColor Yellow
} else {
    Write-Host "✅ No obvious passwords found in backup" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Backup verification completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Store backup in secure location" -ForegroundColor White
Write-Host "2. Test restoration process" -ForegroundColor White
Write-Host "3. Update environment variables" -ForegroundColor White
Write-Host "4. Verify all functionality" -ForegroundColor White
Write-Host ""
Write-Host "🆘 For support, refer to BACKUP_README.md" -ForegroundColor Yellow
