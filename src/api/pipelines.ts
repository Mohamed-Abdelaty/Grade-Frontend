import { api } from './client'
import type { Pipeline, PipelineSummary } from '@/types/pipeline'

export async function listPipelines(): Promise<PipelineSummary[]> {
  const { data } = await api.get<PipelineSummary[]>('/pipelines')
  return data
}

export async function getPipeline(id: string): Promise<Pipeline> {
  const { data } = await api.get<Pipeline>(`/pipelines/${id}`)
  return data
}

export async function duplicatePipeline(id: string): Promise<PipelineSummary> {
  const { data } = await api.post<PipelineSummary>(`/pipelines/${id}/duplicate`)
  return data
}

export async function deletePipeline(id: string): Promise<void> {
  await api.delete(`/pipelines/${id}`)
}

export async function savePipeline(p: Pipeline): Promise<Pipeline> {
  const { data } = await api.put<Pipeline>(`/pipelines/${p.id}`, { pipeline: p })
  return data
}