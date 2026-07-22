import re

with open("src/App.tsx", "r", encoding="utf-8") as f:
    code = f.read()

print("=== Code Analysis of App.tsx ===")

# Check roles defined or used
roles = set(re.findall(r'"(admin|reviewer|HR|user)"', code, re.IGNORECASE))
print("Detected roles in code:", roles)

# Check Level definitions in Rubrics
levels_in_rubric = set(re.findall(r'level\s*===\s*(\d)|level\s*==\s*(\d)', code, re.IGNORECASE))
print("Levels evaluated in App.tsx rubrics:", levels_in_rubric)

# Check UI tabs / view modes
views = set(re.findall(r'view\s*===\s*\'([^\'\s]+)\'|view\s*==\s*\'([^\'\s]+)\'', code))
print("Detected view states in code:", views)

# Search for specific features:
features = {
    "Level 2 Evaluation (L2)": "level === 2" in code or "L2" in code,
    "Consensus Monitor (15-point difference check)": "15" in code and ("diff" in code.lower() or "alert" in code.lower() or "warning" in code.lower()),
    "Conflict of Interest Alert (이해상충)": "affiliate" in code or "이해상충" in code,
    "Seeding database / Seeder script": "seed" in code.lower(),
    "Question Bank Search (질문은행 검색)": "questions" in code.lower() and "filter" in code.lower(),
    "Print report (AICA 자격인증 심사결과 종합판정서)": "print" in code.lower() or "판정서" in code or "인쇄" in code,
    "Red Flag security warning": "flag" in code.lower() or "red" in code.lower()
}

print("\n=== Feature Detection in App.tsx ===")
for feat, present in features.items():
    print(f"  {feat}: {'PRESENT' if present else 'ABSENT'}")

# Print code snippets around Level 2 to verify if L2 is implemented
l2_snippets = [line for line in code.split("\n") if "level" in line.lower() and "2" in line]
print(f"\nLines matching 'level' and '2' (count: {len(l2_snippets)}):")
for s in l2_snippets[:15]:
    print("  ", s.strip())
