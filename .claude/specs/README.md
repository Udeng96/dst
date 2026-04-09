# 채택 스펙 요약

## 백엔드

### 기술 스택

| 항목 | 스펙 |
|------|------|
| 언어 | Java 21 |
| 프레임워크 | Spring Boot 3.x |
| 빌드 | Gradle |
| DB | PostgreSQL 14 + PostGIS |
| ORM | Spring Data JPA + QueryDSL 5.x (jakarta) + Hibernate Spatial |
| Cache | Redis 7 |
| 인증 | Spring Security + Google OAuth2 + JWT, 사내 OAuth |
| 실시간 | SSE (Server-Sent Events) |
| 동시성 | Virtual Thread (Project Loom) |
| 아키텍처 | Hexagonal Architecture |

### Spring 디자인 패턴

| 기능 | 용도 |
|------|------|
| `OncePerRequestFilter` | MDC 기반 요청 추적 (traceId, uri, method) |
| `@LoginUser` ArgumentResolver | SecurityContext에서 현재 사용자 직접 주입 |
| `@RestControllerAdvice` | 도메인 예외 → HTTP 상태코드 매핑, 표준 에러 응답 통일 |
| AOP `@Around` | 스케줄러 실행 추적 (실행 시간, 수신 건수, 실패 여부) |
| AOP `@AfterThrowing` | 서비스 레이어 예외 로깅 (스택트레이스 포함) |
| `ApplicationEvent` + `@EventListener` | 도메인 이벤트 기반 비동기 처리 (SSE 알림, Redis Pub/Sub 발행) |
| `@Cacheable` + Redis | 마스터 데이터 캐싱, `@CacheEvict`로 무효화 |
| `@Async` + Virtual Thread | 외부 API 병렬 호출 |

### Hexagonal Architecture

**핵심 원칙**: 비즈니스 로직(도메인)이 외부 기술(DB, Web, 외부 API)에 의존하지 않는다.

```
        ┌─────────────────────────────────┐
        │           Adapter (In)          │
        │     Controller, Scheduler       │
        │               │                 │
        │               ▼                 │
        │  ┌─────── Port (In) ───────┐    │
        │  │      UseCase 인터페이스  │    │
        │  └──────────┬──────────────┘    │
        │             ▼                   │
        │     ┌──── Domain ────┐          │
        │     │  핵심 비즈니스  │          │
        │     │  모델 & 규칙   │          │
        │     └───────┬────────┘          │
        │             ▼                   │
        │  ┌─────── Port (Out) ──────┐    │
        │  │    Repository 인터페이스  │    │
        │  └──────────┬──────────────┘    │
        │             ▼                   │
        │         Adapter (Out)           │
        │    JPA Repository, API Client   │
        └─────────────────────────────────┘
```

| 레이어 | 역할 | 의존 방향 |
|--------|------|-----------|
| **Adapter In** (`adapter/in/web/`) | 외부 요청 수신 (Controller, Scheduler) | → Port In |
| **Port In** (`application/port/in/`) | UseCase 인터페이스 정의 | ← Adapter In이 호출 |
| **Service** (`application/service/`) | UseCase 구현, 도메인 오케스트레이션 | → Domain, Port Out |
| **Domain** (`domain/`) | 핵심 비즈니스 모델, 도메인 규칙 | 아무것도 의존하지 않음 |
| **Port Out** (`application/port/out/`) | 영속성/외부 시스템 인터페이스 정의 | ← Service가 호출 |
| **Adapter Out** (`adapter/out/persistence/`) | Port Out 구현 (JPA, 외부 API) | → Port Out 구현 |

**의존성 규칙**:
- Domain은 어떤 레이어도 import하지 않는다
- Service는 Port 인터페이스만 의존하고, 구체 구현(Adapter)을 알지 못한다
- Adapter는 항상 Port를 통해 Application 레이어와 통신한다

### 패키지 구조

```
com.{project}.platform
├── {domain}/                           # 도메인별 Hexagonal 모듈
│   ├── adapter/
│   │   ├── in/
│   │   │   └── web/
│   │   │       ├── {Domain}Controller.java       # REST 엔드포인트
│   │   │       ├── dto/
│   │   │       │   ├── {Domain}Request.java      # 요청 DTO
│   │   │       │   └── {Domain}Response.java     # 응답 DTO
│   │   │       └── mapper/
│   │   │           └── {Domain}DtoMapper.java    # DTO ↔ Domain 변환
│   │   └── out/
│   │       └── persistence/
│   │           ├── {Domain}JpaRepository.java    # Spring Data JPA
│   │           ├── {Domain}RepositoryImpl.java   # Port Out 구현체
│   │           ├── {Domain}QueryRepository.java  # QueryDSL 커스텀 쿼리
│   │           └── entity/
│   │               └── {Domain}Entity.java       # JPA 엔티티
│   ├── application/
│   │   ├── port/
│   │   │   ├── in/
│   │   │   │   └── {Domain}UseCase.java          # UseCase 인터페이스
│   │   │   └── out/
│   │   │       └── {Domain}Port.java             # 영속성 Port 인터페이스
│   │   ├── service/
│   │   │   └── {Domain}Service.java              # UseCase 구현
│   │   └── event/
│   │       └── {Domain}Event.java                # 도메인 이벤트
│   └── domain/
│       ├── {Domain}.java                         # 도메인 모델 (엔티티/VO)
│       └── {Domain}Type.java                     # 도메인 Enum
│
├── integration/                        # 외부 시스템 연동
│   └── scheduler/
│       ├── {External}Scheduler.java              # @Scheduled 폴링
│       └── client/
│           └── {External}ApiClient.java          # 외부 API 호출
│
└── infra/                              # 인프라 횡단 관심사
    ├── redis/
    │   ├── RedisConfig.java                      # Redis 연결 설정
    │   └── CacheConfig.java                      # @Cacheable 캐시 설정
    ├── security/
    │   ├── SecurityConfig.java                   # Spring Security 설정
    │   ├── JwtFilter.java                        # JWT 인증 필터
    │   ├── OAuth2Config.java                     # Google OAuth2 + 사내 OAuth
    │   └── LoginUserArgumentResolver.java        # @LoginUser 주입
    ├── filter/
    │   └── MdcLoggingFilter.java                 # MDC 기반 요청 추적
    ├── aop/
    │   ├── SchedulerAspect.java                  # 스케줄러 실행 추적
    │   └── ExceptionLoggingAspect.java           # 서비스 예외 로깅
    └── sse/
        └── SseEmitterManager.java                # SSE 연결 관리
```

---

## 프론트엔드

### 기술 스택

| 항목 | 스펙 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 아키텍처 | Feature Sliced Design (FSD) |
| 스타일 | TailwindCSS + tailwind-merge + clsx |
| 지도 | OpenLayers, Leaflet |
| 상태관리 | Zustand (전역), TanStack Query (서버 상태) |
| 폼 | react-hook-form + Zod |
| HTTP | native fetch 래퍼 (커스텀 구현) |
| 실시간 | EventSource (SSE) |
| 패키지 매니저 | pnpm |
| 코드품질 | ESLint, Prettier, husky, lint-staged |

### Feature Sliced Design (FSD)

**핵심 원칙**: UI를 비즈니스 도메인 단위로 분리하고, 레이어 간 단방향 의존성을 강제한다.

```
  ┌─────────────────────────────────────────────────┐
  │  app          라우팅, 프로바이더, 글로벌 설정     │
  │    ↓                                             │
  │  pages        레이어를 조합하여 완성된 페이지 구성  │
  │    ↓                                             │
  │  widgets      독립적인 대형 UI 블록 (헤더, 사이드바)│
  │    ↓                                             │
  │  features     사용자 인터랙션 단위 (로그인, 검색)   │
  │    ↓                                             │
  │  entities     비즈니스 도메인 모델 (User, Vessel)  │
  │    ↓                                             │
  │  shared       공통 UI킷, 유틸, 설정               │
  └─────────────────────────────────────────────────┘
       ↓ = 의존 방향 (상위 → 하위만 허용)
```

| 레이어 | 역할 | 포함 요소 |
|--------|------|-----------|
| **app** | 앱 초기화, 라우팅, 프로바이더 설정 | Next.js App Router, layout, providers |
| **pages** | 레이어 조합으로 완성된 페이지 구성 | widgets + features 조합, 페이지별 데이터 로딩 |
| **widgets** | 독립적인 대형 UI 블록 | 헤더, 사이드바, 지도 패널 등 |
| **features** | 하나의 사용자 시나리오 단위 | ui/ (컴포넌트), model/ (로직, 상태, Query) |
| **entities** | 비즈니스 도메인 모델 | api/ (Query 훅 + fetch), model/ (타입 정의) |
| **shared** | 프로젝트 전역 공통 요소 | ui/ (Button, Modal), lib/ (cn, 헬퍼), api/ (fetch 래퍼) |

**의존성 규칙**:
- 상위 레이어는 하위 레이어만 import 가능 (역방향 금지)
- 같은 레이어 내 slice 간 cross-import 금지 (`features/login` → `features/search` 불가)
- 각 slice는 `index.ts`로 public API만 노출, 내부 구조 직접 접근 금지
- Next.js `app/` 디렉토리는 라우팅만 담당 — 실제 페이지 조합은 `pages/` 레이어에서

### 패키지 구조

```
src/
├── app/                    # Next.js App Router (라우팅만)
│   ├── layout.tsx          # 글로벌 프로바이더 (QueryClientProvider, etc.)
│   └── {route}/
│       └── page.tsx        # pages/ 레이어 컴포넌트를 import하여 렌더링
│
├── pages/                  # [FSD] 페이지 조합
│   └── {page}/
│       ├── ui/             # widgets + features 조합
│       └── index.ts
│
├── widgets/                # [FSD] 독립적인 대형 UI 블록
│   └── {widget}/
│       ├── ui/             # 위젯 컴포넌트
│       ├── model/          # 위젯 전용 Zustand store
│       └── index.ts
│
├── features/               # [FSD] 사용자 인터랙션 단위
│   └── {feature}/
│       ├── ui/             # 피처 컴포넌트
│       ├── model/
│       │   ├── store.ts    # Zustand store (피처 상태)
│       │   └── queries.ts  # TanStack Query (mutation, 피처별 서버 상태)
│       ├── lib/            # 피처 전용 유틸 (validation schema 등)
│       └── index.ts
│
├── entities/               # [FSD] 비즈니스 도메인 모델
│   └── {entity}/
│       ├── api/
│       │   ├── queries.ts  # TanStack Query 훅 (useQuery)
│       │   └── fetch.ts    # fetch 호출 함수
│       ├── model/
│       │   ├── types.ts    # 도메인 타입 정의
│       │   └── store.ts    # Zustand store (도메인 전역 상태)
│       └── index.ts
│
└── shared/                 # [FSD] 공통 유틸/UI킷
    ├── ui/                 # Button, Input, Modal, Toast 등
    ├── api/
    │   ├── fetch.ts        # fetch 래퍼 (인터셉터, 에러 핸들링)
    │   └── sse.ts          # EventSource 래퍼 (SSE 연결 관리)
    ├── lib/
    │   ├── cn.ts           # tailwind-merge + clsx
    │   └── map/            # OpenLayers, Leaflet 헬퍼
    ├── store/              # 앱 전역 Zustand store (auth, theme 등)
    └── config/             # 상수, 환경변수
```
