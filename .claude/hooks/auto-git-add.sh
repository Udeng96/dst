#!/bin/bash
# PostToolUse(Edit|Write): 파일 수정 후 자동 git add

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE" ]; then
  exit 0
fi

# 빌드 결과물 및 민감 파일 제외
EXCLUDED_PATTERNS=(
  "dist/"
  "build/"
  "out/"
  ".next/"
  "target/"
  "node_modules/"
  ".gradle/"
  "src/main/generated/"
  ".env"
)

for PATTERN in "${EXCLUDED_PATTERNS[@]}"; do
  if echo "$FILE" | grep -q "$PATTERN"; then
    exit 0
  fi
done

# git 저장소인지 확인 후 add
cd "$(dirname "$FILE")"
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  git add "$FILE" 2>/dev/null
fi

exit 0