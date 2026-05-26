# Phase 16: Permanent Safety Guard Implementation - Pattern Map

**Mapped:** 2026-05-26
**Files analyzed:** 1
**Analogs found:** 1 / 1

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `scripts/check-safety-guards.sh` | utility | request-response | `.agents/hooks/gsd-phase-boundary.sh` | role-match |

## Pattern Assignments

### `scripts/check-safety-guards.sh` (utility, request-response)

**Analog:** `.agents/hooks/gsd-phase-boundary.sh`

**Shebang + non-mutating bash guard structure** (lines 1-16):
```bash
#!/usr/bin/env bash
# gsd-hook-version: 1.41.2
# gsd-phase-boundary.sh — PostToolUse hook: detect .planning/ file writes
# Outputs a reminder when planning files are modified outside normal workflow.
# Uses Node.js for JSON parsing (always available in GSD projects, no jq dependency).
#
# OPT-IN: This hook is a no-op unless config.json has hooks.community: true.
# Enable with: "hooks": { "community": true } in .planning/config.json

# Check opt-in config — exit silently if not enabled
if [ -f .planning/config.json ]; then
  ENABLED=$(node -e "try{const c=require('./.planning/config.json');process.stdout.write(c.hooks?.community===true?'1':'0')}catch{process.stdout.write('0')}" 2>/dev/null)
  if [ "$ENABLED" != "1" ]; then exit 0; fi
else
  exit 0
fi
```

**Guard output formatting and structured emission** (lines 31-45):
```bash
if [ "$PLANNING_MODIFIED" = "true" ]; then
  node -e '
    const file = process.argv[1];
    const additionalContext = ".planning/ file modified: " + file + "\n" +
      "Check: Should STATE.md be updated to reflect this change?";
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext,
        planning_modified: true,
        file_path: file,
      },
    }));
  ' "$FILE"
fi
```

**Additional bash guard patterns** (lines 1-7, 19-27 in `.agents/hooks/gsd-validate-commit.sh`):
```bash
#!/usr/bin/env bash
# gsd-hook-version: 1.41.2
# gsd-validate-commit.sh — PreToolUse hook: enforce Conventional Commits format
# Blocks git commit commands with non-conforming messages (exit 2).
# Allows conforming messages and all non-commit commands (exit 0).
# Uses Node.js for JSON parsing (always available in GSD projects, no jq dependency).

INPUT=$(cat)
```

## Shared Patterns

### Bash Script Layout (shebang + comments + guard checks)
**Source:** `.agents/hooks/gsd-phase-boundary.sh` (lines 1-16)
**Apply to:** `scripts/check-safety-guards.sh`
```bash
#!/usr/bin/env bash
# gsd-hook-version: 1.41.2
# gsd-phase-boundary.sh — PostToolUse hook: detect .planning/ file writes
# Outputs a reminder when planning files are modified outside normal workflow.
# Uses Node.js for JSON parsing (always available in GSD projects, no jq dependency).
```

### Error/Exit Behavior in Bash Guards
**Source:** `.agents/hooks/gsd-validate-commit.sh` (lines 41-54)
**Apply to:** `scripts/check-safety-guards.sh`
```bash
if [ -n "$MSG" ]; then
  SUBJECT=$(echo "$MSG" | head -1)
  # Validate Conventional Commits format
  if ! [[ "$SUBJECT" =~ ^(feat|fix|docs|style|refactor|perf|test|build|ci|chore)(\(.+\))?:[[:space:]].+ ]]; then
    echo '{"decision": "block", "code": "CONVENTIONAL_COMMITS_VIOLATION", "reason": "Commit message must follow Conventional Commits: <type>(<scope>): <subject>. Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore. Subject must be <=72 chars, lowercase, imperative mood, no trailing period."}'
    exit 2
  fi
  if [ ${#SUBJECT} -gt 72 ]; then
    echo '{"decision": "block", "code": "COMMIT_SUBJECT_TOO_LONG", "reason": "Commit subject must be 72 characters or less."}'
    exit 2
  fi
fi
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `scripts/check-safety-guards.sh` | utility | request-response | No existing `scripts/` shell guard in repo; only `.agents/hooks/*.sh` serve as closest pattern. |

## Metadata

**Analog search scope:** `**/*.sh`, `**/*guard*.*`, `.agents/hooks/`
**Files scanned:** 6
**Pattern extraction date:** 2026-05-26
