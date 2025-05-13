import { render } from '@testing-library/react'
import AdminSettingsPage from '../page'

describe('AdminSettingsPage', () => {
  it('renders without crashing', () => {
    render(<AdminSettingsPage />)
  })
}) 