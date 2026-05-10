// ========== NAKSHATRA SOUND INTEGRATION ==========
// Add this to your existing index.html script section

// Load sound data (add after nakshatras array)
// The sound data is already in nakshatra_sound.js

function getNakshatraSoundFromHash(hash) {
    const nakshatraIdx = hash % 27;
    // Sound data matches the same order as nakshatras
    return {
        name: nakshatras[nakshatraIdx].name,
        svara: soundSvara[nakshatraIdx],
        raga: soundRaga[nakshatraIdx],
        chand: soundChand[nakshatraIdx],
        bija: soundBija[nakshatraIdx],
        seed: soundSeed[nakshatraIdx]
    };
}

// Sound arrays (same order as nakshatras)
const soundSvara = [
    "Ni (komal)", "Ma (tivra)", "Ga (śuddha)", "Re (komal)", "Sa (śuddha)",
    "Dha (komal)", "Pa (śuddha)", "Ni (komal)", "Ga (śuddha)", "Re (komal)",
    "Ma (tivra)", "Sa (śuddha)", "Dha (komal)", "Ni (komal)", "Pa (śuddha)",
    "Ga (śuddha)", "Re (komal)", "Ma (tivra)", "Sa (śuddha)", "Dha (komal)",
    "Ni (komal)", "Pa (śuddha)", "Ga (śuddha)", "Re (komal)", "Ma (tivra)",
    "Sa (śuddha)", "Dha (komal)"
];

const soundRaga = [
    "Bhairav", "Todi", "Marwa", "Khamaj", "Bageshree", "Malkauns",
    "Yaman", "Darbari", "Bhimpalasi", "Bhairav", "Khamaj", "Bhoop",
    "Yaman", "Brindavani Sarang", "Hamsadhwani", "Shankara", "Malkauns",
    "Darbari", "Malkauns", "Khamaj", "Bhoop", "Yaman", "Brindavani Sarang",
    "Bhairav", "Desh", "Darbari", "Bhimpalasi"
];

const soundChand = [
    "Vasantatilaka", "Shikharini", "Mandākrāntā", "Vasantatilaka", "Upajati",
    "Shārdūlavikrīḍita", "Vasantatilaka", "Upajati", "Mandākrāntā", "Shikharini",
    "Vasantatilaka", "Upajati", "Mandākrāntā", "Shikharini", "Vasantatilaka",
    "Upajati", "Mandākrāntā", "Shikharini", "Vasantatilaka", "Upajati",
    "Mandākrāntā", "Shikharini", "Vasantatilaka", "Upajati", "Mandākrāntā",
    "Shikharini", "Vasantatilaka"
];

const soundBija = ["A","Ī","U","AI","Ē","O","AU","AM","AH","KA","KHA","GA","GHA",
    "CA","CHA","JA","JHA","ÑA","ṬA","ṬHA","ḌA","ḌHA","ṆA","TA","THA","DA","DHA"];

const soundSeed = ["Aśva","Īśā","Ulkā","Ena","Mriga","Rudra","Aditi","Brhaspati",
    "Nāga","Pitṛ","Bhaga","Aryaman","Savitṛ","Viśva","Vāyu","Indra","Mitra",
    "Indra","Nirṛti","Apa","Viśve","Viṣṇu","Vasu","Varuṇa","Aja","Ahir","Pūṣan"];

function playSvaraForNakshatra(hash) {
    const idx = hash % 27;
    const svara = soundSvara[idx];
    const freq = getSvaraFrequency(svara);
    playTone(freq, 2);
}

function getSvaraFrequency(svara) {
    const ratios = {
        "Sa (śuddha)": 261.63,
        "Re (komal)": 294.33,
        "Ga (śuddha)": 327.03,
        "Ma (tivra)": 348.83,
        "Pa (śuddha)": 392.44,
        "Dha (komal)": 436.05,
        "Ni (komal)": 457.86
    };
    return ratios[svara] || 261.63;
}

// Update the astrology display to include sound info
function updateAstroWithSound() {
    const hash = document.getElementById('astroHash')?.innerText || 2693315;
    const idx = hash % 27;
    document.getElementById('soundSvara').innerHTML = soundSvara[idx];
    document.getElementById('soundRaga').innerHTML = soundRaga[idx];
    document.getElementById('soundChand').innerHTML = soundChand[idx];
    document.getElementById('soundBija').innerHTML = soundBija[idx];
}
