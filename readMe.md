# 재난상황전파 시스템

### 개요

인천시청 고도화 사업 중 개발된 재난상황전파 기능이 있었음

통영 사업에 위 내용과 같은 기능이 필요하여 안철환 과장님 지시로 독립된 서버로 만들게 됐음 

하지만 기존 소스의 품질이 너무 낮아 적당한 수준의 리팩토링을 진행하여 적용하고자 함

### 대략적인 구조

> Backend
>1. Kotlin
>
>2. Spring-boot
>
>3. JpaRepository
>
>4. REST API...

> Frontend
>
>1. Typescript
>
>2. React
>
>3. Redux (redux-toolkit, redux-saga)
>
>4. Styled components

### 실행 방법

> #### backend
>> 1. DST_HOME 경로 설정
>> 2. Spring-boot Application 실행(기본 포트는 9999)

> #### frontend
>> 1. front 경로로 이동 : cd src/main/web
>> 2. npm start(node 기본 포트는 3000)

### 배포 방법

> 1. gradle build 명령어 실행
> 2. build/lib/dst-0.0.1-SNAPSHOT.war 요놈이 배포된 파일
> 3. export DST_HOME `대충 홈경로`
> 4. java -jar dst-0.0.1-SNAPSHOT.war (기본 포트는 22222)
> 5. 위 front 및 back 작업 결과물이 함께 있을 것


### 프론트 배포 안될 경우(수동 프론트 배포 방법)
> 1. 터미널에서 front 폴더로 진입한다.
> 2. npm run build
> 3. build 폴더가 생기면 /src/main/resource에 맵핑해서 파일을 넣어준다
>  - index.htm2l --> template의 index.html 과 static의 index.html 전부 교체
>  - static폴더전체 --> static의 static 폴더 전체 교체
>  - asset-manifest.json , robots.txt 교체
> 4. 다시 build 명령어 실행

### 이슈발생 시

열심히 해결하면 된다