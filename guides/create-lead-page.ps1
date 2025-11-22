# ========================================
# Create New Lead Magnet Landing Page (PowerShell)
# ========================================
# This script duplicates an existing lead magnet page
# and updates it for a new Brevo list.
#
# Usage:
#   .\create-lead-page.ps1 -ListId 9

param(
    [Parameter(Mandatory=$true)]
    [int]$ListId
)

# ========================================
# Configuration
# ========================================
$SourcePage = "lead-gift-8"
$BaseDir = "src\app\(public)"
$TargetPage = "lead-gift-$ListId"
$SourcePath = Join-Path $BaseDir $SourcePage
$TargetPath = Join-Path $BaseDir $TargetPage

# ========================================
# Check if source exists
# ========================================
if (-not (Test-Path $SourcePath)) {
    Write-Host "❌ Error: Source page not found at $SourcePath" -ForegroundColor Red
    exit 1
}

# ========================================
# Check if target already exists
# ========================================
if (Test-Path $TargetPath) {
    Write-Host "⚠️  Warning: Target page already exists at $TargetPath" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (y/N)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host "❌ Cancelled" -ForegroundColor Red
        exit 1
    }
    Remove-Item -Path $TargetPath -Recurse -Force
}

# ========================================
# Copy the directory
# ========================================
Write-Host "📁 Creating new landing page directory..." -ForegroundColor Cyan
Copy-Item -Path $SourcePath -Destination $TargetPath -Recurse

# ========================================
# Update LIST_ID in page.tsx
# ========================================
Write-Host "✏️  Updating LIST_ID to $ListId..." -ForegroundColor Cyan
$pageFile = Join-Path $TargetPath "page.tsx"
$content = Get-Content $pageFile -Raw
$content = $content -replace 'const LIST_ID = \d+;', "const LIST_ID = $ListId;"
Set-Content -Path $pageFile -Value $content

# ========================================
# Success!
# ========================================
Write-Host ""
Write-Host "✅ Success! New landing page created!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Location: $TargetPath" -ForegroundColor White
Write-Host "🔗 URL: /lead-gift-$ListId" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Make sure list #$ListId exists in Brevo"
Write-Host "  2. Customize the copy in $TargetPath\page.tsx"
Write-Host "  3. Test it: npm run dev"
Write-Host "  4. Visit: http://localhost:3000/lead-gift-$ListId"
Write-Host ""
Write-Host "📝 Need help? Check guides/LEAD_MAGNET_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

