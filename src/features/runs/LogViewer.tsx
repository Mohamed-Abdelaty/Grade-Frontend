import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { LogLevel, LogLine } from '@/types/run'

const levelColor: Record<LogLevel, string> = {
  DEBUG: 'text-gray-500',
  INFO: 'text-blue-600 dark:text-blue-400',
  WARN: 'text-yellow-600 dark:text-yellow-400',
  ERROR: 'text-red-600 dark:text-red-400',
}

const order: Record<LogLevel, number> = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 }

type Filter = 'ALL' | LogLevel

export function LogViewer({ logs }: { logs: LogLine[] }) {
  const [filter, setFilter] = useState<Filter>('ALL')
  const [paused, setPaused] = useState(false)
  const [frozen, setFrozen] = useState<LogLine[]>([])
  const endRef = useRef<HTMLDivElement>(null)

  const source = paused ? frozen : logs
  const visible = useMemo(
    () => (filter === 'ALL' ? source : source.filter((l) => order[l.level] >= order[filter])),
    [source, filter],
  )

  useEffect(() => {
    if (!paused) endRef.current?.scrollIntoView({ block: 'end' })
  }, [visible, paused])

  function togglePause() {
    if (!paused) setFrozen(logs)
    setPaused(!paused)
  }

  return (
    <section aria-label="Run logs" className="flex flex-col gap-2">
      <div className="flex items-end gap-3">
        <h2 className="mr-auto text-lg font-semibold">Logs</h2>
        <Select
          label="Level"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
          options={[
            { value: 'ALL', label: 'All' },
            { value: 'DEBUG', label: 'Debug+' },
            { value: 'INFO', label: 'Info+' },
            { value: 'WARN', label: 'Warn+' },
            { value: 'ERROR', label: 'Error' },
          ]}
        />
        <Button variant="secondary" onClick={togglePause}>
          {paused ? 'Resume' : 'Pause'}
        </Button>
      </div>

      <div
        role="log"
        aria-live="off"
        tabIndex={0}
        className="h-80 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3 font-mono text-xs dark:border-gray-700 dark:bg-gray-950"
      >
        {visible.length === 0 && <p className="text-gray-500">No logs yet…</p>}
        {visible.map((l) => (
          <div key={l.id} className="animate-log-in whitespace-pre-wrap">
            <span className="text-gray-500">{new Date(l.timestamp).toLocaleTimeString()} </span>
            <span className={`font-semibold ${levelColor[l.level]}`}>{l.level.padEnd(5)} </span>
            <span>{l.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </section>
  )
}