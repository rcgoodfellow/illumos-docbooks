#!/usr/bin/env python3
import re
import sys

def fix_admonitions(filename):
    """Fix admonition patterns by removing closing ==== lines."""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern to match admonitions with closing ====
        # This matches [ADMONITION] followed by ==== and content ending with ====
        pattern = r'(\[(NOTE|WARNING|IMPORTANT|TIP|CAUTION)\]\s*\n====\n)(.*?)\n(====\s*)$'
        
        fixes = []
        
        # Find all matches and process them
        for match in re.finditer(pattern, content, re.MULTILINE | re.DOTALL):
            start_pos = match.start()
            end_pos = match.end()
            full_match = match.group(0)
            admonition_start = match.group(1)  # [NOTE]\n====\n
            admonition_type = match.group(2)  # NOTE, WARNING, etc.
            content_text = match.group(3)     # The content between the fences
            closing_fence = match.group(4)    # ====
            
            # Check if the content doesn't already have internal ====
            # If it has internal ====, we should be more careful
            if '====' not in content_text:
                # Safe to remove the closing fence
                replacement = admonition_start + content_text
                fixes.append({
                    'start': start_pos,
                    'end': end_pos,
                    'original': full_match,
                    'replacement': replacement,
                    'type': admonition_type
                })
        
        # Apply fixes in reverse order to preserve positions
        for fix in reversed(fixes):
            content = content[:fix['start']] + fix['replacement'] + content[fix['end']:]
            print(f"Fixed {fix['type']} admonition at position {fix['start']}")
        
        if fixes:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Applied {len(fixes)} fixes to {filename}")
            return len(fixes)
        else:
            print(f"No fixes needed for {filename}")
            return 0
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")
        return 0

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 fix_admonitions.py <file.adoc>")
        sys.exit(1)
    
    filename = sys.argv[1]
    fix_admonitions(filename)