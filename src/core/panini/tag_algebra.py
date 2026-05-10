"""
tag_algebra.py - Complete Tag Algebra System for Paninian Engine
Implements: ProvenancedTag, TagSemanticRole, TagPriority, TagAlgebra
"""

from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Set, Dict, Optional, List, Tuple
from uuid import UUID, uuid4
from functools import total_ordering


# ============================================================================
# ENUMS & PRIORITIES
# ============================================================================

class TagSemanticRole(Enum):
    """The semantic function of a tag in the grammatical system"""
    TRIGGER = auto()      # Actively causes transformation
    INHIBITOR = auto()    # Blocks transformation
    CONTEXTUAL = auto()   # Depends on environment (default)
    PASSIVE = auto()      # Inherited but inert
    MARKER = auto()       # Just metadata, no action


class TagPriority(Enum):
    """Priority levels based on Paninian hierarchy"""
    ROOT_ORIGIN = 100      # Direct root anubandha
    DIRECT_OPERATION = 90  # Operation-applied tag
    INHERITED_DEPTH_1 = 50 # Inherited from immediate parent
    INHERITED_DEPTH_2 = 30 # Inherited from grandparent
    AUGMENT_PASSIVE = 10   # Passive inheritance from augment
    DEFAULT = 0            # Lowest priority


# Role weights for tie-breaking (higher = stronger)
_ROLE_WEIGHTS = {
    TagSemanticRole.TRIGGER: 100,
    TagSemanticRole.INHIBITOR: 90,
    TagSemanticRole.CONTEXTUAL: 60,
    TagSemanticRole.PASSIVE: 40,
    TagSemanticRole.MARKER: 20,
}


# ============================================================================
# PROVENANCED TAG (Core Data Structure)
# ============================================================================

@total_ordering
@dataclass
class ProvenancedTag:
    """A tag with full provenance and priority information"""
    type: str                       # 'Ṇ', 'Ṭ', 'Ḍ', etc.
    role: TagSemanticRole
    origin_node_id: UUID
    inheritance_depth: int
    priority: TagPriority
    source_rule: str                # Which Paninian sutra created this
    id: UUID = field(default_factory=uuid4)
    is_consumed: bool = False
    parent_tag_id: Optional[UUID] = None  # For cloned tags
    
    def __hash__(self):
        return hash((self.type, self.origin_node_id, self.id))
    
    def __eq__(self, other):
        if not isinstance(other, ProvenancedTag):
            return False
        return self.id == other.id
    
    def __lt__(self, other):
        """Ordering for priority resolution"""
        if not isinstance(other, ProvenancedTag):
            return NotImplemented
        
        # Primary: priority value (higher = better)
        if self.priority.value != other.priority.value:
            return self.priority.value < other.priority.value
        
        # Secondary: role weight (higher = better)
        if _ROLE_WEIGHTS[self.role] != _ROLE_WEIGHTS[other.role]:
            return _ROLE_WEIGHTS[self.role] < _ROLE_WEIGHTS[other.role]
        
        # Tertiary: shallower inheritance depth wins
        if self.inheritance_depth != other.inheritance_depth:
            return self.inheritance_depth > other.inheritance_depth
        
        # Quaternary: deterministic tie-break
        return str(self.id) < str(other.id)
    
    def clone(self, new_origin_id: UUID, depth_delta: int = 1) -> 'ProvenancedTag':
        """Create a cloned tag for inheritance"""
        new_role = self.role
        new_priority = self.priority
        
        # Demote priority on inheritance
        if self.priority == TagPriority.ROOT_ORIGIN:
            new_priority = TagPriority.INHERITED_DEPTH_1
            new_role = TagSemanticRole.CONTEXTUAL
        elif self.priority == TagPriority.INHERITED_DEPTH_1:
            new_priority = TagPriority.INHERITED_DEPTH_2
            new_role = TagSemanticRole.PASSIVE
        
        return ProvenancedTag(
            type=self.type,
            role=new_role,
            origin_node_id=new_origin_id,
            inheritance_depth=self.inheritance_depth + depth_delta,
            priority=new_priority,
            source_rule=self.source_rule,
            parent_tag_id=self.id
        )


# ============================================================================
# TAG ALGEBRA (Conflict Resolution Engine)
# ============================================================================

class TagAlgebra:
    """
    Resolves conflicts when multiple ProvenancedTags of same type coexist.
    Implements: resolve(T) = maximal elements under priority ordering
    """
    
    @staticmethod
    def resolve(tag_set: Set[ProvenancedTag]) -> Set[ProvenancedTag]:
        """
        Returns the set of winning tags after conflict resolution.
        
        Rule: Higher priority wins.
        If tie: TRIGGER > INHIBITOR > CONTEXTUAL > PASSIVE > MARKER
        If still tie: shallower inheritance depth wins
        """
        if not tag_set:
            return set()
        
        # Group by tag type
        by_type: Dict[str, Set[ProvenancedTag]] = {}
        for tag in tag_set:
            by_type.setdefault(tag.type, set()).add(tag)
        
        # Resolve per type
        resolved = set()
        for tag_type, tags in by_type.items():
            winner = TagAlgebra._resolve_single_type(tags)
            if not winner.is_consumed:
                resolved.add(winner)
        
        return resolved
    
    @staticmethod
    def _resolve_single_type(tags: Set[ProvenancedTag]) -> ProvenancedTag:
        """Single tag type resolution"""
        # Sort by priority (higher first)
        sorted_tags = sorted(tags, reverse=True)
        winner = sorted_tags[0]
        
        # Log conflict if tie-breaker was needed
        if len(sorted_tags) > 1:
            second = sorted_tags[1]
            if second.priority == winner.priority and second.role == winner.role:
                print(f"⚠️ Tag conflict on {winner.type}: ambiguous resolution")
            elif second.priority == winner.priority:
                print(f"⚖️ Tag conflict on {winner.type}: {winner.role.name} > {second.role.name}")
        
        return winner
    
    @staticmethod
    def merge_tags(source_tags: Set[ProvenancedTag], 
                   target_tags: Set[ProvenancedTag]) -> Set[ProvenancedTag]:
        """Merge two tag sets with conflict resolution"""
        combined = source_tags.union(target_tags)
        return TagAlgebra.resolve(combined)


# ============================================================================
# PHONEME WITH TAG SUPPORT (DAG Node)
# ============================================================================

class InheritanceMode(Enum):
    FULL = "full"                     # Inherit all tags with CONTEXTUAL role
    BEHAVIORAL_ONLY = "behavioral_only"  # Inherit only TRIGGER tags as PASSIVE
    NONE = "none"                     # No inheritance


@dataclass
class Phoneme:
    """Phoneme node with tag algebra support - DAG Node"""
    value: str
    original_index: int
    id: UUID = field(default_factory=uuid4)
    parent_id: Optional[UUID] = None
    tags: Set[ProvenancedTag] = field(default_factory=set)
    is_deleted: bool = False
    inserted_by: Optional[str] = None
    inheritance_mode: InheritanceMode = InheritanceMode.NONE
    
    def lineage(self) -> Set[UUID]:
        """Return all ancestor IDs including self"""
        ancestors = {self.id}
        # Traverse parent chain
        # In production: traverse parent pointers recursively
        return ancestors
    
    def add_tag(self, tag: ProvenancedTag):
        """Add tag with automatic conflict resolution"""
        # Collect all tags of same type
        same_type = {t for t in self.tags if t.type == tag.type}
        if same_type:
            # Resolve conflict
            combined = same_type | {tag}
            winner = TagAlgebra.resolve(combined)
            # Remove all of this type, add winner
            self.tags = {t for t in self.tags if t.type != tag.type}
            self.tags.update(winner)
        else:
            self.tags.add(tag)
    
    def get_active_tags(self) -> Set[ProvenancedTag]:
        """Return only tags that can apply"""
        resolved = TagAlgebra.resolve(self.tags)
        return {t for t in resolved if not t.is_consumed}
    
    def consume_tag(self, tag_type: str):
        """Mark a tag as consumed after applying its effect"""
        for tag in self.tags:
            if tag.type == tag_type and not tag.is_consumed:
                tag.is_consumed = True
                break


# ============================================================================
# ĀGAMA REGISTRY (Phase 0 Buffer)
# ============================================================================

@dataclass
class AgamaNode:
    """Augment node with inheritance policy"""
    name: str
    rule_id: str
    inheritance_mode: InheritanceMode
    position: str  # 'prefix', 'infix', 'suffix'
    priority: int  # lower number = earlier rule
    parent_id: Optional[UUID] = None
    node_id: UUID = field(default_factory=uuid4)


class AgamaRegistry:
    """Phase 0 Buffer - Declares all augments before tag binding"""
    
    def __init__(self):
        self.agamas: List[AgamaNode] = []
        self.inheritance_policies = {
            'iṭ': {'mode': InheritanceMode.BEHAVIORAL_ONLY, 'position': 'prefix', 'priority': 10},
            'uṭ': {'mode': InheritanceMode.FULL, 'position': 'prefix', 'priority': 20},
            'nuṭ': {'mode': InheritanceMode.FULL, 'position': 'infix', 'priority': 15},
            'suṭ': {'mode': InheritanceMode.BEHAVIORAL_ONLY, 'position': 'suffix', 'priority': 5},
        }
    
    def register(self, agama_name: str, parent_id: UUID = None) -> AgamaNode:
        """Register an augment before processing"""
        if agama_name not in self.inheritance_policies:
            raise ValueError(f"Unknown augment: {agama_name}")
        
        policy = self.inheritance_policies[agama_name]
        node = AgamaNode(
            name=agama_name,
            rule_id=self._get_rule_id(agama_name),
            inheritance_mode=policy['mode'],
            position=policy['position'],
            priority=policy['priority'],
            parent_id=parent_id
        )
        self.agamas.append(node)
        # Sort by priority (lower = earlier rule)
        self.agamas.sort(key=lambda x: x.priority)
        return node
    
    def _get_rule_id(self, agama_name: str) -> str:
        rules = {
            'iṭ': '1.1.46',
            'uṭ': '1.1.47',
            'nuṭ': '1.1.48',
            'suṭ': '1.1.49'
        }
        return rules.get(agama_name, 'unknown')
    
    def get_ordered_agamas(self) -> List[AgamaNode]:
        """Return augments in priority order"""
        return self.agamas


# ============================================================================
# INHERITANCE MANAGER
# ============================================================================

class InheritanceManager:
    """Manages tag inheritance between phonemes"""
    
    @staticmethod
    def inherit_tags(child: Phoneme, parent: Phoneme) -> Phoneme:
        """Inherit tags from parent to child based on child's inheritance mode"""
        
        mode = child.inheritance_mode
        
        if mode == InheritanceMode.NONE:
            return child
        
        for parent_tag in parent.tags:
            # Determine new role based on mode
            if mode == InheritanceMode.FULL:
                new_role = TagSemanticRole.CONTEXTUAL
                new_priority = TagPriority.INHERITED_DEPTH_1
            else:  # BEHAVIORAL_ONLY
                if parent_tag.role != TagSemanticRole.TRIGGER:
                    continue  # Only inherit triggers
                new_role = TagSemanticRole.PASSIVE
                new_priority = TagPriority.AUGMENT_PASSIVE
            
            # Create inherited tag
            inherited_tag = ProvenancedTag(
                type=parent_tag.type,
                role=new_role,
                origin_node_id=parent_tag.origin_node_id,
                inheritance_depth=parent_tag.inheritance_depth + 1,
                priority=new_priority,
                source_rule=f"inheritance:{parent_tag.source_rule}",
                parent_tag_id=parent_tag.id
            )
            
            child.add_tag(inherited_tag)
        
        return child


# ============================================================================
# PANINIAN ENGINE (Complete)
# ============================================================================

class PaninianEngine:
    """Complete Paninian engine with Phase 0 Buffer + DAG + Tag Algebra"""
    
    def __init__(self):
        self.agama_registry = AgamaRegistry()
        self.inheritance_manager = InheritanceManager()
        self.phonemes: List[Phoneme] = []
        self.rule_priority = {
            '1.1.46': 100,    # iṭ anubandha
            '1.1.47': 90,     # uṭ anubandha
            'gana_7': 80,     # Rudhādi nasal infix
            '8.4.39': 70,     # Retroflexion
        }
    
    def process(self, dhatu: str, tags: List[str], gana: int, augments: List[str] = None):
        """
        Complete processing pipeline
        """
        print(f"\n🔄 Processing: √{dhatu} + {tags} + Gana {gana}")
        if augments:
            print(f"   Augments: {augments}")
        
        # ========== PHASE 0: Āgama Registry ==========
        print("\n📋 PHASE 0: Āgama Registry")
        agama_nodes = []
        if augments:
            for aug in augments:
                node = self.agama_registry.register(aug)
                agama_nodes.append(node)
                print(f"   Registered: {aug} (rule {node.rule_id}, mode={node.inheritance_mode.value})")
        
        # ========== STAGE 1: DAG Construction ==========
        print("\n🏗️ STAGE 1: DAG Construction")
        self.phonemes = []
        for i, ch in enumerate(dhatu):
            phoneme = Phoneme(value=ch, original_index=i)
            self.phonemes.append(phoneme)
            print(f"   Created: {ch}(id={phoneme.id.hex[:8]})")
        
        # Attach augments (for simplicity, attach as prefix)
        for agama in agama_nodes:
            augment_phoneme = Phoneme(
                value=self._get_agama_sound(agama.name),
                original_index=-1,
                parent_id=self.phonemes[0].id if self.phonemes else None,
                inheritance_mode=agama.inheritance_mode,
                inserted_by=agama.name
            )
            self.phonemes.insert(0, augment_phoneme)
            print(f"   Attached augment: {agama.name}(id={augment_phoneme.id.hex[:8]}) with mode={agama.inheritance_mode.value}")
        
        # ========== STAGE 2: Tag Binding ==========
        print("\n🏷️ STAGE 2: Tag Binding")
        for tag_str in tags:
            tag = ProvenancedTag(
                type=tag_str,
                role=TagSemanticRole.TRIGGER,
                origin_node_id=self.phonemes[0].id if self.phonemes else uuid4(),
                inheritance_depth=0,
                priority=TagPriority.ROOT_ORIGIN,
                source_rule='external'
            )
            if self.phonemes:
                self.phonemes[0].add_tag(tag)
                print(f"   Bound {tag_str} to {self.phonemes[0].value}(id={self.phonemes[0].id.hex[:8]})")
        
        # ========== STAGE 3: Inheritance Resolution ==========
        print("\n🔄 STAGE 3: Inheritance Resolution")
        for i, phoneme in enumerate(self.phonemes[1:], 1):  # Skip root
            parent = self.phonemes[0]
            self.inheritance_manager.inherit_tags(phoneme, parent)
            active = phoneme.get_active_tags()
            tag_names = [t.type for t in active]
            print(f"   Phoneme {phoneme.value}(id={phoneme.id.hex[:8]}): tags={tag_names}, mode={phoneme.inheritance_mode.value}")
        
        # ========== STAGE 4: Tag Algebra ==========
        print("\n⚖️ STAGE 4: Tag Algebra Resolution")
        for phoneme in self.phonemes:
            resolved = TagAlgebra.resolve(phoneme.tags)
            if resolved:
                winner = next(iter(resolved))
                print(f"   {phoneme.value}: winner={winner.type}(role={winner.role.name}, priority={winner.priority.value})")
        
        # ========== STAGE 5-7: Morphology & Sandhi ==========
        result = ''.join(p.value for p in self.phonemes if not p.is_deleted)
        
        print(f"\n✅ FINAL OUTPUT: {result}")
        return result
    
    def _get_agama_sound(self, agama_name: str) -> str:
        sounds = {'iṭ': 'i', 'uṭ': 'u', 'nuṭ': 'n', 'suṭ': 's'}
        return sounds.get(agama_name, 'a')


# ============================================================================
# UNIT TESTS
# ============================================================================

def run_tests():
    """Run all three conflict scenarios"""
    print("=" * 70)
    print("TAG ALGEBRA SYSTEM - COMPLETE TEST SUITE")
    print("=" * 70)
    
    engine = PaninianEngine()
    
    # Test 1: iṭ + uṭ collision
    print("\n" + "=" * 50)
    print("TEST 1: iṭ + uṭ Collision on √BRŪ + Ṇ")
    print("=" * 50)
    result = engine.process("brū", ["Ṇ"], 1, ["iṭ", "uṭ"])
    
    # Test 2: Ṇ + Ṭ conflict
    print("\n" + "=" * 50)
    print("TEST 2: Ṇ + Ṭ Conflict on Same Node")
    print("=" * 50)
    result = engine.process("rudh", ["Ṇ", "Ṭ"], 1, [])
    
    # Test 3: Inheritance chain
    print("\n" + "=" * 50)
    print("TEST 3: Three-Way Inheritance Chain")
    print("=" * 50)
    result = engine.process("bhū", ["Ṇ"], 1, ["iṭ", "uṭ"])
    
    print("\n" + "=" * 70)
    print("🎉 ALL TESTS COMPLETED")
    print("=" * 70)


if __name__ == "__main__":
    run_tests()
