#!/bin/bash

# Script to fix admonition closing fences
# This script removes standalone "====" lines that close admonitions

fix_file() {
    local file="$1"
    local temp_file=$(mktemp)
    local in_admonition=false
    local line_num=0
    local changes=0
    
    echo "Processing $file..."
    
    while IFS= read -r line; do
        line_num=$((line_num + 1))
        
        # Check if this line starts an admonition
        if [[ "$line" =~ ^\[(NOTE|WARNING|IMPORTANT|TIP|CAUTION)\]$ ]]; then
            echo "$line" >> "$temp_file"
            in_admonition=true
            continue
        fi
        
        # Check if this line is the opening fence after an admonition
        if [[ "$in_admonition" == true && "$line" =~ ^====$ ]]; then
            echo "$line" >> "$temp_file"
            in_admonition="content"
            continue
        fi
        
        # Check if this line is a closing fence
        if [[ "$in_admonition" == "content" && "$line" =~ ^====\s*$ ]]; then
            # This is a closing fence line - skip it (don't write to output)
            echo "  Removed closing fence at line $line_num"
            changes=$((changes + 1))
            in_admonition=false
            continue
        fi
        
        # Any other line resets the admonition state and gets written
        if [[ "$line" =~ ^=== || "$line" =~ ^== || "$line" =~ ^\[\[ ]]; then
            in_admonition=false
        fi
        
        echo "$line" >> "$temp_file"
    done < "$file"
    
    if [ $changes -gt 0 ]; then
        mv "$temp_file" "$file"
        echo "  Applied $changes changes to $file"
    else
        rm "$temp_file"
        echo "  No changes needed for $file"
    fi
    
    return $changes
}

# Process all .adoc files
total_changes=0
for file in /Users/ry/src/illumos-docbooks/adoc/*.adoc; do
    if [ -f "$file" ]; then
        fix_file "$file"
        total_changes=$((total_changes + $?))
    fi
done

echo ""
echo "Total changes applied: $total_changes"