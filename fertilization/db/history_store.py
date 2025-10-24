from typing import List
from models.data_models import HistoryRecord

recommendation_history: List[HistoryRecord] = []

def add_history(record: HistoryRecord):
    recommendation_history.append(record)

def get_tree_history(tree_id: str):
    return [r for r in recommendation_history if r.tree_id == tree_id]

def get_all_history(limit: int = 100):
    return recommendation_history[-limit:]

def delete_tree_history(tree_id: str):
    global recommendation_history
    initial_count = len(recommendation_history)
    recommendation_history = [r for r in recommendation_history if r.tree_id != tree_id]
    return initial_count - len(recommendation_history)
