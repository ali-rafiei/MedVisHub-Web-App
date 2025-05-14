from flask import Flask, render_template, request, jsonify
from PIL import Image
import base64
import io
import os
import subprocess
import uuid

app = Flask(__name__)

def generate_unique_filename():
    return str(uuid.uuid4()) + '.png'

def save_image(image_data, filename):
    # Remove the data URL prefix if present
    if ',' in image_data:
        image_data = image_data.split(',')[1]
    
    image = Image.open(io.BytesIO(base64.b64decode(image_data)))
    image.save(filename)


def process_image(image_data):
    # Generate unique filenames
    source_path = generate_unique_filename()
    enhanced_path = generate_unique_filename()
    processed_path = generate_unique_filename()

    try:
        # Save the uploaded image
        save_image(image_data, source_path)

        # Run the image processing script to handle both tasks at once
        subprocess.run(['python3', 'image_processor.py', source_path, enhanced_path, processed_path])

        # Convert both images to base64
        with open(enhanced_path, 'rb') as enhanced_file:
            enhanced_image_str = base64.b64encode(enhanced_file.read()).decode('utf-8')
        
        with open(processed_path, 'rb') as processed_file:
            processed_image_str = base64.b64encode(processed_file.read()).decode('utf-8')

        return {
            'enhancedImage': f'data:image/png;base64,{enhanced_image_str}',
            'processedImage': f'data:image/png;base64,{processed_image_str}'
        }

    finally:
        # Clean up temporary files
        for path in [source_path, enhanced_path, processed_path]:
            if os.path.exists(path):
                os.remove(path)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_image', methods=['POST'])
def process_image_route():
    try:
        image_data = request.json['image']
        images = process_image(image_data)
        return jsonify(images)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)