from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import cv2
import numpy as np
from PIL import Image
import io
import base64
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="WeaponGuard API")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model load logic with fallback
CUSTOM_MODEL_PATH = "models/yolov5/best.pt"
model = None
WEAPON_CLASSES = [
    'automatic_rifle', 'bazooka', 'grenade_launcher',
    'handgun', 'knife', 'shotgun', 'smg', 'sniper', 'sword'
]

def load_model():
    global model
    try:
        if os.path.exists(CUSTOM_MODEL_PATH):
            logger.info(f"Loading custom model from {CUSTOM_MODEL_PATH}")
            model = torch.hub.load('ultralytics/yolov5', 'custom', path=CUSTOM_MODEL_PATH, force_reload=True)
            logger.info("Custom model loaded successfully")
        else:
            logger.info("Custom model not found. Loading YOLOv5s pretrained model...")
            model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
            logger.info("YOLOv5s model loaded successfully")
            
        # Set model to evaluation mode
        model.eval()
        
        # Test the model with a dummy input
        test_img = np.zeros((640, 640, 3), dtype=np.uint8)
        test_results = model(test_img)
        logger.info("Model test successful")
        
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise e

# Load model on startup
load_model()

@app.get("/")
async def root():
    return {"message": "WeaponGuard API is running", "model_loaded": model is not None}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "weapon_classes": WEAPON_CLASSES
    }

@app.post("/detect")
async def detect_weapons(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        logger.info(f"Processing file: {file.filename}")
        
        # Read and validate file
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        # Convert to PIL Image
        try:
            image = Image.open(io.BytesIO(contents)).convert("RGB")
            logger.info(f"Image loaded: {image.size}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

        # Run inference
        logger.info("Running YOLOv5 inference...")
        results = model(image)
        
        # Process results
        detections = []
        if hasattr(results, 'xyxy') and len(results.xyxy) > 0:
            for *xyxy, conf, cls in results.xyxy[0].tolist():
                confidence = float(conf)
                class_index = int(cls)
                
                # Filter by confidence threshold
                if confidence > 0.3:  # Lower threshold for better detection
                    # Map class index to weapon class
                    if class_index < len(WEAPON_CLASSES):
                        weapon_class = WEAPON_CLASSES[class_index]
                    else:
                        # For pretrained model, map common objects to weapons if they might be weapons
                        coco_classes = model.names if hasattr(model, 'names') else {}
                        detected_class = coco_classes.get(class_index, f"class_{class_index}")
                        
                        # Map some COCO classes to weapon categories
                        weapon_mapping = {
                            'knife': 'knife',
                            'scissors': 'knife',
                            'person': None,  # Ignore person detections
                            'bottle': None,  # Ignore bottles
                        }
                        
                        weapon_class = weapon_mapping.get(detected_class.lower())
                        if weapon_class is None:
                            continue  # Skip non-weapon detections
                    
                    detection = {
                        "class": weapon_class,
                        "confidence": confidence,
                        "bbox": {
                            "x": float(xyxy[0]),
                            "y": float(xyxy[1]),
                            "width": float(xyxy[2] - xyxy[0]),
                            "height": float(xyxy[3] - xyxy[1])
                        }
                    }
                    detections.append(detection)
                    logger.info(f"Detection: {weapon_class} with confidence {confidence:.2f}")

        # Generate annotated image
        try:
            annotated_imgs = results.render()
            if len(annotated_imgs) > 0:
                annotated_img = annotated_imgs[0]
                # Convert BGR to RGB for proper display
                annotated_img_rgb = cv2.cvtColor(annotated_img, cv2.COLOR_BGR2RGB)
                _, buffer = cv2.imencode('.jpg', cv2.cvtColor(annotated_img_rgb, cv2.COLOR_RGB2BGR))
                img_base64 = base64.b64encode(buffer).decode()
            else:
                # If no annotations, convert original image
                img_array = np.array(image)
                _, buffer = cv2.imencode('.jpg', cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR))
                img_base64 = base64.b64encode(buffer).decode()
        except Exception as e:
            logger.error(f"Error generating annotated image: {str(e)}")
            # Fallback: return original image
            img_array = np.array(image)
            _, buffer = cv2.imencode('.jpg', cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR))
            img_base64 = base64.b64encode(buffer).decode()

        # Calculate threat level
        threat_level = calculate_threat_level(detections)
        
        response = {
            "filename": file.filename,
            "detections": detections,
            "annotated_image": f"data:image/jpeg;base64,{img_base64}",
            "threat_level": threat_level,
            "processing_info": {
                "model_type": "custom" if os.path.exists(CUSTOM_MODEL_PATH) else "yolov5s",
                "total_detections": len(detections),
                "image_size": image.size
            }
        }
        
        logger.info(f"Detection complete: {len(detections)} weapons found, threat level: {threat_level}")
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during detection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

def calculate_threat_level(detections):
    if not detections:
        return "low"
    
    # Define critical weapon types
    critical_weapons = {'automatic_rifle', 'bazooka', 'grenade_launcher', 'sniper', 'smg'}
    high_threat_weapons = {'shotgun'}
    
    # Check for critical weapons
    critical_count = sum(1 for d in detections if d['class'] in critical_weapons)
    high_threat_count = sum(1 for d in detections if d['class'] in high_threat_weapons)
    
    # Calculate max confidence
    max_confidence = max(d['confidence'] for d in detections) if detections else 0
    
    if critical_count > 0 or max_confidence > 0.8:
        return "critical"
    elif high_threat_count > 0 or len(detections) > 2 or max_confidence > 0.6:
        return "high"
    elif len(detections) > 1 or max_confidence > 0.4:
        return "medium"
    else:
        return "low"

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting WeaponGuard API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")