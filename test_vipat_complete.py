# test_vipat_complete.py
import sys
sys.path.insert(0, 'engine')
from tag_algebra import ProvenancedTag, TagAlgebra, TagSemanticRole, Modality

def test_vipat_logic():
    lattice = TagAlgebra()
    
    # Test Case: Vipat (INHIBITOR) vs Guṇa (TRIGGER)
    vipat = ProvenancedTag(
        type='Vipat',
        role=TagSemanticRole.INHIBITOR,
        origin_node_id=1,
        inheritance_depth=11,
        priority=85,
        source_rule='navatara'
    )
    
    guna = ProvenancedTag(
        type='Guṇa',
        role=TagSemanticRole.TRIGGER,
        origin_node_id=2,
        inheritance_depth=8,
        priority=65,
        source_rule='7.3.84'
    )
    
    winner = lattice.resolve([vipat, guna])
    
    print("=" * 50)
    print("VIPAT vs GUṆA CONFLICT RESOLUTION")
    print("=" * 50)
    print(f"Conflicting tags: {vipat.type} ({vipat.modality.value}) vs {guna.type} ({guna.modality.value})")
    print(f"Winner: {winner.type}")
    print(f"Winner modality: {winner.modality.value}")
    print(f"INHIBITOR wins: {winner.modality == Modality.INHIBITOR}")
    
    if winner.type == "Vipat":
        print("\n✅ CORRECT: Vipat (obstacle/transformation phase) overrides Guṇa")
        print("   This means Navatara Vipat blocks normal Guṇa operations")
    else:
        print("\n❌ INCORRECT: Guṇa should not override Vipat in Navatara logic")
    
    return winner

if __name__ == "__main__":
    test_vipat_logic()
