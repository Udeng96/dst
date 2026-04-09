---
name: setup
description: 프로젝트 초기 셋업 (vitest, husky, lint-staged, GitLab CI)
disable-model-invocation: true
---

프로젝트의 프론트엔드 디렉토리를 탐색하여 아래 항목들을 순서대로 셋업한다.
이미 설정된 항목은 건너뛴다.

## Step 1. 프론트엔드 디렉토리 탐색

- `package.json`이 있는 프론트엔드 디렉토리를 찾는다
- 모노레포인 경우 (`view/`, `frontend/`, `client/` 등) 해당 디렉토리 기준으로 작업

## Step 2. Vitest + Testing Library 설치

`vitest.md` 참조하여 설치 및 설정 파일 생성.

## Step 3. husky + lint-staged 설치

`husky.md` 참조하여 설치 및 설정.

## Step 4. GitLab CI 파이프라인

`gitlab-ci.md` 참조하여 `.gitlab-ci.yml` 생성.

## Step 5. 검증

- `pnpm run test` 실행하여 vitest 정상 동작 확인
- 생성/수정된 파일 모두 `git add`

---

## 주의사항

- `pnpm run dev`, `pnpm run build` 등 개발 서버/빌드 명령은 실행하지 않는다
- 기존 설정 파일이 있으면 덮어쓰지 않고, 필요한 부분만 수정한다
- `.gitlab-ci.yml`이 이미 존재하면 사용자에게 확인 후 수정한다