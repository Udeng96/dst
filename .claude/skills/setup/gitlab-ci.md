# GitLab CI 파이프라인 설정

git 루트에 `.gitlab-ci.yml` 생성. stages: `lint → test → build`

## frontend:lint (stage: lint)

- image: `node:20-alpine`
- `corepack enable && corepack prepare pnpm@latest --activate`
- `pnpm install --frozen-lockfile`
- `pnpm run lint` + `pnpm exec prettier --check "src/**/*.{ts,tsx}"`
- `only: changes`로 프론트엔드 디렉토리 변경 시만 실행

## frontend:test (stage: test)

- image: `node:20-alpine`
- `pnpm run test:coverage`
- artifacts: cobertura coverage report
- `only: changes`로 프론트엔드 디렉토리 변경 시만 실행

## backend:test (stage: test)

- image: 프로젝트의 Java 버전에 맞는 `eclipse-temurin` 이미지
- `./gradlew test jacocoTestReport`
- artifacts: junit report + jacoco
- `only: changes`로 백엔드 소스 변경 시만 실행

## full:build (stage: build)

- 프론트엔드 빌드 → 백엔드로 복사 → bootJar
- `only: main, tags`
- artifacts: `*.jar`, expire_in: 7 days

## 공통 설정

```yaml
variables:
  GRADLE_OPTS: "-Dorg.gradle.daemon=false"
```