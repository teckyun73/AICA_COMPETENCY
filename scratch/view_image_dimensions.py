from PIL import Image
import os

img_dir = r"C:\Users\ATECCN\.gemini\antigravity\brain\251e0be8-b054-44a9-82c7-d28a8df26ff8"
images = [
    "aica_evaluation_workspace_mockup_1784167999282.png",
    "media__1784176101924.png",
    "media__1784176902473.png",
    "media__1784188798650.png",
    "media__1784189721812.png",
    "media__1784191494861.png",
    "media__1784191958529.png",
    "media__1784596287593.png"
]

print("=== Image Resolutions and Sizes ===")
for img_name in images:
    path = os.path.join(img_dir, img_name)
    if os.path.exists(path):
        with Image.open(path) as img:
            print(f"{img_name}: Size={os.path.getsize(path)} bytes, Format={img.format}, Resolution={img.size} (aspect ratio={img.size[0]/img.size[1]:.2f})")
    else:
        print(f"{img_name}: File not found")
