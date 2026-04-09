# 01. 보안

- 우선순위: 높음
- 선행 조건: Phase 0 (테스트 안전망)
- 테스트 현황: 없음

## 진행 현황

- [x] 01-0. 특성화 테스트 작성
- [x] 01-1. TokenInterceptor 인증 우회 버그 수정
- [x] 01-2. DisasterHistoryController 인증 로직 복원
- [x] 01-3. 개발/운영 모드 전환 방식 개선

## 상세

### 01-0. 특성화 테스트 작성

대상 파일:
- `TokenInterceptor.kt`
- `DisasterHistoryController.kt`

작성 방식: 현재 동작(버그 포함)을 먼저 테스트로 고정한 뒤, 버그 수정 후 테스트를 함께 변경.

### 01-1. TokenInterceptor 인증 우회 버그 수정

현재 문제:
- `response.sendError(HttpStatus.UNAUTHORIZED.value())` 후 `return true` 반환
- 인증 실패해도 요청이 컨트롤러까지 넘어감

변경 방향:
- `sendError` 후 `return false`로 변경하여 요청 차단
- 인증 실패 시 로깅 추가

### 01-2. DisasterHistoryController 인증 로직 복원

현재 문제:
- `@PostMapping` 핸들러에서 `session.getAttribute(TOKEN_KEY)` 인증 코드가 전체 주석처리됨
- 누구나 재난이력을 생성/수정/삭제 가능한 상태

변경 방향:
- 인증 로직 주석 해제 및 정상화
- TokenInterceptor와 일관된 인증 흐름 확보

### 01-3. 개발/운영 모드 전환 방식 개선

현재 문제:
- `TokenInterceptor.kt`에서 `nodeEnv` 비교로 개발/운영 분기
- 소스코드 주석 토글로 모드 전환 (`if (nodeEnv.isNullOrEmpty() || nodeEnv == "development")`)
- 배포 시 실수로 운영에 개발 모드 노출 위험

변경 방향:
- Spring `@Profile("development")` 또는 `@Value("\${spring.profiles.active}")` 활용
- 주석 토글 방식 제거
