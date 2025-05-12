import { render, screen, waitFor } from '@testing-library/react'
import AdminSettingsPage from '../page'

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock

describe('AdminSettingsPage', () => {
  it('renders the Admin Settings page correctly', async () => {
    render(<AdminSettingsPage />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Store Settings')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Configure your store settings')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument()
  })
}) 