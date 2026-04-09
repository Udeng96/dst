# Vitest + Testing Library 설정

## 설치

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

## vitest.config.ts

```ts
import {defineConfig, mergeConfig} from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      passWithNoTests: true,
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'cobertura', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/main.tsx',
          'src/routes/routeTree.gen.ts',
          'src/mock/**',
          'src/**/*.d.ts',
        ],
      },
    },
  }),
);
```

## vitest.setup.ts

```ts
import '@testing-library/jest-dom/vitest';
```

## package.json 스크립트 추가

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```