import { describe, expect, it } from 'vitest'
import type { Edge } from '@xyflow/react'
import type { Pipeline } from '@/types/pipeline'
import type { FlowNode } from '@/types/flow'
import { flowToPipeline, pipelineToFlow } from './pipelineConverter'
import { canConnect } from './connectionRules'
import { validateConfig } from './schemaForm'

const sample: Pipeline = {
  id: 'p1',
  name: 'Test',
  version: 1,
  schedule: null,
  nodes: [
    { id: 'src_1', type: 'source', plugin: 'csv', config: { path: 'a.csv' } },
    { id: 'tr_1', type: 'transform', plugin: 'filter', config: { expression: 'x > 1' } },
    { id: 'snk_1', type: 'sink', plugin: 'postgres', config: { table: 't' } },
  ],
  edges: [
    { from: 'src_1', to: 'tr_1' },
    { from: 'tr_1', to: 'snk_1' },
  ],
  retry: { max_attempts: 3, backoff_seconds: 5 },
}

describe('pipeline converter', () => {
  it('round-trips pipeline -> flow -> pipeline', () => {
    const { nodes, edges } = pipelineToFlow(sample)
    const { nodes: _n, edges: _e, ...meta } = sample
    void _n
    void _e
    expect(flowToPipeline(meta, nodes, edges)).toEqual(sample)
  })
})

describe('connection rules', () => {
  const { nodes, edges } = pipelineToFlow(sample)

  it('rejects duplicate edges', () => {
    expect(canConnect({ source: 'src_1', target: 'tr_1' }, nodes, edges)).toBe(false)
  })
  it('rejects connections into a source', () => {
    expect(canConnect({ source: 'tr_1', target: 'src_1' }, nodes, edges)).toBe(false)
  })
  it('rejects connections out of a sink', () => {
    expect(canConnect({ source: 'snk_1', target: 'tr_1' }, nodes, edges)).toBe(false)
  })
  it('rejects self connections', () => {
    expect(canConnect({ source: 'tr_1', target: 'tr_1' }, nodes, edges)).toBe(false)
  })
  it('rejects cycles between transforms', () => {
    const extra: FlowNode = {
      id: 'tr_2',
      type: 'pipelineNode',
      position: { x: 0, y: 0 },
      data: { kind: 'transform', plugin: 'filter', config: {} },
    }
    const e: Edge[] = [...edges, { id: 'tr_1->tr_2', source: 'tr_1', target: 'tr_2' }]
    expect(canConnect({ source: 'tr_2', target: 'tr_1' }, [...nodes, extra], e)).toBe(false)
  })
  it('accepts a valid connection', () => {
    expect(canConnect({ source: 'src_1', target: 'snk_1' }, nodes, edges)).toBe(true)
  })
})

describe('validateConfig', () => {
  const schema = {
    required: ['path'],
    properties: {
      path: { type: 'string' as const, title: 'File path' },
      size: { type: 'integer' as const, title: 'Size' },
      mode: { type: 'string' as const, title: 'Mode', enum: ['append', 'overwrite'] },
    },
  }

  it('reports missing required fields', () => {
    expect(validateConfig(schema, {})).toEqual({ path: 'File path is required' })
  })
  it('accepts a valid config', () => {
    expect(validateConfig(schema, { path: 'a.csv', size: 3, mode: 'append' })).toEqual({})
  })
  it('rejects non-integers and bad enum values', () => {
    const errors = validateConfig(schema, { path: 'a', size: 1.5, mode: 'x' })
    expect(Object.keys(errors).sort()).toEqual(['mode', 'size'])
  })
})