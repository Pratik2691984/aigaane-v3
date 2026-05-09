// tabs/soul-map.js
window.SoulMap = {
    render: function() {
        const tensor = window.Quantatech.getTensor();
        const metrics = window.Quantatech.getMetrics();
        if (!tensor.length) return;
        
        const d1_7 = tensor.slice(0,7).reduce((a,b)=>a+b,0).toFixed(3);
        const freqLayer = tensor.slice(7,21).reduce((a,b)=>a+b,0).toFixed(3);
        const anumanaCore = tensor.slice(21,35).reduce((a,b)=>a+b,0).toFixed(3);
        
        const atmakarakaIdx = Math.floor(tensor[12] * 9) % 9;
        const grahas = ['Sūrya', 'Chandra', 'Maṅgala', 'Budha', 'Guru', 'Śukra', 'Śani', 'Rāhu', 'Ketu'];
        const atmakaraka = grahas[atmakarakaIdx];
        
        const nakshatraIdx = Math.floor(tensor[16] * 27);
        const nakshatras = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadra','Uttara Bhadra','Revati'];
        
        const html = `
            <div class="result-card">
                <h3>🧬 49D Soul Map Profile</h3>
                <div class="result-grid">
                    <div class="result-item"><strong>Ātma Kāraka</strong><br>${atmakaraka}</div>
                    <div class="result-item"><strong>Nakṣatra</strong><br>${nakshatras[nakshatraIdx % 27]}</div>
                    <div class="result-item"><strong>Root 7D Cohesion</strong><br>${d1_7}</div>
                    <div class="result-item"><strong>Frequency Band (8-21)</strong><br>${freqLayer}</div>
                    <div class="result-item"><strong>Anumana Layer (22-35)</strong><br>${anumanaCore}</div>
                    <div class="result-item"><strong>Kernel Magnitude</strong><br>${metrics.vectorMagnitude}</div>
                </div>
                <p class="mono" style="margin-top:1rem; font-size:0.7rem;">✓ Unified 49D arithmetic: all tabs derive from same tensor</p>
            </div>
        `;
        document.getElementById('soulmap-output').innerHTML = html;
    }
};