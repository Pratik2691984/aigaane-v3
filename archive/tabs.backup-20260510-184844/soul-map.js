// --- SOUL MAP ENGINE ---
window.SoulMap = (function() {
    
    function render() {
        const tensor = window.Quantatech?.getTensor();
        const metrics = window.Quantatech?.getMetrics();
        const userName = document.getElementById('user-name')?.value || 'Seeker';
        const birthLocation = document.getElementById('birth-location')?.value || 'New Delhi, India';
        
        if (!tensor || !tensor.length) {
            document.getElementById('soulmap-output').innerHTML = '<div class="info-card">Waiting for kernel initialization...</div>';
            return;
        }
        
        // Calculate 49D dimensional metrics
        const d1_7 = tensor.slice(0, 7).reduce((a,b) => a+b, 0).toFixed(3);
        const freqLayer = tensor.slice(7, 21).reduce((a,b) => a+b, 0).toFixed(3);
        const anumanaLayer = tensor.slice(21, 35).reduce((a,b) => a+b, 0).toFixed(3);
        const predictiveLayer = tensor.slice(35, 49).reduce((a,b) => a+b, 0).toFixed(3);
        
        // Calculate Ātma Kāraka from tensor
        const atmakarakaIdx = Math.floor(tensor[12] * 9) % 9;
        const grahas = ['Sūrya (Sun)', 'Chandra (Moon)', 'Maṅgala (Mars)', 'Budha (Mercury)', 
                        'Guru (Jupiter)', 'Śukra (Venus)', 'Śani (Saturn)', 'Rāhu (North Node)', 'Ketu (South Node)'];
        const atmakaraka = grahas[atmakarakaIdx];
        
        // Determine Ishta Devata from frequency band
        const ishtaSeed = tensor[18];
        const deities = ['Gaṇapati', 'Śiva', 'Viṣṇu', 'Durgā', 'Lakṣmī', 'Sarasvatī', 'Hanumān', 'Sūrya'];
        const ishtaDevata = deities[Math.floor(ishtaSeed * 7) % 7];
        
        // Calculate Nakshatra from moon dimension
        const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 
                            'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
                            'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
                            'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 
                            'Shatabhisha', 'Purva Bhadra', 'Uttara Bhadra', 'Revati'];
        const nakshatra = nakshatras[Math.floor((tensor[9] || 0.5) * 27) % 27];
        const nakshatraPadam = Math.floor((tensor[10] || 0.5) * 4) % 4 + 1;
        
        // Life purpose from Anumana layer
        const purposeCode = tensor[24] || 0.5;
        const purposes = ['Dharma Seva (Sacred Service)', 'Creative Manifestation', 
                          'Wisdom Integration', 'Healing Resonance', 'Leadership Expression'];
        const lifePurpose = purposes[Math.floor(purposeCode * 5) % 5];
        
        // Generate soul mantra
        const mantraSeed = tensor[28] || 0.5;
        const soulMantra = mantraSeed > 0.66 ? "ॐ श्री आदिगुरवे नमः" : 
                          (mantraSeed > 0.33 ? "ह्रीं क्लीं श्रीं" : "ॐ अनंताय धीमहि");
        
        const html = `
            <div class="result-card">
                <h3>🧬 49D Soul Map Profile for ${userName}</h3>
                <p style="margin-bottom: 15px; font-size: 0.8rem;">📍 ${birthLocation}</p>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>🌟 Ātma Kāraka (Soul Planet)</strong><br>${atmakaraka}
                        <small>Your soul's primary guide</small>
                    </div>
                    <div class="result-item">
                        <strong>🙏 Iṣṭa Devatā (Chosen Deity)</strong><br>${ishtaDevata}
                        <small>Personal divine connection</small>
                    </div>
                    <div class="result-item">
                        <strong>🌙 Nakṣatra (Birth Star)</strong><br>${nakshatra} (Pāda ${nakshatraPadam})
                        <small>Lunar mansion influence</small>
                    </div>
                    <div class="result-item">
                        <strong>🎯 Life Purpose (Anumana)</strong><br>${lifePurpose}
                        <small>From predictive layer</small>
                    </div>
                    <div class="result-item">
                        <strong>🔊 Soul Mantra</strong><br>${soulMantra}
                        <small>Resonant vibration</small>
                    </div>
                    <div class="result-item">
                        <strong>📊 Dimensional Cohesion</strong><br>Root 7D: ${d1_7} | Freq: ${freqLayer}
                        <small>Physical → Energetic</small>
                    </div>
                </div>
                <div class="result-item" style="margin-top: 1rem;">
                    <strong>🔬 49D Kernel Stats</strong><br>
                    Anumana Entropy: ${metrics?.anumanaEntropy || '—'} | 
                    Resonance Hash: ${metrics?.resonanceHash || '—'} |
                    Vector Magnitude: ${metrics?.vectorMagnitude || '—'}
                </div>
                <p class="mono" style="margin-top: 1rem; font-size: 0.7rem;">✓ Unified 49D arithmetic: All dimensions from same tensor</p>
            </div>
        `;
        
        document.getElementById('soulmap-output').innerHTML = html;
    }
    
    return { render };
})();

console.log('✅ Soul Map Engine loaded');