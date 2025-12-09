from typing import List, Optional, Dict
from src.algorithms.base import Algorithm

class AlgorithmRegistry:
    """
    Singleton-like registry to store all known algorithms.
    """
    _algorithms: Dict[str, Algorithm] = {}

    @classmethod
    def register(cls, algorithm: Algorithm):
        cls._algorithms[algorithm.name.lower()] = algorithm

    @classmethod
    def get_all(cls) -> List[Algorithm]:
        return list(cls._algorithms.values())

    @classmethod
    def get_by_name(cls, name: str) -> Optional[Algorithm]:
        return cls._algorithms.get(name.lower())

    @classmethod
    def get_by_type(cls, problem_type: str) -> List[Algorithm]:
        return [algo for algo in cls._algorithms.values() if algo.type == problem_type]
