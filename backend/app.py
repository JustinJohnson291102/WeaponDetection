from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import cv2
import numpy as np
from PIL import Image
import io
import base64
import os

app = FastAPI(title="WeaponGuard API")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model load logic with fallback
CUSTOM_MODEL_PATH = "models/yolov5/best.pt"
if os.path.exists(CUSTOM_MODEL_PATH):
    model = torch.hub.load('ultralytics/yolov5', 'custom', path=CUSTOM_MODEL_PATH, force_reload=True)
    WEAPON_CLASSES = [
        'automatic_rifle', 'bazooka', 'grenade_launcher',
        'handgun', 'knife', 'shotgun', 'smg', 'sniper', 'sword'
    ]
else:
    print("[INFO] Custom model not found. Loading yolov5s pretrained model for testing...")
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
    WEAPON_CLASSES = model.names  # COCO classes

@app.post("/detect")
async def detect_weapons(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        results = model(image)

        detections = []
        for *xyxy, conf, cls in results.xyxy[0].tolist():
            if conf > 0.5:
                class_index = int(cls)
                if class_index < len(WEAPON_CLASSES):
                    detections.append({
                        "class": WEAPON_CLASSES[class_index],
                        "confidence": float(conf),
                        "bbox": {
                            "x": float(xyxy[0]),
                            "y": float(xyxy[1]),
                            "width": float(xyxy[2] - xyxy[0]),
                            "height": float(xyxy[3] - xyxy[1])
                        }
                    })

        annotated_img = results.render()[0]
        _, buffer = cv2.imencode('.jpg', annotated_img)
        img_base64 = base64.b64encode(buffer).decode()

        return {
            "filename": file.filename,
            "detections": detections,
            "annotated_image": f"data:image/jpeg;base64,{img_base64}",
            "threat_level": calculate_threat_level(detections)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def calculate_threat_level(detections):
    if not detections:
        return "low"
    critical_classes = {'automatic_rifle', 'bazooka', 'grenade_launcher', 'sniper'}
    critical_hits = sum(1 for d in detections if d['class'] in critical_classes)
    if critical_hits > 0:
        return "critical"
    elif len(detections) > 2:
        return "high"
    else:
        return "medium"

def save_detection(filename, detections):
    print(f"[LOG] Saved: {filename}, detections: {len(detections)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
