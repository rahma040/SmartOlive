from fastapi import FastAPI, HTTPException
from datetime import datetime
from models.data_models import RecommendationRequest, RecommendationResponse, HistoryRecord
from models.fertilization_model import TunisianOliveFertilizationModel
from db.history_store import add_history, get_tree_history, get_all_history, delete_tree_history
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Tunisian Olive Tree Fertilization Recommendation System")
fertilization_model = TunisianOliveFertilizationModel()
origins = [
    "http://localhost:3000",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080","http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendation(request: RecommendationRequest):
    try:
        recommendation = fertilization_model.recommend_fertilizer(request)
        record = HistoryRecord(
            tree_id=request.tree_id,
            recommendation_date=datetime.now().isoformat(),
            fertilizer_type=recommendation.fertilizer_type,
            application_time=recommendation.application_time,
            quantity_per_tree_kg=recommendation.quantity_per_tree_kg,
            confidence_score=recommendation.confidence_score,
            days_since_last_fertilization=request.days_since_last_fertilization,
            age=request.age,
            location=request.location
        )
        add_history(record)
        return recommendation
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/history/{tree_id}")
async def history_by_tree(tree_id: str):
    records = get_tree_history(tree_id)
    if not records:
        raise HTTPException(status_code=404, detail="No history found for this tree")
    return records

@app.get("/history")
async def history_all(limit: int = 100):
    return get_all_history(limit)

@app.delete("/history/{tree_id}")
async def delete_history(tree_id: str):
    deleted = delete_tree_history(tree_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="No records deleted")
    return {"message": f"Deleted {deleted} records for tree {tree_id}"}

@app.get("/locations")
async def locations():
    return {"locations": list(fertilization_model.regional_characteristics.keys())}

@app.get("/varieties")
async def varieties():
    return {"varieties": list(fertilization_model.variety_traits.keys())}

@app.get("/")
async def root():
    return {
        "name": "Tunisian Olive Tree Fertilization API",
        "version": "1.0",
        "description": "AI-powered recommendations for olive fertilization in Tunisia",
    }
# ✅ Add these endpoints
@app.get("/locations")
def get_locations():
    return {"locations": ["Sousse","monastir","tunis","beja", "Sfax", "Kairouan", "Gabes", "Bizerte"]}

@app.get("/varieties")
def get_varieties():
    return {"varieties": ["Chemlali", "Chetoui", "Koroneiki", "Arbequina"]}

if __name__ == "__main__":
  # FIXED: Was _name and main
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
