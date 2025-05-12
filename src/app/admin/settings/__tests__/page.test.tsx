import { render, screen } from '@testing-library/react'
import AdminSettingsPage from '../page'

describe('AdminSettingsPage', () => {
  it('renders the Admin Settings page correctly', () => {
    render(<AdminSettingsPage />)
    
    expect(screen.getByText('Store Settings')).toBeInTheDocument()
    expect(screen.getByText('Configure your store settings')).toBeInTheDocument()
    expect(screen.getByText('Failed to load settings')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument()
  })
}) 