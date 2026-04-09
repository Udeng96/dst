#!/bin/bash
# PreToolUse(Bash): 개발 서버 실행 명령 차단

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

BLOCKED_PATTERNS=(
  "npm run dev"
  "npm run start"
  "npm run build"
  "pnpm dev"
  "pnpm start"
  "pnpm build"
  "yarn dev"
  "yarn start"
  "yarn build"
  "mvnw spring-boot:run"
  "mvn spring-boot:run"
  "gradlew bootRun"
  "gradle bootRun"
  "./gradlew bootRun"
)

for PATTERN in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -q "$PATTERN"; then
    echo "차단: 개발 서버/빌드 명령은 직접 실행하지 않습니다." >&2
    echo "터미널에서 직접 실행해주세요: $COMMAND" >&2
    exit 2
  fi
done

exit 0