// Types لجدولة البايبلاين (Schedules)
export interface Schedule {
  id: string
  pipeline_id: string
  cron: string
  timezone: string
  enabled: boolean
  next_run_at: string
  last_run_status: 'succeeded' | 'failed' | 'pending'
}

// Types لمركز الإشعارات (Notifications)
export interface NotificationItem {
  id: string
  type: 'run_failed' | 'run_succeeded' | 'schedule_missed'
  title: string
  body: string
  run_id: string | null
  read: boolean
  created_at: string
}

// Types لمعرض القوالب (Templates)
export interface PipelineTemplate {
  id: string
  name: string
  category: 'ETL' | 'Analytics' | 'Sync'
  description: string
  config: Record<string, unknown>
  usage_count: number
}

// Types لسجل العمليات (Audit Log)
export interface AuditEvent {
  id: string
  actor: string
  action: string
  target_type: string
  target_id: string
  ip: string
  created_at: string
}

// Types لمفاتيح API Keys
export interface ApiKey {
  id: string
  name: string
  prefix: string
  scopes: string[]
  last_used_at: string | null
  expires_at: string | null
  status: 'active' | 'revoked'
}