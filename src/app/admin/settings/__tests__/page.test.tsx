import { render, screen } from '@testing-library/react'
import AdminSettingsPage from '../page'

describe('AdminSettingsPage', () => {
  it('renders the Admin Settings page correctly', () => {
    render(<AdminSettingsPage />)
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
}) 