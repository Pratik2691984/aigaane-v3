# Add to nakshatra_sound.py - Yantra generation from hash

def hash_to_yantra_params(self, hash_val: int) -> dict:
    """Convert 49D hash to geometric yantra parameters"""
    # Use modulo operations to get deterministic geometry
    return {
        "rotation": hash_val % 360,
        "triangles": (hash_val % 12) + 3,  # 3-14 triangles
        "petals": (hash_val % 24) + 4,      # 4-27 petals
        "dot_radius": (hash_val % 15) + 5,  # 5-20 pixels
        "color_phase": hash_val % 360,
        "symmetry": ["radial", "bilateral", "asymmetric"][hash_val % 3]
    }

def generate_yantra_svg(self, hash_val: int, size: int = 500) -> str:
    """Generate SVG yantra from hash parameters"""
    params = self.hash_to_yantra_params(hash_val)
    
    svg = f'<svg width="{size}" height="{size}" xmlns="http://www.w3.org/2000/svg">'
    svg += f'<rect width="{size}" height="{size}" fill="#fffaf0"/>'
    
    center = size / 2
    
    # Outer circle
    svg += f'<circle cx="{center}" cy="{center}" r="{size*0.44}" stroke="#2c3e50" stroke-width="12" fill="none"/>'
    
    # Triangles based on hash
    for i in range(params["triangles"]):
        angle = (i * 360 / params["triangles"] + params["rotation"]) * 3.14159 / 180
        x2 = center + size * 0.35 * cos(angle)
        y2 = center + size * 0.35 * sin(angle)
        x3 = center + size * 0.35 * cos(angle + 2*3.14159/3)
        y3 = center + size * 0.35 * sin(angle + 2*3.14159/3)
        svg += f'<polygon points="{center},{center} {x2},{y2} {x3},{y3}" stroke="#e67e22" stroke-width="3" fill="none"/>'
    
    # Center bindu
    svg += f'<circle cx="{center}" cy="{center}" r="{params["dot_radius"]}" fill="#f1c40f"/>'
    svg += '</svg>'
    
    return svg
