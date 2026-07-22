import re

files = ["scratch/pdf1_text.md", "scratch/pdf2_text.md"]

print("=== Search for Key Sections in PDF 1 & 2 ===")
for f_path in files:
    print(f"\n--- Scanning {f_path} ---")
    with open(f_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Find headings (lines starting with # or ##)
    headings = re.findall(r'^(#+\s+.*)$', content, re.MULTILINE)
    print("Headings:")
    for h in headings[:30]:
        print("  ", h)
    
    # Search for specific terms
    terms = ["PRD", "요구사항", "평가시스템", "자격검정위원회", "시스템 구성", "구현"]
    print("Term frequencies:")
    for term in terms:
        count = len(re.findall(term, content, re.IGNORECASE))
        print(f"  {term}: {count} occurrences")
