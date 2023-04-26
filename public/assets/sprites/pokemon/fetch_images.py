import requests
import os
from io import BytesIO
from PIL import Image

def download_resize_image(url, position, i):
    response = requests.get(url)
    image = Image.open(BytesIO(response.content))
    width, height = image.size
    new_img = image.resize((width * 3, height * 3))
    os.makedirs(f"/{position}", exist_ok=True)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    image_dir = os.path.join(script_dir, position, f"{i}.png")
    new_img.save(image_dir)

for i in range(1, 657):
   download_resize_image(f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{i}.png", "front", i)
#  download_resize_image(f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/{i}.png", "back", i) 
