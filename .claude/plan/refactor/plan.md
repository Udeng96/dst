# DST 전체 리팩토링 계획

## 현황 요약

- Spring Boot 2.4.2 + Kotlin 1.4.30 백엔드 (JVM 8), CRA eject + React 17 프론트엔드
- 다중 데이터소스 4개 (PostgreSQL 3 + Oracle 1)
- 실질적 자동화 테스트 0개
- 보안 버그 2건 (TokenInterceptor 인증 우회, Controller 인증 주석처리)
- 프론트엔드 레거시: CRA/webpack4, styled-components, Redux/Saga, React 17, TS 4

## 분석 요약

- 분석 상세: [dependency.md](./analysis/dependency.md) | [hotspots.md](./analysis/hotspots.md)
- Hotspot: 백엔드 2개 (DisasterHistoryService, EventService), 프론트엔드 5개 (CctvSelectPopup, Share, Sms, EventList, MainSaga)
- Fan-in 최상위: styled-components(46), @reduxjs/toolkit(42), react-redux(31), DstConstants(BE 18, FE 11)

## 도메인별 작업 현황

| # | 도메인 | 파일 | 테스트 현황 | 상태 |
|---|--------|------|-----------|------|
| 01 | 보안 | [01-security.md](./tasks/01-security.md) | 단위 테스트 | 완료 (4/4) |
| 02 | 백엔드 인프라 | [02-backend-infra.md](./tasks/02-backend-infra.md) | 없음 | 미완료 (0/5) |
| 03 | 백엔드 서비스 | [03-backend-service.md](./tasks/03-backend-service.md) | 없음 | 미완료 (0/6) |
| 04 | 프론트엔드 빌드 | [04-frontend-build.md](./tasks/04-frontend-build.md) | 없음 | 미완료 (0/5) |
| 05 | 프론트엔드 상태관리 | [05-frontend-state.md](./tasks/05-frontend-state.md) | 없음 | 미완료 (0/5) |
| 06 | 프론트엔드 컴포넌트 + FSD | [06-frontend-component.md](./tasks/06-frontend-component.md) | 없음 | 미완료 (0/7) |
| 08 | Kotlin -> Java 전환 | [08-backend-java-migration.md](./tasks/08-backend-java-migration.md) | 없음 | 미완료 (0/9) |

## 실행 원칙

1. 기능 파괴 없이 점진적으로 진행한다.
2. 안정성을 최우선으로 한다.
3. 각 Phase 완료 시 빌드 + 기능 동작을 반드시 확인한다.
4. 보안 버그는 최우선으로 수정한다.
5. 백엔드 트랙과 프론트엔드 트랙은 병렬로 진행한다.

## 실행 순서

### Phase 0: 테스트 안전망 구축
- 대상: 모든 도메인 (현재 테스트 0개)
- 전략: 특성화 테스트(기본) + BDD(user-facing 보완) + 단위 테스트(Phase 1 이후)
- 각 task 파일의 `NN-0` 항목 참조

### Phase 1: 보안 수정
- 대상: 01-security
- 이유: 인증 우회 버그 -- 백엔드/프론트엔드 양쪽의 선행 조건
- 독립 진행 가능

### Phase 2: 병렬 트랙 시작 (백엔드 / 프론트엔드 독립 진행)

#### 백엔드 트랙

| 순서 | 도메인 | 작업 |
|------|--------|------|
| BE-1 | 08-backend-java-migration | Kotlin -> Java 전체 전환 (build.gradle 포함) |
| BE-2 | 02-backend-infra | DB Config 공통화, 상수 외부화, 소켓 인터페이스 추출 |
| BE-3 | 03-backend-service | DisasterHistoryService 분리, EventService 개선, UserService N+1 |

- BE-1 완료 후 BE-2, BE-3은 Java 코드 위에서 진행
- BE-2와 BE-3은 순차 (BE-2의 인터페이스 추출이 BE-3의 선행 조건)

#### 프론트엔드 트랙

| 순서 | 도메인 | 작업 |
|------|--------|------|
| FE-1 | 04-frontend-build | CRA -> Vite, React 17 -> 18, TS 4 -> 5, pnpm 전환 |
| FE-2 | 05-frontend-state | Redux/Saga -> Zustand + React-Query 전환 |
| FE-3 | 06-frontend-component | Atomic -> FSD 구조 전환, God Component 분리, 중복 제거 |

- FE-1 -> FE-2 -> FE-3 순차 진행

## 의존 관계

```
Phase 0 (테스트 안전망)
    |
Phase 1 (보안)
    |
    +============ Phase 2 병렬 트랙 ============+
    |                                           |
    | [백엔드 트랙]          [프론트엔드 트랙]   |
    |                                           |
    | BE-1: Kotlin->Java     FE-1: CRA->Vite   |
    |   |                      |                |
    | BE-2: 인프라 정비       FE-2: 상태관리     |
    |   |                      |                |
    | BE-3: 서비스 리팩토링   FE-3: 컴포넌트     |
    |                                           |
    +============= 완료 ======================+
```

## 검증 방법

| 유형 | 방법 |
|------|------|
| 빌드/컴파일 | `./gradlew build` (백엔드+프론트엔드 통합) |
| 테스트 통과 | `./gradlew test` (백엔드), `pnpm test` (프론트엔드) |
| 기능 동작 확인 | 개발 서버 실행 후 사용자가 직접 확인 |

## 핵심 파일 목록

### 백엔드 (변경 우선순위 순)

1. `config/interceptor/TokenInterceptor.kt` -- 보안 버그 (return true 인증 우회)
2. `build.gradle.kts` -- Kotlin -> Java 전환 시작점
3. `service/disasterHistory/DisasterHistoryService.kt` -- God Service, 로직 버그 2건
4. `controller/disasterHistory/DisasterHistoryController.kt` -- 인증 주석처리, 파일 IO
5. `service/event/EventService.kt` -- 하드코딩, DI 우회, 트랜잭션 불완전
6. `service/user/UserService.kt` -- N+1 HTTP, 라이브러리 혼용
7. `config/database/*DataContextConfig.kt` -- 4개 파일 98% 중복
8. `constants/DstConstants.kt` -- 운영 IP 하드코딩
9. `proc/SocketTempSendProcImpl.kt` -- 중복 메서드, 인터페이스 없음

### 프론트엔드 (변경 우선순위 순)

1. `package.json` -- CRA -> Vite 전환 기준
2. `store/index.ts` -- Redux 구조 -> Zustand 전환 기준
3. `components/organisms/main/CctvSelectPopup/CctvSelectPopup.tsx` -- God Component (716줄)
4. `components/organisms/main/SituationTransfer/Share/Share.tsx` -- Sms.tsx와 중복
5. `components/organisms/main/EventGenerator/EventGenerator.tsx` -- CctvSelectPopup 복붙
6. `store/view/Main/MainSaga.ts` -- WebSocket 관리, 데드코드
7. `util/xeusPlayer.ts` -- 외부 SDK 인라인 (912줄)
8. `constants/DstConstants.ts` -- 환경 분기 미사용, 하드코딩

## 보류 요약

(현재 보류 항목 없음)
