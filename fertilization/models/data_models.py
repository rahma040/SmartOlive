from pydantic import BaseModel, Field
from typing import Optional

class RecommendationRequest(BaseModel):
    tree_id: str = Field(..., description="Unique identifier for the olive tree")
    days_since_last_fertilization: int = Field(..., ge=0)
    age: str
    location: str
    variety: Optional[str] = "Chemlali"

class RecommendationResponse(BaseModel):
    fertilizer_type: str
    application_time: str
    quantity_per_tree_kg: float
    confidence_score: float
    reasoning: str

class HistoryRecord(BaseModel):
    tree_id: str
    recommendation_date: str
    fertilizer_type: str
    application_time: str
    quantity_per_tree_kg: float
    confidence_score: float
    days_since_last_fertilization: int
    age: str
    location: str
