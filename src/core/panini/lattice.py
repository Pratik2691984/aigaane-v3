"""
Lattice Theory + Modal S4 Logic for Pāṇinian Conflict Resolution
"""

from typing import List, Dict, Any
from dataclasses import dataclass, field
from enum import Enum

class Modality(Enum):
    POSSIBLE = "◇"
    NECESSARY = "□"
    INHIBITOR = "□¬"
    
    def __gt__(self, other):
        order = {Modality.POSSIBLE: 0, Modality.NECESSARY: 1, Modality.INHIBITOR: 2}
        return order[self] > order[other]

@dataclass(frozen=True)
class Tag:
    name: str
    priority: int = 50
    depth: int = 0
    origin: str = "root"
    role: str = "neutral"
    modality: Modality = Modality.POSSIBLE
    specificity: int = 0
    
    def __lt__(self, other: 'Tag') -> bool:
        if self.priority != other.priority:
            return self.priority < other.priority
        if self.depth != other.depth:
            return self.depth < other.depth
        if self.specificity != other.specificity:
            return self.specificity < other.specificity
        return self.modality < other.modality
    
    def meet(self, other: 'Tag') -> 'Tag':
        if not isinstance(other, Tag):
            raise TypeError("Meet only defined between Tags")
        new_priority = max(self.priority, other.priority)
        new_depth = max(self.depth, other.depth)
        new_specificity = max(self.specificity, other.specificity)
        origin_order = {"reduplicant": 3, "augment": 2, "root": 1}
        so = origin_order.get(self.origin, 0)
        oo = origin_order.get(other.origin, 0)
        new_origin = self.origin if so >= oo else other.origin
        if self.role != "neutral" and other.role == "neutral":
            new_role = self.role
        elif other.role != "neutral" and self.role == "neutral":
            new_role = other.role
        elif self.role == other.role:
            new_role = self.role
        else:
            new_role = "conflict"
        new_modality = self.modality if self.modality > other.modality else other.modality
        if self.name == other.name:
            new_name = self.name
        else:
            new_name = f"{self.name}|{other.name}"
        return Tag(name=new_name, priority=new_priority, depth=new_depth,
                   origin=new_origin, role=new_role, modality=new_modality,
                   specificity=new_specificity)

class TagLattice:
    def __init__(self):
        self.top = Tag("INHIBITOR", priority=9999, depth=9999, modality=Modality.INHIBITOR, specificity=100)
        self.bottom = Tag("PASSIVE", priority=-9999, depth=-9999, specificity=-100)
    
    def resolve(self, tags: List[Tag]) -> Tag:
        if not tags:
            return self.bottom
        sorted_tags = sorted(tags, reverse=True)
        winner = sorted_tags[0]
        for t in sorted_tags[1:]:
            winner = winner.meet(t)
        return winner
