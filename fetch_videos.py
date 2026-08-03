import urllib.request
import urllib.parse
import re
import json
import time
import os

file_path = r'c:\Users\seppi\Desktop\Persoonlijk\code projecten\Volley Train\volleybuild-android\src\engine\exercises.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# simple string search for missing video URLs
out_content = content

missing_names = []
lines = content.split('\n')
current_name = None
current_has_video = False
block_start = -1

for i, line in enumerate(lines):
    name_match = re.search(r"name:\s*'([^']+)'", line)
    if name_match:
        current_name = name_match.group(1)
        current_has_video = False
        block_start = i
    
    if 'videoUrl:' in line:
        current_has_video = True
    
    # We reached the end of an exercise block
    if current_name and 'visual:' in line and not current_has_video:
        missing_names.append((current_name, i))

print(f"Found {len(missing_names)} missing video URLs.")

def search_youtube(query):
    try:
        url = 'https://www.youtube.com/results?search_query=' + urllib.parse.quote(query)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'"videoId":"([^"]+)"', res)
        if match:
            return f'https://www.youtube.com/watch?v={match.group(1)}'
    except Exception as e:
        print('Error searching youtube for', query, e)
    return None

added_count = 0
offset = 0

for name, line_idx in missing_names:
    query = name + ' exercise proper form'
    print(f'Searching for: {query}')
    video_url = search_youtube(query)
    if video_url:
        print(f'Found: {video_url}')
        # Insert videoUrl line right before visual:
        idx_with_offset = line_idx + offset
        indent = lines[idx_with_offset][:len(lines[idx_with_offset]) - len(lines[idx_with_offset].lstrip())]
        new_line = f"{indent}videoUrl: '{video_url}',"
        lines.insert(idx_with_offset, new_line)
        offset += 1
        added_count += 1
        time.sleep(1)

out_content = '\n'.join(lines)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(out_content)

print(f'Added {added_count} missing video URLs.')
