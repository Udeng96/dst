# 프론트엔드 규칙

## 패키지 매니저 및 주요 스택

- pnpm 사용
- React 18.2.0 이상
- vite, swc, TypeScript 사용
- eslint, prettier 무조건 사용

## 상태관리 및 유틸리티

- 전역 상태관리: zustand
- 유효성 검사: zod
- 폼: react-hook-form
- HTTP: axios
- 유틸: lodash-es
- 서버 상태: TanStack react-query
- 라우팅: TanStack react-router

## TailwindCSS

- tailwindCSS, tailwind-merge, clsx 사용
- `./tailwind/colors.js` — 색상 정의
- `./tailwind/animation.js` — keyframes, animation 정의
- `./tailwind/images/` — 이미지 분류마다 파일 생성하여 지정

### className 가독성

복잡한 className은 `cn` 메소드로 가독성 확보:

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 테스트

- vitest + @testing-library/react + jsdom
- 테스트 파일: `src/**/*.test.{ts,tsx}`
- `vitest.config.ts`에서 `vite.config.ts`를 `mergeConfig`로 공유
- `vitest.setup.ts`에서 `@testing-library/jest-dom/vitest` import

## 코드 품질 자동화

- husky + lint-staged: 커밋 시 eslint fix + prettier fix 자동 실행
- GitLab CI: lint → test → build 3단계 파이프라인
- coverage: `@vitest/coverage-v8` (cobertura 리포트)
