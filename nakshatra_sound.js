/**
 * nakshatra_sound.js - Pure sound architecture for 27 Nakshatras
 * No astrology, only music & mantra attributes
 */

const NAKSHATRA_SOUND_DATA = {
  "version": "1.0",
  "nakshatras": [
    {"index":1,"name":"Ashwinī","svara":"Ni (komal)","raga":"Bhairav","chand":"Vasantatilaka","bija":"A","seed":"Aśva"},
    {"index":2,"name":"Bharaṇī","svara":"Ma (tivra)","raga":"Todi","chand":"Shikharini","bija":"Ī","seed":"Īśā"},
    {"index":3,"name":"Kṛttikā","svara":"Ga (śuddha)","raga":"Marwa","chand":"Mandākrāntā","bija":"U","seed":"Ulkā"},
    {"index":4,"name":"Rohiṇī","svara":"Re (komal)","raga":"Khamaj","chand":"Vasantatilaka","bija":"AI","seed":"Ena"},
    {"index":5,"name":"Mrigaśirā","svara":"Sa (śuddha)","raga":"Bageshree","chand":"Upajati","bija":"Ē","seed":"Mriga"},
    {"index":6,"name":"Ārdrā","svara":"Dha (komal)","raga":"Malkauns","chand":"Shārdūlavikrīḍita","bija":"O","seed":"Rudra"},
    {"index":7,"name":"Punarvasu","svara":"Pa (śuddha)","raga":"Yaman","chand":"Vasantatilaka","bija":"AU","seed":"Aditi"},
    {"index":8,"name":"Puṣya","svara":"Ni (komal)","raga":"Darbari","chand":"Upajati","bija":"AM","seed":"Brhaspati"},
    {"index":9,"name":"Āśleṣā","svara":"Ga (śuddha)","raga":"Bhimpalasi","chand":"Mandākrāntā","bija":"AH","seed":"Nāga"},
    {"index":10,"name":"Maghā","svara":"Re (komal)","raga":"Bhairav","chand":"Shikharini","bija":"KA","seed":"Pitṛ"},
    {"index":11,"name":"Pūrva Phālgunī","svara":"Ma (tivra)","raga":"Khamaj","chand":"Vasantatilaka","bija":"KHA","seed":"Bhaga"},
    {"index":12,"name":"Uttara Phālgunī","svara":"Sa (śuddha)","raga":"Bhoop","chand":"Upajati","bija":"GA","seed":"Aryaman"},
    {"index":13,"name":"Hasta","svara":"Dha (komal)","raga":"Yaman","chand":"Mandākrāntā","bija":"GHA","seed":"Savitṛ"},
    {"index":14,"name":"Citrā","svara":"Ni (komal)","raga":"Brindavani Sarang","chand":"Shikharini","bija":"CA","seed":"Viśva"},
    {"index":15,"name":"Svāti","svara":"Pa (śuddha)","raga":"Hamsadhwani","chand":"Vasantatilaka","bija":"CHA","seed":"Vāyu"},
    {"index":16,"name":"Viśākhā","svara":"Ga (śuddha)","raga":"Shankara","chand":"Upajati","bija":"JA","seed":"Indra"},
    {"index":17,"name":"Anurādhā","svara":"Re (komal)","raga":"Malkauns","chand":"Mandākrāntā","bija":"JHA","seed":"Mitra"},
    {"index":18,"name":"Jyeṣṭhā","svara":"Ma (tivra)","raga":"Darbari","chand":"Shikharini","bija":"ÑA","seed":"Indra"},
    {"index":19,"name":"Mūla","svara":"Sa (śuddha)","raga":"Malkauns","chand":"Vasantatilaka","bija":"ṬA","seed":"Nirṛti"},
    {"index":20,"name":"Pūrva Aṣāḍhā","svara":"Dha (komal)","raga":"Khamaj","chand":"Upajati","bija":"ṬHA","seed":"Apa"},
    {"index":21,"name":"Uttara Aṣāḍhā","svara":"Ni (komal)","raga":"Bhoop","chand":"Mandākrāntā","bija":"ḌA","seed":"Viśve"},
    {"index":22,"name":"Śravaṇa","svara":"Pa (śuddha)","raga":"Yaman","chand":"Shikharini","bija":"ḌHA","seed":"Viṣṇu"},
    {"index":23,"name":"Dhanisṭhā","svara":"Ga (śuddha)","raga":"Brindavani Sarang","chand":"Vasantatilaka","bija":"ṆA","seed":"Vasu"},
    {"index":24,"name":"Śatabhiṣā","svara":"Re (komal)","raga":"Bhairav","chand":"Upajati","bija":"TA","seed":"Varuṇa"},
    {"index":25,"name":"Pūrva Bhādrapadā","svara":"Ma (tivra)","raga":"Desh","chand":"Mandākrāntā","bija":"THA","seed":"Aja"},
    {"index":26,"name":"Uttara Bhādrapadā","svara":"Sa (śuddha)","raga":"Darbari","chand":"Shikharini","bija":"DA","seed":"Ahir"},
    {"index":27,"name":"Revatī","svara":"Dha (komal)","raga":"Bhimpalasi","chand":"Vasantatilaka","bija":"DHA","seed":"Pūṣan"}
  ]
};

class NakshatraSoundJS {
  constructor() {
    this.data = NAKSHATRA_SOUND_DATA;
    this.byName = {};
    this.byIndex = {};
    
    for (const n of this.data.nakshatras) {
      this.byName[n.name.toLowerCase()] = n;
      this.byIndex[n.index] = n;
    }
  }
  
  getByName(name) {
    return this.byName[name.toLowerCase()];
  }
  
  getByIndex(idx) {
    return this.byIndex[idx];
  }
  
  getSvaraFrequency(svara, baseFreq = 261.63) {
    const ratios = {
      "Sa (śuddha)": 1/1,
      "Re (komal)": 9/8,
      "Ga (śuddha)": 5/4,
      "Ma (tivra)": 4/3,
      "Pa (śuddha)": 3/2,
      "Dha (komal)": 11/8,
      "Ni (komal)": 7/4
    };
    const ratio = ratios[svara] || 1;
    return baseFreq * ratio;
  }
  
  generateMantra(nakshatra) {
    const bija = nakshatra.bija.toLowerCase();
    const seed = nakshatra.seed.toLowerCase();
    return `Oṁ ${bija}ṁ ${seed} namaḥ`;
  }
}

// Export for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NakshatraSoundJS, NAKSHATRA_SOUND_DATA };
}
