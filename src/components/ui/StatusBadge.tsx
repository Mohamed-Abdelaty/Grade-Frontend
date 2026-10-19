import { Badge } from './Badge'

type Tone = 'gray' | 'green' | 'red' | 'yellow' | 'blue'

const tones: Record<string, Tone> = {
  active: 'green',
  success: 'green',
  running: 'blue',
  queued: 'gray',
  draft: 'gray',
  failed: 'red',
  cancelled: 'yellow',
}

export function StatusBadge({ status }: { status: string }) {
return (
  <Badge tone={tones[status] ?? 'gray'} pulse={status === 'running'}>
    {status}
  </Badge>
)}