import os
import sys

pptx_path = os.path.abspath("AICA_System_User_Manual.pptx")
pdf_path = os.path.abspath("AICA_System_User_Manual.pdf")

try:
    import win32com.client
    powerpoint = win32com.client.Dispatch("PowerPoint.Application")
    powerpoint.Visible = True
    deck = powerpoint.Presentations.Open(pptx_path)
    deck.SaveAs(pdf_path, 32) # 32 = ppSaveAsPDF
    deck.Close()
    powerpoint.Quit()
    print(f"Successfully converted PPTX to PDF via PowerPoint COM: '{pdf_path}'")
except Exception as e:
    print("PowerPoint COM conversion failed:", e)
    # Fallback using PyMuPDF to assemble images into PDF
    try:
        sys.path.append(r'C:\Users\ATECCN\AppData\Roaming\Python\Python314\site-packages')
        import fitz
        doc = fitz.open()
        img_dir = r"scratch\pdf_images"
        for i in range(1, 21):
            img_file = os.path.join(img_dir, f"page_{i:02d}.png")
            if os.path.exists(img_file):
                imgdoc = fitz.open(img_file)
                pdfbytes = imgdoc.convert_to_pdf()
                imgpdf = fitz.open("pdf", pdfbytes)
                doc.insert_pdf(imgpdf)
        doc.save(pdf_path)
        print(f"Successfully created PDF from page screenshots: '{pdf_path}'")
    except Exception as ex2:
        print("Fallback PDF creation error:", ex2)
