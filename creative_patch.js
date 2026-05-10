// ========== CREATIVE DISPLAY INTEGRATION ==========
// Add this function to your index.html script section

async function analyzeCreative() {
    const text = document.getElementById('mantra49d').value.trim() || "Om";
    const resultDiv = document.getElementById('creativeResult');
    
    if (!resultDiv) {
        // Create creative result div if not exists
        const container = document.getElementById('mantra49dResult');
        const newDiv = document.createElement('div');
        newDiv.id = 'creativeResult';
        newDiv.className = 'mantra-result';
        newDiv.style.marginTop = '1rem';
        container.parentNode.insertBefore(newDiv, container.nextSibling);
    }
    
    try {
        const response = await fetch('/api/nakshatra/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            const html = `
                <div style="border-top: 2px solid #e67e22; padding-top: 1rem;">
                    <h4>🎵 Creative Analysis for "${data.text}"</h4>
                    <table style="width:100%; margin-top:0.5rem;">
                        <tr><td><strong>Nakṣatra:</strong></td><td>${data.nakshatra} (Index ${data.index})</td></tr>
                        <tr><td><strong>Svara:</strong></td><td>${data.sound.svara} → ${data.frequency_hz} Hz</td></tr>
                        <tr><td><strong>Rāga:</strong></td><td>${data.sound.raga} (${data.sound.time}, ${data.sound.mood})</td></tr>
                        <tr><td><strong>Chand (Meter):</strong></td><td>${data.creative.chand.meter} - ${data.creative.chand.style}</td></tr>
                        <tr><td><strong>Kavita Rasa:</strong></td><td>${data.creative.kavita.rasa}</td></tr>
                        <tr><td><strong>Theme:</strong></td><td>${data.creative.kavita.theme}</td></tr>
                        <tr><td><strong>Imagery:</strong></td><td>${data.creative.kavita.imagery.slice(0,3).join(', ')}</td></tr>
                        <tr><td><strong>Bīja Phoneme:</strong></td><td>${data.creative.lyrics.bija_phoneme} (${data.creative.lyrics.phoneme_class})</td></tr>
                        <tr><td><strong>Suggested Mantra:</strong></td><td><code>${data.mantra}</code></td></tr>
                    </table>
                    <button onclick="playTone(${data.frequency_hz}, 3)" style="margin-top:0.5rem">🔊 Play Svara (${data.frequency_hz} Hz)</button>
                </div>
            `;
            
            document.getElementById('creativeResult').innerHTML = html;
        } else {
            document.getElementById('creativeResult').innerHTML = '<span style="color:red">Error fetching creative analysis</span>';
        }
    } catch (err) {
        console.error("Creative analysis error:", err);
        if (document.getElementById('creativeResult')) {
            document.getElementById('creativeResult').innerHTML = '<span style="color:red">Backend not available - using simulation</span>';
        }
    }
}

// Update analyze49d to call creative analysis
const originalAnalyze = analyze49d;
window.analyze49d = async function() {
    await originalAnalyze();
    await analyzeCreative();
};

// Add refresh button for creative analysis
document.getElementById('refreshRagaBtn')?.addEventListener('click', analyzeCreative);
