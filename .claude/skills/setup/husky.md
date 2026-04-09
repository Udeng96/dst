# husky + lint-staged 설정

## 설치

```bash
pnpm add -D husky lint-staged
```

## .husky/pre-commit 생성

- `.git` 디렉토리 위치를 확인하여 git 루트에 `.husky/` 생성
- `chmod +x` 설정
- `git config core.hooksPath .husky` 실행

### 모노레포인 경우

```bash
cd <frontend-dir> && npx lint-staged
```

### 단일 프로젝트

```bash
npx lint-staged
```

## lint-staged 설정 (package.json 내)

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.css": ["stylelint --fix"],
  "*.{json,md}": ["prettier --write"]
}
```

## 주의사항

- `prepare` 스크립트는 모노레포에서 `.git` 위치 문제로 동작하지 않을 수 있음
- 그 경우 `git config core.hooksPath .husky`로 직접 설정