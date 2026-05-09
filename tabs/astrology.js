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
        
        const rashis = ['Meṣa (Aries)', 'Vṛṣabha (Taurus)', 'Mithuna (Gemini)', 'Karkaṭa (Cancer)', 
                        'Siṃha (Leo)', 'Kanyā (Virgo)', 'Tulā (Libra)', 'Vṛścika (Scorpio)',
                        'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Mīna (Pisces)'];
        
        const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 
                            'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
                            'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
                            'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 
                            'Shatabhisha', 'Purva Bhadra', 'Uttara Bhadra', 'Revati'];
        
        const moonRashi = rashis[Math.floor((tensor[9]||0.5) * 12) % 12];
        const sunRashi = rashis[Math.floor((tensor[5]||0.5) * 12) % 12];
        const moonNakshatra = nakshatras[Math.floor((tensor[9]||0.5) * 27) % 27];
        const marsHouse = Math.floor((tensor[2]||0.5) * 12) + 1;
        const hasMangalDosha = [1,4,7,8,12].includes(marsHouse);
        
        const html = `
            <div class="result-card">
                <h3>⭐ Vedic Astrology for ${userName}</h3>
                <p>📍 ${birthLocation}</p>
                <div class="result-grid">
                    <div class="result-item"><strong>🌙 Moon Rashi</strong><br>${moonRashi}</div>
                    <div class="result-item"><strong>☀️ Sun Rashi</strong><br>${sunRashi}</div>
                    <div class="result-item"><strong>⭐ Nakshatra</strong><br>${moonNakshatra}</div>
                    <div class="result-item"><strong>🔥 Mars House</strong><br>${marsHouse} ${hasMangalDosha ? '⚠️ Mangal Dosha' : '✓ No Dosha'}</div>
                </div>
            </div>
        `;
        document.getElementById('astrology-output').innerHTML = html;
    }
    return { render };
})();
console.log('✅ Astrology Engine loaded');
