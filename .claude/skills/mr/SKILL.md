---
name: mr
description: 타겟 브랜치 대비 현재 브랜치의 커밋을 분석하여 MR 메시지를 생성한다. 사용자가 "MR 올리자", "MR 메시지 만들어줘", "merge request 생성" 등을 요청하면 이 skill을 사용한다.
---

## 사전 준비 (최초 1회)

### 1. glab 설치
```bash
brew install glab
```

### 2. GitLab 인증
GitLab → 우측 상단 프로필 → **Edit profile** → **Access Tokens** → `api` 스코프 체크 후 토큰 생성

```bash
glab auth login \
  --hostname <GITLAB_HOST> \
  --token <YOUR_TOKEN> \
  --api-protocol http \
  --git-protocol http
```

> `<GITLAB_HOST>` 예시: `210.97.42.250:5002`

### 3. 인증 확인
```bash
glab auth status
```
아래 항목이 모두 체크되면 준비 완료:
- `✓ Logged in to <host> as <username>`
- `✓ API calls are made over http protocol`
- `✓ Git operations configured to use http protocol`

### 주의사항 — fork repo에서 `glab mr create` 버그
이 프로젝트는 fork repo이므로 `glab mr create` 명령어 사용 시 패닉이 발생한다.
반드시 아래 MR 생성 절차대로 `glab api`를 사용한다.

---

## 인자

- `$ARGUMENTS`: 타겟 브랜치 (기본값: `origin/develop`)

---

## 절차

### Step 1. 변경사항 분석
```bash
git fetch origin
git log --oneline <target>..HEAD
git diff --stat <target>...HEAD
```
필요하면 변경된 파일 내용을 읽어서 맥락 파악

### Step 2. MR 메시지 작성 후 사용자 확인
아래 형식으로 작성하고 사용자에게 보여준 뒤 확인을 받는다.

### Step 3. Reviewer 확인
"Reviewer를 지정할 사람이 있나요?" 라고 물어본다.

### Step 4. MR 생성
프로젝트 ID와 assignee ID를 확인한 뒤 `glab api`로 생성한다.

```bash
# 프로젝트 ID 확인
glab api projects/<namespace>%2F<repo> | python3 -c "import sys,json; d=json.load(sys.stdin); print('project_id:', d['id'])"

# 유저 ID 확인 (assignee/reviewer)
glab api users?username=<username> | python3 -c "import sys,json; d=json.load(sys.stdin); print('user_id:', d[0]['id'])"

# MR 생성
glab api projects/<project_id>/merge_requests \
  --method POST \
  -f source_branch="<source>" \
  -f target_branch="<target>" \
  -f title="<title>" \
  -f "description=<description>" \
  -f assignee_id=<assignee_id> \
  -f reviewer_ids[]=<reviewer_id> \  # reviewer가 있을 때만 포함
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('web_url', d.get('message', d)))"
```

---

## MR 메시지 형식

아래 기본 구조를 반드시 포함한다:

```
## 요약
- 핵심 변경사항 bullet 1~3줄

---

## 변경 내역
### 백엔드
- 변경 내용 (bullet 리스트, 간결하게)

### 프론트엔드
- 변경 내용 (bullet 리스트, 간결하게)
```

변경이 백엔드 또는 프론트엔드 한쪽에만 있으면 해당 카테고리만 작성한다.

## 조건부 섹션

아래 섹션은 해당 사항이 있을 때만 `---` 구분선과 함께 추가한다:

- `## 주의사항` — 환경변수/DB 마이그레이션/설정 변경, 호환성/사이드이펙트가 있을 때
- `## 리뷰어 참고사항` — 리뷰 시 특별히 확인해야 할 포인트가 있을 때
- `## 관련 이슈` — GitLab/Jira 이슈 번호가 있을 때

## 작성 규칙

- 변경 내역은 bullet 리스트로 간결하게 작성 (커밋에 상세 내역이 있으므로 중복 서술 금지)
- 버전 변경은 인라인 코드로 표기 (예: `42.2.20` → `42.7.5`)