import { api } from './client'
import type { PluginDefinition } from '@/types/plugin'

export async function listPlugins(): Promise<PluginDefinition[]> {
  const { data } = await api.get<PluginDefinition[]>('/plugins')
  return data
}