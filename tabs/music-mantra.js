// tabs/music-mantra.js
window.MusicMantra = {
    render: function() {
        const tensor = window.Quantatech.getTensor();
        const entries = window.Quantatech.getVedicEntries();
        if (!tensor.length) return;
        
        const freqBand = tensor.slice(7, 21);
        const avgFreq = freqBand.reduce((a,b)=>a+b,0) / freqBand.length;
        const notes = ['Shadja (Sa)', 'Rishabha (Re)', 'Gandhara (Ga)', 'Madhyama (Ma)', 'Panchama (Pa)', 'Dhaivata (Dha)', 'Nishada (Ni)'];
        const swara = notes[Math.floor(avgFreq * 7) % 7];
        
        // Find matching mantra based on frequency dimension
        const targetDim = Math.floor(avgFreq * 20) + 1;
        const matched = entries.find(e => e.frequency_dim === targetDim) || entries[0];
        
        const html = `
            <div class="result-card">
                <h3>🎵 49D → Musical Resonance</h3>
                <div class="result-grid">
                    <div class="result-item"><strong>Vedic Swara</strong><br>${swara}<br><small>${(avgFreq * 432).toFixed(2)} Hz</small></div>
                    <div class="result-item"><strong>Matched Mantra</strong><br>${matched.mantra || 'Om'}<br><small>${matched.deity || 'Vedic'}</small></div>
                    <div class="result-item"><strong>Nakshatra Resonance</strong><br>${matched.nakshatra || 'Universal'}</div>
                    <div class="result-item"><strong>Frequency Dim Index</strong><br>Dim ${targetDim} → ${avgFreq.toFixed(3)}</div>
                </div>
                <p class="mono" style="margin-top:0.8rem;">◆ Derived from dimensions 8-21 (frequency resonance band) ◆</p>
            </div>
        `;
        document.getElementById('music-output').innerHTML = html;
    }
};