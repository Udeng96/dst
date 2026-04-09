# Plan — 프론트엔드

## 기술 스택

| 항목 | 기술 |
|---|---|
| 프레임워크 | React |
| 언어 | TypeScript |
| 아키텍처 | Feature Sliced Design (FSD) |
| 스타일 | TailwindCSS + tailwind-merge + clsx |
| 지도 | OpenLayers |
| 상태관리 | Zustand (전역), TanStack Query (서버 상태) |
| 폼 | react-hook-form + Zod |
| HTTP | native fetch 래퍼 (커스텀 구현) |
| 실시간 | EventSource (SSE) |
| 패키지 매니저 | pnpm |
| 코드품질 | ESLint, Prettier, husky, lint-staged |

---

## FSD 레이어 원칙

```
app → pages → widgets → features → entities → shared
```

- 상위 레이어는 하위 레이어만 import 가능
- 같은 레이어 내 slice 간 cross-import 금지
- Next.js `app/` 디렉토리는 라우팅만 담당 — 실제 페이지 조합은 `pages/` 레이어에서

---

## 디렉토리 구조

```
src/
├── app/                              # Next.js App Router (라우팅만)
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx             # → LoginPage re-export
│   ├── (main)/
│   │   └── page.tsx                 # → MainPage re-export
│   ├── layout.tsx                   # 전역 레이아웃
│   └── providers.tsx                # QueryClient, Zustand 등 Provider
│
├── pages/                           # [FSD] 페이지 조합
│   ├── main/
│   │   └── index.tsx                # Widgets 조합 → 지도 메인 화면
│   └── login/
│       └── index.tsx                # 로그인 화면 조합
│
├── widgets/                         # [FSD] 독립적인 대형 UI 블록
│   ├── map/
│   │   ├── ui/
│   │   │   ├── MapContainer.tsx     # OpenLayers 지도 초기화 및 레이어 주입
│   │   │   └── MapPopup.tsx         # 피처 클릭 팝업 컨테이너
│   │   └── index.ts
│   ├── sidebar/
│   │   ├── ui/
│   │   │   └── Sidebar.tsx          # 검색 + 상세 패널 조합
│   │   └── index.ts
│   └── layer-panel/
│       ├── ui/
│       │   └── LayerPanel.tsx       # 레이어 on/off 패널 전체
│       └── index.ts
│
├── features/                        # [FSD] 사용자 인터랙션 단위
│   ├── bus-search/                  # 버스/정류장 검색
│   │   ├── ui/
│   │   │   ├── BusSearchInput.tsx
│   │   │   └── BusSearchResults.tsx
│   │   ├── model/
│   │   │   └── useBusSearch.ts      # 검색 로직 + TanStack Query
│   │   └── index.ts
│   ├── bus-route-view/              # 노선 선택 → 지도 표시
│   │   ├── ui/
│   │   │   ├── BusRouteLayer.tsx    # OL VectorLayer
│   │   │   └── BusRouteDetail.tsx   # 사이드 상세 패널
│   │   ├── model/
│   │   │   └── useBusRouteView.ts
│   │   └── index.ts
│   ├── bus-stop-view/               # 정류장 선택 → 도착 정보
│   │   ├── ui/
│   │   │   ├── BusStopLayer.tsx
│   │   │   ├── BusStopDetail.tsx
│   │   │   └── BusStopPopup.tsx
│   │   ├── model/
│   │   │   └── useBusStopView.ts
│   │   └── index.ts
│   ├── bus-realtime/                # 실시간 버스 위치 SSE
│   │   ├── ui/
│   │   │   └── BusPositionLayer.tsx
│   │   ├── model/
│   │   │   └── useBusPosition.ts    # SSE 구독
│   │   └── index.ts
│   ├── traffic-layer/               # 교통이벤트 SSE + 레이어
│   │   ├── ui/
│   │   │   ├── TrafficLayer.tsx
│   │   │   └── TrafficEventPopup.tsx
│   │   ├── model/
│   │   │   └── useTrafficEvents.ts  # SSE 구독
│   │   └── index.ts
│   ├── favorite-manage/             # 즐겨찾기 추가/수정/삭제
│   │   ├── ui/
│   │   │   ├── AddFavoriteModal.tsx
│   │   │   └── CategoryManager.tsx
│   │   ├── model/
│   │   │   └── useFavoriteManage.ts
│   │   └── index.ts
│   ├── favorite-layer/              # 즐겨찾기 레이어 렌더링
│   │   ├── ui/
│   │   │   └── FavoriteLayer.tsx    # 분류별 VectorLayer
│   │   ├── model/
│   │   │   └── useFavoriteLayer.ts
│   │   └── index.ts
│   ├── layer-toggle/                # 레이어 활성화 상태 관리
│   │   ├── ui/
│   │   │   ├── TrafficLayerItem.tsx
│   │   │   └── FavoriteCategoryItem.tsx
│   │   ├── model/
│   │   │   └── layerStore.ts        # Zustand
│   │   └── index.ts
│   └── auth/                        # 구글 로그인/로그아웃
│       ├── ui/
│       │   ├── LoginButton.tsx
│       │   └── LogoutButton.tsx
│       ├── model/
│       │   └── authStore.ts         # Zustand
│       └── index.ts
│
├── entities/                        # [FSD] 비즈니스 도메인 모델
│   ├── bus/
│   │   ├── api/
│   │   │   └── busApi.ts            # TanStack Query 훅 + axios 호출
│   │   ├── model/
│   │   │   └── types.ts             # BusRoute, BusStop, BusPosition
│   │   └── index.ts
│   ├── traffic/
│   │   ├── api/
│   │   │   └── trafficApi.ts
│   │   ├── model/
│   │   │   └── types.ts             # TrafficEvent
│   │   └── index.ts
│   ├── favorite/
│   │   ├── api/
│   │   │   └── favoriteApi.ts
│   │   ├── model/
│   │   │   └── types.ts             # FavoriteCategory, FavoriteItem
│   │   └── index.ts
│   └── user/
│       ├── model/
│       │   └── types.ts             # User
│       └── index.ts
│
└── shared/                          # [FSD] 공통 유틸/UI킷
    ├── ui/                          # Button, Input, Modal, Badge 등
    ├── api/
    │   └── fetchClient.ts           # native fetch 래퍼 (토큰 주입, 토큰 갱신, 에러 처리)
    ├── lib/
    │   ├── cn.ts                    # tailwind-merge 유틸
    │   └── map/
    │       ├── olConfig.ts          # OpenLayers 초기 설정
    │       └── layerFactory.ts      # VectorLayer 생성 헬퍼
    └── config/
        └── constants.ts             # API base URL 등
```

---

## 주요 화면 구성

```
+------------------------------------------+
|  [검색창]              [레이어 패널 토글] |
+------------+-----------------------------+
|            |                             |
| 사이드패널  |         지도 (OpenLayers)    |
| - 검색결과 |                             |
| - 노선상세 |   [교통이벤트 마커]          |
| - 정류장   |   [버스 위치 아이콘]         |
|   상세     |   [즐겨찾기 마커]           |
|            |                             |
+------------+-----------------------------+
```

레이어 패널:
```
레이어 패널
├── 교통정보
│   ├── [x] 교통사고
│   ├── [x] 돌발상황
│   ├── [ ] 교통혼잡
│   └── [ ] 공사구간
└── 내 즐겨찾기 (로그인 시)
    ├── [x] 출근길  (색상 변경 가능)
    └── [x] 자주가는 곳
```

---

## 상태 관리 설계

### layerStore — `features/layer-toggle/model/layerStore.ts`
```ts
interface LayerState {
  traffic: {
    accident: boolean
    congestion: boolean
    construction: boolean
    incident: boolean
  }
  favoriteCategories: Record<string, boolean>  // categoryId → visible
  activeBusRouteId: string | null
  activeStopId: string | null
}
```

### authStore — `features/auth/model/authStore.ts`
```ts
interface AuthState {
  user: User | null
  accessToken: string | null
}
```

### mapStore — `widgets/map/model/mapStore.ts`
```ts
interface MapState {
  olMap: Map | null
  center: [number, number]
  zoom: number
  selectedFeature: Feature | null
}
```

---

## SSE 구독 패턴

```ts
// features/bus-realtime/model/useBusPosition.ts
export function useBusPosition(routeId: string) {
  const [positions, setPositions] = useState<BusPosition[]>([])

  useEffect(() => {
    const es = new EventSource(`/api/sse/bus/${routeId}`)
    es.onmessage = (e) => setPositions(JSON.parse(e.data))
    return () => es.close()
  }, [routeId])

  return positions
}
```

---

## OpenLayers 레이어 전략

- 각 레이어는 독립적인 `VectorLayer`로 생성
- 레이어 on/off는 `layer.setVisible(boolean)` 처리 (React 재렌더링 없음)
- 버스 위치는 SSE 수신 시 `source.clear()` + `source.addFeatures()` 갱신
- 즐겨찾기 레이어는 분류별 별도 `VectorLayer` 생성 (색상 독립 적용)
- 마커 스타일은 레이어별 `StyleFunction`으로 정의

---

## Next.js App Router 연결 방식

```tsx
// src/app/(main)/page.tsx — 라우팅만, 로직 없음
import { MainPage } from '@/pages/main'
export default MainPage

// src/pages/main/index.tsx — 실제 조합
export function MainPage() {
  return (
    <>
      <MapContainer />
      <Sidebar />
      <LayerPanel />
    </>
  )
}
```

---

## native fetch 래퍼 설계

의존성 없이 native fetch를 래핑하여 인터셉터와 동일한 효과를 구현한다.
Server Component / Client Component 양쪽에서 모두 사용 가능하다.

```ts
// shared/api/fetchClient.ts

type FetchOptions = RequestInit & {
  skipAuth?: boolean  // 로그인 API 등 토큰 불필요한 경우
}

async function fetchClient<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, ...init } = options

  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  // 요청 전: 토큰 주입
  if (!skipAuth) {
    const token = getAccessToken()  // authStore에서 읽거나 쿠키에서 읽음
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  // 401: 토큰 갱신 후 1회 재시도
  if (res.status === 401 && !skipAuth) {
    const refreshed = await refreshAccessToken()
    if (!refreshed) {
      redirect('/login')
    }
    headers.set('Authorization', `Bearer ${getAccessToken()}`)
    return fetchClient<T>(path, { ...options, skipAuth: true })
  }

  if (!res.ok) {
    const error = await res.json()
    throw new FetchError(res.status, error.code, error.message)
  }

  return res.json() as Promise<T>
}

// 편의 메서드
export const api = {
  get:    <T>(path: string, opts?: FetchOptions) =>
            fetchClient<T>(path, { method: 'GET', ...opts }),
  post:   <T>(path: string, body: unknown, opts?: FetchOptions) =>
            fetchClient<T>(path, { method: 'POST', body: JSON.stringify(body), ...opts }),
  patch:  <T>(path: string, body: unknown, opts?: FetchOptions) =>
            fetchClient<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...opts }),
  delete: <T>(path: string, opts?: FetchOptions) =>
            fetchClient<T>(path, { method: 'DELETE', ...opts }),
}
```

### Server Component에서 사용

```ts
// Next.js 캐시 옵션을 그대로 사용 가능
const routes = await api.get<BusRoute[]>('/bus/routes', {
  next: { revalidate: 3600 }
})
```

### Client Component (TanStack Query)에서 사용

```ts
// entities/bus/api/busApi.ts
export const useBusRoutes = (keyword: string) =>
  useQuery({
    queryKey: ['busRoutes', keyword],
    queryFn: () => api.get<BusRoute[]>(`/bus/routes?q=${keyword}`),
  })
```
