# 🐅 Wild Animal Detection and Alert System

## Overview

The Wild Animal Detection and Alert System is an AI-powered surveillance and safety platform designed to reduce human-wildlife conflict in forest-bordering areas. The system uses a custom-trained YOLO deep learning model to detect wild animals from:

* Uploaded images
* Uploaded videos
* Live CCTV/Webcam feeds

When a wild animal is detected, the system can:

* Display detection results with bounding boxes
* Trigger siren alerts
* Generate logs and reports
* Export detection results
* Monitor live camera streams

The project combines:

* React + TypeScript frontend
* Flask backend API
* YOLO object detection model
* OpenCV video processing
* Modern responsive wildlife dashboard UI

---

# 🚀 Features

## Image Detection

* Upload wildlife images
* Detect animals using YOLO model
* Display confidence score
* Draw bounding boxes around detected animals
* Trigger siren alert on detection
* Export detection results as JSON

---

## Video Detection

* Upload MP4/AVI/MOV videos
* Analyze videos frame-by-frame
* Detect multiple animals
* Show detection timeline
* Generate CSV and JSON reports
* Display bounding boxes during playback
* Track detections using timestamps

---

## Live Detection

* Real-time webcam/CCTV detection
* Continuous monitoring
* Instant alert system
* Real-time animal tracking
* Detection overlays

---

## Alert System

* Automatic siren activation
* Manual siren stop button
* Detection warning notifications
* Real-time emergency response

---

## System Logs

* Detection history
* Export reports
* Detection statistics
* Timestamp tracking

---

## Modern Dashboard

* Fully responsive UI
* Forest-themed wildlife interface
* Sticky navigation bar
* Mobile responsive sidebar menu
* Professional monitoring dashboard layout

---

# 🛠️ Technologies Used

## Frontend

* React
* TypeScript
* React Router DOM
* Tailwind CSS
* Lucide React Icons
* HTML5
* CSS3

---

## Backend

* Flask
* Flask-CORS
* Python
* OpenCV
* Ultralytics YOLO

---

## AI / Machine Learning

* YOLO Object Detection
* Custom-trained wildlife dataset
* Deep Learning Computer Vision

---

# 📁 Project Structure

```bash
Wild-Animal-Detection-System/
│
├── backend/
│   ├── app.py
│   ├── models/
│   │   └── best.pt
│   ├── uploads/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── ImageDetection.tsx
│   │   │   ├── VideoDetection.tsx
│   │   │   ├── LiveDetection.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Admin.tsx
│   │   │   └── SystemLogs.tsx
│   │   │
│   │   ├── utils/
│   │   │   └── siren.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# ⚙️ Installation Guide

# 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/wild-animal-detection-system.git
```

```bash
cd wild-animal-detection-system
```

---

# 2️⃣ Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

## Windows

```bash
venv\Scripts\activate
```

## Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 3️⃣ Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

Install frontend packages:

```bash
npm install
```

---

# ▶️ Running the Application

## Start Backend Server

Navigate to backend:

```bash
cd backend
```

Run Flask server:

```bash
python app.py
```

Backend runs on:

```bash
http://127.0.0.1:5000
```

---

## Start Frontend Server

Navigate to frontend:

```bash
cd frontend
```

Run React frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔌 API Endpoints

## Image Detection API

### Endpoint

```bash
POST /upload_image
```

### Request

Form Data:

```bash
image: image_file
```

### Response

```json
{
  "success": true,
  "detections": [
    {
      "animal": "Tiger",
      "confidence": 96.4,
      "bbox": {
        "x1": 120,
        "y1": 90,
        "x2": 300,
        "y2": 350
      }
    }
  ]
}
```

---

## Video Detection API

### Endpoint

```bash
POST /upload_video
```

### Request

Form Data:

```bash
video: video_file
```

### Response

```json
{
  "success": true,
  "detections": [
    {
      "frame": 120,
      "timestamp": "0:04",
      "animal": "Elephant",
      "confidence": 93.2,
      "bbox": {
        "x": 100,
        "y": 120,
        "width": 200,
        "height": 260
      }
    }
  ]
}
```

---

# 🧠 YOLO Model

The system uses a custom-trained YOLO model for wildlife detection.

Supported animals may include:

* Tiger
* Elephant
* Bear
* Leopard
* Deer
* Wild Boar
* Wolf

The trained model file:

```bash
models/best.pt
```

---

# 🔊 Siren System

The application includes an emergency alert siren.

Features:

* Auto siren activation on detection
* Manual stop button
* Real-time warning alerts
* Emergency monitoring support

---

# 📊 Export Features

Users can export:

* JSON detection reports
* CSV detection timelines
* Detection history logs

---

# 📱 Responsive Design

The UI is fully responsive and works on:

* Desktop
* Laptop
* Tablet
* Mobile devices

Features include:

* Responsive navbar
* Mobile sidebar menu
* Adaptive dashboard layout
* Flexible detection cards

---

# 🛡️ Security & Monitoring Use Cases

This system can be used for:

* Forest border surveillance
* Village wildlife protection
* Wildlife monitoring
* National park security
* Forest department monitoring
* Human-wildlife conflict prevention
* Smart CCTV wildlife systems

---

# 🔥 Future Improvements

Potential future upgrades:

* SMS alert integration
* Email notifications
* Drone camera integration
* Cloud deployment
* GPS animal tracking
* Multi-camera support
* Mobile application
* AI analytics dashboard
* Detection heatmaps
* Firebase integration

---

# 🧪 Testing

Test the backend API using:

* Postman
* Thunder Client
* Frontend integration

---

# 📌 Common Issues

## 404 NOT FOUND

Cause:

* Incorrect backend route
* Flask server not running
* Wrong API URL

Solution:

Verify backend is running on:

```bash
http://127.0.0.1:5000
```

---

## Failed to Fetch

Cause:

* Backend server stopped
* Wrong port
* CORS issue

Solution:

Start Flask server again.

---

## Unexpected token '<'

Cause:

Frontend expected JSON but backend returned HTML error page.

Solution:

Check Flask API route paths.

---

# 📷 Screenshots

Add your project screenshots here.

Examples:

* Home Dashboard
* Image Detection Results
* Video Detection Timeline
* Live Detection Monitoring
* Admin Dashboard

---

# 🤝 Contribution

Contributions are welcome.

Steps:

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Open pull request

---

# 📄 License

This project is for educational and research purposes.

---

# 👨‍💻 Author

Developed by:

Abhay Yadav

---

# ⭐ Final Note

This project demonstrates practical implementation of:

* AI-powered wildlife monitoring
* Computer vision surveillance
* Real-time object detection
* React + Flask integration
* Smart forest safety systems

The system aims to help protect both humans and wildlife through intelligent monitoring technology.
