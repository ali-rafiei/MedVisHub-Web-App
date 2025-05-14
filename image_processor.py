import sys
from PIL import Image, ImageEnhance

def enhance_image(image):
    """
    Example enhancement: Increase brightness by 30%
    You can modify this function with your own enhancement logic later
    """
    enhancer = ImageEnhance.Brightness(image)
    return enhancer.enhance(1.8)

def process_image(image):
    """
    Example processing: Convert to grayscale
    You can modify this function with your own processing logic later
    """
    return image.convert('L')

def main():
    if len(sys.argv) != 4:
        print("Usage: python image_processor.py <source> <target1> <target2>")
        sys.exit(1)

    source = sys.argv[1]
    target1 = sys.argv[2]
    target2 = sys.argv[3] 

    image = Image.open(source)
    
    processed_image = enhance_image(image)
    processed_image.save(target1)
    processed_image = process_image(image)
    processed_image.save(target2)

if __name__ == "__main__":
    main()