export type RunStatus = 'queued' | 'running' | 'success' | 'failed' | 'cancelled'

export interface Run {
  id: string
  pipeline_id: string
  pipeline_name: string
  status: RunStatus
  started_at: string
  duration_seconds: number | null
  records_processed: number
}

export interface DashboardStats {
  total_pipelines: number
  runs_today: number
  success_rate: number
}
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

export interface LogLine {
  id: number
  timestamp: string
  level: LogLevel
  message: string
}

export interface RunDetails extends Run {
  progress: number // 0-100
}

export type WsMessage =
  | { type: 'log'; level: LogLevel; message: string; timestamp: string }
  | { type: 'progress'; progress: number; records_processed: number }
  | { type: 'status'; status: RunStatus }