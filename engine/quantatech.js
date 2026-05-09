// --- AIGAANE V3: 49D QUANTATECH KERNEL (PRODUCTION GRADE) ---

window.Quantatech = (function() {
    let kernelTensor = new Array(49).fill(0.5);
    let kernelMetrics = { dimensionSum: 0, vectorMagnitude: 0, anumanaEntropy: 0, resonanceHash: '' };
    let kernelData = null;
    let isInitialized = false;

    function hashBirthToSeed(birth) {
        const { year, month, day, hour, minute, lat, lon } = birth;
        const julian = (year * 365.25) + (month * 30.44) + day + (hour / 24) + (minute / 1440);
        const spatial = (lat + 90) * (lon + 180);
        return Math.sin(julian) * 10000 + Math.cos(spatial) * 10000;
    }

    function generateTensor(seed) {
        const tensor = [];
        for (let d = 1; d <= 49; d++) {
            const angle = (d * 0.618033988749895) * seed;
            let raw = (Math.sin(angle) * 0.5 + 0.5) + (Math.cos(d * 0.87) * 0.12);
            if (d >= 22) raw = raw * 0.65 + Math.sin(angle * 1.7) * 0.2 + 0.15;
            tensor.push(Math.min(0.99, Math.max(0.03, raw)));
        }
        const sum = tensor.reduce((a, b) => a + b, 0);
        const factor = (0.52 * 49) / sum;
        return tensor.map(v => v * factor);
    }

    function calculateMetrics(tensor) {
        const sum = tensor.reduce((a, b) => a + b, 0).toFixed(5);
        const magnitude = Math.sqrt(tensor.reduce((s, v) => s + v * v, 0)).toFixed(5);
        const anumanaSlice = tensor.slice(21, 49);
        const entropy = anumanaSlice.reduce((acc, val) => acc + (val * Math.log(val + 0.001)), 0).toFixed(5);
        let hash = 0;
        for (let i = 0; i < 12; i++) {
            hash = ((hash << 5) - hash) + Math.floor(tensor[i] * 1e6);
            hash |= 0;
        }
        const hashStr = '0x' + Math.abs(hash).toString(16).slice(0, 8);
        return { dimensionSum: sum, vectorMagnitude: magnitude, anumanaEntropy: entropy, resonanceHash: hashStr };
    }

    function updateUI() {
        const sumEl = document.getElementById('dim-sum');
        const entropyEl = document.getElementById('anumana-entropy');
        const hashEl = document.getElementById('res-hash');
        if (sumEl) sumEl.innerText = kernelMetrics.dimensionSum;
        if (entropyEl) entropyEl.innerText = kernelMetrics.anumanaEntropy;
        if (hashEl) hashEl.innerText = kernelMetrics.resonanceHash;
        
        // Show success indicator
        const statsContainer = document.getElementById('kernel-stats');
        if (statsContainer && isInitialized) {
            statsContainer.style.opacity = '1';
        }
    }

    function showError(message) {
        console.error('Quantatech Error:', message);
        const statsContainer = document.getElementById('kernel-stats');
        if (statsContainer) {
            statsContainer.style.border = '1px solid #ff4d4d';
            setTimeout(() => {
                statsContainer.style.border = '';
            }, 3000);
        }
    }

    return {
        init: async function() {
            try {
                const response = await fetch('/engine/kernel.json');
                if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load kernel.json`);
                kernelData = await response.json();
                console.log('✅ Kernel JSON loaded:', kernelData.vedic_entries?.length || 0, 'entries');
                
                const defaultBirth = { 
                    year: 1990, month: 6, day: 15, hour: 10, minute: 30, 
                    lat: 28.6139, lon: 77.2090 
                };
                this.recompute(defaultBirth);
                isInitialized = true;
                return true;
            } catch (error) {
                console.error('❌ Kernel initialization failed:', error);
                showError(error.message);
                return false;
            }
        },
        
        recompute: function(birth) {
            try {
                if (!birth || typeof birth.year === 'undefined') {
                    throw new Error('Invalid birth data');
                }
                const seed = hashBirthToSeed(birth);
                kernelTensor = generateTensor(seed);
                kernelMetrics = calculateMetrics(kernelTensor);
                this.updateUI();
                return { tensor: kernelTensor, metrics: kernelMetrics };
            } catch (error) {
                console.error('Recompute error:', error);
                showError(error.message);
                return null;
            }
        },
        
        getTensor: function() { return kernelTensor; },
        getMetrics: function() { return kernelMetrics; },
        getVedicEntries: function() { return kernelData?.vedic_entries || []; },
        getLexicon: function() { return kernelData?.lexicon || []; },
        isReady: function() { return isInitialized; },
        updateUI: updateUI
    };
})();

console.log('✅ 49D Quantatech Kernel loaded');
