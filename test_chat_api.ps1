# PowerShell script to test the chat API
# This script tests the chat API endpoint to diagnose issues

Write-Host "🧪 Testing Chat API..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Test data
$testData = @{
    message = "שלום עליזה"
    userId = "test-user-123"
    conversationId = $null
} | ConvertTo-Json

# API endpoint
$apiUrl = "http://localhost:3000/api/chat"

Write-Host "📡 Testing API: $apiUrl" -ForegroundColor Yellow
Write-Host "📝 Test message: שלום עליזה" -ForegroundColor Yellow
Write-Host ""

try {
    # Make request
    $response = Invoke-RestMethod -Uri $apiUrl -Method POST -Body $testData -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ API call successful" -ForegroundColor Green
    Write-Host "📄 Response content:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 3
    
    # Check for errors
    if ($response.error) {
        Write-Host "❌ API Error: $($response.error)" -ForegroundColor Red
    } else {
        Write-Host "✅ API call successful" -ForegroundColor Green
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -like "*Cannot connect*") {
        Write-Host "💡 Make sure the server is running on localhost:3000" -ForegroundColor Yellow
        Write-Host "   Run: npm run dev" -ForegroundColor Yellow
    } elseif ($_.Exception.Message -like "*404*") {
        Write-Host "💡 API route not found. Check if the server is running correctly." -ForegroundColor Yellow
    } elseif ($_.Exception.Message -like "*500*") {
        Write-Host "💡 Server error. Check console logs for details." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🔧 Troubleshooting Steps:" -ForegroundColor Cyan
Write-Host "1. Check if server is running: npm run dev" -ForegroundColor White
Write-Host "2. Check .env.local file exists" -ForegroundColor White
Write-Host "3. Check OpenAI API key is set" -ForegroundColor White
Write-Host "4. Check Supabase configuration" -ForegroundColor White
Write-Host "5. Check console logs for errors" -ForegroundColor White
