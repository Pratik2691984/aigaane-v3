// ============================================================
// AIGAANE V3 - COMPLETE SANSKRIT LEXICON
// 75+ Terms for Vedic Intelligence Platform
// ============================================================

const lexiconTerms = [
    // ============================================================
    // CORE PHILOSOPHICAL TERMS
    // ============================================================
    { term: "ātman", meaning: "Self; soul; the eternal essence" },
    { term: "brahman", meaning: "Ultimate reality; cosmic consciousness" },
    { term: "dharma", meaning: "Righteousness; duty; cosmic order" },
    { term: "karma", meaning: "Action; deed; cause and effect" },
    { term: "yoga", meaning: "Union; discipline; spiritual practice" },
    { term: "mantra", meaning: "Sacred formula; mind protection" },
    { term: "guru", meaning: "Teacher; guide; spiritual master" },
    { term: "śiṣya", meaning: "Disciple; student; learner" },
    { term: "ācārya", meaning: "Master teacher; preceptor" },
    { term: "veda", meaning: "Knowledge; sacred text" },
    { term: "upaniṣad", meaning: "Esoteric teaching; sitting near" },
    { term: "purāṇa", meaning: "Ancient text; mythological narrative" },
    { term: "itihāsa", meaning: "History; epic (Ramayana, Mahabharata)" },
    { term: "rāmāyaṇa", meaning: "Rama's journey; epic of Rama" },
    { term: "mahābhārata", meaning: "Great Bharat; epic of India" },
    { term: "bhagavad", meaning: "Divine; the lord's" },
    { term: "gītā", meaning: "Song; sacred discourse" },
    { term: "samādhi", meaning: "Meditative absorption; enlightenment" },
    { term: "prāṇa", meaning: "Life breath; vital energy" },
    { term: "kuṇḍalinī", meaning: "Serpent power; coiled energy" },
    { term: "cakra", meaning: "Wheel; energy center" },
    { term: "nāḍī", meaning: "Energy channel; subtle tube" },
    { term: "mokṣa", meaning: "Liberation; freedom from rebirth" },
    { term: "saṃsāra", meaning: "Cycle of rebirth; wandering" },
    { term: "nirvāṇa", meaning: "Extinction; blowing out" },
    { term: "siddhi", meaning: "Accomplishment; supernatural power" },
    { term: "bhakti", meaning: "Devotion; love towards God" },
    { term: "jñāna", meaning: "Knowledge; wisdom" },
    { term: "vairāgya", meaning: "Detachment; dispassion" },
    { term: "tapas", meaning: "Austerity; spiritual practice" },
    { term: "hatha", meaning: "Force; determined practice" },
    { term: "rāja", meaning: "Royal; kingly" },
    
    // ============================================================
    // JYOTISH (VEDIC ASTROLOGY) TERMS
    // ============================================================
    { term: "graha", meaning: "Planet; celestial influencer" },
    { term: "nakṣatra", meaning: "Lunar mansion; 27 sectors" },
    { term: "rāśi", meaning: "Zodiac sign; 12 divisions" },
    { term: "lagna", meaning: "Ascendant; rising sign" },
    { term: "horā", meaning: "Hour; planetary hour" },
    { term: "doṣa", meaning: "Affliction; planetary imbalance" },
    { term: "yoga", meaning: "Auspicious planetary combination" },
    { term: "daśā", meaning: "Period; planetary cycle" },
    { term: "antara", meaning: "Sub-period; bhukti" },
    { term: "sandhi", meaning: "Junction; transitional period" },
    
    // ============================================================
    // PHONETIC & SANDHI TERMS (Sanskrit Engine)
    // ============================================================
    { term: "sandhi", meaning: "Junction; phonetic combination rules" },
    { term: "visarga", meaning: "Aspiration; final 'ḥ' sound" },
    { term: "anusvāra", meaning: "Nasalization; 'ṃ' mark" },
    { term: "halanta", meaning: "Consonant ending; virama" },
    { term: "svara", meaning: "Note; vowel; tone" },
    { term: "vyañjana", meaning: "Consonant; articulation" },
    { term: "prayatna", meaning: "Effort; articulatory energy" },
    { term: "anunāsikatva", meaning: "Nasalization quality" },
    { term: "vṛddhi", meaning: "Lengthening; vowel strengthening" },
    { term: "guṇa", meaning: "Quality; vowel modification" },
    
    // ============================================================
    // RESONANCE & SOUND (Svara-Prana)
    // ============================================================
    { term: "spanda", meaning: "Vibration; subtle creative pulse" },
    { term: "nāda", meaning: "Sacred Sound; primordial vibration" },
    { term: "anunāsika", meaning: "Nasalized sound; phonetic nasalization" },
    { term: "laya", meaning: "Tempo; absorption; dissolution" },
    { term: "yati", meaning: "Flow; rhythmic gait" },
    { term: "kalā", meaning: "Fractional unit of time" },
    { term: "virāma", meaning: "Pause; silence in phonetics" },
    
    // ============================================================
    // VEDIC METRICS & PROSODY (Pingala Shastra)
    // ============================================================
    { term: "chanda", meaning: "Prosody; Vedic meter" },
    { term: "mātrā", meaning: "Measure; metric unit of time" },
    { term: "sūtra", meaning: "Thread; aphorism; algorithmic rule" },
    { term: "anuṣṭubh", meaning: "Sloka meter; eight syllables per pada" },
    { term: "gāyatrī", meaning: "24-syllable Vedic meter" },
    { term: "triṣṭubh", meaning: "11-syllable per pada meter" },
    { term: "jagatī", meaning: "12-syllable per pada meter" },
    { term: "laghu", meaning: "Light syllable; one mātrā" },
    { term: "guru", meaning: "Heavy syllable; two mātrās" },
    
    // ============================================================
    // COSMIC MAPPING (Nakshatra & Soul Map)
    // ============================================================
    { term: "kāla", meaning: "Time; destiny; epoch" },
    { term: "akṣara", meaning: "Imperishable; letter; syllable" },
    { term: "prakṛti", meaning: "Nature; source; fundamental state" },
    { term: "vikṛti", meaning: "Modification; derived state" },
    { term: "tattva", meaning: "Principle; reality; that-ness" },
    { term: "jīva", meaning: "Individual soul; living being" },
    { term: "puruṣa", meaning: "Cosmic being; consciousness" },
    
    // ============================================================
    // ANUMANA LAYER (Predictive Logic & State Modeling)
    // ============================================================
    { term: "vyāpti", meaning: "Invariable concomitance; universal law of prediction" },
    { term: "hetu", meaning: "Reason; probabilistic trigger for state change" },
    { term: "sādhya", meaning: "Target; predicted state or conclusion" },
    { term: "pakṣa", meaning: "Locus; data point where inference is observed" },
    { term: "anumāna", meaning: "Inference; process of trend detection" },
    { term: "dṛṣṭānta", meaning: "Example; training data for pattern establishment" },
    { term: "siddhānta", meaning: "Established doctrine; final validated logic" },
    
    // ============================================================
    // RESONANCE CATEGORIES
    // ============================================================
    { term: "vimarśa", meaning: "Self-reflection; critical examination" },
    { term: "pratibimba", meaning: "Reflection; resonance image" },
    { term: "anukaraṇa", meaning: "Imitation; harmonic matching" },
    { term: "sampatti", meaning: "Prosperity; abundance of resonance" },
    { term: "laya", meaning: "Absorption; dissolution of vibration" }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { lexiconTerms };
}
