from datetime import datetime
from typing import Dict
from sklearn.preprocessing import LabelEncoder
from models.data_models import RecommendationRequest, RecommendationResponse

class TunisianOliveFertilizationModel:
    def __init__(self):  # FIXED: Was _init
        # Fertilizer types used in Tunisia
        self.fertilizer_types = [
            "NPK 12-12-17",
            "NPK 15-15-15",
            "NPK 20-10-10",
            "Organic Compost",
            "NPK 10-20-20"
        ]

        # Regional soil characteristics
        self.regional_characteristics = {
            "Sfax": {"soil_type": "sandy-clay", "rainfall": "low", "salinity": "moderate"},
            "Kairouan": {"soil_type": "clay", "rainfall": "low", "salinity": "low"},
            "Mahdia": {"soil_type": "clay-sandy", "rainfall": "moderate", "salinity": "moderate"},
            "Sousse": {"soil_type": "sandy", "rainfall": "moderate", "salinity": "low"},
            "Monastir": {"soil_type": "sandy-clay", "rainfall": "moderate", "salinity": "moderate"}
        }

        # Age-based requirements
        self.age_requirements = {
            "young": {"N": 0.4, "P": 0.3, "K": 0.5, "base_kg": 0.3},
            "mature": {"N": 0.8, "P": 0.6, "K": 1.0, "base_kg": 0.8},
            "old": {"N": 0.6, "P": 0.5, "K": 0.8, "base_kg": 0.6}
        }

        # Variety-specific characteristics
        self.variety_traits = {
            "Chemlali": {"vigor": "moderate", "yield": "high", "K_preference": 1.2},
            "Chetoui": {"vigor": "high", "yield": "very_high", "K_preference": 1.3}
        }

        # Encoders (not critical but useful)
        self.age_encoder = LabelEncoder().fit(["young", "mature", "old"])
        self.location_encoder = LabelEncoder().fit(list(self.regional_characteristics.keys()))
        self.variety_encoder = LabelEncoder().fit(["Chemlali", "Chetoui"])

    def get_current_season(self) -> str:
        month = datetime.now().month
        if month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        elif month in [9, 10, 11]:
            return "autumn"
        else:
            return "winter"

    def calculate_application_time(self, days_since_last: int, current_season: str) -> str:
        if days_since_last < 120:
            return "not_needed"
        elif days_since_last < 180:
            return "autumn" if current_season in ["spring", "summer"] else "spring"
        else:
            if current_season in ["winter", "early_spring"]:
                return "spring"
            elif current_season in ["spring", "summer"]:
                return "summer"
            else:
                return "autumn"

    def recommend_fertilizer(self, request: RecommendationRequest) -> RecommendationResponse:
        if request.age not in ["young", "mature", "old"]:
            raise ValueError("Age must be 'young', 'mature', or 'old'")

        location = request.location if request.location in self.regional_characteristics else "Sfax"
        variety = request.variety if request.variety in ["Chemlali", "Chetoui"] else "Chemlali"
        current_season = self.get_current_season()
        application_time = self.calculate_application_time(request.days_since_last_fertilization, current_season)

        if application_time == "not_needed":
            return RecommendationResponse(
                fertilizer_type="None",
                application_time="Not needed yet",
                quantity_per_tree_kg=0.0,
                confidence_score=0.95,
                reasoning="Tree was fertilized recently (less than 120 days ago)."
            )

        age_reqs = self.age_requirements[request.age]
        variety_traits = self.variety_traits[variety]
        regional = self.regional_characteristics[location]
        base_quantity = age_reqs["base_kg"]

        if variety == "Chetoui":
            base_quantity *= 1.1

        if regional["salinity"] == "moderate":
            fertilizer_type = "NPK 12-12-17"
            base_quantity *= 0.95
        elif regional["rainfall"] == "low":
            fertilizer_type = "NPK 15-15-15" if request.age != "young" else "NPK 12-12-17"
        else:
            fertilizer_type = "NPK 15-15-15"

        if request.days_since_last_fertilization > 240:
            base_quantity *= 1.2
            fertilizer_type = "NPK 15-15-15"

        if application_time == "spring" and request.age == "young":
            fertilizer_type = "NPK 20-10-10"
            base_quantity *= 0.9
        elif application_time == "autumn":
            fertilizer_type = "NPK 12-12-17"
            base_quantity *= 1.05

        if request.age == "old" and request.days_since_last_fertilization > 200:
            fertilizer_type = "Organic Compost"
            base_quantity = 2.0

        confidence = self._calculate_confidence(request.days_since_last_fertilization, request.age, location, variety)
        reasoning = self._generate_reasoning(request, fertilizer_type, application_time, regional, variety_traits)

        return RecommendationResponse(
            fertilizer_type=fertilizer_type,
            application_time=application_time,
            quantity_per_tree_kg=round(base_quantity, 1),
            confidence_score=round(confidence, 2),
            reasoning=reasoning
        )

    def _calculate_confidence(self, days_since, age, location, variety) -> float:
        confidence = 0.85
        if 150 <= days_since <= 210:
            confidence += 0.10
        elif days_since > 240:
            confidence -= 0.05
        if location in self.regional_characteristics:
            confidence += 0.05
        if age == "mature":
            confidence += 0.05
        return min(confidence, 0.99)

    def _generate_reasoning(self, request, fertilizer, app_time, regional, variety_traits) -> str:
        reasons = []
        if request.age == "young":
            reasons.append("Young trees need nitrogen for growth")
        elif request.age == "mature":
            reasons.append("Mature trees need potassium for fruiting")
        else:
            reasons.append("Old trees benefit from organic supplements")
        if regional["salinity"] == "moderate":
            reasons.append(f"Moderate salinity in {request.location} requires potassium-rich fertilizer")
        if regional["rainfall"] == "low":
            reasons.append("Low rainfall areas need balanced NPK formulas")
        if request.days_since_last_fertilization > 200:
            reasons.append("Long time since last fertilization needs replenishment")
        if app_time == "spring":
            reasons.append("Spring supports vegetative growth")
        elif app_time == "autumn":
            reasons.append("Autumn helps fruit development")
        return ". ".join(reasons) + "."