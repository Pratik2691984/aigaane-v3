// --- ASTROLOGY ENGINE ---
window.AstrologyEngine = (function() {
    
    function render() {
        const tensor = window.Quantatech?.getTensor();
        const metrics = window.Quantatech?.getMetrics();
        const userName = document.getElementById('user-name')?.value || 'Seeker';
        const birthLocation = document.getElementById('birth-location')?.value || 'New Delhi, India';
        
        if (!tensor || !tensor.length) {
            document.getElementById('astrology-output').innerHTML = '<div class="info-card">Waiting for kernel initialization...</div>';
            return;
        }
        
        // Calculate astrological positions from 49D tensor
        const moonDim = tensor[9] || 0.5;
        const sunDim = tensor[5] || 0.5;
        const marsDim = tensor[2] || 0.5;
        
        const rashis = ['Meṣa (Aries)', 'Vṛṣabha (Taurus)', 'Mithuna (Gemini)', 'Karkaṭa (Cancer)', 
                        'Siṃha (Leo)', 'Kanyā (Virgo)', 'Tulā (Libra)', 'Vṛścika (Scorpio)',
                        'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Mīna (Pisces)'];
        
        const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 
                            'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
                            'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
                            'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 
                            'Shatabhisha', 'Purva Bhadra', 'Uttara Bhadra', 'Revati'];
        
        const moonRashi = rashis[Math.floor(moonDim * 12) % 12];
        const sunRashi = rashis[Math.floor(sunDim * 12) % 12];
        const marsHouse = Math.floor(marsDim * 12) + 1;
        const moonNakshatra = nakshatras[Math.floor((moonDim * 27)) % 27];
        const lagnaRashi = rashis[Math.floor(tensor[0] * 12) % 12];
        
        // Check for Mangal Dosha
        const hasMangalDosha = [1, 4, 7, 8, 12].includes(marsHouse);
        
        // Calculate compatibility score from Anumana layer
        const anumanaLayer = tensor.slice(21, 35);
        const compatibilityScore = (anumanaLayer.reduce((a,b) => a+b, 0) / anumanaLayer.length * 100).toFixed(1);
        
        const html = `
            <div class="result-card">
                <h3>⭐ Vedic Astrology Report for ${userName}</h3>
                <p style="margin-bottom: 15px; font-size: 0.8rem;">📍 ${birthLocation} | Based on 49D Kernel</p>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>🌙 Chandra (Moon) Rashi</strong><br>${moonRashi}
                        <small>Mental disposition</small>
                    </div>
                    <div class="result-item">
                        <strong>☀️ Surya (Sun) Rashi</strong><br>${sunRashi}
                        <small>Core identity</small>
                    </div>
                    <div class="result-item">
                        <strong>⭐ Nakṣatra (Birth Star)</strong><br>${moonNakshatra}
                        <small>Lunar mansion</small>
                    </div>
                    <div class="result-item">
                        <strong>📈 Lagna (Ascendant)</strong><br>${lagnaRashi}
                        <small>Rising sign</small>
                    </div>
                    <div class="result-item">
                        <strong>🔥 Maṅgala Position</strong><br>House ${marsHouse}
                        <small>${hasMangalDosha ? '⚠️ Mangal Dosha Present' : '✓ No Mangal Dosha'}</small>
                    </div>
                    <div class="result-item">
                        <strong>💑 Compatibility Score</strong><br>${compatibilityScore}%
                        <small>From Anumana Layer</small>
                    </div>
                </div>
                <div class="result-item" style="margin-top: 1rem;">
                    <strong>📜 Kernel Metrics</strong><br>
                    Σ Dimension Sum: ${metrics?.dimensionSum || '—'} | 
                    Vector Magnitude: ${metrics?.vectorMagnitude || '—'} |
                    Anumana Entropy: ${metrics?.anumanaEntropy || '—'}
                </div>
            </div>
        `;
        
        document.getElementById('astrology-output').innerHTML = html;
    }
    
    return { render };
})();

console.log('✅ Astrology Engine loaded');