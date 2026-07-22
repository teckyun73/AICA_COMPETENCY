import sys
sys.path.append(r'C:\Users\ATECCN\AppData\Roaming\Python\Python314\site-packages')
import fitz
import os

pdf_path = r"C:\Users\ATECCN\.gemini\antigravity\brain\251e0be8-b054-44a9-82c7-d28a8df26ff8\media__1784608664610.pdf"
out_dir = r"scratch\pdf_images"
os.makedirs(out_dir, exist_ok=True)

try:
    doc = fitz.open(pdf_path)
    print(f"Total pages in PDF: {len(doc)}")
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        img_path = os.path.join(out_dir, f"page_{i+1:02d}.png")
        pix.save(img_path)
        print(f"Saved: {img_path}")
    print("PDF page extraction complete!")
except Exception as e:
    print("Error during fitz extraction:", e)
