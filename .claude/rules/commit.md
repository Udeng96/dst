# 커밋 메시지 규칙

- `Co-Authored-By:` 라인 포함 금지.

# 파일 스테이징 규칙

- 대화 중 생성하거나 수정한 파일은 작업 완료 즉시 `git add <file>` 로 stage에 올린다.
- 단, 빌드 결과물(`dist/`, `build/`, `*.class`, `*.jar` 등)과 민감 정보 파일(`.env`)은 제외한다.
