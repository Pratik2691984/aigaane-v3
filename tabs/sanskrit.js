// ============================================================
// AIGAANE V3 - SANSKRIT ENGINE WITH ENHANCED SANDHI SPLITTER
// ============================================================

// Devanagari to IAST mapping
const devToIast = {
    'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'ṛ','ॠ':'ṝ',
    'ऌ':'ḷ','ॡ':'ḹ','ए':'e','ऐ':'ai','ओ':'o','औ':'au','ं':'ṃ','ः':'ḥ',
    'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ','च':'c','छ':'ch','ज':'j',
    'झ':'jh','ञ':'ñ','ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ','त':'t',
    'थ':'th','द':'d','ध':'dh','न':'n','प':'p','फ':'ph','ब':'b','भ':'bh',
    'म':'m','य':'y','र':'r','ल':'l','व':'v','श':'ś','ष':'ṣ','स':'s','ह':'h'
};

// IAST to Devanagari mapping
const iastToDev = {};
for (let [k, v] of Object.entries(devToIast)) {
    iastToDev[v] = k;
}

// ============================================================
// ENHANCED SANDHI SPLITTER ENGINE
// ============================================================

const SandhiEngine = {
    // Sandhi rules based on Paninian Sutras
    rules: [
        {
            name: "Savarna Dīrgha (6.1.101)",
            marker: /ā|ī|ū/,
            priority: 100,
            transform: function(word) {
                let results = [];
                if (word.includes('ā')) {
                    results.push({ split: word.replace('ā', 'a + a'), type: "identical" });
                    results.push({ split: word.replace('ā', 'a + ā'), type: "short+long" });
                    results.push({ split: word.replace('ā', 'ā + a'), type: "long+short" });
                }
                if (word.includes('ī')) {
                    results.push({ split: word.replace('ī', 'i + i'), type: "identical" });
                    results.push({ split: word.replace('ī', 'i + ī'), type: "short+long" });
                }
                if (word.includes('ū')) {
                    results.push({ split: word.replace('ū', 'u + u'), type: "identical" });
                    results.push({ split: word.replace('ū', 'u + ū'), type: "short+long" });
                }
                return results;
            }
        },
        {
            name: "Guṇa Sandhi (6.1.87)",
            marker: /e|o/,
            priority: 90,
            transform: function(word) {
                let results = [];
                if (word.includes('e')) {
                    results.push({ split: word.replace('e', 'a + i'), type: "a+i→e" });
                    results.push({ split: word.replace('e', 'a + ī'), type: "a+ī→e" });
                    results.push({ split: word.replace('e', 'ā + i'), type: "ā+i→e" });
                }
                if (word.includes('o')) {
                    results.push({ split: word.replace('o', 'a + u'), type: "a+u→o" });
                    results.push({ split: word.replace('o', 'a + ū'), type: "a+ū→o" });
                    results.push({ split: word.replace('o', 'aḥ + '), type: "visarga+u→o" });
                }
                return results;
            }
        },
        {
            name: "Vṛddhi Sandhi (6.1.88)",
            marker: /ai|au/,
            priority: 85,
            transform: function(word) {
                let results = [];
                if (word.includes('ai')) {
                    results.push({ split: word.replace('ai', 'a + e'), type: "a+e→ai" });
                    results.push({ split: word.replace('ai', 'ā + e'), type: "ā+e→ai" });
                }
                if (word.includes('au')) {
                    results.push({ split: word.replace('au', 'a + o'), type: "a+o→au" });
                    results.push({ split: word.replace('au', 'ā + o'), type: "ā+o→au" });
                }
                return results;
            }
        },
        {
            name: "Yan Sandhi (6.1.77)",
            marker: /y|v|r|l/,
            priority: 80,
            transform: function(word) {
                let results = [];
                if (word.includes('y')) {
                    results.push({ split: word.replace('y', 'i + '), type: "i+vowel→y" });
                    results.push({ split: word.replace('y', 'ī + '), type: "ī+vowel→y" });
                }
                if (word.includes('v')) {
                    results.push({ split: word.replace('v', 'u + '), type: "u+vowel→v" });
                    results.push({ split: word.replace('v', 'ū + '), type: "ū+vowel→v" });
                }
                if (word.includes('r')) {
                    results.push({ split: word.replace('r', 'ṛ + '), type: "ṛ+vowel→r" });
                }
                if (word.includes('l')) {
                    results.push({ split: word.replace('l', 'ḷ + '), type: "ḷ+vowel→l" });
                }
                return results;
            }
        },
        {
            name: "Visarga Sandhi (8.3.15)",
            marker: /ḥ/,
            priority: 95,
            transform: function(word) {
                let results = [];
                let parts = word.split('ḥ');
                if (parts.length > 1) {
                    results.push({ split: parts[0] + ' + ' + 's' + parts[1], type: "visarga→s" });
                    results.push({ split: parts[0] + ' + ' + 'r' + parts[1], type: "visarga→r" });
                    results.push({ split: parts[0] + ' + ' + 'ḥ' + parts[1], type: "visarga preserved" });
                }
                return results;
            }
        },
        {
            name: "Jashitvam (Consonant)",
            marker: /cc|dd|gg|jj|ṭṭ|ṭḍ|tt|dd|pp|bb/,
            priority: 70,
            transform: function(word) {
                let results = [];
                if (word.includes('cc')) results.push({ split: word.replace('cc', 't + c'), type: "t→c before c" });
                if (word.includes('dd')) results.push({ split: word.replace('dd', 't + d'), type: "t→d before d" });
                if (word.includes('gg')) results.push({ split: word.replace('gg', 'k + g'), type: "k→g before g" });
                if (word.includes('jj')) results.push({ split: word.replace('jj', 't + j'), type: "t→j before j" });
                if (word.includes('ṭṭ')) results.push({ split: word.replace('ṭṭ', 'ṭ + ṭ'), type: "ṭ→ṭ before ṭ" });
                if (word.includes('tt')) results.push({ split: word.replace('tt', 't + t'), type: "t→t before t" });
                if (word.includes('pp')) results.push({ split: word.replace('pp', 'p + p'), type: "p→p before p" });
                if (word.includes('bb')) results.push({ split: word.replace('bb', 'p + b'), type: "p→b before b" });
                return results;
            }
        },
        {
            name: "Parasavarna (Nasal)",
            marker: /ñc|ñj|ṇṭ|ṇḍ|nt|nd|mp|mb/,
            priority: 75,
            transform: function(word) {
                let results = [];
                if (word.includes('ñc')) results.push({ split: word.replace('ñc', 't + c'), type: "t→ñ before c" });
                if (word.includes('ñj')) results.push({ split: word.replace('ñj', 't + j'), type: "t→ñ before j" });
                if (word.includes('ṇṭ')) results.push({ split: word.replace('ṇṭ', 'ṭ + ṭ'), type: "ṭ→ṇ before ṭ" });
                if (word.includes('ṇḍ')) results.push({ split: word.replace('ṇḍ', 'ṭ + ḍ'), type: "ṭ→ṇ before ḍ" });
                if (word.includes('nt')) results.push({ split: word.replace('nt', 'n + t'), type: "n preserved" });
                if (word.includes('nd')) results.push({ split: word.replace('nd', 'n + d'), type: "n preserved" });
                if (word.includes('mp')) results.push({ split: word.replace('mp', 'm + p'), type: "m preserved" });
                if (word.includes('mb')) results.push({ split: word.replace('mb', 'm + b'), type: "m preserved" });
                return results;
            }
        }
    ],

    // Check if word is valid in lexicon
    isValidWord: function(word) {
        // Basic check - can be enhanced with actual lexicon lookup
        return word.length > 0;
    },

    // Main split function
    split: function(word, maxResults = 6) {
        let results = [];
        
        // Convert to IAST first
        let iastWord = this.toIAST(word);
        
        // Apply each rule
        for (let rule of this.rules) {
            if (rule.marker.test(iastWord)) {
                let splits = rule.transform(iastWord);
                for (let split of splits) {
                    let parts = split.split.split(' + ');
                    if (parts.length >= 2 && this.isValidWord(parts[0]) && this.isValidWord(parts[1])) {
                        results.push({
                            rule: rule.name,
                            split: split.split,
                            type: split.type,
                            priority: rule.priority,
                            devanagari: this.toDevanagari(split.split)
                        });
                    }
                }
            }
        }
        
        // Remove duplicates and sort by priority
        results = results.filter((v, i, a) => a.findIndex(t => t.split === v.split) === i);
        results.sort((a, b) => b.priority - a.priority);
        
        // Add fallback splits if no rules matched
        if (results.length === 0) {
            for (let i = 1; i <= Math.min(iastWord.length - 1, 4); i++) {
                let part1 = iastWord.substring(0, i);
                let part2 = iastWord.substring(i);
                if (this.isValidWord(part1) && this.isValidWord(part2)) {
                    results.push({
                        rule: "Boundary Split",
                        split: part1 + " + " + part2,
                        type: "character boundary",
                        priority: 10,
                        devanagari: this.toDevanagari(part1 + " + " + part2)
                    });
                }
            }
        }
        
        return results.slice(0, maxResults);
    },
    
    // Convert Devanagari to IAST
    toIAST: function(text) {
        if (!text) return '';
        let result = '';
        for (let ch of text) {
            result += devToIast[ch] || ch;
        }
        return result;
    },
    
    // Convert IAST to Devanagari
    toDevanagari: function(text) {
        if (!text) return '';
        let result = '';
        let i = 0;
        while (i < text.length) {
            let found = false;
            if (i + 1 < text.length) {
                let two = text.substr(i, 2);
                if (iastToDev[two]) {
                    result += iastToDev[two];
                    i += 2;
                    found = true;
                }
            }
            if (!found) {
                result += iastToDev[text[i]] || text[i];
                i++;
            }
        }
        return result;
    }
};

// ============================================================
// LEXICON DATABASE (50+ terms)
// ============================================================

const lexiconTerms = [
    { term: "ātman", meaning: "Self; soul" },
    { term: "brahman", meaning: "Ultimate reality" },
    { term: "dharma", meaning: "Righteousness; duty" },
    { term: "karma", meaning: "Action; deed" },
    { term: "yoga", meaning: "Union; discipline" },
    { term: "mantra", meaning: "Sacred formula" },
    { term: "guru", meaning: "Teacher; guide" },
    { term: "śiṣya", meaning: "Disciple; student" },
    { term: "ācārya", meaning: "Master teacher" },
    { term: "veda", meaning: "Knowledge; sacred text" },
    { term: "upaniṣad", meaning: "Esoteric teaching" },
    { term: "purāṇa", meaning: "Ancient text" },
    { term: "itihāsa", meaning: "History; epic" },
    { term: "rāmāyaṇa", meaning: "Rama's journey" },
    { term: "mahābhārata", meaning: "Great Bharat" },
    { term: "bhagavad", meaning: "Divine" },
    { term: "gītā", meaning: "Song" },
    { term: "samādhi", meaning: "Meditative absorption" },
    { term: "prāṇa", meaning: "Life breath" },
    { term: "kuṇḍalinī", meaning: "Serpent power" },
    { term: "cakra", meaning: "Wheel; energy center" },
    { term: "nāḍī", meaning: "Energy channel" },
    { term: "mokṣa", meaning: "Liberation" },
    { term: "saṃsāra", meaning: "Cycle of rebirth" },
    { term: "nirvāṇa", meaning: "Extinction" },
    { term: "siddhi", meaning: "Accomplishment" },
    { term: "bhakti", meaning: "Devotion" },
    { term: "jñāna", meaning: "Knowledge" },
    { term: "vairāgya", meaning: "Detachment" },
    { term: "tapas", meaning: "Austerity" },
    { term: "hatha", meaning: "Force" },
    { term: "rāja", meaning: "Royal" },
    { term: "karma", meaning: "Action" },
    { term: "bhakti", meaning: "Devotion" },
    { term: "jñāna", meaning: "Wisdom" },
    { term: "graha", meaning: "Planet" },
    { term: "nakṣatra", meaning: "Lunar mansion" },
    { term: "rāśi", meaning: "Zodiac sign" },
    { term: "lagna", meaning: "Ascendant" },
    { term: "horā", meaning: "Hour" },
    { term: "doṣa", meaning: "Affliction" },
    { term: "yoga", meaning: "Combination" },
    { term: "daśā", meaning: "Period" },
    { term: "antara", meaning: "Sub-period" },
    { term: "sandhi", meaning: "Junction" },
    { term: "visarga", meaning: "Aspiration" },
    { term: "anusvāra", meaning: "Nasalization" },
    { term: "halanta", meaning: "Consonant ending" }
];

// ============================================================
// UI FUNCTIONS
// ============================================================

function showTransliteration() {
    const html = `
        <div class="result-card">
            <h3>🔤 Sanskrit Transliteration Tool</h3>
            <div class="input-group">
                <div class="input-field"><label>IAST or Devanagari</label><input type="text" id="translitInput" placeholder="e.g., samskrita or संस्कृत"></div>
                <button id="transliterateBtn">🔄 Convert</button>
            </div>
            <div class="result-item"><div class="result-label">Result</div><div id="translitResult" style="font-size:1.2rem; font-family:monospace;"></div></div>
        </div>
    `;
    document.getElementById('sanskrit-output').innerHTML = html;
    
    document.getElementById('transliterateBtn').addEventListener('click', () => {
        const input = document.getElementById('translitInput').value.trim();
        if (!input) return;
        const isDevanagari = /[\u0900-\u097F]/.test(input);
        const output = isDevanagari ? SandhiEngine.toIAST(input) : SandhiEngine.toDevanagari(input);
        document.getElementById('translitResult').innerHTML = output;
    });
}

function showSandhiTool() {
    const html = `
        <div class="result-card">
            <h3>⚡ 49D Sandhi Splitter (Paninian Rules)</h3>
            <div class="input-group">
                <div class="input-field"><label>Enter Sandhi word (Devanagari)</label><input type="text" id="sandhiWord" placeholder="e.g., हिमालय"></div>
                <button id="splitSandhiBtn">⚡ Split Sandhi</button>
            </div>
            <div id="sandhiResults" style="margin-top: 1rem;"></div>
        </div>
    `;
    document.getElementById('sanskrit-output').innerHTML = html;
    
    document.getElementById('splitSandhiBtn').addEventListener('click', () => {
        const word = document.getElementById('sandhiWord').value.trim();
        if (!word) {
            document.getElementById('sandhiResults').innerHTML = '<div class="result-item">Please enter a word.</div>';
            return;
        }
        
        const results = SandhiEngine.split(word);
        
        if (results.length === 0) {
            document.getElementById('sandhiResults').innerHTML = `
                <div class="result-item">
                    <div class="result-label">No Sandhi rules matched</div>
                    <div class="result-value">Try a different word or check the spelling.</div>
                </div>
            `;
            return;
        }
        
        let html = `<h4>📖 Sandhi Split Results for "${word}"</h4>`;
        html += `<div class="result-grid">`;
        for (let r of results) {
            html += `
                <div class="result-item">
                    <div class="result-label">${r.rule}</div>
                    <div class="result-value">${r.split}</div>
                    <div style="font-size:0.7rem; color:#aaa;">${r.type}</div>
                </div>
            `;
        }
        html += `</div>`;
        document.getElementById('sandhiResults').innerHTML = html;
    });
}

function showLexicon() {
    let html = `
        <div class="result-card">
            <h3>📖 Jyotish Lexicon (${lexiconTerms.length}+ Terms)</h3>
            <div class="input-group">
                <div class="input-field"><label>Search term</label><input type="text" id="lexiconSearch" placeholder="e.g., graha, ātman, dharma"></div>
                <button id="searchLexiconBtn">🔍 Search</button>
            </div>
            <div id="lexiconResults" class="lexicon-result" style="max-height:400px; overflow-y:auto;"></div>
        </div>
    `;
    document.getElementById('sanskrit-output').innerHTML = html;
    
    function displayLexicon(searchTerm = '') {
        let filtered = lexiconTerms;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = lexiconTerms.filter(t => t.term.toLowerCase().includes(term) || t.meaning.toLowerCase().includes(term));
        }
        
        let itemsHtml = '<div class="result-grid">';
        filtered.forEach(term => {
            itemsHtml += `
                <div class="result-item">
                    <div class="result-label">${term.term}</div>
                    <div class="result-value">${term.meaning}</div>
                </div>
            `;
        });
        itemsHtml += '</div>';
        document.getElementById('lexiconResults').innerHTML = itemsHtml || '<div class="result-item">No terms found.</div>';
    }
    
    displayLexicon();
    
    document.getElementById('searchLexiconBtn').addEventListener('click', () => {
        const search = document.getElementById('lexiconSearch').value.trim().toLowerCase();
        displayLexicon(search);
    });
}

// Initialize tool buttons
document.addEventListener('DOMContentLoaded', () => {
    const transliterateBtn = document.getElementById('transliterate-btn');
    const sandhiBtn = document.getElementById('sandhi-btn');
    const lexiconBtn = document.getElementById('lexicon-btn');
    
    if (transliterateBtn) transliterateBtn.addEventListener('click', showTransliteration);
    if (sandhiBtn) sandhiBtn.addEventListener('click', showSandhiTool);
    if (lexiconBtn) lexiconBtn.addEventListener('click', showLexicon);
    
    console.log('✅ Sanskrit Engine loaded with enhanced Sandhi Splitter');
});
