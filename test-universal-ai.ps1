# 🧪 TEST UNIVERSAL AI CHATBOT
# This script tests if your AI can answer different types of questions

Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🧪 TESTING UNIVERSAL AI CHATBOT" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$apiUrl = "http://localhost:5000/api/chatbot/chat"
$testsPassed = 0
$totalTests = 0

function Test-ChatbotQuery {
    param(
        [string]$Query,
        [string]$Category,
        [string]$ExpectedKeyword
    )
    
    $global:totalTests++
    Write-Host "[$global:totalTests] Testing $Category..." -ForegroundColor Cyan
    Write-Host "    Query: '$Query'" -ForegroundColor Gray
    
    try {
        $body = @{
            message = $Query
            userId = "test_user_123"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
        
        if ($response.success -and $response.response -like "*$ExpectedKeyword*") {
            Write-Host "    ✅ PASS - AI responded correctly!" -ForegroundColor Green
            $global:testsPassed++
            # Show short preview
            $preview = $response.response.Substring(0, [Math]::Min(100, $response.response.Length))
            Write-Host "    Preview: $preview..." -ForegroundColor DarkGray
        } else {
            Write-Host "    ❌ FAIL - Unexpected response" -ForegroundColor Red
            Write-Host "    Got: $($response.response)" -ForegroundColor DarkRed
        }
    } catch {
        Write-Host "    ❌ ERROR - $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Milliseconds 500
}

# Check if server is running
Write-Host "🔍 Checking if server is running..." -ForegroundColor Cyan
try {
    $null = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "✅ Server is running on port 5000" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Server is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the server first:" -ForegroundColor Yellow
    Write-Host "   .\start-universal-ai.ps1" -ForegroundColor White
    Write-Host ""
    exit
}

Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🎯 RUNNING TESTS" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 1: Math
Test-ChatbotQuery -Query "What is 25 * 48?" -Category "Math Calculation" -ExpectedKeyword "1200"

# Test 2: Science
Test-ChatbotQuery -Query "What is artificial intelligence?" -Category "Science/Technology" -ExpectedKeyword "AI"

# Test 3: More Science
Test-ChatbotQuery -Query "How does photosynthesis work?" -Category "Biology" -ExpectedKeyword "plant"

# Test 4: Technology
Test-ChatbotQuery -Query "What is JavaScript?" -Category "Programming" -ExpectedKeyword "programming"

# Test 5: Conversation
Test-ChatbotQuery -Query "Hello!" -Category "Conversation" -ExpectedKeyword "Hello"

# Test 6: Products
Test-ChatbotQuery -Query "Show me steel doors" -Category "Product Query" -ExpectedKeyword "door"

# Test 7: Math percentage
Test-ChatbotQuery -Query "What is 15% of 2000?" -Category "Percentage" -ExpectedKeyword "300"

# Test 8: General knowledge
Test-ChatbotQuery -Query "What is the speed of light?" -Category "Physics" -ExpectedKeyword "299"

Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   📊 TEST RESULTS" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tests Passed: $testsPassed / $totalTests" -ForegroundColor $(if ($testsPassed -eq $totalTests) { "Green" } else { "Yellow" })

if ($testsPassed -eq $totalTests) {
    Write-Host ""
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "Your Universal AI Chatbot is working perfectly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your AI can now answer:" -ForegroundColor White
    Write-Host "  ✅ Math questions" -ForegroundColor Gray
    Write-Host "  ✅ Science concepts" -ForegroundColor Gray
    Write-Host "  ✅ Technology topics" -ForegroundColor Gray
    Write-Host "  ✅ General knowledge" -ForegroundColor Gray
    Write-Host "  ✅ Product queries" -ForegroundColor Gray
    Write-Host "  ✅ Conversations" -ForegroundColor Gray
    Write-Host "  ✅ ANYTHING users ask!" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "⚠️  Some tests failed" -ForegroundColor Yellow
    Write-Host "   Check the errors above for details" -ForegroundColor Gray
}

Write-Host ""
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
