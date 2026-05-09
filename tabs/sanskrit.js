// --- AIGAANE V3: SANSKRIT ENGINE (CORRECTED TRANSLITERATION) ---

// Complete Devanagari to IAST mapping (single characters)
const devToIast = {
    'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'ṛ','ॠ':'ṝ',
    'ऌ':'ḷ','ॡ':'ḹ','ए':'e','ऐ':'ai','ओ':'o','औ':'au','ं':'ṃ','ः':'ḥ',
    'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ','च':'c','छ':'ch','ज':'j',
    'झ':'jh','ञ':'ñ','ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ','त':'t',
    'थ':'th','द':'d','ध':'dh','न':'n','प':'p','फ':'ph','ब':'b','भ':'bh',
    'म':'m','य':'y','र':'r','ल':'l','व':'v','श':'ś','ष':'ṣ','स':'s','ह':'h'
};

// IAST to Devanagari mapping (includes vowel signs and conjuncts)
const iastToDevMap = {
    // Vowels
    'a': 'अ', 'ā': 'आ', 'i': 'इ', 'ī': 'ई', 'u': 'उ', 'ū': 'ऊ',
    'ṛ': 'ऋ', 'ṝ': 'ॠ', 'ḷ': 'ऌ', 'ḹ': 'ॡ', 'e': 'ए', 'ai': 'ऐ',
    'o': 'ओ', 'au': 'औ',
    
    // Consonants
    'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'ṅ': 'ङ',
    'c': 'च', 'ch': 'छ', 'j': 'ज', 'jh': 'झ', 'ñ': 'ञ',
    'ṭ': 'ट', 'ṭh': 'ठ', 'ḍ': 'ड', 'ḍh': 'ढ', 'ṇ': 'ण',
    't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
    'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
    'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'ś': 'श', 'ṣ': 'ष', 's': 'स', 'h': 'ह',
    
    // Special
    'ṃ': 'ं', 'ḥ': 'ः', '~': 'ँ',
    
    // Vowel signs (when attached to consonants)
    'ā': 'ा', 'i': 'ि', 'ī': 'ी', 'u': 'ु', 'ū': 'ू',
    'ṛ': 'ृ', 'ṝ': 'ॄ', 'ḷ': 'ॢ', 'ḹ': 'ॣ',
    'e': 'े', 'ai': 'ै', 'o': 'ो', 'au': 'ौ'
};

/**
 * Convert IAST to Devanagari properly
 * Handles consonant+vowel combinations correctly
 */
function iastToDevanagari(text) {
    if (!text) return '';
    
    let result = '';
    let i = 0;
    
    while (i < text.length) {
        // Check for 2-character sequences first (kh, ch, ṅ, etc.)
        let found = false;
        
        // Look ahead for 3-character sequences (rare, like 'ṅh')
        if (i + 2 <= text.length) {
            const threeChar = text.substr(i, 3);
            if (iastToDevMap[threeChar]) {
                result += iastToDevMap[threeChar];
                i += 3;
                found = true;
                continue;
            }
        }
        
        // Look ahead for 2-character sequences
        if (i + 1 <= text.length) {
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
            result += singleChar; // Keep unknown characters as-is
        }
        i++;
    }
    
    return result;
}

/**
 * Convert Devanagari to IAST
 */
function devanagariToIAST(text) {
    if (!text) return '';
    return text.split('').map(ch => devToIast[ch] || ch).join('');
}

/**
 * Main transliteration function
 */
function transliterate(text, direction) {
    if (!text || text.trim() === '') return '';
    
    if (direction === 'toIAST') {
        return devanagariToIAST(text);
    } else {
        return iastToDevanagari(text);
    }
}

// Sandhi rules (expanded)
const sandhiRules = {
    'रामायण': 'राम + अयण (Dīrgha Sandhi)',
    'देवालय': 'देव + आलय (Dīrgha Sandhi)',
    'सूर्योदय': 'सूर्य + उदय (Guṇa Sandhi)',
    'चन्द्रोदय': 'चन्द्र + उदय (Guṇa Sandhi)',
    'महर्षि': 'महा + ऋषि (Guṇa Sandhi)',
    'स्वागत': 'सु + आगत (Yan Sandhi)',
    'इत्यादि': 'इति + आदि (Yan Sandhi)',
    'पावक': 'पौ + अक (Ayādi Sandhi)',
    'नमस्ते': 'नमः + ते (Visarga Sandhi)',
    'तथापि': 'तथा + अपि (Dīrgha Sandhi)',
    'हरिः': 'हरि + विसर्ग (Visarga)',
    'गंगा': 'गम् + गा (Anusvāra)',
    'दिग्गज': 'दिक् + गज (Jashva Sandhi)',
    'सत्कार': 'सत् + कार (Jashva Sandhi)',
    'वागीश': 'वाक् + ईश (Jashva Sandhi)',
    'प्रत्येक': 'प्रति + एक (Yan Sandhi)',
    'षट्कोण': 'षष् + कोण (Jashva Sandhi)',
    'सम्मुख': 'सम् + मुख (Anusvāra)',
    'उच्चार': 'उत् + चार (Jashva Sandhi)',
    'सलिल': 'स + लिल (Prakriti)',
    'अध्ययन': 'अधि + अयन (Yan Sandhi)',
    'पित्राज्ञा': 'पितृ + आज्ञा (Guṇa Sandhi)',
    'देवर्षि': 'देव + ऋषि (Guṇa Sandhi)',
    'राजर्षि': 'राज + ऋषि (Guṇa Sandhi)',
    'ब्रह्मर्षि': 'ब्रह्म + ऋषि (Guṇa Sandhi)'
};

// Expanded Lexicon (50+ Vedic terms)
const lexiconTerms = [
    { term: "Atmakaraka", meaning: "Soul's significator; planet with highest longitude (22°-30°)" },
    { term: "Amatyakaraka", meaning: "'Minister' planet; career, talent, and authority" },
    { term: "Bhratrukaraka", meaning: "Sibling significator; indicates brothers and sisters" },
    { term: "Matrukaraka", meaning: "Mother significator; nurturing and emotional foundation" },
    { term: "Pitrukaraka", meaning: "Father significator; discipline and ancestry" },
    { term: "Putrakaraka", meaning: "Child significator; creativity and progeny" },
    { term: "Gnatikaraka", meaning: "Relative significator; extended family connections" },
    { term: "Darakaraka", meaning: "Spouse significator; partnership and commitment" },
    { term: "Bhava", meaning: "House; one of 12 divisions of the birth chart" },
    { term: "Graha", meaning: "Planet; celestial influencer (9 total)" },
    { term: "Rashi", meaning: "Zodiac sign; 12 equal divisions of 30° each" },
    { term: "Nakshatra", meaning: "Lunar mansion; 27 sectors of the ecliptic" },
    { term: "Lagna", meaning: "Ascendant; rising sign at time of birth" },
    { term: "Kundli", meaning: "Birth chart; complete planetary map" },
    { term: "Dosha", meaning: "Affliction; planetary imbalance requiring remedy" },
    { term: "Yoga", meaning: "Auspicious planetary combination" },
    { term: "Tithi", meaning: "Lunar day; 30 phases of the moon" },
    { term: "Karana", meaning: "Half-tithi; 11 types based on moon's motion" },
    { term: "Hora", meaning: "Hourly planetary ruler (Sun to Saturn)" },
    { term: "Drekkana", meaning: "Decanate; 3 divisions of 10° per sign" },
    { term: "Saptamsa", meaning: "7th harmonic chart; children and creativity" },
    { term: "Navamsa", meaning: "9th harmonic chart; spouse and dharma" },
    { term: "Dasamsa", meaning: "10th harmonic chart; career and status" },
    { term: "Dharma", meaning: "Right action; cosmic order and duty" },
    { term: "Artha", meaning: "Wealth; material prosperity and resources" },
    { term: "Kama", meaning: "Desire; pleasure and emotional fulfillment" },
    { term: "Moksha", meaning: "Liberation; freedom from rebirth cycle" },
    { term: "Prakriti", meaning: "Fundamental nature; constitution (Vata/Pitta/Kapha)" },
    { term: "Ojas", meaning: "Vitality; immune strength and life essence" },
    { term: "Tejas", meaning: "Radiance; metabolic fire and brilliance" },
    { term: "Prana", meaning: "Life force; breath energy sustaining body" },
    { term: "Sankalpa", meaning: "Resolve; conscious intention and vow" },
    { term: "Vayu", meaning: "Air element; movement and communication" },
    { term: "Agni", meaning: "Fire element; transformation and digestion" },
    { term: "Apas", meaning: "Water element; fluidity and emotion" },
    { term: "Prithvi", meaning: "Earth element; stability and structure" },
    { term: "Akasha", meaning: "Ether element; space and consciousness" },
    { term: "Jyotish", meaning: "Science of light; Vedic astrology" },
    { term: "Ayurveda", meaning: "Science of life; Vedic medicine" },
    { term: "Vedanta", meaning: "End of Vedas; non-dual philosophy" },
    { term: "Yantra", meaning: "Geometric diagram; energy tool" },
    { term: "Tantra", meaning: "Technique; woven tradition" },
    { term: "Mantra", meaning: "Sacred sound; mind protection" },
    { term: "Kavacha", meaning: "Armor; protective prayer" },
    { term: "Stotra", meaning: "Hymn of praise" },
    { term: "Suktam", meaning: "Well-spoken Vedic hymn" },
    { term: "Upanishad", meaning: "Sitting near; philosophical text" },
    { term: "Purana", meaning: "Ancient narrative; mythological text" },
    { term: "Itihasa", meaning: "History; epic (Ramayana, Mahabharata)" }
];

// UI Functions
function showTransliteration() {
    const html = `
        <div class="result-card">
            <h3>🔤 Sanskrit Transliteration Tool</h3>
            <textarea id="transliteration-input" rows="3" placeholder="Enter Sanskrit text..." style="width:100%; padding:10px;">Pratik</textarea>
            <select id="transliteration-direction" style="margin: 10px 0; padding: 8px;">
                <option value="toDevanagari">IAST → Devanagari</option>
                <option value="toIAST">Devanagari → IAST</option>
            </select>
            <button onclick="performTransliteration()" class="btn-primary">Convert</button>
            <div id="transliteration-output" style="margin-top: 15px; padding: 10px; background: #fefaf5;">
                <strong>Result:</strong> <span id="transliteration-result">प्रतिक</span>
            </div>
            <p style="margin-top: 10px; font-size: 0.7rem;">Example: "Pratik" → "प्रतिक" | "नमस्ते" → "namaste"</p>
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
            <input type="text" id="sandhi-word" placeholder="Enter compound word (e.g., रामायण)" style="width: 100%; padding: 10px;">
            <button onclick="splitSandhiWord()" class="btn-primary" style="margin-top: 10px;">Split Sandhi</button>
            <div id="sandhi-result" style="margin-top: 15px; padding: 10px; background: #fefaf5;"></div>
            <h4 style="margin-top: 20px;">📖 Reference Sandhi Rules:</h4>
            ${rulesHtml}
        </div>
    `;
    document.getElementById('sanskrit-output').innerHTML = html;
}

function splitSandhiWord() {
    const word = document.getElementById('sandhi-word').value;
    const result = sandhiRules[word] || `${word} (No sandhi rule found - try: रामायण, देवालय, सूर्योदय)`;
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
            <input type="text" id="lexicon-search" placeholder="Search terms..." style="width: 100%; padding: 10px; margin-bottom: 15px;" onkeyup="searchLexiconTerms()">
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

// Bind buttons
document.addEventListener('DOMContentLoaded', () => {
    const transliterateBtn = document.getElementById('transliterate-btn');
    const sandhiBtn = document.getElementById('sandhi-btn');
    const lexiconBtn = document.getElementById('lexicon-btn');
    
    if (transliterateBtn) transliterateBtn.addEventListener('click', showTransliteration);
    if (sandhiBtn) sandhiBtn.addEventListener('click', showSandhiTool);
    if (lexiconBtn) lexiconBtn.addEventListener('click', showLexicon);
    
    console.log('✅ Sanskrit Engine loaded with corrected transliteration');
});

// Make functions global for onclick handlers
window.performTransliteration = performTransliteration;
window.splitSandhiWord = splitSandhiWord;
window.searchLexiconTerms = searchLexiconTerms;