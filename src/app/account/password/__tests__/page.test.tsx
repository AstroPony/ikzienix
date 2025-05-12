import { render, screen } from '@testing-library/react'
import AccountPasswordPage from '../page'
import { SessionProvider } from 'next-auth/react'

describe('AccountPasswordPage', () => {
  it('renders the Account Password page correctly', () => {
    render(
      <SessionProvider session={null}>
        <AccountPasswordPage />
      </SessionProvider>
    )
    // Since unauthenticated, expect no content
    expect(document.body.textContent).toBe('')
  })
}) 