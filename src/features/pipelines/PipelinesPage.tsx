import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deletePipeline, duplicatePipeline, listPipelines } from '@/api/pipelines'
import type { ApiError } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Table } from '@/components/ui/Table'
import type { Column } from '@/components/ui/Table'
import { useToastStore } from '@/store/toastStore'
import type { PipelineStatus, PipelineSummary } from '@/types/pipeline'
import { formatDate } from '@/utils/format'

const PAGE_SIZE = 5

type StatusFilter = 'all' | PipelineStatus
type SortKey = 'updated' | 'name'

export function PipelinesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToastStore.getState().show

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortKey>('updated')
  const [page, setPage] = useState(1)
  const [target, setTarget] = useState<PipelineSummary | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pipelines'],
    queryFn: listPipelines,
  })

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['pipelines'] })
    void queryClient.invalidateQueries({ queryKey: ['stats'] })
  }

  const duplicate = useMutation<PipelineSummary, ApiError, string>({
    mutationFn: duplicatePipeline,
    onSuccess: () => {
      toast('success', 'Pipeline duplicated')
      refresh()
    },
    onError: (e) => toast('error', e.message),
  })

  const remove = useMutation<void, ApiError, string>({
    mutationFn: deletePipeline,
    onSuccess: () => {
      toast('success', 'Pipeline deleted')
      setTarget(null)
      refresh()
    },
    onError: (e) => toast('error', e.message),
  })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const rows = (data ?? []).filter(
      (p) =>
        (status === 'all' || p.status === status) &&
        (q === '' || p.name.toLowerCase().includes(q)),
    )
    return rows.sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : b.updated_at.localeCompare(a.updated_at),
    )
  }, [data, search, status, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const columns: Column<PipelineSummary>[] = [
    {
      header: 'Name',
      render: (p) => (
        <Link
          to={`/pipelines/${p.id}/edit`}
          className="font-bold text-white transition-colors duration-150 hover:text-indigo-300 hover:underline"
        >
          {p.name}
        </Link>
      ),
    },
    { header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    { header: 'Version', render: (p) => `v${p.version}` },
    { header: 'Nodes', render: (p) => p.nodes_count },
    { header: 'Updated', render: (p) => formatDate(p.updated_at) },
    {
      header: 'Actions',
      render: (p) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="px-2 py-1 text-xs font-semibold"
            onClick={() => navigate(`/pipelines/${p.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            className="px-2 py-1 text-xs font-semibold"
            loading={duplicate.isPending && duplicate.variables === p.id}
            onClick={() => duplicate.mutate(p.id)}
          >
            Duplicate
          </Button>
          <Button
            variant="danger"
            className="px-2 py-1 text-xs font-semibold"
            onClick={() => setTarget(p)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5 text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Pipelines</h1>
        <Button onClick={() => navigate('/pipelines/new/edit')}>New pipeline</Button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-64">
          <Input
            label="Search"
            placeholder="Search by name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Select
          label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as StatusFilter)
            setPage(1)
          }}
          options={[
            { value: 'all', label: 'All' },
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' },
            { value: 'running', label: 'Running' },
            { value: 'failed', label: 'Failed' },
          ]}
        />
        <Select
          label="Sort by"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          options={[
            { value: 'updated', label: 'Last updated' },
            { value: 'name', label: 'Name' },
          ]}
        />
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2" aria-busy="true">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {error && (
        <EmptyState
          title="Could not load pipelines"
          description="Check your connection and try again."
          action={<Button onClick={() => void refetch()}>Retry</Button>}
        />
      )}

      {data && filtered.length === 0 && (
        <EmptyState
          title={data.length === 0 ? 'No pipelines yet' : 'No pipelines match your filters'}
          description={
            data.length === 0 ? 'Create your first pipeline to get started.' : undefined
          }
          action={
            data.length === 0 ? (
              <Button onClick={() => navigate('/pipelines/new/edit')}>New pipeline</Button>
            ) : undefined
          }
        />
      )}

      {data && filtered.length > 0 && (
        <>
          <Table columns={columns} rows={visible} rowKey={(p) => p.id} />
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              Page {currentPage} of {totalPages} ({filtered.length} pipelines)
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal
        open={target !== null}
        onClose={() => setTarget(null)}
        title="Delete pipeline?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={remove.isPending}
              onClick={() => target && remove.mutate(target.id)}
            >
              Delete
            </Button>
          </>
        }
      >
        <strong>{target?.name}</strong> will be permanently deleted. This action cannot be undone.
      </Modal>
    </div>
  )
}