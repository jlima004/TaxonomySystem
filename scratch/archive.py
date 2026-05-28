import re
import os

with open('.planning/ROADMAP.md', 'r', encoding='utf-8') as f:
    roadmap = f.read()

# We want to extract phases 13 to 37.1
# Let's find the sections
phases_text = []
lines = roadmap.split('\n')
in_post_v1 = False
extracted_lines = []
remaining_roadmap = []

for line in lines:
    if line.startswith('### Phase 13:'):
        in_post_v1 = True
    elif line.startswith('### Phase ') and in_post_v1:
        # maybe we hit phase 38?
        pass

# It's easier to use regex
# But let's just do it manually
roadmap_sections = roadmap.split('### Phase ')

new_roadmap_parts = [roadmap_sections[0]]

extracted_phases = []

for section in roadmap_sections[1:]:
    # Section starts with the phase number
    phase_num = section.split(':')[0].strip()
    try:
        num = float(phase_num)
        if 13 <= num <= 38:
            extracted_phases.append('### Phase ' + section)
        else:
            new_roadmap_parts.append('### Phase ' + section)
    except ValueError:
        new_roadmap_parts.append('### Phase ' + section)

# Let's rebuild the template
template = """# Milestone Archive Template

# Milestone vpost-v1.0: Post-v1.0 Validation, Safety and Curation

**Status:** ✅ SHIPPED 2026-05-28
**Phases:** 13-37.1
**Total Plans:** 25+

## Overview

Stabilization of taxonomy seed v2, permanent safety guards implementation, microcuration expansion (Petitgrain, Cedarwood, Ambergris, Rosewood), conflict stopwords filter, and comprehensive Nyquist verification coverage.

## Phases

""" + "\n\n".join(extracted_phases) + """

---

_For current project status, see .planning/ROADMAP.md_
"""

with open('.planning/milestones/vpost-v1.0-ROADMAP.md', 'w', encoding='utf-8') as f:
    f.write(template)

# Now rebuild ROADMAP.md
# We will insert a details block where the extracted phases were

details_block = """
<details>
<summary><strong>Milestone post-v1.0 (Phases 13-37.1)</strong></summary>

Archived to `.planning/milestones/vpost-v1.0-ROADMAP.md`
</details>
"""

# Find the insertion point: after phase 12
final_roadmap_str = new_roadmap_parts[0]
for part in new_roadmap_parts[1:]:
    if part.startswith('### Phase 12:'):
        final_roadmap_str += part + "\n" + details_block + "\n"
    else:
        final_roadmap_str += part

with open('.planning/ROADMAP.md', 'w', encoding='utf-8') as f:
    f.write(final_roadmap_str)

# Mark requirements
with open('.planning/milestones/vpost-v1.0-REQUIREMENTS.md', 'r', encoding='utf-8') as f:
    reqs = f.read()

reqs = reqs.replace('- [ ]', '- [x]')

with open('.planning/milestones/vpost-v1.0-REQUIREMENTS.md', 'w', encoding='utf-8') as f:
    f.write(reqs)

# Update PROJECT.md
with open('.planning/PROJECT.md', 'r', encoding='utf-8') as f:
    project = f.read()

# Replace "### Active" section
active_idx = project.find('### Active')
if active_idx != -1:
    end_idx = project.find('### Known v1 Semantic Limitations', active_idx)
    new_active = "### Current State\n\nMilestone post-v1.0 closed. v2 default is stabilized, safety guards are permanent, and conflict filters are active. All phases 13-37.1 are fully verified.\n\n### Next Milestone Goals\n\nRun `/gsd-new-milestone` to define goals for v2.1 (e.g. semantic curation, aliases, or architecture refinement).\n\n"
    project = project[:active_idx] + new_active + project[end_idx:]

with open('.planning/PROJECT.md', 'w', encoding='utf-8') as f:
    f.write(project)

print("Done")
