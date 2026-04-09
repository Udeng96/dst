# Plan — 백엔드

## 기술 스택

| 항목 | 기술 |
|---|---|
| 언어 | Java 17 |
| 프레임워크 | Spring Boot 3.x |
| 빌드 | Gradle |
| DB | PostgreSQL 14 + PostGIS |
| ORM | Spring Data JPA + QueryDSL 5.x (jakarta) + Hibernate Spatial |
| Cache | Redis 7 |
| 인증 | Spring Security + Google OAuth2 + JWT |
| 실시간 | SSE (Server-Sent Events) |
| 동시성 | Virtual Thread (Project Loom) |
| 아키텍처 | Hexagonal Architecture |

---

## 패키지 구조

```
com.traffic.platform
├── auth/
│   ├── adapter/
│   │   ├── in/web/          # OAuth2 콜백, 토큰 갱신 Controller
│   │   └── out/persistence/ # User JPA Repository
│   ├── application/
│   │   ├── port/in/         # LoginUseCase, TokenUseCase
│   │   ├── port/out/        # LoadUserPort, SaveUserPort, TokenStorePort
│   │   └── service/         # AuthService
│   └── domain/
│       └── User.java
│
├── bus/
│   ├── adapter/
│   │   ├── in/
│   │   │   ├── web/         # BusRouteController, BusStopController
│   │   │   └── sse/         # BusPositionSseController
│   │   └── out/
│   │       ├── persistence/ # BusRoute, BusStop JPA Repository
│   │       ├── redis/       # BusPositionRedisAdapter
│   │       └── client/      # 지자체 버스 API Client
│   ├── application/
│   │   ├── port/in/         # SearchBusRouteUseCase, SearchBusStopUseCase
│   │   ├── port/out/        # LoadBusPositionPort, SaveBusPositionPort
│   │   └── service/
│   └── domain/
│       ├── BusRoute.java
│       ├── BusStop.java
│       └── BusPosition.java
│
├── traffic/
│   ├── adapter/
│   │   ├── in/
│   │   │   ├── web/         # TrafficEventController
│   │   │   └── sse/         # TrafficEventSseController
│   │   └── out/
│   │       ├── persistence/
│   │       ├── redis/
│   │       └── client/      # 지자체 교통 API Client
│   ├── application/
│   │   ├── port/
│   │   └── service/
│   └── domain/
│       └── TrafficEvent.java  # sealed interface
│
├── favorite/
│   ├── adapter/
│   │   ├── in/web/          # FavoriteCategoryController, FavoriteItemController
│   │   └── out/persistence/
│   ├── application/
│   │   ├── port/
│   │   └── service/
│   └── domain/
│       ├── FavoriteCategory.java
│       └── FavoriteItem.java
│
├── integration/
│   └── scheduler/           # 지자체 API 폴링 스케줄러
│
└── infra/
    ├── redis/               # RedisConfig, RedisPubSubConfig
    ├── security/            # SecurityConfig, JwtFilter
    └── sse/                 # SseEmitterManager
```

---

## DB 스키마

### users
```sql
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    google_id   VARCHAR(100) UNIQUE NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

### favorite_category
```sql
CREATE TABLE favorite_category (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name          VARCHAR(100) NOT NULL,
    color         VARCHAR(7) NOT NULL DEFAULT '#3B82F6',  -- hex color
    display_order INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMP DEFAULT NOW()
);
```

### favorite_item
```sql
CREATE TABLE favorite_item (
    id          BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES favorite_category(id) ON DELETE CASCADE,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type   VARCHAR(20) NOT NULL,  -- BUS_STOP | CUSTOM_POINT
    item_id     VARCHAR(100),          -- 정류장 ID (CUSTOM_POINT는 null)
    alias       VARCHAR(100) NOT NULL,
    latitude    DOUBLE PRECISION NOT NULL,
    longitude   DOUBLE PRECISION NOT NULL,
    metadata    JSONB,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

### bus_route
```sql
CREATE TABLE bus_route (
    id          BIGSERIAL PRIMARY KEY,
    route_id    VARCHAR(100) UNIQUE NOT NULL,  -- 지자체 노선 ID
    route_no    VARCHAR(20) NOT NULL,          -- 버스 번호 (ex. "302")
    route_type  VARCHAR(20),
    start_stop  VARCHAR(100),
    end_stop    VARCHAR(100),
    updated_at  TIMESTAMP DEFAULT NOW()
);
```

### bus_stop
```sql
CREATE TABLE bus_stop (
    id          BIGSERIAL PRIMARY KEY,
    stop_id     VARCHAR(100) UNIQUE NOT NULL,  -- 지자체 정류장 ID
    stop_name   VARCHAR(200) NOT NULL,
    stop_no     VARCHAR(20),
    latitude    DOUBLE PRECISION NOT NULL,
    longitude   DOUBLE PRECISION NOT NULL,
    geom        GEOMETRY(Point, 4326),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bus_stop_geom ON bus_stop USING GIST(geom);
CREATE INDEX idx_bus_stop_name ON bus_stop USING GIN(to_tsvector('simple', stop_name));
```

### traffic_event
```sql
CREATE TABLE traffic_event (
    id          BIGSERIAL PRIMARY KEY,
    event_id    VARCHAR(100) UNIQUE NOT NULL,
    event_type  VARCHAR(30) NOT NULL,  -- ACCIDENT | CONGESTION | CONSTRUCTION | INCIDENT
    title       VARCHAR(500),
    latitude    DOUBLE PRECISION NOT NULL,
    longitude   DOUBLE PRECISION NOT NULL,
    geom        GEOMETRY(Point, 4326),
    started_at  TIMESTAMP,
    ended_at    TIMESTAMP,
    metadata    JSONB,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);
```

---

## Redis 키 설계

```
bus:position:{routeId}           → List<BusPositionDto> (JSON)  TTL: 30s
traffic:event:current            → List<TrafficEventDto> (JSON) TTL: 60s
user:jwt:blacklist:{jti}         → "1"                          TTL: 토큰 만료시간
sse:channel:bus                  → Pub/Sub 채널
sse:channel:traffic              → Pub/Sub 채널
```

---

## API 엔드포인트

### 인증
```
GET  /api/auth/google                  # Google OAuth2 리다이렉트
GET  /api/auth/google/callback         # OAuth2 콜백
POST /api/auth/refresh                 # Access Token 갱신
POST /api/auth/logout                  # 로그아웃 (JWT 블랙리스트)
GET  /api/auth/me                      # 내 정보
```

### 버스
```
GET  /api/bus/routes?q={keyword}       # 노선 검색
GET  /api/bus/routes/{routeId}         # 노선 상세 (경로, 정류장 목록)
GET  /api/bus/stops?q={keyword}        # 정류장 검색
GET  /api/bus/stops/{stopId}           # 정류장 상세 (경유 버스, 도착 정보)
GET  /api/bus/routes/{routeId}/positions  # 특정 노선 버스 위치
```

### 실시간 SSE
```
GET  /api/sse/bus/{routeId}            # 버스 위치 실시간 구독
GET  /api/sse/traffic                  # 교통이벤트 실시간 구독
```

### 교통정보
```
GET  /api/traffic/events               # 현재 교통이벤트 목록
GET  /api/traffic/events/{eventId}     # 이벤트 상세
```

### 즐겨찾기 (인증 필요)
```
GET    /api/favorites/categories             # 내 분류 목록
POST   /api/favorites/categories             # 분류 생성
PATCH  /api/favorites/categories/{id}        # 분류 수정 (이름, 색상)
DELETE /api/favorites/categories/{id}        # 분류 삭제
GET    /api/favorites/items                  # 내 즐겨찾기 전체
POST   /api/favorites/items                  # 즐겨찾기 추가
DELETE /api/favorites/items/{id}             # 즐겨찾기 삭제
```

---

## 실시간 데이터 흐름

```
[Scheduler] @Scheduled(fixedDelay = 5000)
    → 지자체 버스 API 호출 (WebClient)
    → BusPositionDto 변환
    → Redis SET bus:position:{routeId}
    → Redis PUBLISH sse:channel:bus (변경된 routeId 목록)

[SseEmitterManager]
    → Redis SUBSCRIBE sse:channel:bus
    → 구독 중인 routeId에 해당하는 SseEmitter에 전송
    → ping 실패 시 emitter 제거
```

---

## 스케줄러 주기 (임시 — 지자체 API 연계 확정 후 조정)

| 데이터 | 주기 |
|---|---|
| 버스 실시간 위치 | 5초 |
| 교통사고/돌발 | 30초 |
| 교통 혼잡 | 60초 |
| 정류장/노선 마스터 | 1일 1회 |

---

## TrafficEvent 도메인 모델 (Sealed Class)

```java
public sealed interface TrafficEvent
    permits AccidentEvent, CongestionEvent, ConstructionEvent, IncidentEvent {

    String eventId();
    double latitude();
    double longitude();
    LocalDateTime startedAt();
}
```

---

## Spring 기능 및 디자인 패턴

### Filter — `OncePerRequestFilter`

MDC 기반 요청 추적. Spring Security 앞단에서 동작.

```java
// 모든 요청에 traceId 부여 → 로그 파일에서 요청 단위 추적 가능
MDC.put("traceId", UUID.randomUUID().toString());
MDC.put("uri", request.getRequestURI());
MDC.put("method", request.getMethod());
```

- JWT 검증은 Spring Security Filter Chain이 담당 → Filter에서 중복 처리 금지
- CORS는 Spring Security 설정으로 처리

---

### ArgumentResolver — `@LoginUser`

컨트롤러에서 현재 로그인 사용자를 직접 주입받는 커스텀 어노테이션.
SecurityContext 접근 boilerplate를 완전히 제거한다.

```java
// 사용 예시
@GetMapping("/favorites")
public List<FavoriteItemDto> getFavorites(@LoginUser User user) { ... }

// 구현 위치: infra/security/LoginUserArgumentResolver.java
// SecurityContextHolder → Authentication → User 변환
```

---

### ControllerAdvice — 전역 예외 처리

도메인 예외를 HTTP 상태코드로 매핑하고 표준 에러 응답 포맷을 통일한다.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusRouteNotFoundException.class)  // → 404
    @ExceptionHandler(UnauthorizedException.class)       // → 401
    @ExceptionHandler(ConstraintViolationException.class) // → 400
}
```

표준 에러 응답 포맷:
```json
{
  "code": "BUS_NOT_FOUND",
  "message": "노선을 찾을 수 없습니다."
}
```

---

### AOP

두 가지 목적으로 도입한다.

**① 스케줄러 실행 추적** — 지자체 API 폴링 성능 및 수집 결과 로깅

```java
// @GovApiScheduler 어노테이션이 붙은 메서드에 적용
@Around("@annotation(GovApiScheduler)")
// 실행 시간, 수신 건수, 실패 여부 자동 기록
```

**② 서비스 레이어 예외 로깅** — 스택트레이스 포함 자동화

```java
@AfterThrowing(
    pointcut = "execution(* com.traffic..application.service.*.*(..))",
    throwing = "e"
)
public void logServiceException(Exception e) {
    log.error(e.getMessage(), e);  // 스택트레이스 포함 필수
}
```

---

### ApplicationEvent + @EventListener

도메인 이벤트 기반 비동기 처리. 서비스 레이어의 관심사를 분리한다.

```java
// 서비스에서 이벤트 발행
applicationEventPublisher.publishEvent(new FavoriteAddedEvent(userId, item));

// 리스너에서 비동기 처리 (SSE 알림, 통계 수집 등)
@EventListener
@Async
public void onFavoriteAdded(FavoriteAddedEvent event) { ... }
```

Redis Pub/Sub 발행도 EventListener에서 처리하여 서비스 레이어가 Redis에 직접 의존하지 않도록 한다.

---

### @Cacheable — Spring Cache + Redis

버스 노선/정류장 마스터 데이터는 자주 변경되지 않으므로 Redis에 캐싱하여 DB 부하를 줄인다.

```java
@Cacheable(value = "busRoute", key = "#routeId", cacheManager = "redisCacheManager")
public BusRouteDto getBusRoute(String routeId) { ... }

// 1일 1회 마스터 데이터 갱신 스케줄러 실행 시 캐시 무효화
@CacheEvict(value = "busRoute", allEntries = true)
public void refreshBusRouteMaster() { ... }
```

---

### @Async + Virtual Thread — 병렬 폴링

지자체 API가 여러 개일 때 병렬로 호출하여 전체 폴링 시간을 단축한다.

```java
@Async
public CompletableFuture<List<BusPosition>> fetchBusPositions(String routeId) { ... }

// 스케줄러에서 전체 노선 병렬 수집
List<CompletableFuture<?>> futures = routeIds.stream()
    .map(this::fetchBusPositions)
    .toList();
CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
```

Virtual Thread 활성화 시 @Async 스레드풀도 자동으로 가상 스레드를 사용한다.

---

### 기능 배치 요약

| 기능 | 위치 |
|---|---|
| `OncePerRequestFilter` | `infra/filter/MdcLoggingFilter.java` |
| `@LoginUser ArgumentResolver` | `infra/security/LoginUserArgumentResolver.java` |
| `@RestControllerAdvice` | `common/exception/GlobalExceptionHandler.java` |
| AOP 스케줄러 추적 | `infra/aop/GovApiSchedulerAspect.java` |
| AOP 예외 로깅 | `infra/aop/ServiceExceptionAspect.java` |
| ApplicationEvent 리스너 | 각 도메인 `adapter/in/event/` |
| `@Cacheable` 설정 | `infra/redis/CacheConfig.java` |
| `@Async` 설정 | `infra/async/AsyncConfig.java` |
