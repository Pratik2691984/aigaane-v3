# test_vipat_simple.py
import sys
sys.path.insert(0, 'engine')
from tag_algebra import ProvenancedTag, TagAlgebra, TagSemanticRole

def test_vipat_logic():
    lattice = TagAlgebra()
    
    # Create Vipat tag (INHIBITOR role)
    vipat = ProvenancedTag(
        type='Vipat',
        role=TagSemanticRole.INHIBITOR,
        origin_node_id=1,
        inheritance_depth=11,
        priority=85,
        source_rule='navatara'
    )
    
    # Create Guṇa tag (TRIGGER role)
    guna = ProvenancedTag(
        type='Guṇa',
        role=TagSemanticRole.TRIGGER,
        origin_node_id=2,
        inheritance_depth=8,
        priority=65,
        source_rule='7.3.84'
    )
    
    # Resolve conflict
    winner = lattice.resolve([vipat, guna])
    
    print("=" * 50)
    print("VIPAT vs GUṆA CONFLICT RESOLUTION")
    print("=" * 50)
    print(f"Vipat role: {vipat.role}")
    print(f"Guṇa role: {guna.role}")
    print(f"Winner: {winner.type}")
    print(f"Winner role: {winner.role}")
    
    # Check if INHIBITOR wins (without Modality)
    is_inhibitor_winner = winner.role == TagSemanticRole.INHIBITOR
    
    if winner.type == "Vipat":
        print("\n✅ CORRECT: Vipat (obstacle phase) overrides Guṇa")
    else:
        print("\n❌ INCORRECT: Guṇa should not override Vipat")
    
    return winner

if __name__ == "__main__":
    test_vipat_logic()
