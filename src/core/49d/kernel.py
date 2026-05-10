"""
49-Dimensional Arithmetic Kernel for Vedic Metrics
Provides Σ Dim, Entropy, and Hash for any Sanskrit text
"""

import math
import hashlib
from typing import Dict, Any

class FortyNineDKernel:
    def __init__(self):
        self.dimensions = list(range(1, 50))
    
    def compute_vector(self, text: str) -> Dict[int, float]:
        vec = {d: 0.0 for d in self.dimensions}
        for i, ch in enumerate(text):
            code = ord(ch) % 49 + 1
            for d in self.dimensions:
                vec[d] += (code / (i + 1)) * math.sin(d * (i + 1))
        return vec
    
    def sigma_dim(self, vec: Dict[int, float]) -> float:
        return sum(abs(v) for v in vec.values())
    
    def entropy(self, vec: Dict[int, float]) -> float:
        total = sum(abs(v) for v in vec.values())
        if total == 0:
            return 0.0
        probs = [abs(v) / total for v in vec.values()]
        ent = -sum(p * math.log(p + 1e-12) for p in probs)
        return -ent
    
    def hash_vector(self, vec: Dict[int, float]) -> str:
        data = "".join(f"{v:.5f}" for v in vec.values())
        return hashlib.sha256(data.encode()).hexdigest()[:8]
    
    def process(self, text: str) -> Dict[str, Any]:
        vec = self.compute_vector(text)
        return {
            "sigma_dim": round(self.sigma_dim(vec), 5),
            "entropy": round(self.entropy(vec), 5),
            "hash": self.hash_vector(vec)
        }

_kernel = FortyNineDKernel()

def get_49d_stats(text: str) -> Dict[str, Any]:
    return _kernel.process(text)
