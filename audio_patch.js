// ========== ENHANCED AUDIO PLAYBACK ==========
// Add to index.html script section

const SVARA_FREQUENCIES = {
    "Sa (śuddha)": 261.63,
    "Re (komal)": 294.33,
    "Ga (śuddha)": 327.03,
    "Ma (tivra)": 348.83,
    "Pa (śuddha)": 392.44,
    "Dha (komal)": 436.05,
    "Ni (komal)": 457.86
};

function playSvara(svaraName, duration = 2) {
    const freq = SVARA_FREQUENCIES[svaraName];
    if (freq) {
        playTone(freq, duration);
    } else {
        console.warn("Unknown svara:", svaraName);
        playTone(261.63, duration);
    }
}

function playNakshatraSvaraFromHash(hash) {
    const nakshatraIdx = hash % 27;
    const svaraMap = [
        "Ni (komal)", "Ma (tivra)", "Ga (śuddha)", "Re (komal)", "Sa (śuddha)",
        "Dha (komal)", "Pa (śuddha)", "Ni (komal)", "Ga (śuddha)", "Re (komal)",
        "Ma (tivra)", "Sa (śuddha)", "Dha (komal)", "Ni (komal)", "Pa (śuddha)",
        "Ga (śuddha)", "Re (komal)", "Ma (tivra)", "Sa (śuddha)", "Dha (komal)",
        "Ni (komal)", "Pa (śuddha)", "Ga (śuddha)", "Re (komal)", "Ma (tivra)",
        "Sa (śuddha)", "Dha (komal)"
    ];
    const svara = svaraMap[nakshatraIdx];
    playSvara(svara, 3);
}

// Add button to play svara from current analysis
function addSvaraButton() {
    const container = document.getElementById('mantra49dResult');
    if (container && !document.getElementById('playSvaraBtn')) {
        const btn = document.createElement('button');
        btn.id = 'playSvaraBtn';
        btn.textContent = '🎵 Play Nakshatra Svara';
        btn.style.marginLeft = '0.5rem';
        btn.onclick = () => {
            const text = document.getElementById('mantra49d').value.trim() || "Om";
            const hash = getHashFromText(text);
            playNakshatraSvaraFromHash(hash);
        };
        container.parentNode.insertBefore(btn, container.nextSibling);
    }
}

function getHashFromText(text) {
    let h = 0;
    for (let i = 0; i < text.length; i++) {
        h = ((h << 5) - h) + text.charCodeAt(i);
        h = h & 0xffffffff;
    }
    return Math.abs(h);
}

// Call on load
window.addEventListener('load', addSvaraButton);
