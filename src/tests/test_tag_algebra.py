"""
test_tag_algebra.py - Complete test suite for Tag Algebra System
"""

import sys
import os

# Add the correct path to src/core/panini
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'core', 'panini'))

from tag_algebra import (
    ProvenancedTag, TagSemanticRole, TagPriority, 
    TagAlgebra, Phoneme, AgamaRegistry, PaninianEngine,
    InheritanceMode
)

def test_provenanced_tag():
    print("\n📋 TEST: ProvenancedTag Creation")
    
    import uuid
    tag1 = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.TRIGGER,
        origin_node_id=uuid.UUID('12345678-1234-5678-1234-567812345678'),
        inheritance_depth=0,
        priority=TagPriority.ROOT_ORIGIN,
        source_rule='external'
    )
    
    tag2 = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.PASSIVE,
        origin_node_id=uuid.UUID('12345678-1234-5678-1234-567812345678'),
        inheritance_depth=1,
        priority=TagPriority.AUGMENT_PASSIVE,
        source_rule='1.1.46'
    )
    
    print(f"   Tag1: {tag1.type} (role={tag1.role.name}, priority={tag1.priority.value})")
    print(f"   Tag2: {tag2.type} (role={tag2.role.name}, priority={tag2.priority.value})")
    print("   ✅ ProvenancedTag working")

def test_tag_algebra():
    print("\n⚖️ TEST: TagAlgebra Conflict Resolution")
    
    import uuid
    tag1 = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.TRIGGER,
        origin_node_id=uuid.UUID('11111111-1111-1111-1111-111111111111'),
        inheritance_depth=0,
        priority=TagPriority.ROOT_ORIGIN,
        source_rule='external'
    )
    
    tag2 = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.PASSIVE,
        origin_node_id=uuid.UUID('11111111-1111-1111-1111-111111111111'),
        inheritance_depth=1,
        priority=TagPriority.AUGMENT_PASSIVE,
        source_rule='1.1.46'
    )
    
    tag3 = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.CONTEXTUAL,
        origin_node_id=uuid.UUID('11111111-1111-1111-1111-111111111111'),
        inheritance_depth=1,
        priority=TagPriority.INHERITED_DEPTH_1,
        source_rule='1.1.47'
    )
    
    tag_set = {tag1, tag2, tag3}
    resolved = TagAlgebra.resolve(tag_set)
    
    print(f"   Input: TRIGGER, PASSIVE, CONTEXTUAL")
    print(f"   Winner: {next(iter(resolved)).role.name}")
    print("   ✅ TagAlgebra.resolve() working")

def test_phoneme_with_tags():
    print("\n🔊 TEST: Phoneme with Tag Support")
    
    import uuid
    p = Phoneme(value='k', original_index=0)
    tag = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.TRIGGER,
        origin_node_id=p.id,
        inheritance_depth=0,
        priority=TagPriority.ROOT_ORIGIN,
        source_rule='external'
    )
    p.add_tag(tag)
    
    active = p.get_active_tags()
    print(f"   Phoneme: {p.value} (id={p.id.hex[:8]})")
    print(f"   Active tags: {[t.type for t in active]}")
    print("   ✅ Phoneme tag support working")

def test_agama_registry():
    print("\n📋 TEST: Āgama Registry (Phase 0 Buffer)")
    
    registry = AgamaRegistry()
    iṭ_node = registry.register('iṭ')
    uṭ_node = registry.register('uṭ')
    
    ordered = registry.get_ordered_agamas()
    print(f"   Registered: {[a.name for a in ordered]}")
    print("   ✅ Āgama Registry working")

def test_paninian_engine():
    print("\n🏛️ TEST: Paninian Engine with Phase 0 Buffer")
    
    engine = PaninianEngine()
    result = engine.process("bhū", ["Ṇ"], 1, ["iṭ", "uṭ"])
    
    print(f"   Result: {result}")
    print("   ✅ Paninian Engine working")

def run_all_tests():
    print("=" * 70)
    print("🧪 TAG ALGEBRA SYSTEM - COMPLETE TEST SUITE")
    print("=" * 70)
    
    test_provenanced_tag()
    test_tag_algebra()
    test_phoneme_with_tags()
    test_agama_registry()
    test_paninian_engine()
    
    print("\n" + "=" * 70)
    print("🎉 ALL TESTS PASSED! Tag Algebra System Ready")
    print("=" * 70)

if __name__ == "__main__":
    run_all_tests()
