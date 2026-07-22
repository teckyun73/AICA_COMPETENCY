import os
import pypdf

pdf_dir = r"C:\Users\ATECCN\.gemini\antigravity\brain\251e0be8-b054-44a9-82c7-d28a8df26ff8"
files = {
    "media__1784166592849.pdf": "scratch/pdf1_text.md",
    "media__1784166628146.pdf": "scratch/pdf2_text.md"
}

for pdf_name, out_name in files.items():
    pdf_path = os.path.join(pdf_dir, pdf_name)
    out_path = os.path.join(r"C:\Users\ATECCN\Documents\competency_antiravity", out_name)
    if os.path.exists(pdf_path):
        print(f"Extracting {pdf_name} to {out_name}...")
        try:
            reader = pypdf.PdfReader(pdf_path)
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(f"# Text Extracted from {pdf_name}\n\n")
                for i, page in enumerate(reader.pages):
                    f.write(f"## Page {i + 1}\n\n")
                    f.write(page.extract_text() or "")
                    f.write("\n\n---\n\n")
            print("Extracted successfully.")
        except Exception as e:
            print("Error extracting:", e)
    else:
        print(f"{pdf_name} not found")
