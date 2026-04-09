# 08. 백엔드 Kotlin -> Java 전환

- 우선순위: 높음
- 선행 조건: 01-security 완료
- 테스트 현황: 없음

## 진행 현황

- [ ] 08-0. 특성화 테스트 작성
- [ ] 08-1. build.gradle.kts -> build.gradle 전환 및 의존성 정리
- [ ] 08-2. domain 레이어 전환 (entity, dto)
- [ ] 08-3. repository 레이어 전환
- [ ] 08-4. service 레이어 전환
- [ ] 08-5. controller 레이어 전환
- [ ] 08-6. config 레이어 전환 (database, interceptor, websocket, web)
- [ ] 08-7. proc 레이어 전환 (소켓 관련)
- [ ] 08-8. util, constants 전환 및 정리

## 상세

### 08-0. 특성화 테스트 작성

대상: API 엔드포인트 스모크 테스트 (호출 -> 응답 형태 확인)
작성 방식: Java로 작성. 전환 전후 API 응답이 동일한지 검증하는 안전망.

### 08-1. build.gradle.kts -> build.gradle 전환 및 의존성 정리

현재 문제:
- `build.gradle.kts` (Kotlin DSL)
- Kotlin 관련 플러그인: `kotlin("jvm")`, `kotlin("plugin.serialization")`, `kotlin("plugin.spring")`, `kotlin.plugin.jpa`, `kotlin.plugin.allopen`
- `kotlin-reflect`, `kotlin-stdlib-jdk8` 의존성
- 로컬 절대경로 하드코딩 (71~72줄)
- `kotlinx-serialization-json` 사용

변경 방향:
- `build.gradle` (Groovy DSL)로 전환
- Kotlin 플러그인 전부 제거
- `kotlin-reflect`, `kotlin-stdlib-jdk8` 제거
- `kotlinx-serialization-json` -> Jackson (이미 Spring Boot에 포함)
- `allOpen` JPA 설정 제거 (Java는 기본 open)
- 로컬 절대경로를 프로젝트 상대경로로 수정
- JVM target: 현재 1.8 유지 (Spring Boot 2.4.2 호환)

### 08-2. domain 레이어 전환 (entity, dto)

대상 (20개 파일):
- `domain/entity/dst/` -- DisasterHistory, DisasterHistoryCctvMapping, DisasterHistoryFileMapping, DisasterHistoryVideoMapping, MonMbDesc
- `domain/entity/rino/` -- Department, Event, EventInfo, Group, Organization, User, VwIocEvetGdInfoWithZn
- `domain/entity/xeus/` -- Cctv
- `domain/entity/xroshot/` -- TtbSms
- `domain/dto/` -- UserInfo, Receiver, EventForSend, EventRequest, GeneralMessage, MobileInfo, oms/*, video/*, vworld/*

변경 방향:
- Kotlin data class -> Java class (Lombok `@Data` 또는 record 사용)
- `@Serializable` (kotlinx) -> Jackson `@JsonProperty` (필요 시)
- nullable 타입 (`String?`) -> Java null 처리 (Optional 또는 null check)

### 08-3. repository 레이어 전환

대상 (14개 파일):
- `repository/dst/` -- DisasterHistoryRepository, DisasterHistoryCctvMappingRepository 등
- `repository/rino/` -- EventRepository, UserRepository 등
- `repository/xeus/` -- CctvRepository
- `repository/xroshot/` -- SmsEm

변경 방향:
- Kotlin interface -> Java interface
- `@Query` 어노테이션 유지
- SmsEm (EntityManager 직접 사용) -> Java로 변환

### 08-4. service 레이어 전환

대상 (11개 파일):
- DisasterHistoryService, EventService, EventStatService, UserService
- CctvService, DepartmentService, GroupService, MobileService
- OrganizationService, VideoService, VworldService

변경 방향:
- Kotlin class -> Java class
- `lateinit var` -> 생성자 주입 (`@RequiredArgsConstructor` + `final` 필드)
- Kotlin 확장 함수, scope 함수 (`let`, `apply`, `also`) -> Java 패턴
- `companion object` -> static 멤버
- null safety (`?.`, `?:`, `!!`) -> Java null 처리

### 08-5. controller 레이어 전환

대상 (11개 파일):
- ReactController, DisasterHistoryController, EventController, EventStatController
- UserController, CctvController, DepartmentController, GroupController
- MobileController, OrganizationController, VideoController, VworldController, AddressApiController

변경 방향:
- Kotlin class -> Java class
- 어노테이션 유지 (`@RestController`, `@RequestMapping` 등)
- 응답 형태(ResponseEntity) 동일하게 유지 -- API 호환성 보장

### 08-6. config 레이어 전환

대상 (9개 파일):
- `config/database/` -- 4개 DataContextConfig
- `config/interceptor/` -- TokenInterceptor
- `config/web/` -- WebConfig
- `config/websocket/` -- WebSocketConfig, EventWebsocketHandler, MobileWebsocketHandler, WebSocketHandler
- `config/properties/` -- ApiProperties

변경 방향:
- `companion object` 로깅 -> static logger
- `NamedKLogging` -> `LoggerFactory.getLogger()`
- WebSocket sessionList `mutableListOf()` -> `CopyOnWriteArrayList` (02-4와 연계)

### 08-7. proc 레이어 전환

대상 (6개 파일):
- SocketTempSendProcImpl
- rinoEvent/rcv/ -- RinoEventSocketHandler, RinoEventSocketServer
- rinoEvent/rcv/codec/ -- RinoEventServerMessageDecoder, RinoEventServerMessageEncoder
- rinoEvent/rcv/queue/ -- SocketMsgQueue, SocketMsgQueuePolling, SocketMobileMsgQueuePolling

변경 방향:
- Netty 핸들러/코덱 Kotlin -> Java
- BlockingQueue 패턴 유지

### 08-8. util, constants 전환 및 정리

대상 (3개 파일):
- DstConstants.kt -> DstConstants.java
- HeaderUtil.kt -> HeaderUtil.java
- HttpHelper.kt -> HttpHelper.java

변경 방향:
- `const val` -> `public static final`
- Kotlin object -> Java class with static methods
- DstApplication.kt -> DstApplication.java (`@SpringBootApplication`)
