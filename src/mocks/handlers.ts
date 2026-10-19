import { http, HttpResponse } from 'msw'
import type { Pipeline, PipelineStatus, PipelineSummary } from '@/types/pipeline'
import type { Run } from '@/types/run'

function makePipeline(id: string, name: string): Pipeline {
  return {
    id,
    name,
    version: 1,
    schedule: null,
    nodes: [
      { id: 'src_1', type: 'source', plugin: 'csv', config: { path: 'data/orders.csv' } },
      { id: 'tr_1', type: 'transform', plugin: 'filter', config: { expression: 'amount > 100' } },
      { id: 'snk_1', type: 'sink', plugin: 'postgres', config: { table: 'orders_clean' } },
    ],
    edges: [
      { from: 'src_1', to: 'tr_1' },
      { from: 'tr_1', to: 'snk_1' },
    ],
    retry: { max_attempts: 3, backoff_seconds: 5 },
  }
}

const names = [
  'Orders Pipeline',
  'IoT Sensors',
  'Network Logs',
  'Customer Sync',
  'Payments Audit',
  'Inventory Feed',
  'Clickstream',
  'Daily Report',
]
const statuses: PipelineStatus[] = [
  'active', 'running', 'failed', 'draft', 'active', 'draft', 'running', 'active',
]

const pipelines: Pipeline[] = names.map((n, i) => makePipeline(String(i + 1), n))
const statusById = new Map<string, PipelineStatus>(
  pipelines.map((p, i) => [p.id, statuses[i]]),
)
const updatedAt = new Map<string, string>(
  pipelines.map((p, i) => [p.id, new Date(Date.now() - i * 3_600_000).toISOString()]),
)

function summarize(p: Pipeline): PipelineSummary {
  return {
    id: p.id,
    name: p.name,
    version: p.version,
    status: statusById.get(p.id) ?? 'draft',
    nodes_count: p.nodes.length,
    updated_at: updatedAt.get(p.id) ?? new Date().toISOString(),
  }
}

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

const runs: Run[] = [
  { id: 'r1', pipeline_id: '1', pipeline_name: 'Orders Pipeline', status: 'running', started_at: minutesAgo(2), duration_seconds: null, records_processed: 1200 },
  { id: 'r2', pipeline_id: '2', pipeline_name: 'IoT Sensors', status: 'success', started_at: minutesAgo(30), duration_seconds: 94, records_processed: 10000 },
  { id: 'r3', pipeline_id: '3', pipeline_name: 'Network Logs', status: 'failed', started_at: minutesAgo(75), duration_seconds: 12, records_processed: 340 },
  { id: 'r4', pipeline_id: '1', pipeline_name: 'Orders Pipeline', status: 'success', started_at: minutesAgo(180), duration_seconds: 120, records_processed: 8500 },
  { id: 'r5', pipeline_id: '5', pipeline_name: 'Payments Audit', status: 'success', started_at: minutesAgo(300), duration_seconds: 61, records_processed: 4200 },
  { id: 'r6', pipeline_id: '4', pipeline_name: 'Customer Sync', status: 'cancelled', started_at: minutesAgo(1500), duration_seconds: 8, records_processed: 90 },
]

export const handlers = [
  // ---------- Auth ----------
  http.post('*/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    if (body.password !== 'password123') {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }
    return HttpResponse.json({
      token: 'mock-token',
      user: {
        id: 'u1',
        email: body.email,
        name: 'Demo User',
        role: body.email.startsWith('admin') ? 'admin' : 'user',
      },
    })
  }),
  http.post('*/auth/register', async ({ request }) => {
    const body = (await request.json()) as { email: string; name: string }
    return HttpResponse.json(
      {
        token: 'mock-token',
        user: { id: 'u2', email: body.email, name: body.name, role: 'user' },
      },
      { status: 201 },
    )
  }),

  // ---------- Plugins ----------
  http.get('*/plugins', () =>
    HttpResponse.json([
      {
        name: 'csv', kind: 'source', label: 'CSV File',
        schema: {
          type: 'object', required: ['path'],
          properties: {
            path: { type: 'string', title: 'File path' },
            delimiter: { type: 'string', title: 'Delimiter', default: ',' },
          },
        },
      },
      {
        name: 'json', kind: 'source', label: 'JSON File',
        schema: {
          type: 'object', required: ['path'],
          properties: { path: { type: 'string', title: 'File path' } },
        },
      },
      {
        name: 'filter', kind: 'transform', label: 'Filter',
        schema: {
          type: 'object', required: ['expression'],
          properties: { expression: { type: 'string', title: 'Expression' } },
        },
      },
      {
        name: 'remove_nulls', kind: 'transform', label: 'Remove Nulls',
        schema: { type: 'object', properties: {} },
      },
      {
        name: 'postgres', kind: 'sink', label: 'PostgreSQL',
        schema: {
          type: 'object', required: ['table'],
          properties: {
            table: { type: 'string', title: 'Table' },
            mode: { type: 'string', title: 'Mode', enum: ['append', 'overwrite'] },
          },
        },
      },
    ]),
  ),

  // ---------- Pipelines ----------
  http.get('*/pipelines', () => HttpResponse.json(pipelines.map(summarize))),
  http.get('*/pipelines/:id', ({ params }) => {
    const found = pipelines.find((p) => p.id === params.id)
    return found
      ? HttpResponse.json(found)
      : HttpResponse.json({ message: 'Pipeline not found' }, { status: 404 })
  }),
  http.post('*/pipelines/:id/duplicate', ({ params }) => {
    const src = pipelines.find((p) => p.id === params.id)
    if (!src) return HttpResponse.json({ message: 'Pipeline not found' }, { status: 404 })
    const copy: Pipeline = { ...src, id: crypto.randomUUID(), name: `${src.name} (copy)` }
    pipelines.push(copy)
    statusById.set(copy.id, 'draft')
    updatedAt.set(copy.id, new Date().toISOString())
    return HttpResponse.json(summarize(copy), { status: 201 })
  }),
  http.delete('*/pipelines/:id', ({ params }) => {
    const i = pipelines.findIndex((p) => p.id === params.id)
    if (i === -1) return HttpResponse.json({ message: 'Pipeline not found' }, { status: 404 })
    pipelines.splice(i, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // ---------- Runs & stats ----------
  http.get('*/runs', () => HttpResponse.json(runs)),
  http.get('*/stats', () => {
    const today = new Date().toDateString()
    const finished = runs.filter((r) => r.status === 'success' || r.status === 'failed')
    const ok = finished.filter((r) => r.status === 'success').length
    return HttpResponse.json({
      total_pipelines: pipelines.length,
      runs_today: runs.filter((r) => new Date(r.started_at).toDateString() === today).length,
      success_rate: finished.length === 0 ? 0 : Math.round((ok / finished.length) * 100),
    })
  }),
    http.get('*/runs/:id', ({ params }) => {
    const found = runs.find((r) => r.id === params.id)
    if (!found) return HttpResponse.json({ message: 'Run not found' }, { status: 404 })
    return HttpResponse.json({
      ...found,
      progress: found.status === 'success' ? 100 : found.status === 'running' ? 35 : 60,
    })
  }),
    http.put('*/pipelines/:id', async ({ params, request }) => {
    const body = (await request.json()) as { pipeline: Pipeline }
    const i = pipelines.findIndex((p) => p.id === params.id)
    if (i === -1) pipelines.push(body.pipeline)
    else pipelines[i] = body.pipeline
    statusById.set(body.pipeline.id, statusById.get(body.pipeline.id) ?? 'draft')
    updatedAt.set(body.pipeline.id, new Date().toISOString())
    return HttpResponse.json(body.pipeline)
  }),
]