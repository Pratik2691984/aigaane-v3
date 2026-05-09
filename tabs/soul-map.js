window.SoulMap = (function() {
    function render() {
        const tensor = window.Quantatech?.getTensor();
        const metrics = window.Quantatech?.getMetrics();
        const userName = document.getElementById('user-name')?.value || 'Seeker';
        
        if (!tensor || !tensor.length) {
            document.getElementById('soulmap-output').innerHTML = '<div class="info-card">Waiting for kernel initialization...</div>';
            return;
        }
        
        const grahas = ['Sūrya', 'Chandra', 'Maṅgala', 'Budha', 'Guru', 'Śukra', 'Śani', 'Rāhu', 'Ketu'];
        const atmakaraka = grahas[Math.floor((tensor[12]||0.5) * 9) % 9];
        const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 
                            'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
                            'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
                            'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 
                            'Shatabhisha', 'Purva Bhadra', 'Uttara Bhadra', 'Revati'];
        const nakshatra = nakshatras[Math.floor((tensor[9]||0.5) * 27) % 27];
        
        const html = `
            <div class="result-card">
                <h3>🧬 49D Soul Map for ${userName}</h3>
                <div class="result-grid">
                    <div class="result-item"><strong>🌟 Ātma Kāraka</strong><br>${atmakaraka}</div>
                    <div class="result-item"><strong>🌙 Nakṣatra</strong><br>${nakshatra}</div>
                    <div class="result-item"><strong>📊 Kernel Hash</strong><br>${metrics?.resonanceHash || '—'}</div>
                    <div class="result-item"><strong>🔬 Entropy</strong><br>${metrics?.anumanaEntropy || '—'}</div>
                </div>
            </div>
        `;
        document.getElementById('soulmap-output').innerHTML = html;
    }
    return { render };
})();
console.log('✅ Soul Map Engine loaded');
