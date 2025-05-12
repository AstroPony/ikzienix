import { render, screen } from '@testing-library/react'
import CompleteProfilePage from '../page'
import { useSession, SessionProvider } from 'next-auth/react'

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({ data: { user: { id: '1' } }, status: 'authenticated' })
}))

describe.skip('CompleteProfilePage', () => {
  it('renders the Complete Profile page correctly', () => {
    render(
      <SessionProvider session={null}>
        <CompleteProfilePage />
      </SessionProvider>
    )
    // Since unauthenticated, expect no content
    expect(document.body.textContent).toBe('')
  })
}) 