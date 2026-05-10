param(
    [string]$BaseUrl = "http://localhost:8000/api"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AIGAANE V4 API MASTER SUITE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# --- 1. HEALTH CHECK ---
Write-Host "`n📊 1. HEALTH CHECK" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BaseUrl/health"
    Write-Host "✅ Server: $($health.status) | Version: $($health.version)" -ForegroundColor Green
    Write-Host "   Modules: $($health.modules -join ', ')" -ForegroundColor Green
} catch {
    Write-Host "❌ Server not responding! Start with: python server.py" -ForegroundColor Red
    exit
}

# --- 2. 49D KERNEL (Generating Hash for Anumana) ---
Write-Host "`n🧠 2. 49D KERNEL" -ForegroundColor Yellow
$statsPayload = @{ text = "Rāma" } | ConvertTo-Json
$stats = Invoke-RestMethod -Uri "$BaseUrl/49d/stats" -Method POST -ContentType "application/json" -Body $statsPayload
$currentHashHex = $stats.hash
# Convert hex string to integer - FIXED
$currentHashInt = [Convert]::ToInt32($currentHashHex, 16)
Write-Host "✅ Hash (hex): $currentHashHex" -ForegroundColor Green
Write-Host "   Hash (int): $currentHashInt" -ForegroundColor Green
Write-Host "   Entropy: $($stats.entropy)" -ForegroundColor Green
Write-Host "   Sigma Dim: $($stats.sigma_dim)" -ForegroundColor Green

# --- 3. SANDHI PROCESSING ---
Write-Host "`n🔗 3. SANDHI PROCESSING" -ForegroundColor Yellow
$sandhiPayload = @{ left = "devaḥ"; right = "api"; sandhi_type = "visarga" } | ConvertTo-Json
$sandhi = Invoke-RestMethod -Uri "$BaseUrl/sandhi" -Method POST -ContentType "application/json" -Body $sandhiPayload
Write-Host "✅ Input: devaḥ + api" -ForegroundColor Gray
Write-Host "   Result: $($sandhi.result)" -ForegroundColor Green
Write-Host "   Rule: $($sandhi.rule_applied)" -ForegroundColor Green

# --- 4. PROSODY VALIDATION ---
Write-Host "`n📜 4. PROSODY VALIDATION" -ForegroundColor Yellow
$prosodyPayload = @{ text = "dhyāyūn nityam"; language = "sanskrit"; strict_mode = $true } | ConvertTo-Json
$prosody = Invoke-RestMethod -Uri "$BaseUrl/prosody/validate" -Method POST -ContentType "application/json" -Body $prosodyPayload
Write-Host "✅ Pattern: $($prosody.pattern)" -ForegroundColor Green
Write-Host "   Laghu: $($prosody.laghu_count), Guru: $($prosody.guru_count)" -ForegroundColor Green
Write-Host "   Syllables: $($prosody.syllables -join ', ')" -ForegroundColor Green

# --- 5. NAKSHATRA ANALYSIS ---
Write-Host "`n🪐 5. NAKSHATRA ANALYSIS" -ForegroundColor Yellow
$nakshatraPayload = @{
    text = "dhyāyūn nityam"
    nakshatra = "krittika"
    pada = 1
    generate_metrics = $true
    vibration_filter = "high_freq"
} | ConvertTo-Json
$nak = Invoke-RestMethod -Uri "$BaseUrl/nakshatra/analyze" -Method POST -ContentType "application/json" -Body $nakshatraPayload
Write-Host "✅ Nakshatra: $($nak.nakshatra) (Pada: $($nak.pada))" -ForegroundColor Green
Write-Host "   Raga: $($nak.sound.raga)" -ForegroundColor Green
Write-Host "   Frequency: $($nak.frequency_hz) Hz" -ForegroundColor Green
Write-Host "   Mantra: $($nak.mantra)" -ForegroundColor Green

# --- 6. ANUMANA LAYER (CROWN JEWEL) ---
Write-Host "`n🔮 6. ANUMANA LAYER (CROWN JEWEL)" -ForegroundColor Yellow
$anumanaPayload = @{
    current_hash = $currentHashInt
    current_rasa = "Shanta"
    intensity = 0.5
    steps = 3
} | ConvertTo-Json

Write-Host "   Using hash: $currentHashInt" -ForegroundColor Gray
try {
    $anu = Invoke-RestMethod -Uri "$BaseUrl/anu-layer/predict" -Method POST -ContentType "application/json" -Body $anumanaPayload
    Write-Host "✅ Current Nakshatra: $($anu.current_nakshatra)" -ForegroundColor Green
    Write-Host "   Current Navatara: $($anu.current_navatara)" -ForegroundColor Green
    Write-Host "   Next Nakshatra: $($anu.next_nakshatra)" -ForegroundColor Green
    Write-Host "   Next Navatara: $($anu.next_navatara)" -ForegroundColor Green
    Write-Host "   Predicted Raga: $($anu.predicted_raga)" -ForegroundColor Green
    Write-Host "   Predicted Mood: $($anu.predicted_mood)" -ForegroundColor Green
} catch {
    Write-Host "❌ Anumana Error: $($_.Exception.Message)" -ForegroundColor Red
}

# --- 7. DATASET SAMPLE ---
Write-Host "`n📚 7. DATASET SAMPLE" -ForegroundColor Yellow
$sample = Invoke-RestMethod -Uri "$BaseUrl/dataset/sample"
Write-Host "✅ Random Nakshatra: $($sample.nakshatra)" -ForegroundColor Green
Write-Host "   Raga: $($sample.raga)" -ForegroundColor Green
Write-Host "   Chand: $($sample.chand)" -ForegroundColor Green
Write-Host "   Seed Word: $($sample.seed_word)" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   ✅ V4 MASTER TEST COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n🌐 Swagger UI: http://localhost:8000/docs"
Write-Host "📱 Live Site: https://www.aigaane.in"
