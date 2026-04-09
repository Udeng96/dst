# Hotspot 분석

- 분석 일시: 2026-03-25
- 분석 방식: git 기반 (변경 빈도) + 라인 수 (복잡도 프록시)
- 기준: 상위 30개 파일 내에서 상위 1/3 = 높음, 중간 1/3 = 중간, 하위 1/3 = 낮음

## Hotspot 목록

### 백엔드

| 파일 | 변경 빈도 | 라인 수 | 판정 | 관련 도메인 |
|------|----------|--------|------|-----------|
| DisasterHistoryService.kt | 높음 (26) | 322 | Hotspot | 재난이력 서비스 |
| EventService.kt | 높음 (17) | 186 | Hotspot | 이벤트 서비스 |
| DisasterHistoryController.kt | 중간 (13) | 274 | 잠재적 위험 | 재난이력 컨트롤러 |
| UserService.kt | 중간 (10+) | 206 | 잠재적 위험 | 인증/사용자 |
| EventStatService.kt | - | 177 | 복잡하지만 안정적 | 이벤트 통계 |
| HeaderUtil.kt | - | 174 | 복잡하지만 안정적 | 유틸리티 |
| SocketTempSendProcImpl.kt | - | 139 | 복잡하지만 안정적 | 소켓 통신 |

### 프론트엔드

| 파일 | 변경 빈도 | 라인 수 | 판정 | 관련 도메인 |
|------|----------|--------|------|-----------|
| xeusPlayer.ts | - | 912 | 복잡하지만 안정적 | 영상 플레이어 |
| CctvSelectPopup.tsx | 높음 (14) | 716 | Hotspot | CCTV 팝업 |
| Share.tsx | 높음 (19) | 655 | Hotspot | 재난 공유 |
| EventGenerator.tsx | 중간 (11) | 552 | 잠재적 위험 | 이벤트 생성 |
| Sms.tsx | 높음 (14) | 452 | Hotspot | SMS 전송 |
| EventList.tsx | 높음 (18) | 357 | Hotspot | 이벤트 목록 |
| MainSaga.ts | 높음 (17) | 247 | Hotspot | 메인 Saga/WS |
| ShareTemplate.tsx | 중간 (11) | 236 | 자주 수정되는 설정 | 공유 템플릿 |
| EventSaga.ts | 중간 (12) | 210 | 잠재적 위험 | 이벤트 Saga |
| DisasterHistorySaga.ts | 중간 (12) | 201 | 잠재적 위험 | 재난이력 Saga |

## 도메인별 우선순위

| 도메인 | 우선순위 | 근거 |
|--------|---------|------|
| 보안 (TokenInterceptor, 인증) | 높음 | 보안 버그 (인증 우회), 모든 도메인의 선행 조건 |
| 백엔드 서비스 (DisasterHistory, Event) | 높음 | Hotspot 2개, 로직 버그 다수 |
| 프론트엔드 빌드 시스템 | 높음 | CRA eject → Vite 전환이 모든 FE 작업의 선행 조건 |
| 프론트엔드 상태관리 | 중간 | Redux/Saga 전체 교체 필요, Fan-in 매우 높음 |
| 프론트엔드 컴포넌트 | 중간 | God Component 다수, 중복 코드 |
| 백엔드 인프라 (DB Config, Socket) | 중간 | 중복 구조이나 안정적 |
| 프론트엔드 스타일링 | 낮음 | Fan-in 최고(46)이므로 가장 마지막에 전환 |
