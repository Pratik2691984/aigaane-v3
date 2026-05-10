"""
Tag Algebra System for AIGAANE V3
Implements Paninian conflict resolution with provenance tracking
"""

from enum import Enum, auto
from dataclasses import dataclass, field
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
    
    @staticmethod
    def can_apply(tag: ProvenancedTag, context: Dict = None) -> bool:
        """Check if a tag can apply in current context"""
        if tag.is_consumed:
            return False
        
        if tag.role == TagSemanticRole.PASSIVE:
            return False
        
        if tag.role == TagSemanticRole.MARKER:
            return False
        
        # Contextual tags need environment check
        if tag.role == TagSemanticRole.CONTEXTUAL:
            if not context:
                return False
            # Check if context meets requirements
            # (to be implemented per tag type)
            pass
        
        return True


# ============================================================================
# PHONEME WITH TAG SUPPORT
# ============================================================================

@dataclass
class Phoneme:
    """Phoneme node with tag algebra support"""
    value: str
    original_index: int
    id: UUID = field(default_factory=uuid4)
    parent_id: Optional[UUID] = None
    tags: Set[ProvenancedTag] = field(default_factory=set)
    is_deleted: bool = False
    inserted_by: Optional[str] = None
    
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
    
    def get_active_tags(self, context: Dict = None) -> Set[ProvenancedTag]:
        """Return only tags that can apply"""
        resolved = TagAlgebra.resolve(self.tags)
        return {t for t in resolved if TagAlgebra.can_apply(t, context)}
    
    def consume_tag(self, tag_type: str):
        """Mark a tag as consumed after applying its effect"""
        for tag in self.tags:
            if tag.type == tag_type and not tag.is_consumed:
                tag.is_consumed = True
                break


# ============================================================================
# INHERITANCE MANAGER
# ============================================================================

class InheritanceMode(Enum):
    FULL = "full"               # Inherit all tags with CONTEXTUAL role
    BEHAVIORAL_ONLY = "behavioral_only"  # Inherit only TRIGGER tags as PASSIVE
    NONE = "none"               # No inheritance


class InheritanceManager:
    """Manages tag inheritance between phonemes"""
    
    def __init__(self):
        self.inheritance_policies = {
            'root': InheritanceMode.FULL,
            'augment_iṭ': InheritanceMode.BEHAVIORAL_ONLY,
            'augment_uṭ': InheritanceMode.FULL,
            'reduplicant': InheritanceMode.BEHAVIORAL_ONLY,
        }
    
    def inherit_tags(self, child: Phoneme, parent: Phoneme, 
                     mode: InheritanceMode = None) -> Phoneme:
        """
        Inherit tags from parent to child based on mode
        """
        if mode is None:
            mode = self._get_mode_for_node(child)
        
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
    
    def _get_mode_for_node(self, node: Phoneme) -> InheritanceMode:
        """Determine inheritance mode based on node metadata"""
        if node.inserted_by:
            if 'iṭ' in node.inserted_by:
                return InheritanceMode.BEHAVIORAL_ONLY
            if 'uṭ' in node.inserted_by:
                return InheritanceMode.FULL
            if 'reduplicant' in node.inserted_by:
                return InheritanceMode.BEHAVIORAL_ONLY
        return InheritanceMode.FULL


# ============================================================================
# UNIT TESTS
# ============================================================================

def run_tests():
    """Run the three conflict scenarios"""
    print("=" * 60)
    print("TAG ALGEBRA TESTS")
    print("=" * 60)
    
    # Test 1: iṭ + uṭ collision
    print("\n📋 TEST 1: iṭ + uṭ Collision")
    print("-" * 40)
    
    root_id = uuid4()
    root_tag = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.TRIGGER,
        origin_node_id=root_id,
        inheritance_depth=0,
        priority=TagPriority.ROOT_ORIGIN,
        source_rule='external'
    )
    
    i_tag = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.PASSIVE,
        origin_node_id=root_id,
        inheritance_depth=1,
        priority=TagPriority.AUGMENT_PASSIVE,
        source_rule='1.1.46'
    )
    
    u_tag = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.CONTEXTUAL,
        origin_node_id=root_id,
        inheritance_depth=1,
        priority=TagPriority.INHERITED_DEPTH_1,
        source_rule='1.1.47'
    )
    
    tag_set = {root_tag, i_tag, u_tag}
    resolved = TagAlgebra.resolve(tag_set)
    
    print(f"Input tags: Ṇ(TRIGGER), Ṇ(PASSIVE), Ṇ(CONTEXTUAL)")
    print(f"Resolved winner: {next(iter(resolved)).role.name}")
    assert next(iter(resolved)).role == TagSemanticRole.TRIGGER
    print("✅ PASS: TRIGGER wins over CONTEXTUAL and PASSIVE")
    
    # Test 2: Ṇ + Ṭ conflict on same node
    print("\n📋 TEST 2: Ṇ + Ṭ Conflict (Trigger vs Inhibitor)")
    print("-" * 40)
    
    phoneme = Phoneme(value='d', original_index=0)
    n_tag = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.TRIGGER,
        origin_node_id=phoneme.id,
        inheritance_depth=0,
        priority=TagPriority.ROOT_ORIGIN,
        source_rule='8.4.39'
    )
    t_tag = ProvenancedTag(
        type='Ṭ',
        role=TagSemanticRole.INHIBITOR,
        origin_node_id=phoneme.id,
        inheritance_depth=0,
        priority=TagPriority.ROOT_ORIGIN,
        source_rule='ṭ_block'
    )
    
    phoneme.add_tag(n_tag)
    phoneme.add_tag(t_tag)
    
    active = phoneme.get_active_tags()
    print(f"Active tags after resolution: {[t.type for t in active]}")
    # Both should be active since different types
    assert len(active) == 2
    print("✅ PASS: Different tag types can coexist")
    
    # Test 3: Three-way inheritance chain
    print("\n📋 TEST 3: Three-Way Inheritance Chain")
    print("-" * 40)
    
    root = Phoneme(value='ū', original_index=0)
    root_tag = ProvenancedTag(
        type='Ṇ',
        role=TagSemanticRole.TRIGGER,
        origin_node_id=root.id,
        inheritance_depth=0,
        priority=TagPriority.ROOT_ORIGIN,
        source_rule='external'
    )
    root.add_tag(root_tag)
    
    augment = Phoneme(value='i', original_index=-1, inserted_by='iṭ')
    inherit_mgr = InheritanceManager()
    augment = inherit_mgr.inherit_tags(augment, root)
    
    reduplicant = Phoneme(value='h', original_index=-1, inserted_by='reduplicant')
    reduplicant = inherit_mgr.inherit_tags(reduplicant, augment)
    
    print(f"Root tags: {[t.role.name for t in root.tags]}")
    print(f"Augment tags: {[t.role.name for t in augment.tags]}")
    print(f"Reduplicant tags: {[t.role.name for t in reduplicant.tags]}")
    
    assert len(root.tags) == 1
    assert len(augment.tags) == 1
    assert len(reduplicant.tags) == 0 or len(reduplicant.tags) == 1
    print("✅ PASS: Inheritance chain working")
    
    print("\n" + "=" * 60)
    print("🎉 ALL TESTS PASSED!")
    print("=" * 60)


if __name__ == "__main__":
    run_tests()
