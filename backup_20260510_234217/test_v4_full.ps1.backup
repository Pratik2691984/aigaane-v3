param(
    [string]$BaseUrl = "http://localhost:8000/api"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AIGAANE V4 API TEST SUITE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n📊 1. HEALTH CHECK" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BaseUrl/health"
    Write-Host "✅ Server: $($health.status)" -ForegroundColor Green
    Write-Host "   Version: $($health.version)" -ForegroundColor Green
    Write-Host "   Modules: $($health.modules -join ', ')" -ForegroundColor Green
} catch {
    Write-Host "❌ Server not responding! Start with: python server.py" -ForegroundColor Red
    exit
}

# Test 2: 49D Kernel
Write-Host "`n🧠 2. 49D KERNEL" -ForegroundColor Yellow
$statsPayload = @{text = "Rāma"} | ConvertTo-Json
$stats = Invoke-RestMethod -Uri "$BaseUrl/49d/stats" -Method POST -ContentType "application/json" -Body $statsPayload
Write-Host "✅ Hash: $($stats.hash)" -ForegroundColor Green
Write-Host "   Entropy: $($stats.entropy)" -ForegroundColor Green
Write-Host "   Sigma Dim: $($stats.sigma_dim)" -ForegroundColor Green

# Test 3: Sandhi
Write-Host "`n🔗 3. SANDHI PROCESSING" -ForegroundColor Yellow
$sandhiPayload = @{left = "devaḥ"; right = "api"; sandhi_type = "visarga"} | ConvertTo-Json
$sandhi = Invoke-RestMethod -Uri "$BaseUrl/sandhi" -Method POST -ContentType "application/json" -Body $sandhiPayload
Write-Host "✅ Result: $($sandhi.result)" -ForegroundColor Green
Write-Host "   Rule: $($sandhi.rule_applied)" -ForegroundColor Green

# Test 4: Nakshatra Analysis
Write-Host "`n🪐 4. NAKSHATRA ANALYSIS" -ForegroundColor Yellow
$nakshatraPayload = @{
    text = "dhyāyūn nityam"
    nakshatra = "krittika"
    pada = 1
    generate_metrics = $true
} | ConvertTo-Json
$nakshatra = Invoke-RestMethod -Uri "$BaseUrl/nakshatra/analyze" -Method POST -ContentType "application/json" -Body $nakshatraPayload
Write-Host "✅ Nakshatra: $($nakshatra.nakshatra)" -ForegroundColor Green
Write-Host "   Pada: $($nakshatra.pada)" -ForegroundColor Green
Write-Host "   Raga: $($nakshatra.sound.raga)" -ForegroundColor Green
Write-Host "   Frequency: $($nakshatra.frequency_hz) Hz" -ForegroundColor Green
Write-Host "   Mantra: $($nakshatra.mantra)" -ForegroundColor Green

# Test 5: Prosody Validation
Write-Host "`n📜 5. PROSODY VALIDATION" -ForegroundColor Yellow
$prosodyPayload = @{text = "dhyāyūn nityam"; language = "sanskrit"; strict_mode = $true} | ConvertTo-Json
$prosody = Invoke-RestMethod -Uri "$BaseUrl/prosody/validate" -Method POST -ContentType "application/json" -Body $prosodyPayload
Write-Host "✅ Pattern: $($prosody.pattern)" -ForegroundColor Green
Write-Host "   Laghu: $($prosody.laghu_count), Guru: $($prosody.guru_count)" -ForegroundColor Green
Write-Host "   Syllables: $($prosody.syllables -join ', ')" -ForegroundColor Green

# Test 6: Anumana Layer (Crown Jewel)
Write-Host "`n🔮 6. ANUMANA LAYER (CROWN JEWEL)" -ForegroundColor Yellow
$anumanaPayload = @{
    input_vector = @(0.26, 0.84, 1.0)
    context = "v4_transition_alpha"
    prediction_depth = 5
    entropy_threshold = 0.49
} | ConvertTo-Json
$anumana = Invoke-RestMethod -Uri "$BaseUrl/anu-layer/predict" -Method POST -ContentType "application/json" -Body $anumanaPayload
Write-Host "✅ Current Nakshatra: $($anumana.current_nakshatra)" -ForegroundColor Green
Write-Host "   Current Navatara: $($anumana.current_navatara)" -ForegroundColor Green
Write-Host "   Next Nakshatra: $($anumana.next_nakshatra)" -ForegroundColor Green
Write-Host "   Next Navatara: $($anumana.next_navatara)" -ForegroundColor Green
Write-Host "   Predicted Raga: $($anumana.predicted_raga)" -ForegroundColor Green
Write-Host "   Predicted Mood: $($anumana.predicted_mood)" -ForegroundColor Green

# Test 7: Dataset Sample
Write-Host "`n📚 7. DATASET SAMPLE" -ForegroundColor Yellow
$sample = Invoke-RestMethod -Uri "$BaseUrl/dataset/sample"
Write-Host "✅ Random Nakshatra: $($sample.nakshatra)" -ForegroundColor Green
Write-Host "   Raga: $($sample.raga)" -ForegroundColor Green
Write-Host "   Seed Word: $($sample.seed_word)" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   ✅ ALL TESTS COMPLETED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n🌐 Swagger UI: http://localhost:8000/docs"
Write-Host "📱 Live Site: https://www.aigaane.in"
