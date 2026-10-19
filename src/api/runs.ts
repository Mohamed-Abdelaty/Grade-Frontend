import { api } from './client'
import type { DashboardStats, Run, RunDetails } from '@/types/run'

export async function listRuns(): Promise<Run[]> {
  const { data } = await api.get<Run[]>('/runs')
  return data
}

export async function getStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/stats')
  return data
}

export async function getRun(id: string): Promise<RunDetails> {
  const { data } = await api.get<RunDetails>(`/runs/${id}`)
  return data
}