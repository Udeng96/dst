import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainPage from './pages/MainPage'
import Popup from './widgets/popup/Popup'
import Loading from './widgets/loading/Loading'
import SharePage from './pages/SharePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const container = document.getElementById('root')
if (!container) throw new Error('root element를 찾을 수 없습니다.')

const root = createRoot(container)

root.render(
  <QueryClientProvider client={queryClient}>
    {/* 공통 컴포넌트 */}
    <Loading />
    <Popup />

    {/* 뷰 라우팅 */}
    <Router basename={'/dst'}>
      <Switch>
        <Route path={'/main'}>
          <MainPage />
        </Route>
        <Route path={'/share/:disasterHistoryId'}>
          <SharePage />
        </Route>
        <Route>
          <MainPage />
        </Route>
      </Switch>
    </Router>
  </QueryClientProvider>
)
