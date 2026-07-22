with open("src/App.tsx", "r", encoding="utf-8") as f:
    code = f.read()

import re

out_path = "scratch/levels_report.md"
with open(out_path, "w", encoding="utf-8") as out:
    out.write("# Analysis of AICA Levels in Codebase\n\n")
    
    # 1. Look at candidates and how level is used
    out.write("## 1. Occurrences of 'level' in App.tsx\n")
    lines = code.split("\n")
    for i, line in enumerate(lines):
        if "level" in line.lower():
            out.write(f"- Line {i+1}: `{line.strip()}`\n")
            
    # 2. Look at how level is checked in evaluation forms
    out.write("\n## 2. Rubric and Evaluation Logic for Levels\n")
    # Search for level-based conditional rendering (e.g. level === 3, level === 4)
    level_checks = re.findall(r'(\w+\.level\s*===\s*\d|\w+\.level\s*==\s*\d)', code)
    out.write(f"Level checks found in code: {level_checks}\n\n")
    
    # Let's search for references to Level 2 (L2), Level 3 (L3), Level 4 (L4)
    out.write("## 3. References to L2 / L3 / L4\n")
    for term in ["Level 2", "L2", "Level 3", "L3", "Level 4", "L4"]:
        matches = [line.strip() for line in lines if term in line]
        out.write(f"### Term: {term} (count: {len(matches)})\n")
        for m in matches[:10]:
            out.write(f"- `{m}`\n")
        out.write("\n")

print("Levels report generated at:", out_path)
