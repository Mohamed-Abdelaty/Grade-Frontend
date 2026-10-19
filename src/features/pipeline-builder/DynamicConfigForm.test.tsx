import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DynamicConfigForm } from './DynamicConfigForm'

const schema = {
  required: ['path'],
  properties: {
    path: { type: 'string' as const, title: 'File path' },
    mode: { type: 'string' as const, title: 'Mode', enum: ['append', 'overwrite'] },
    size: { type: 'integer' as const, title: 'Size' },
  },
}

describe('DynamicConfigForm', () => {
  it('renders a field per schema property and marks required ones', () => {
    render(<DynamicConfigForm schema={schema} values={{}} errors={{}} onChange={vi.fn()} />)
    expect(screen.getByLabelText('File path *')).toBeInTheDocument()
    expect(screen.getByLabelText('Mode')).toBeInTheDocument()
    expect(screen.getByLabelText('Size')).toHaveAttribute('type', 'number')
  })

  it('shows field errors', () => {
    render(
      <DynamicConfigForm
        schema={schema}
        values={{}}
        errors={{ path: 'File path is required' }}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('File path is required')
  })

  it('calls onChange when typing', async () => {
    const onChange = vi.fn()
    render(<DynamicConfigForm schema={schema} values={{}} errors={{}} onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('File path *'), 'a')
    expect(onChange).toHaveBeenCalledWith('path', 'a')
  })

  it('shows an empty message when the plugin has no settings', () => {
    render(<DynamicConfigForm schema={{}} values={{}} errors={{}} onChange={vi.fn()} />)
    expect(screen.getByText('This plugin has no settings.')).toBeInTheDocument()
  })
})