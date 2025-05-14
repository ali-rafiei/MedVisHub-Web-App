# MedVisHub

**MedVisHub** is a lightweight web application for uploading, processing, and visually comparing medical images. It features a plug-and-play backend for image processing, along with a dynamic frontend for easy viewing in single or split-screen modes.

---

## 🚀 Features

- Drag-and-drop or click-to-upload interface  
- Toggle between original, enhanced, and processed images  
- Side-by-side split view comparison  
- Zoom controls and image clearing  
- Modular backend — easily add new image processors

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript  
- **Backend:** Python (Flask)  
- **Image Processing:** Custom logic in `image_processor.py`

---

## 📦 Install

### 1. Clone the Repository
```bash
git clone https://github.com/ali-rafiei/MedVisHub-Web-App.git
cd MedVisHub-Web-App
````

### 2. Create a Virtual Environment (optional but recommended)

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install flask pillow
```

---

## 🧪 Run the App

```bash
python app.py
```

Then open your browser at:
📎 `http://127.0.0.1:5000/`

---

## 🔌 Adding New Image Processing Tools

To add a new processor:

1. Add a new function to `image_processor.py`
2. Update the logic in `app.py` to call it
3. The frontend will reflect the output in the "Processed" view automatically

---

## 📂 Project Structure

```
medvishub/
├── app.py                # Flask server
├── image_processor.py    # Image processing logic
├── templates/
│   └── index.html        # Main frontend HTML
├── static/
│   ├── styles.css        # Frontend styling
│   └── script.js         # Frontend behavior
├── requirements.txt      # Python dependencies
└── README.md
```

