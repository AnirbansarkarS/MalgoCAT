from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class Algorithm:
    """
    Represents an ML algorithm with its metadata.
    """
    name: str
    type: str  # 'classification', 'regression', 'clustering', 'dimensionality_reduction'
    description: str
    pros: List[str]
    cons: List[str]
    complexity_score: int # 1 (Low) to 10 (High)
    min_samples: int = 10
    handle_missing: bool = False
    handle_sparse: bool = False
    handle_categorical: bool = False # Native support
    
    def to_dict(self):
        return {
            "name": self.name,
            "type": self.type,
            "description": self.description,
            "pros": self.pros,
            "cons": self.cons,
            "complexity_score": self.complexity_score,
            "handle_missing": self.handle_missing,
            "handle_sparse": self.handle_sparse
        }
