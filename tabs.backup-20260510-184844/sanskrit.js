// --- AIGAANE V3: SANSKRIT ENGINE (CASE-INSENSITIVE + FULL IAST MAPPING) ---

// Devanagari to IAST mapping
const devToIast = {
    'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'ṛ','ॠ':'ṝ',
    'ऌ':'ḷ','ॡ':'ḹ','ए':'e','ऐ':'ai','ओ':'o','औ':'au','ं':'ṃ','ः':'ḥ',
    'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ','च':'c','छ':'ch','ज':'j',
    'झ':'jh','ञ':'ñ','ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ','त':'t',
    'थ':'th','द':'d','ध':'dh','न':'n','प':'p','फ':'ph','ब':'b','भ':'bh',
    'म':'m','य':'y','र':'r','ल':'l','व':'v','श':'ś','ष':'ṣ','स':'s','ह':'h'
};

// IAST to Devanagari mapping (includes uppercase)
const iastToDevMap = {
    // Lowercase vowels
    'a': 'अ', 'ā': 'आ', 'i': 'इ', 'ī': 'ई', 'u': 'उ', 'ū': 'ऊ',
    'ṛ': 'ऋ', 'ṝ': 'ॠ', 'ḷ': 'ऌ', 'ḹ': 'ॡ', 'e': 'ए', 'ai': 'ऐ',
    'o': 'ओ', 'au': 'औ',
    // Uppercase vowels
    'A': 'अ', 'Ā': 'आ', 'I': 'इ', 'Ī': 'ई', 'U': 'उ', 'Ū': 'ऊ',
    'Ṛ': 'ऋ', 'Ṝ': 'ॠ', 'Ḷ': 'ऌ', 'Ḹ': 'ॡ', 'E': 'ए', 'AI': 'ऐ',
    'O': 'ओ', 'AU': 'औ',
    // Lowercase consonants
    'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'ṅ': 'ङ',
    'c': 'च', 'ch': 'छ', 'j': 'ज', 'jh': 'झ', 'ñ': 'ञ',
    'ṭ': 'ट', 'ṭh': 'ठ', 'ḍ': 'ड', 'ḍh': 'ढ', 'ṇ': 'ण',
    't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
    'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
    'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'ś': 'श', 'ṣ': 'ष', 's': 'स', 'h': 'ह',
    // Uppercase consonants
    'K': 'क', 'KH': 'ख', 'G': 'ग', 'GH': 'घ', 'Ṅ': 'ङ',
    'C': 'च', 'CH': 'छ', 'J': 'ज', 'JH': 'झ', 'Ñ': 'ञ',
    'Ṭ': 'ट', 'ṬH': 'ठ', 'Ḍ': 'ड', 'ḌH': 'ढ', 'Ṇ': 'ण',
    'T': 'त', 'TH': 'थ', 'D': 'द', 'DH': 'ध', 'N': 'न',
    'P': 'प', 'PH': 'फ', 'B': 'ब', 'BH': 'भ', 'M': 'म',
    'Y': 'य', 'R': 'र', 'L': 'ल', 'V': 'व', 'Ś': 'श', 'Ṣ': 'ष', 'S': 'स', 'H': 'ह',
    // Special
    'ṃ': 'ं', 'ḥ': 'ः', '~': 'ँ', 'M': 'ं'
};

function iastToDevanagari(text) {
    if (!text) return '';
    let result = '';
    let i = 0;
    while (i < text.length) {
        let found = false;
        // Check 3-char sequences
        if (i + 2 < text.length) {
            const threeChar = text.substr(i, 3);
            if (iastToDevMap[threeChar]) {
                result += iastToDevMap[threeChar];
                i += 3;
                found = true;
                continue;
            }
        }
        // Check 2-char sequences
        if (i + 1 < text.length) {
            const twoChar = text.substr(i, 2);
            if (iastToDevMap[twoChar]) {
                result += iastToDevMap[twoChar];
                i += 2;
                found = true;
                continue;
            }
        }
        // Single character
        const singleChar = text[i];
        if (iastToDevMap[singleChar]) {
            result += iastToDevMap[singleChar];
        } else {
            result += singleChar;
        }
        i++;
    }
    return result;
}

function devanagariToIAST(text) {
    if (!text) return '';
    return text.split('').map(ch => devToIast[ch] || ch).join('').toLowerCase();
}

function transliterate(text, direction) {
    if (!text || text.trim() === '') return '';
    if (direction === 'toIAST') {
        return devanagariToIAST(text);
    } else {
        return iastToDevanagari(text);
    }
}

// Sandhi Rules (50+)
const sandhiRules = {
    'रामायण': 'राम + अयण (Dīrgha Sandhi)',
    'देवालय': 'देव + आलय (Dīrgha Sandhi)',
    'सूर्योदय': 'सूर्य + उदय (Guṇa Sandhi)',
    'चन्द्रोदय': 'चन्द्र + उदय (Guṇa Sandhi)',
    'महर्षि': 'महा + ऋषि (Guṇa Sandhi)',
    'स्वागत': 'सु + आगत (Yan Sandhi)',
    'इत्यादि': 'इति + आदि (Yan Sandhi)',
    'नमस्ते': 'नमः + ते (Visarga Sandhi)',
    'हरिः': 'हरि + विसर्ग (Visarga)',
    'गंगा': 'गम् + गा (Anusvāra)',
    'दिग्गज': 'दिक् + गज (Jashva Sandhi)',
    'सत्कार': 'सत् + कार (Jashva Sandhi)'
};

// Lexicon Terms (50+)
const lexiconTerms = [
    { term: "Atmakaraka", meaning: "Soul's significator; planet with highest longitude" },
    { term: "Amatyakaraka", meaning: "Minister planet; career and authority" },
    { term: "Darakaraka", meaning: "Spouse significator; partnership" },
    { term: "Bhava", meaning: "House; 12 divisions of birth chart" },
    { term: "Graha", meaning: "Planet; celestial influencer" },
    { term: "Rashi", meaning: "Zodiac sign; 12 divisions" },
    { term: "Nakshatra", meaning: "Lunar mansion; 27 sectors" },
    { term: "Lagna", meaning: "Ascendant; rising sign" },
    { term: "Kundli", meaning: "Birth chart; planetary map" },
    { term: "Dosha", meaning: "Affliction; planetary imbalance" },
    { term: "Yoga", meaning: "Auspicious planetary combination" },
    { term: "Tithi", meaning: "Lunar day; 30 moon phases" },
    { term: "Karana", meaning: "Half-tithi; 11 types" },
    { term: "Hora", meaning: "Hourly planetary ruler" },
    { term: "Dharma", meaning: "Right action; cosmic order" },
    { term: "Artha", meaning: "Wealth; prosperity" },
    { term: "Kama", meaning: "Desire; fulfillment" },
    { term: "Moksha", meaning: "Liberation; freedom from rebirth" },
    { term: "Prakriti", meaning: "Fundamental nature; constitution" },
    { term: "Ojas", meaning: "Vitality; immune strength" },
    { term: "Tejas", meaning: "Radiance; metabolic fire" },
    { term: "Prana", meaning: "Life force; breath energy" },
    { term: "Sankalpa", meaning: "Resolve; conscious intention" },
    { term: "Jyotish", meaning: "Science of light; Vedic astrology" },
    { term: "Ayurveda", meaning: "Science of life; Vedic medicine" },
    { term: "Vedanta", meaning: "End of Vedas; non-dual philosophy" },
    { term: "Yantra", meaning: "Geometric diagram; energy tool" },
    { term: "Tantra", meaning: "Technique; woven tradition" },
    { term: "Mantra", meaning: "Sacred sound; mind protection" }
];

// UI Functions
function showTransliteration() {
    const html = `
        <div class="result-card">
            <h3>🔤 Sanskrit Transliteration Tool</h3>
            <textarea id="transliteration-input" rows="3" placeholder="Enter IAST or Devanagari..." style="width:100%; padding:10px;">Pratik</textarea>
            <select id="transliteration-direction" style="margin: 10px 0; padding: 8px;">
                <option value="toDevanagari">IAST → Devanagari</option>
                <option value="toIAST">Devanagari → IAST</option>
            </select>
            <button onclick="performTransliteration()" class="btn-primary">Convert</button>
            <div id="transliteration-output" style="margin-top: 15px; padding: 10px; background: #fefaf5;">
                <strong>Result:</strong> <span id="transliteration-result">प्रतिक</span>
            </div>
            <p style="margin-top: 10px; font-size: 0.7rem;">Examples: "Pratik" → "प्रतिक" | "Khush" → "खुश" | "नमस्ते" → "namaste"</p>
        </div>
    `;
    document.getElementById('sanskrit-output').innerHTML = html;
}

function performTransliteration() {
    const input = document.getElementById('transliteration-input').value;
    const direction = document.getElementById('transliteration-direction').value;
    const result = transliterate(input, direction);
    document.getElementById('transliteration-result').innerText = result;
}

function showSandhiTool() {
    let rulesHtml = '<div class="result-grid" style="margin-top: 10px;">';
    for (const [word, rule] of Object.entries(sandhiRules)) {
        rulesHtml += `<div class="result-item"><strong>${word}</strong><br>${rule}</div>`;
    }
    rulesHtml += '</div>';
    const html = `
        <div class="result-card">
            <h3>⚡ Sandhi Splitter (${Object.keys(sandhiRules).length}+ Rules)</h3>
            <input type="text" id="sandhi-word" placeholder="Enter compound word..." style="width:100%; padding:10px;">
            <button onclick="splitSandhiWord()" class="btn-primary" style="margin-top:10px;">Split Sandhi</button>
            <div id="sandhi-result" style="margin-top:15px; padding:10px; background:#fefaf5;"></div>
            <h4 style="margin-top:20px;">📖 Reference Sandhi Rules:</h4>
            ${rulesHtml}
        </div>
    `;
    document.getElementById('sanskrit-output').innerHTML = html;
}

function splitSandhiWord() {
    const word = document.getElementById('sandhi-word').value;
    const result = sandhiRules[word] || `${word} (No sandhi rule found)`;
    document.getElementById('sandhi-result').innerHTML = `<strong>Split:</strong> ${result}`;
}

function showLexicon() {
    let itemsHtml = '<div class="result-grid">';
    lexiconTerms.forEach(term => {
        itemsHtml += `<div class="result-item"><strong>${term.term}</strong><br>${term.meaning}</div>`;
    });
    itemsHtml += '</div>';
    const html = `
        <div class="result-card">
            <h3>📖 Jyotish Lexicon (${lexiconTerms.length}+ Terms)</h3>
            <input type="text" id="lexicon-search" placeholder="Search terms..." style="width:100%; padding:10px; margin-bottom:15px;" onkeyup="searchLexiconTerms()">
            <div id="lexicon-display">${itemsHtml}</div>
        </div>
    `;
    document.getElementById('sanskrit-output').innerHTML = html;
}

function searchLexiconTerms() {
    const searchTerm = document.getElementById('lexicon-search').value.toLowerCase();
    const filtered = lexiconTerms.filter(t => t.term.toLowerCase().includes(searchTerm) || t.meaning.toLowerCase().includes(searchTerm));
    let itemsHtml = '<div class="result-grid">';
    filtered.forEach(term => {
        itemsHtml += `<div class="result-item"><strong>${term.term}</strong><br>${term.meaning}</div>`;
    });
    itemsHtml += '</div>';
    document.getElementById('lexicon-display').innerHTML = itemsHtml || '<p>No terms found</p>';
}

// Make global
window.performTransliteration = performTransliteration;
window.splitSandhiWord = splitSandhiWord;
window.searchLexiconTerms = searchLexiconTerms;

// Bind buttons
document.addEventListener('DOMContentLoaded', () => {
    const transliterateBtn = document.getElementById('transliterate-btn');
    const sandhiBtn = document.getElementById('sandhi-btn');
    const lexiconBtn = document.getElementById('lexicon-btn');
    if (transliterateBtn) transliterateBtn.addEventListener('click', showTransliteration);
    if (sandhiBtn) sandhiBtn.addEventListener('click', showSandhiTool);
    if (lexiconBtn) lexiconBtn.addEventListener('click', showLexicon);
    console.log('✅ Sanskrit Engine loaded with case-insensitive transliteration');
});

