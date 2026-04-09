# 의존 관계 분석

- 분석 일시: 2026-03-25
- 기준: 코드베이스 내 import 수 상위 20% = Fan-out/Fan-in "높음"

## Fan-out 높은 파일 (많은 파일을 참조 -- 변경 시 파급 범위 큼)

### 백엔드 (기준: import 18개 이상)

| 파일 | import 수 | 영향 도메인 |
|------|----------|-----------|
| DisasterHistoryService.kt | 27 | 재난이력, 파일시스템, SMS, CCTV, 비디오 |
| UserService.kt | 21 | 인증, 암호화, OMS 외부 API |
| EventService.kt | 21 | 이벤트, 소켓, MRS 외부 시스템 |
| DisasterHistoryController.kt | 21 | 재난이력, 인증, 파일 입출력 |
| EventStatService.kt | 18 | 이벤트 통계 |

### 프론트엔드 (기준: import 20개 이상)

| 파일 | import 수 | 영향 도메인 |
|------|----------|-----------|
| CctvData.ts | 41 | CCTV 데이터 매핑 |
| store/index.ts | 25 | 전체 Redux 스토어 |
| CctvSelectPopup.tsx | 25 | CCTV, 지도, DnD, 영상 |
| EventGenerator.tsx | 24 | 이벤트 생성, 지도, CCTV |
| Share.tsx | 22 | 공유, 수신자, 재난이력 |
| Map.tsx | 22 | 지도, CCTV, 모바일 마커 |

## Fan-in 높은 파일 (많은 파일에 의해 참조 -- 변경 시 영향받는 곳 많음)

### 백엔드

| 참조 대상 | 참조 수 | 비고 |
|----------|--------|------|
| DstConstants | 18 | 전역 상수 -- 변경 시 전체 영향 |
| @Autowired | 25 | 필드 주입 패턴 전역 사용 |
| NamedKLogging / LoggerFactory | 25 | 로깅 라이브러리 혼용 |

### 프론트엔드

| 참조 대상 | 참조 수 | 비고 |
|----------|--------|------|
| styled-components | 46 | 스타일링 전역 -- TailwindCSS 전환 시 전체 영향 |
| @reduxjs/toolkit | 42 | 상태관리 전역 -- Zustand 전환 시 전체 영향 |
| react-redux | 31 | useSelector/useDispatch 전역 사용 |
| leaflet | 17 | 지도 관련 컴포넌트 |
| axios / xhrUtil | 25 | HTTP 통신 전역 |
| DstConstants.ts | 11 | 프론트 전역 상수 |
| redux-saga | 13 | Saga 패턴 -- React-Query 전환 시 전체 영향 |

## 도메인 간 선행/후행 관계

```
[백엔드]                              [프론트엔드]

DstConstants ◄──── 모든 Service/Controller    DstConstants ◄──── 모든 Store/Component
     |                                              |
TokenInterceptor ◄──── WebConfig               store/index.ts ◄──── 모든 Saga/Reducer
     |                                              |
DB Configs (4개) ◄──── 모든 Repository         xhrUtil ◄──── 모든 *Api.ts
     |                                              |
Repository ◄──── Service ◄──── Controller      *Api.ts ◄──── *Saga.ts ◄──── Component
     |                                              |
HeaderUtil ◄──── Controller (파일/HTTP 헤더)    styled-components ◄──── 모든 Component

[횡단 의존]
프론트엔드 xhrUtil ──HTTP──► 백엔드 Controller
프론트엔드 WebSocket ──WS──► 백엔드 WebSocketHandler
```

### Phase 배치 시사점

- `DstConstants` (FE/BE 모두): 다른 모든 파일이 참조 -- Phase 초반에 정리
- `styled-components` (Fan-in 46): 가장 마지막에 전환 (전체 영향)
- `Redux/Saga` (Fan-in 42+31+13): styled-components 전환 전에 먼저 처리
- `TokenInterceptor`: 보안 버그 -- 최우선 수정, 다른 작업의 선행 조건
- `DB Config 4개`: 중복 구조 -- 독립적으로 처리 가능
