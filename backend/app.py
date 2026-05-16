from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import os
import tempfile
import time

app = Flask(__name__)
CORS(app)

# LOAD MODEL
model = YOLO("models/best.pt")

# MINIMUM CONFIDENCE
CONFIDENCE_THRESHOLD = 60


# =========================
# IMAGE DETECTION
# =========================
@app.route("/upload_image", methods=["POST"])
def upload_image():

    try:

        if "image" not in request.files:
            return jsonify({
                "success": False,
                "message": "No image uploaded"
            })

        image_file = request.files["image"]

        temp_path = tempfile.mktemp(suffix=".jpg")

        image_file.save(temp_path)

        # RUN YOLO
        results = model.predict(
            temp_path,
            conf=0.60
        )

        detections = []

        for result in results:

            for box in result.boxes:

                confidence = float(box.conf[0]) * 100

                # FILTER LOW CONFIDENCE
                if confidence < CONFIDENCE_THRESHOLD:
                    continue

                cls = int(box.cls[0])

                animal_name = model.names[cls]

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                detections.append({
                    "animal": animal_name,
                    "confidence": round(confidence, 2),
                    "bbox": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2
                    }
                })

        os.remove(temp_path)

        return jsonify({
            "success": True,
            "detections": detections
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })


# =========================
# VIDEO DETECTION
# =========================
@app.route("/upload_video", methods=["POST"])
def upload_video():

    try:

        if "video" not in request.files:
            return jsonify({
                "success": False,
                "message": "No video uploaded"
            })

        video_file = request.files["video"]

        temp_video = tempfile.mktemp(suffix=".mp4")

        video_file.save(temp_video)

        cap = cv2.VideoCapture(temp_video)

        if not cap.isOpened():

            return jsonify({
                "success": False,
                "message": "Could not open video"
            })

        fps = int(cap.get(cv2.CAP_PROP_FPS))

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        detections = []

        frame_number = 0

        start_time = time.time()

        while True:

            success, frame = cap.read()

            if not success:
                break

            frame_number += 1

            # PROCESS EVERY 10TH FRAME
            if frame_number % 10 != 0:
                continue

            # RESIZE FRAME
            frame = cv2.resize(frame, (640, 480))

            # YOLO DETECTION
            results = model.predict(
                frame,
                conf=0.60
            )

            for result in results:

                for box in result.boxes:

                    confidence = float(box.conf[0]) * 100

                    # IGNORE LOW CONFIDENCE
                    if confidence < CONFIDENCE_THRESHOLD:
                        continue

                    cls = int(box.cls[0])

                    animal_name = model.names[cls]

                    x1, y1, x2, y2 = map(int, box.xyxy[0])

                    timestamp_seconds = frame_number / fps

                    minutes = int(timestamp_seconds // 60)

                    seconds = int(timestamp_seconds % 60)

                    detections.append({

                        "frame": frame_number,

                        "timestamp":
                            f"{minutes}:{seconds:02d}",

                        "animal": animal_name,

                        "confidence":
                            round(confidence, 2),

                        "bbox": {
                            "x": x1,
                            "y": y1,
                            "width": x2 - x1,
                            "height": y2 - y1
                        }

                    })

        cap.release()

        os.remove(temp_video)

        processing_time = round(
            time.time() - start_time,
            2
        )

        return jsonify({
            "success": True,
            "detections": detections,
            "totalFrames": total_frames,
            "fps": fps,
            "processingTime": processing_time
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })

# TEST ROUTE
@app.route("/")
def home():

    return jsonify({
        "success": True,
        "message": "Wild Animal Detection Backend Running"
    })

# =========================
# MAIN
# =========================
if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )