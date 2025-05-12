import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import AdminOrdersPage from '../page'

const mockSession = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin'
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString()
}

describe('AdminOrdersPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('handles error state', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'))

    render(
      <SessionProvider session={mockSession}>
        <AdminOrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('handles order status update', async () => {
    const mockOrders = {
      orders: [
        {
          id: '1',
          userId: '1',
          status: 'pending',
          total: 100,
          createdAt: new Date().toISOString(),
          user: {
            name: 'Test User',
            email: 'test@example.com'
          }
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        hasNextPage: false,
        hasPrevPage: false
      }
    }

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOrders)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

    render(
      <SessionProvider session={mockSession}>
        <AdminOrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/orders/i)).toBeInTheDocument()
    })

    const statusButton = screen.getByText('Change Status')
    fireEvent.click(statusButton)

    const newStatus = screen.getByText('Processing')
    fireEvent.click(newStatus)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/orders/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ status: 'processing' })
        })
      )
    })
  })

  it('handles unauthorized access', () => {
    const nonAdminSession = {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      },
      expires: new Date(Date.now() + 2 * 86400).toISOString()
    }

    render(
      <SessionProvider session={nonAdminSession}>
        <AdminOrdersPage />
      </SessionProvider>
    )

    expect(screen.getByText(/unauthorized/i)).toBeInTheDocument()
  })
}) 