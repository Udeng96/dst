import { useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import useMobileStore from '@/entities/mobile/useMobileStore'
import { EVENT_QUERY_KEY } from '@/entities/event/useEvents'
import { MOBILE_QUERY_KEY } from '@/entities/mobile/useMobiles'
import { Mobile } from '@/entities/mobile/MobileType'

interface WebSocketConfig {
  url: string
  onMessage: (data: unknown) => void
  onOpen?: () => void
  onError?: (error: Event) => void
  reconnectDelayMs?: number
}

/**
 * 단일 WebSocket 연결을 관리하는 범용 훅.
 * 컴포넌트 unmount 시 자동으로 연결을 종료한다.
 * 예기치 않게 연결이 끊어지면 reconnectDelayMs 후 재연결을 시도한다.
 */
function useWebSocketConnection({
  url,
  onMessage,
  onOpen,
  onError,
  reconnectDelayMs = 1000,
}: WebSocketConfig) {
  const wsRef = useRef<WebSocket | null>(null)
  const isUnmountedRef = useRef(false)

  const connect = useCallback(() => {
    if (!url || isUnmountedRef.current) return

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      console.log(`[WebSocket] 연결됨: ${url}`)
      onOpen?.()
    }

    ws.onerror = (error) => {
      console.error(`[WebSocket] 오류: ${url}`, error)
      onError?.(error)
    }

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        onMessage(data)
      } catch {
        // JSON 파싱 실패 시 원시 데이터(e.g. 공유 URL) 처리
        onMessage(e.data)
      }
    }

    ws.onclose = (e) => {
      if (isUnmountedRef.current) return
      if (e.code === 1005) {
        console.log(`[WebSocket] 정상 종료: ${url}`)
      } else {
        console.warn(`[WebSocket] 비정상 종료, ${reconnectDelayMs}ms 후 재연결 시도: ${url}`, e.reason)
        setTimeout(() => {
          if (!isUnmountedRef.current) connect()
        }, reconnectDelayMs)
      }
    }
  }, [url, onMessage, onOpen, onError, reconnectDelayMs])

  useEffect(() => {
    isUnmountedRef.current = false
    if (typeof window !== 'undefined') {
      connect()
    }

    return () => {
      isUnmountedRef.current = true
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
        console.log(`[WebSocket] 연결 해제: ${url}`)
      }
    }
  }, [url])
}

/**
 * 이벤트 WebSocket 연결을 관리하는 훅.
 * 메시지 수신 시 이벤트 목록을 다시 조회하도록 react-query 캐시를 무효화한다.
 * 비-JSON 메시지(공유 URL)는 새 탭으로 연다.
 */
export function useEventWebSocket() {
  const queryClient = useQueryClient()
  const isProduction = import.meta.env.MODE === 'production'

  const url = isProduction
    ? `ws://${window.location.host}/dst/event`
    : `ws://localhost:22223/dst/event`

  useWebSocketConnection({
    url,
    onMessage: (data) => {
      if (typeof data === 'string') {
        // 공유 링크 전달
        window.open(`http://${window.location.host}/dst/share/${data}`, '_blank')
        return
      }
      console.log('[WebSocket] 이벤트 메시지:', data)
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY.list() })
    },
  })
}

/**
 * 모바일 WebSocket 연결을 관리하는 훅.
 * 메시지 수신 시 모바일 목록을 다시 조회하도록 react-query 캐시를 무효화한다.
 */
export function useMobileWebSocket() {
  const queryClient = useQueryClient()
  const isProduction = import.meta.env.MODE === 'production'

  const url = isProduction ? `ws://${window.location.host}/dst/mobile/live` : ''

  // 개발 환경에서는 URL이 없으므로 연결하지 않음
  if (!url) return

  useWebSocketConnection({
    url,
    onMessage: (data) => {
      console.log('[WebSocket] 모바일 메시지:', data)
      queryClient.invalidateQueries({ queryKey: MOBILE_QUERY_KEY.live() })
    },
  })
}
