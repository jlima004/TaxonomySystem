#!/usr/bin/env bash
# check-safety-guards.sh — Non-mutating local safety guard for staged Graphify and protected paths.
#
# Purpose: Block staged graphify-out/* and staged/dirty protected path changes
#          before they can enter a commit. Dirty working-tree graphify-out is allowed.
#
# Usage:
#   ./scripts/check-safety-guards.sh   (requires executable bit)
#   bash scripts/check-safety-guards.sh
#
# Exit codes:
#   0 — PASS: no staged Graphify or protected-path violations found.
#   1 — FAIL: one or more violations found; all are reported before exiting.
#
# This script is NON-MUTATING. It never runs git add, git reset, git checkout,
# git clean, or git rm. It only reads repository state.

# ── Repo root detection (GUARD16-D-21, GUARD16-D-22) ─────────────────────────
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
  echo "NOT_GIT_REPO: not inside a git repository." >&2
  exit 1
fi
cd "$REPO_ROOT" || exit 1

# ── Policy reminder (GUARD16-D-20) ───────────────────────────────────────────
POLICY_LINE="Policy: non-mutating guard; do not clean, revert, regenerate, stage, unstage, or commit protected paths or graphify-out/* in this plan."

# ── Collect violation outputs with report_all (GUARD16-D-17) ─────────────────
VIOLATIONS=0

# Check 1: Staged graphify-out paths (GUARD16-D-10, GUARD16-D-23, GUARD16-D-26)
GRAPHIFY_STAGED=$(git diff --cached --name-only -- graphify-out)
if [ -n "$GRAPHIFY_STAGED" ]; then
  echo "GRAPHIFY_STAGED: the following graphify-out paths are staged for commit:" >&2
  while IFS= read -r line; do
    echo "  $line" >&2
  done <<< "$GRAPHIFY_STAGED"
  echo "$POLICY_LINE" >&2
  VIOLATIONS=1
fi

# Check 2: Staged protected paths (GUARD16-D-11, GUARD16-D-24, GUARD16-D-27)
PROTECTED_PATH_STAGED=$(git diff --cached --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts)
if [ -n "$PROTECTED_PATH_STAGED" ]; then
  echo "PROTECTED_PATH_STAGED: the following protected paths are staged for commit:" >&2
  while IFS= read -r line; do
    echo "  $line" >&2
  done <<< "$PROTECTED_PATH_STAGED"
  echo "$POLICY_LINE" >&2
  VIOLATIONS=1
fi

# Check 3: Working-tree diff on protected paths (GUARD16-D-12, GUARD16-D-25, GUARD16-D-27)
# Note: working-tree graphify-out dirtiness is accepted_with_policy and NOT checked here (GUARD16-D-13, GUARD16-D-14)
PROTECTED_DIFF=$(git diff --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts)
if [ -n "$PROTECTED_DIFF" ]; then
  echo "PROTECTED_DIFF: the following protected paths have uncommitted working-tree changes:" >&2
  while IFS= read -r line; do
    echo "  $line" >&2
  done <<< "$PROTECTED_DIFF"
  echo "$POLICY_LINE" >&2
  VIOLATIONS=1
fi

# ── Final result (GUARD16-D-15, GUARD16-D-18, GUARD16-D-19) ─────────────────
if [ "$VIOLATIONS" -eq 0 ]; then
  echo "PASS"
  exit 0
else
  exit 1
fi
