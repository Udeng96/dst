# 02. 백엔드 인프라

- 우선순위: 중간
- 선행 조건: 08-backend-java-migration 완료
- 테스트 현황: 없음

## 진행 현황

- [ ] 02-0. 특성화 테스트 작성
- [ ] 02-1. DB Config 4개 공통화
- [ ] 02-2. DstConstants 상수 외부화
- [ ] 02-3. SocketTempSendProcImpl 인터페이스 추출 및 DI 전환
- [ ] 02-4. WebSocket sessionList thread-safety 개선

## 상세

### 02-0. 특성화 테스트 작성

대상 파일:
- `DstDataContextConfig.kt` (DB 연결 확인)
- `SocketTempSendProcImpl.kt`
- `EventWebsocketHandler.kt`

작성 방식: input/output 고정 방식. DB Config는 DataSource 빈 생성 확인, Socket은 메시지 직렬화 확인.

### 02-1. DB Config 4개 공통화

현재 문제:
- `DstDataContextConfig`, `RinoDataContextConfig`, `XeusDataContextConfig`, `XroshotDataContextConfig` 4개 클래스가 98% 동일 구조
- 코드 스타일 비일관 (apply 내부 vs 외부 변수 선언)
- `hbm2ddl=update`가 dst에만 남아 있음 (운영 위험)

변경 방향:
- `AbstractDataContextConfig` 추상 클래스 추출
- prefix, dialect, basePackages를 파라미터로 받아 공통 처리
- `hbm2ddl=update` 제거 또는 프로파일 분리

### 02-2. DstConstants 상수 외부화

현재 문제:
- `EXTERNAL_URI`에 운영 서버 IP 하드코딩 (`http://211.226.13.56:18080/dst`)
- `CLIENT_CD`, `SITE_CD` 등 용도 불명확 상수

변경 방향:
- 운영 IP, 포트 등을 `application.yml`로 이전
- `@Value` 또는 `@ConfigurationProperties`로 주입
- 미사용 상수 정리

### 02-3. SocketTempSendProcImpl 인터페이스 추출 및 DI 전환

현재 문제:
- `EventService`에서 `SocketTempSendProcImpl(ip, port)` 직접 생성 -- DI 우회
- `send(GeneralMessage)`와 `send(String)` 100% 동일 구조 중복
- 클래스명에 "Temp" 포함 (임시 구현체)
- timeout 값 하드코딩

변경 방향:
- `SocketSendService` 인터페이스 정의
- 구현체를 Spring Bean으로 등록, `@Value`로 timeout 외부화
- 중복 `send` 메서드 통합

### 02-4. WebSocket sessionList thread-safety 개선

현재 문제:
- `EventWebsocketHandler`, `MobileWebsocketHandler`의 sessionList가 `companion object` 내 `mutableListOf()`
- synchronized 없이 다중 스레드에서 접근

변경 방향:
- `CopyOnWriteArrayList` 또는 `ConcurrentHashMap` 사용
- companion object에서 인스턴스 관리로 전환 (테스트 가능성 확보)
