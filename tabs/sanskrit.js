// tabs/sanskrit.js
window.SanskritEngine = {
    devToIast: { 'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'ṛ','ए':'e','ऐ':'ai','ओ':'o','औ':'au','क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ','च':'c','छ':'ch','ज':'j','झ':'jh','ञ':'ñ','ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ','त':'t','थ':'th','द':'d','ध':'dh','न':'n','प':'p','फ':'ph','ब':'b','भ':'bh','म':'m','य':'y','र':'r','ल':'l','व':'v','श':'ś','ष':'ṣ','स':'s','ह':'h','ः':'ḥ','ं':'ṃ' },
    
    transliterate: function(text, direction = 'toIAST') {
        if (direction === 'toIAST') {
            return text.split('').map(ch => this.devToIast[ch] || ch).join('');
        }
        return text; // simplified IAST to Devanagari placeholder
    },
    
    showTransliterationTool: function() {
        const html = `
            <div class="result-card">
                <h3>🔤 Devanagari ↔ IAST</h3>
                <textarea id="sans-input" rows="3" style="width:100%; padding:8px; margin:10px 0;">नमस्ते</textarea>
                <button id="convert-sans" class="btn-primary">Convert to IAST</button>
                <div id="sans-output" style="margin-top:12px; padding:10px; background:#fefaf5;"><strong>Output:</strong> namaste</div>
            </div>
        `;
        document.getElementById('sanskrit-output').innerHTML = html;
        document.getElementById('convert-sans')?.addEventListener('click', () => {
            const input = document.getElementById('sans-input').value;
            const result = this.transliterate(input, 'toIAST');
            document.getElementById('sans-output').innerHTML = `<strong>Output:</strong> ${result}`;
        });
    },
    
    showSandhiTool: function() {
        const html = `<div class="result-card"><h3>⚡ Sandhi Splitter</h3><input type="text" id="sandhi-word" placeholder="e.g., रामायण" style="width:100%; padding:8px;"><button id="split-sandhi" class="btn-primary" style="margin-top:10px;">Split</button><div id="sandhi-result" style="margin-top:12px;"></div></div>`;
        document.getElementById('sanskrit-output').innerHTML = html;
        document.getElementById('split-sandhi')?.addEventListener('click', () => {
            const word = document.getElementById('sandhi-word').value;
            const rules = { 'रामायण': 'राम + अयण', 'देवालय': 'देव + आलय', 'हरिः': 'हरि + ः' };
            document.getElementById('sandhi-result').innerHTML = `<strong>Split:</strong> ${rules[word] || word + ' (no sandhi detected)'}`;
        });
    },
    
    showLexicon: function() {
        const lexicon = window.Quantatech.getLexicon();
        let items = '';
        lexicon.forEach(l => { items += `<div class="result-item"><strong>${l.term}</strong><br>${l.meaning}</div>`; });
        document.getElementById('sanskrit-output').innerHTML = `<div class="result-card"><h3>📖 Jyotish Lexicon</h3><div class="result-grid">${items}</div></div>`;
    }
};

// Bind buttons after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('transliterate-btn')?.addEventListener('click', () => window.SanskritEngine.showTransliterationTool());
    document.getElementById('sandhi-btn')?.addEventListener('click', () => window.SanskritEngine.showSandhiTool());
    document.getElementById('lexicon-btn')?.addEventListener('click', () => window.SanskritEngine.showLexicon());
});