# test_vipat_fixed.py
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
    
    # Resolve conflict - returns a SET of winning tags
    winners = lattice.resolve([vipat, guna])
    
    print("=" * 50)
    print("VIPAT vs GUṆA CONFLICT RESOLUTION")
    print("=" * 50)
    print(f"Vipat role: {vipat.role}")
    print(f"Guṇa role: {guna.role}")
    print(f"Number of winners: {len(winners)}")
    
    # Get the first winner (if set not empty)
    if winners:
        winner = next(iter(winners))
        print(f"Winner type: {winner.type}")
        print(f"Winner role: {winner.role}")
        
        if winner.type == "Vipat":
            print("\n✅ CORRECT: Vipat (obstacle/transformation phase) overrides Guṇa")
        else:
            print("\n❌ INCORRECT: Guṇa should not override Vipat")
    else:
        print("No winners - conflict resolution failed")
    
    return winners

if __name__ == "__main__":
    test_vipat_logic()
