---
name: commit
description: 변경사항을 분석하여 작업 분류별 커밋 목록을 제안하고, 사용자가 선택한 번호의 커밋을 수행한다
---

## 실행 절차

### Step 1. git add .

먼저 `git add .`을 실행하여 모든 변경사항을 stage에 올린다.
단, 아래 빌드 결과물은 stage에서 즉시 제외(unstage)한다:

**절대 stage에 올리지 않는 파일/디렉토리:**
- `dist/`, `build/`, `out/`, `.next/`, `target/`
- `*.class`, `*.jar`, `*.war`
- `node_modules/`
- `.gradle/`, `gradle/wrapper/gradle-wrapper.jar`
- `*.log`, `*.tmp`, `*.cache`
- `.env`, `.env.*` (`.env.example` 제외)

빌드 결과물이 stage에 포함된 경우 `git restore --staged <file>` 로 제외한 뒤 진행한다.

### Step 2. 변경사항 분석

`git diff --staged`로 staged 변경사항을 분석하고, 작업 성격에 따라 커밋 단위로 분류한다.

### Step 3. 커밋 목록 제안

아래 형식으로 번호를 붙여 커밋 목록을 사용자에게 보여준다.
커밋을 수행하지 않고 **목록만 출력**한 뒤 사용자의 선택을 기다린다.

```
다음 커밋을 제안합니다. 수행할 번호를 알려주세요.

1. feat : Surv NVR 플레이어 연동 추가
   📁 src/data/config/surv.ts, src/queries/surv/, ...

2. refactor : CCTV 플레이어 교체 (XeusPlayer → VoostPlayer)
   📁 src/components/gis/popup/facility/cctv/...

3. fix : SSE 연결 안정화
   📁 src/data/hooks/useSSE.ts, ...
```

### Step 4. 커밋 수행

사용자가 번호를 선택하면, 해당 번호의 커밋만 수행한다.
해당 커밋에 포함된 파일만 stage에 남기고 나머지는 임시로 unstage한 뒤 커밋한다.
커밋 완료 후 나머지 파일을 다시 stage에 올린다.

---

## 커밋 메시지 형식

```
type : 주 Title

1. 큰 내용
 - 상세 내용

2. 큰 내용
 - 상세 내용
```

### type
- `feat`: 새로운 기능 추가
- `refactor`: 기능 변경 없는 코드 개선
- `doc`: 문서 변경
- `design`: UI/스타일 변경
- `build`: 빌드, 설정, 의존성 변경
- `fix`: 버그 수정
- `hotfix`: 긴급 버그 수정

### 작성 규칙
- 주 Title: 변경의 핵심을 한 줄로 요약 (한국어)
- 본문: 변경 내용이 여러 가지일 경우 번호 목록으로 구분
- 각 항목의 상세 내용은 ` - `로 들여써서 기술
- 변경 내용이 단순하면 본문 생략 가능

---

## 주의사항

- `Co-Authored-By` 라인 절대 포함 금지
- staged 파일이 없으면 사용자에게 알린다
- Step 3에서 목록만 출력하고 커밋은 절대 먼저 수행하지 않는다
