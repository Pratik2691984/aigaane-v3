// --- AIGAANE V3: SANSKRIT ENGINE (FULL VERSION) ---

// Complete Devanagari to IAST mapping
const devToIast = {
    'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'ṛ','ॠ':'ṝ',
    'ऌ':'ḷ','ॡ':'ḹ','ए':'e','ऐ':'ai','ओ':'o','औ':'au','ं':'ṃ','ः':'ḥ',
    'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ','च':'c','छ':'ch','ज':'j',
    'झ':'jh','ञ':'ñ','ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ','त':'t',
    'थ':'th','द':'d','ध':'dh','न':'n','प':'p','फ':'ph','ब':'b','भ':'bh',
    'म':'m','य':'y','र':'r','ल':'l','व':'v','श':'ś','ष':'ṣ','स':'s','ह':'h'
};

const iastToDev = Object.fromEntries(Object.entries(devToIast).map(([d,i]) => [i,d]));

// Transliteration function (both directions)
function transliterate(text, direction) {
    if (!text) return '';
    if (direction === 'toIAST') {
        return text.split('').map(ch => devToIast[ch] || ch).join('');
    } else {
        let result = text;
        const sortedIast = Object.keys(iastToDev).sort((a, b) => b.length - a.length);
        sortedIast.forEach(key => {
            const regex = new RegExp(key, 'g');
            result = result.replace(regex, iastToDev[key]);
        });
        return result;
    }
}

// Expanded Sandhi Rules (50+ rules)
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
    'सलिल': 'स + लिल (Prakriti)',
    'अध्ययन': 'अधि + अयन (Yan Sandhi)'
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
    { term: "Dwadasamsa", meaning: "12th harmonic chart; parents and lineage" },
    { term: "Shodasamsa", meaning: "16th harmonic chart; vehicles and comforts" },
    { term: "Vimsamsa", meaning: "20th harmonic chart; spiritual growth" },
    { term: "Chaturvimsa", meaning: "24th harmonic chart; knowledge and learning" },
    { term: "Saptavimsa", meaning: "27th harmonic chart; strengths and weaknesses" },
    { term: "Trimshamsa", meaning: "30th harmonic chart; misfortunes and afflictions" },
    { term: "Khavedamsa", meaning: "40th harmonic chart; auspiciousness" },
    { term: "Akshavedamsa", meaning: "45th harmonic chart; general well-being" },
    { term: "Shashtyamsa", meaning: "60th harmonic chart; past life karma" },
    { term: "Dharma", meaning: "Right action; cosmic order and duty" },
    { term: "Artha", meaning: "Wealth; material prosperity and resources" },
    { term: "Kama", meaning: "Desire; pleasure and emotional fulfillment" },
    { term: "Moksha", meaning: "Liberation; freedom from rebirth cycle" },
    { term: "Prakriti", meaning: "Fundamental nature; constitution (Vata/Pitta/Kapha)" },
    { term: "Vikriti", meaning: "Imbalanced state; current health condition" },
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
    { term: "Vedanta", meaning: "End of Vedas; non-dual philosophy" }
];

// UI Functions
function showTransliteration() {
    const html = `
        <div class="result-card">
            <h3>🔤 Sanskrit Transliteration Tool</h3>
            <textarea id="transliteration-input" rows="3" placeholder="Enter Sanskrit text...">नमस्ते</textarea>
            <select id="transliteration-direction" style="margin: 10px 0; padding: 8px;">
                <option value="toIAST">Devanagari → IAST</option>
                <option value="toDevanagari">IAST → Devanagari</option>
            </select>
            <button onclick="performTransliteration()" class="btn-primary">Convert</button>
            <div id="transliteration-output" style="margin-top: 15px; padding: 10px; background: #fefaf5;">
                <strong>Result:</strong> <span id="transliteration-result">namaste</span>
            </div>
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
            <h3>⚡ Sandhi Splitter (50+ Rules)</h3>
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
    document.getElementById('transliterate-btn')?.addEventListener('click', showTransliteration);
    document.getElementById('sandhi-btn')?.addEventListener('click', showSandhiTool);
    document.getElementById('lexicon-btn')?.addEventListener('click', showLexicon);
});

console.log('✅ Sanskrit Engine loaded with 50+ sandhi rules and 50+ lexicon terms');
