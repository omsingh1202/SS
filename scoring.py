import math

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * \
        math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def get_grade(score):
    if score >= 90: return "A"
    if score >= 75: return "B"
    if score >= 60: return "C"
    if score >= 40: return "D"
    if score >= 20: return "E"
    return "F"

def calculate_hygiene_score(reports, toilet_data):
    score = 100
    penalties = {
        "DIRTY": -10, "WET_FLOOR": -15, "OVERFLOW": -30,
        "NO_WATER": -20, "BLOCKED": -25, "SMELL": -12
    }
    
    # Apply report penalties (based on last 24h reports)
    for r in reports:
        score += penalties.get(r.get('type'), 0)
    
    # Rating bonus: (avg - 3) * 6
    avg_rating = toilet_data.get('avgRating', 3)
    score += (avg_rating - 3) * 6
    
    # Clamp and Grade
    final_score = max(0, min(100, score))
    return final_score, get_grade(final_score)