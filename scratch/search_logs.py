import json
import os

log_path = r"C:\Users\ATECCN\.gemini\antigravity\brain\251e0be8-b054-44a9-82c7-d28a8df26ff8\.system_generated\logs\transcript_full.jsonl"

if not os.path.exists(log_path):
    print("Log file not found at:", log_path)
    exit(1)

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            data = json.loads(line)
            content = str(data.get("content", ""))
            tool_calls = str(data.get("tool_calls", ""))
            
            # Check for PNG files
            for img in ["media__1784176101924", "media__1784176902473", "media__1784188798650", "media__1784189721812", "media__1784191494861", "media__1784191958529"]:
                if img in content or img in tool_calls:
                    print(f"Index: {data.get('step_index')}, Type: {data.get('type')}")
                    # Print first 200 chars of content
                    print("  Text Snippet:", content[:200].replace('\n', ' '))
                    print("  Tool Snippet:", tool_calls[:200])
                    print("-" * 50)
        except Exception as e:
            pass
