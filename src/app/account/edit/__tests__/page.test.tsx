import { render, screen } from '@testing-library/react'
import AccountEditPage from '../page'
import { SessionProvider } from 'next-auth/react'

describe('AccountEditPage', () => {
  it('renders the Account Edit page correctly', () => {
    render(
      <SessionProvider session={null}>
        <AccountEditPage />
      </SessionProvider>
    )
    // Since unauthenticated, expect no content
    expect(document.body.textContent).toBe('')
  })
}) 