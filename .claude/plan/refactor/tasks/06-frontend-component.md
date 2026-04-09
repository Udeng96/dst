# 06. 프론트엔드 컴포넌트

- 우선순위: 중간
- 선행 조건: 05-frontend-state 완료
- 테스트 현황: 없음

## 진행 현황

- [ ] 06-0. 특성화 테스트 작성
- [ ] 06-1. Atomic Design -> FSD 디렉토리 구조 전환
- [ ] 06-2. CctvSelectPopup + EventGenerator 공통 추출 및 분리
- [ ] 06-3. Share + Sms 공통 추출 및 분리
- [ ] 06-4. EventList 정리
- [ ] 06-5. xeusPlayer.ts 래핑 전략
- [ ] 06-6. 타입 안정성 강화

## 상세

### 06-0. 특성화 테스트 작성

대상 파일:
- `CctvSelectPopup.tsx`, `EventGenerator.tsx` (렌더링 + 핵심 인터랙션)
- `Share.tsx`, `Sms.tsx` (수신자 추가/삭제 + 유효성 검사)
- `EventList.tsx` (이벤트 목록 렌더링)

작성 방식: @testing-library/react 기반. user-facing 시나리오는 BDD 보완.

### 06-1. Atomic Design -> FSD 디렉토리 구조 전환

현재 구조 (Atomic Design):
```
src/
  components/
    atoms/        -- Button, Label, InputText, InputSelect, ...
    molecules/    -- Map, EventListItem, Player, Tab, Field, ...
    organisms/    -- EventList, CctvSelectPopup, Share, Sms, ...
    templates/    -- MainTemplate, ShareTemplate
    pages/        -- MainPage, SharePage
  store/          -- Redux (05에서 Zustand으로 전환 완료 상태)
  util/           -- dateUtil, xhrUtil, rinoUtil, xeusPlayer
  constants/      -- DstConstants, AddressAutoCompData
```

변경 후 구조 (Feature-Sliced Design):
```
src/
  app/            -- 앱 초기화, 프로바이더, 라우팅, 전역 스타일
    providers/    -- QueryClientProvider, StoreProvider 등
    router/       -- 라우트 정의
  pages/          -- MainPage, SharePage (라우트별 페이지 조립)
  widgets/        -- 독립적 UI 블록 (조합된 feature/entity 사용)
    event-list/
    situation-transfer/
    cctv-select-popup/
    map-viewer/
    main-header/
  features/       -- 유저 액션 단위
    create-event/
    send-sms/
    share-disaster/
    search-cctv/
    search-address/
  entities/       -- 비즈니스 엔티티 (타입, API, 모델)
    event/
    disaster-history/
    cctv/
    user/
    department/
    organization/
    mobile/
    video/
  shared/         -- 공통 유틸, UI, API 클라이언트, 상수
    ui/           -- Button, Label, InputText 등 (기존 atoms)
    lib/          -- dateUtil, xhrUtil, rinoUtil
    api/          -- axios 인스턴스, API base 설정
    config/       -- DstConstants, 환경변수
    types/        -- 공통 타입 정의
```

변경 방향:
1. FSD 디렉토리 구조 먼저 생성
2. `shared/ui/` <- 기존 `atoms/` 이동
3. `shared/lib/` <- 기존 `util/` 이동
4. `shared/config/` <- 기존 `constants/` 이동
5. `entities/` <- 기존 `store/*/Type.ts` + `*Api.ts` (05에서 Zustand/React-Query 전환된 상태)
6. `features/` <- 비즈니스 로직 훅 배치 (06-2, 06-3에서 추출한 공통 훅)
7. `widgets/` <- 기존 `organisms/` + `molecules/` 중 복합 컴포넌트
8. `pages/` <- 기존 `pages/` + `templates/` 통합
9. import 경로 전체 업데이트
10. 기존 `components/`, `store/` 디렉토리 삭제

FSD 레이어 의존 규칙:
```
app -> pages -> widgets -> features -> entities -> shared
(상위 레이어는 하위만 참조, 같은 레이어 간 참조 금지)
```

### 06-2. CctvSelectPopup + EventGenerator 공통 추출 및 분리

현재 문제:
- `EventGenerator.tsx`가 `CctvSelectPopup.tsx`의 복붙 (인터페이스명까지 `ICctvSelectPopup` 그대로)
- 공통 로직: 주소 자동완성(`findAddressAutoComp`), CCTV 검색, 지도 표시
- 공통 스타일: `StyledCctvSelectPopupWrap`, `StyledMapSearchArea`, fadeIn/fadeOut keyframes
- 각각 700줄, 550줄 -- God Component

변경 방향:
- `features/search-cctv/` -- `useCctvSearch()` 훅
- `features/search-address/` -- `useAddressAutoComplete()` 훅
- `widgets/cctv-select-popup/` -- 여러 서브컴포넌트로 분리 (검색, 목록, 드래그&드롭 플레이어)
- `widgets/event-generator/` -- 공유 feature 재사용
- 공통 스타일은 각 widget 내부로 이동

### 06-3. Share + Sms 공통 추출 및 분리

현재 문제:
- `handleAddReceiver`, `handleDeleteReceiver`, `saveDisasterHistory` 유효성 검사 로직 중복
- `StyledInputText`, `StyledField`, `StyledReceiverListContainer` 등 styled-component 정의 중복
- `Share.tsx`에서 `setTimeout(500ms)` 임시 처방
- 삼항 연산자 3단 중첩

변경 방향:
- `features/share-disaster/` -- `useReceiver()` 훅 (추가/삭제/유효성)
- `features/share-disaster/` -- `useDisasterHistoryForm()` 훅
- `shared/ui/` -- 공통 styled-component (`ReceiverManager`, `FormFields`)
- `setTimeout` 제거 -- 적절한 상태 관리로 대체

### 06-4. EventList 정리

현재 문제:
- 컴포넌트 밖에 `moveHistoryBack` (하드코딩 URL)
- `zeroPadding` 유틸 인라인 정의
- `console.log` 3곳
- 주석처리된 코드 블록 + 죽은 `downloadStatExcel` 함수

변경 방향:
- `widgets/event-list/` 로 이동
- 하드코딩 URL -> `shared/config/` 상수로 이전
- `zeroPadding` -> `shared/lib/dateUtil.ts`로 이동 또는 `String.padStart` 사용
- 데드코드 전부 제거
- `console.log` 제거

### 06-5. xeusPlayer.ts 래핑 전략

현재 문제:
- 912줄 외부 플레이어 SDK가 TypeScript 파일로 인라인 포함
- ES5 스타일 (`var`, prototype, `"user strict"` 오타)
- DOM 직접 조작 (`document.getElementById`)
- `any` 타입 전체 사용

변경 방향:
- `shared/lib/xeusPlayer.js` -- 별도 `.js` 파일로 분리
- `shared/lib/xeusPlayer.d.ts` -- TypeScript declaration 작성
- `shared/ui/XeusPlayer.tsx` -- React 래퍼 컴포넌트 (ref로 DOM 제어)
- 원본 SDK 수정은 최소화 (외부 코드이므로)

### 06-6. 타입 안정성 강화

현재 문제:
- `Function` 타입 남발 (Share.tsx의 `IShare` 등)
- `any` 타입 다수 (Saga 파일, 컴포넌트 props)
- `@ts-ignore` 사용
- `==` 비교 (타입 강제 변환 위험)
- `var` 키워드 사용

변경 방향:
- `Function` -> 구체적 시그니처 (`(value: string) => void` 등)
- `any` -> 적절한 타입 정의
- `@ts-ignore` 제거하고 타입 정의 보완
- `==` -> `===`, `var` -> `const`/`let`
- ESLint strict 규칙 활성화 (`@typescript-eslint/no-explicit-any`)
