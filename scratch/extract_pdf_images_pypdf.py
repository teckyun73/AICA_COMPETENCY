import pypdf
import os

pdf_path = r"C:\Users\ATECCN\.gemini\antigravity\brain\251e0be8-b054-44a9-82c7-d28a8df26ff8\media__1784608664610.pdf"
out_dir = r"scratch\pdf_images"
os.makedirs(out_dir, exist_ok=True)

reader = pypdf.PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

count = 0
for i, page in enumerate(reader.pages):
    for img_name, img_obj in page.images.items():
        clean_name = os.path.basename(img_name).replace('/', '_')
        img_path = os.path.join(out_dir, f"page_{i+1:02d}_{clean_name}.png")
        with open(img_path, "wb") as fp:
            fp.write(img_obj.data)
        print(f"Extracted image for page {i+1}: {img_path}")
        count += 1
