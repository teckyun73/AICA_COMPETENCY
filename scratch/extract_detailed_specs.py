import os
import re

pdf_dir = "scratch"
files = ["pdf1_text.md", "pdf2_text.md"]

keywords = ["PRD", "요구사항", "기능", "평가", "L2", "L3", "L4", "심사", "대시보드", "결격", "보안"]
pattern = re.compile("|".join(keywords), re.IGNORECASE)

out_path = "scratch/prd_analysis.md"

with open(out_path, "w", encoding="utf-8") as out:
    out.write("# PRD and System Requirement Keywords Search Results\n\n")
    
    for filename in files:
        path = os.path.join(pdf_dir, filename)
        if not os.path.exists(path):
            continue
        
        out.write(f"## File: {filename}\n\n")
        
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Split by page
        pages = content.split("## Page ")
        for page_content in pages:
            if not page_content.strip():
                continue
            
            lines = page_content.split("\n")
            page_num = lines[0].strip()
            
            # Find matching lines
            matched_lines = []
            for line in lines[1:]:
                if pattern.search(line):
                    matched_lines.append(line.strip())
            
            if matched_lines:
                out.write(f"### Page {page_num}\n")
                for ml in matched_lines:
                    out.write(f"- {ml}\n")
                out.write("\n")
                
print("Analysis complete. Saved to:", out_path)
