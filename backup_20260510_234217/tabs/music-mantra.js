// --- AIGAANE V3: MANTRA & MUSIC ENGINE (FULL VERSION) ---

const mantraDatabase = [
    { deity: "Gaṇeśa", mantra: "ॐ गं गणपतये नमः", meaning: "Removal of obstacles; wisdom", nakshatra: "Aśvinī", frequency: 12, color: "Red", element: "Earth" },
    { deity: "Sūrya", mantra: "ॐ घृणि सूर्याय नमः", meaning: "Vitality; illumination; confidence", nakshatra: "Kṛttikā", frequency: 7, color: "Orange", element: "Fire" },
    { deity: "Candra", mantra: "ॐ सों सोमाय नमः", meaning: "Mental peace; intuition; nurture", nakshatra: "Rohiṇī", frequency: 10, color: "White", element: "Water" },
    { deity: "Maṅgala", mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः", meaning: "Strength; courage; protection", nakshatra: "Mṛgaśira", frequency: 8, color: "Coral", element: "Fire" },
    { deity: "Budha", mantra: "ॐ बुं बुधाय नमः", meaning: "Intellect; communication; trade", nakshatra: "Āśleṣā", frequency: 8, color: "Green", element: "Earth" },
    { deity: "Guru", mantra: "ॐ बृं बृहस्पतये नमः", meaning: "Wisdom; expansion; spirituality", nakshatra: "Puṣya", frequency: 11, color: "Yellow", element: "Ether" },
    { deity: "Śukra", mantra: "ॐ शुं शुक्राय नमः", meaning: "Creativity; harmony; luxury", nakshatra: "Bharaṇī", frequency: 9, color: "Diamond", element: "Water" },
    { deity: "Śani", mantra: "ॐ शं शनैश्चराय नमः", meaning: "Discipline; patience; justice", nakshatra: "Anurādhā", frequency: 13, color: "Blue", element: "Air" },
    { deity: "Rāhu", mantra: "ॐ रां राहवे नमः", meaning: "Overcoming illusion; ambition", nakshatra: "Ārdrā", frequency: 14, color: "Smoky", element: "Air" },
    { deity: "Ketu", mantra: "ॐ कें केतवे नमः", meaning: "Spiritual liberation; detachment", nakshatra: "Mūla", frequency: 15, color: "Brown", element: "Fire" },
    { deity: "Sarasvatī", mantra: "ॐ ऐं सरस्वत्यै नमः", meaning: "Knowledge; arts; wisdom", nakshatra: "Hasta", frequency: 13, color: "White", element: "Water" },
    { deity: "Lakṣmī", mantra: "ॐ श्रीं महालक्ष्म्यै नमः", meaning: "Abundance; prosperity; beauty", nakshatra: "Rohiṇī", frequency: 10, color: "Gold", element: "Earth" },
    { deity: "Durgā", mantra: "ॐ दुं दुर्गायै नमः", meaning: "Protection; power; victory", nakshatra: "Citrā", frequency: 14, color: "Red", element: "Fire" },
    { deity: "Śiva", mantra: "ॐ नमः शिवाय", meaning: "Transformation; auspiciousness", nakshatra: "Ārdrā", frequency: 9, color: "Vibhuti", element: "Ether" },
    { deity: "Viṣṇu", mantra: "ॐ नमो भगवते वासुदेवाय", meaning: "Preservation; all-pervading", nakshatra: "Śravaṇa", frequency: 11, color: "Blue", element: "Ether" },
    { deity: "Hanumān", mantra: "ॐ हनुमते नमः", meaning: "Devotion; strength; service", nakshatra: "Mūla", frequency: 16, color: "Orange", element: "Fire" }
];

// Musical notes mapping (based on frequency)
const musicalNotes = [
    { note: "Shadja (Sa)", frequency: 240, chakra: "Mūlādhāra", element: "Earth", animal: "Elephant" },
    { note: "Riṣabha (Re)", frequency: 270, chakra: "Svādhiṣṭhāna", element: "Water", animal: "Crocodile" },
    { note: "Gāndhāra (Ga)", frequency: 300, chakra: "Maṇipūra", element: "Fire", animal: "Ram" },
    { note: "Madhyama (Ma)", frequency: 320, chakra: "Anāhata", element: "Air", animal: "Antelope" },
    { note: "Pañcama (Pa)", frequency: 360, chakra: "Viśuddhi", element: "Ether", animal: "Elephant" },
    { note: "Dhaivata (Dha)", frequency: 400, chakra: "Ājñā", element: "Light", animal: "Lotus" },
    { note: "Niṣāda (Ni)", frequency: 450, chakra: "Sahasrāra", element: "Thought", animal: "Thousand-petaled" }
];

function getResonantMantra(userFrequency) {
    if (!mantraDatabase.length) return { deity: "Om", mantra: "ॐ", meaning: "Universal sound", nakshatra: "All", frequency: 12 };
    // Find closest frequency match
    return mantraDatabase.reduce((prev, curr) => 
        Math.abs(curr.frequency - userFrequency) < Math.abs(prev.frequency - userFrequency) ? curr : prev
    );
}

function getMusicalNote(frequencyValue) {
    const normalizedFreq = (frequencyValue * 7) % 7;
    const index = Math.floor(normalizedFreq);
    return musicalNotes[index % musicalNotes.length];
}

function renderMusicTab() {
    const tensor = window.Quantatech?.getTensor();
    if (!tensor || !tensor.length) {
        document.getElementById('music-output').innerHTML = '<div class="info-card">Waiting for kernel initialization...</div>';
        return;
    }
    
    // Extract frequency band (dimensions 8-21)
    const freqBand = tensor.slice(7, 21);
    const avgFreq = freqBand.reduce((a,b) => a+b, 0) / freqBand.length;
    
    const mantra = getResonantMantra(avgFreq * 20);
    const musicalNote = getMusicalNote(avgFreq);
    
    const html = `
        <div class="result-card">
            <h3>🎵 49D → Mantra & Music Resonance</h3>
            <div class="result-grid">
                <div class="result-item">
                    <strong>🎼 Primary Deity</strong><br>${mantra.deity}
                    <small style="display:block;">${mantra.element} · ${mantra.color}</small>
                </div>
                <div class="result-item">
                    <strong>🔊 Resonance Mantra</strong><br>${mantra.mantra}
                    <small>${mantra.meaning}</small>
                </div>
                <div class="result-item">
                    <strong>🎵 Vedic Swara</strong><br>${musicalNote.note}
                    <small>${musicalNote.frequency} Hz · ${musicalNote.chakra}</small>
                </div>
                <div class="result-item">
                    <strong>⭐ Nakṣatra Gateway</strong><br>${mantra.nakshatra}
                    <small>Frequency band: ${avgFreq.toFixed(3)}</small>
                </div>
            </div>
            <p class="mono" style="margin-top: 1rem;">◆ Derived from Frequency Dimensions 8-21 (${freqBand.length} dimensions) ◆</p>
        </div>
    `;
    document.getElementById('music-output').innerHTML = html;
}

// Auto-render when kernel updates
if (typeof window !== 'undefined') {
    window.MusicMantra = { render: renderMusicTab };
}

console.log('✅ Mantra & Music Engine loaded with 16+ mantras and 7 musical notes');
