from fastapi import FastAPI, HTTPException
from firebase_config import db
from scoring import calculate_hygiene_score, calculate_distance
import datetime

app = FastAPI()

@app.post("/reports")
async def create_report(report: dict):
    # 1. Save Report
    tid = report['toiletId']
    report['createdAt'] = datetime.datetime.now()
    db.collection('toilets').document(tid).collection('reports').add(report)
    
    # 2. Recalculate Score
    toilet_ref = db.collection('toilets').document(tid)
    reports = [r.to_dict() for r in toilet_ref.collection('reports').limit(10).get()]
    t_data = toilet_ref.get().to_dict()
    
    new_score, new_grade = calculate_hygiene_score(reports, t_data)
    
    # 3. Update Toilet
    toilet_ref.update({
        "score": new_score,
        "grade": new_grade,
        "updatedAt": datetime.datetime.now()
    })
    
    # 4. Find Best Alternative
    all_toilets = db.collection('toilets').get()
    alts = []
    for t in all_toilets:
        d = t.to_dict()
        dist = calculate_distance(t_data['lat'], t_data['lng'], d['lat'], d['lng'])
        if dist < 2.0 and t.id != tid:
            alts.append({**d, "id": t.id, "dist": dist})
            
    # Sort by Score desc, Distance asc
    alts.sort(key=lambda x: (-x['score'], x['dist']))
    return {"status": "success", "alternative": alts[0] if alts else None}

    