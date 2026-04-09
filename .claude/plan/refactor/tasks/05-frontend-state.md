# 05. 프론트엔드 상태관리

- 우선순위: 중간
- 선행 조건: 04-frontend-build 완료
- 테스트 현황: 없음

## 진행 현황

- [ ] 05-0. 특성화 테스트 작성
- [ ] 05-1. Zustand 도입 및 View 상태 마이그레이션
- [ ] 05-2. React-Query 도입 및 서버 상태 마이그레이션
- [ ] 05-3. WebSocket 관리 분리
- [ ] 05-4. Redux/Saga 완전 제거

## 상세

### 05-0. 특성화 테스트 작성

대상 파일:
- `store/view/Main/MainSaga.ts` (WebSocket 연결)
- `store/Event/EventSaga.ts`
- `store/DisasterHistory/DisasterHistorySaga.ts` -- 테스트 작성 선행 (`CHK_DISASTER_HISTORY.success` 버그 의심)

작성 방식: Saga 동작을 테스트하되, 마이그레이션 후에는 Zustand/React-Query 훅 테스트로 전환.
user-facing 시나리오 (이벤트 목록 조회, 재난이력 검색)는 BDD 스타일로 보완.

### 05-1. Zustand 도입 및 View 상태 마이그레이션

현재 문제:
- 도메인별 `Action/Reducer/Saga/Type/Api` 5파일 패턴 (총 50+파일)
- `view/Main`, `view/Popup`, `view/Loading`, `view/Share` -- 순수 UI 상태도 Redux에 저장
- `serializableCheck: false` (leaflet LatLng 객체를 store에 저장)

변경 방향:
- `view/` 하위 상태를 Zustand store로 먼저 전환 (가장 독립적)
- `useMainStore`, `usePopupStore`, `useLoadingStore`, `useShareStore` 생성
- 기존 `useSelector` -> Zustand hook으로 점진적 교체
- leaflet 객체는 store에서 제거하고 컴포넌트 로컬 상태로 이동

### 05-2. React-Query 도입 및 서버 상태 마이그레이션

현재 문제:
- 서버 데이터 (Event, DisasterHistory, Cctv, User 등)를 Redux에 저장
- Saga에서 API 호출 -> Reducer로 저장 -> useSelector로 조회
- 캐싱, 재요청, 에러 처리 등을 모두 수동으로 구현

변경 방향:
- `QueryClient` 설정 + `QueryClientProvider` 추가
- 도메인별 커스텀 훅 생성: `useEvents()`, `useDisasterHistories()`, `useCctvs()` 등
- 기존 `*Api.ts`의 axios 호출을 React-Query의 `queryFn`으로 래핑
- mutation 처리: `useMutation` 도입
- 점진적 전환: 한 도메인씩 Saga -> React-Query로 이전

### 05-3. WebSocket 관리 분리

현재 문제:
- `MainSaga.ts`에서 모듈 레벨 변수로 WebSocket 관리 (`let wsEvent`, `let ws`)
- redux-saga `eventChannel` 기반
- 3개의 WebSocket 채널 생성 함수가 거의 동일 패턴으로 중복
- 컴포넌트 언마운트 시 정리 불가

변경 방향:
- `WebSocketManager` 클래스 또는 커스텀 훅(`useWebSocket`) 추출
- 중복 채널 생성 함수 통합
- Zustand store와 연동하여 WebSocket 이벤트 -> store 상태 업데이트
- 컴포넌트 생명주기와 연결 (연결/해제 관리)

### 05-4. Redux/Saga 완전 제거

05-1 ~ 05-3 완료 후 수행.

변경 방향:
- `store/` 하위 Redux 관련 파일 전부 삭제 (Action, Reducer, Saga, reduxUtil)
- `@reduxjs/toolkit`, `redux-saga`, `react-redux` 의존성 제거
- `store/index.ts` 삭제 또는 Zustand 재export 파일로 대체
