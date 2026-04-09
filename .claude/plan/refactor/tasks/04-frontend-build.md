# 04. 프론트엔드 빌드

- 우선순위: 높음
- 선행 조건: 01-security 완료
- 테스트 현황: 없음

## 진행 현황

- [ ] 04-0. 특성화 테스트 작성
- [ ] 04-1. npm -> pnpm 전환
- [ ] 04-2. CRA eject -> Vite + SWC 전환
- [ ] 04-3. React 17 -> 18 업그레이드
- [ ] 04-4. TypeScript 4 -> 5 업그레이드 + ESLint/Prettier 설정

## 상세

### 04-0. 특성화 테스트 작성

대상: 주요 페이지 컴포넌트 (`MainPage`, `SharePage`)
작성 방식: 렌더링 스모크 테스트 수준. vitest + @testing-library/react (Vite 전환 후 설정)

### 04-1. npm -> pnpm 전환

현재 문제:
- npm 사용 중 (package-lock.json 존재)
- CLAUDE.md 규칙에서 pnpm 사용을 명시

변경 방향:
- `package-lock.json` 삭제
- `pnpm import` 또는 `pnpm install`로 `pnpm-lock.yaml` 생성
- `build.gradle.kts`의 `installReact` 태스크에서 `npm install` -> `pnpm install` 변경

### 04-2. CRA eject -> Vite + SWC 전환

현재 문제:
- CRA eject 상태: `config/webpack.config.js`, `config/paths.js`, `scripts/build.js`, `scripts/start.js` 존재
- webpack 4 기반, `NODE_OPTIONS=--openssl-legacy-provider` 필수
- `babel.config.js` 존재 (styled-components 플러그인만)

변경 방향:
1. `vite.config.ts` 생성 (`@vitejs/plugin-react-swc`)
2. `base: "/dst"` 설정 (`homepage: "/dst"` 대체)
3. `index.html`을 `src/main/web/` 루트로 이동 (Vite 규약)
4. `%PUBLIC_URL%` -> Vite 방식으로 전환
5. `config/`, `scripts/`, `babel.config.js` 삭제
6. webpack, react-scripts 관련 의존성 전부 제거
7. `build.gradle.kts` 빌드 경로 조정 (Vite 기본 출력: `dist/`)

### 04-3. React 17 -> 18 업그레이드

현재 문제:
- `react@^17.0.2`, `react-dom@^17.0.2`
- `ReactDOM.render()` 사용 (`src/index.tsx`)

변경 방향:
- `react@18`, `react-dom@18`, `@types/react@18`, `@types/react-dom@18` 업그레이드
- `ReactDOM.render()` -> `createRoot()` 전환
- Strict Mode 활성화 검토

### 04-4. TypeScript 4 -> 5 업그레이드 + ESLint/Prettier 설정

현재 문제:
- `typescript@^4.1.2`
- ESLint 설정이 `package.json` 인라인 (`"extends": ["react-app"]`)
- Prettier 설정 없음

변경 방향:
- `typescript@^5.x` 업그레이드
- `tsconfig.json` 최신화
- `.eslintrc.cjs` 또는 `eslint.config.js` 파일로 분리
- `.prettierrc` 생성
- `vitest.config.ts` 생성 (`vite.config.ts`와 `mergeConfig`)
- `vitest.setup.ts` 생성 (`@testing-library/jest-dom/vitest`)
- husky + lint-staged 설정
