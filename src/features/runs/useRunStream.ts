import { useCallback, useEffect, useRef, useState } from 'react'
import type { LogLine, RunStatus, WsMessage } from '@/types/run'

export type ConnectionState = 'connecting' | 'open' | 'reconnecting' | 'closed'

interface StreamState {
  logs: LogLine[]
  progress: number | null
  records: number | null
  status: RunStatus | null
  socketState: ConnectionState
}

export interface RunStream {
  logs: LogLine[]
  progress: number | null
  records: number | null
  status: RunStatus | null
  connection: ConnectionState
}

const MAX_LOGS = 2000
const MAX_RETRY_DELAY = 15_000
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function wsUrl(runId: string): string {
  const base =
    (import.meta.env.VITE_WS_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string).replace(/^http/, 'ws')
  return `${base}/ws/runs/${runId}`
}

// مصدر وهمي: بيطلّع رسائل بنفس شكل الـ WebSocket
function startMockStream(onMessage: (m: WsMessage) => void): () => void {
  let n = 0
  const levels = ['INFO', 'INFO', 'DEBUG', 'WARN', 'INFO', 'ERROR'] as const
  const timer = setInterval(() => {
    n++
    onMessage({
      type: 'log',
      level: levels[n % levels.length],
      message: `Processed batch #${n}`,
      timestamp: new Date().toISOString(),
    })
    onMessage({
      type: 'progress',
      progress: Math.min(100, 35 + n * 3),
      records_processed: 1200 + n * 250,
    })
    if (n >= 20) {
      onMessage({ type: 'status', status: 'success' })
      clearInterval(timer)
    }
  }, 800)
  return () => clearInterval(timer)
}

export function useRunStream(runId: string, enabled: boolean): RunStream {
  const [state, setState] = useState<StreamState>({
    logs: [],
    progress: null,
    records: null,
    status: null,
    socketState: 'connecting',
  })
  const nextId = useRef(1)

  const handle = useCallback((m: WsMessage) => {
    setState((s) => {
      if (m.type === 'log') {
        const line: LogLine = {
          id: nextId.current++,
          timestamp: m.timestamp,
          level: m.level,
          message: m.message,
        }
        return { ...s, logs: [...s.logs, line].slice(-MAX_LOGS) }
      }
      if (m.type === 'progress') {
        return { ...s, progress: m.progress, records: m.records_processed }
      }
      return { ...s, status: m.status }
    })
  }, [])

  useEffect(() => {
    if (!enabled) return

    if (USE_MOCK) return startMockStream(handle)

    let socket: WebSocket | null = null
    let retry = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let disposed = false

    const connect = () => {
      socket = new WebSocket(wsUrl(runId))
      socket.onopen = () => {
        retry = 0
        setState((s) => ({ ...s, socketState: 'open' }))
      }
      socket.onmessage = (ev: MessageEvent<string>) => {
        try {
          handle(JSON.parse(ev.data) as WsMessage)
        } catch {
          // رسالة مش JSON: نتجاهلها
        }
      }
      socket.onclose = () => {
        if (disposed) return
        setState((s) => ({ ...s, socketState: 'reconnecting' }))
        const delay = Math.min(MAX_RETRY_DELAY, 1000 * 2 ** retry++)
        timer = setTimeout(connect, delay)
      }
    }
    connect()

    return () => {
      disposed = true
      clearTimeout(timer)
      socket?.close()
    }
  }, [runId, enabled, handle])

  let connection: ConnectionState
  if (!enabled) connection = 'closed'
  else if (USE_MOCK) connection = state.status === 'success' ? 'closed' : 'open'
  else connection = state.socketState

  return {
    logs: state.logs,
    progress: state.progress,
    records: state.records,
    status: state.status,
    connection,
  }
}