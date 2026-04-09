# 03. 백엔드 서비스

- 우선순위: 높음
- 선행 조건: 02-backend-infra 완료 (Java 전환 완료 상태)
- 테스트 현황: 없음

## 진행 현황

- [ ] 03-0. 특성화 테스트 작성
- [ ] 03-1. DisasterHistoryService 로직 버그 수정
- [ ] 03-2. DisasterHistoryService 책임 분리
- [ ] 03-3. DisasterHistoryController 정리
- [ ] 03-4. EventService 개선
- [ ] 03-5. UserService N+1 HTTP 해결 및 정리

## 상세

### 03-0. 특성화 테스트 작성

대상 파일:
- `DisasterHistoryService.kt` -- 테스트 작성 선행 (파일시스템/HTTP 의존성이 있어 모킹 전략 필요)
- `EventService.kt`
- `UserService.kt`

작성 방식: 서비스 단위 테스트. 외부 의존성(파일시스템, HTTP, 소켓)은 인터페이스 추출 후 목킹.

### 03-1. DisasterHistoryService 로직 버그 수정

현재 문제:
- `===` 참조 비교 (107~108줄): Int 박싱 시 참조 불일치 가능 -> `==` 로 변경
- `||` 조건 오류 (145줄): `pwd != "" || pwd != null` 항상 true -> `&&`로 변경
- 의미없는 try-catch (9개 메서드): `catch(e) { throw e }` 노이즈 제거

변경 방향:
- 버그 3건 즉시 수정
- 불필요한 try-catch 전부 제거

### 03-2. DisasterHistoryService 책임 분리

현재 문제 (God Service -- 322줄, 27 imports):
- 재난이력 CRUD + 파일 저장 + CCTV 매핑 + 비디오 매핑 + SMS 발송 + 암호화

변경 방향:
- `DisasterHistoryFileService` 추출 (파일 저장/다운로드)
- `DisasterHistoryCctvService` 추출 (CCTV 매핑 CRUD)
- `DisasterHistoryVideoService` 추출 (비디오 매핑 CRUD)
- SMS 발송 로직은 별도 `SmsService`로 분리
- 하드코딩된 전화번호 (`031-613-1392`) 설정 파일로 이전
- `System.getenv("DST_HOME")` -> `@Value` 전환

### 03-3. DisasterHistoryController 정리

현재 문제:
- 파일 입출력 로직이 컨트롤러에 직접 존재
- `fileLocation` nullable 필드 중복 언박싱
- 메서드명 오타 (`faveDisasterHistoryVideoMappings`)
- 주석처리된 CCTV 엔드포인트 46줄 잔존

변경 방향:
- 파일 다운로드 로직을 서비스로 위임
- 오타 수정, 데드코드 제거
- `@RequestPart` 어노테이션 추가

### 03-4. EventService 개선

현재 문제:
- 하드코딩된 날짜 (`20250501000000`)
- `SocketTempSendProcImpl` 직접 인스턴스화 (DI 우회)
- 생성자 주입 + `@Autowired` 필드 주입 혼용
- 트랜잭션 불완전 (DB update 후 소켓 실패 시 롤백 없음)

변경 방향:
- 날짜 기준값 설정 파일로 이전 또는 `LocalDate.now()` 복원
- 02-3에서 추출한 인터페이스로 DI 전환
- DI 스타일 생성자 주입으로 통일
- `@TransactionalEventListener`로 소켓 전송을 트랜잭션 후처리로 분리

### 03-5. UserService N+1 HTTP 해결 및 정리

현재 문제:
- `getUsers()`에서 사용자 수만큼 복호화 API 개별 호출 (N+1 HTTP)
- `HttpConnection` (eseict common) vs `httpPost` (Fuel 기반) 두 가지 HTTP 라이브러리 혼용
- `@Value` 주입 필드 5개 분산

변경 방향:
- 복호화 API 배치 호출로 전환 (가능한 경우) 또는 캐싱
- HTTP 클라이언트 하나로 통일
- 암호화 설정을 `@ConfigurationProperties` 클래스로 묶기
