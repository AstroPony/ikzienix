import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import OrdersPage from '../page'

describe('OrdersPage', () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        redirected: false,
        type: 'basic',
        url: '',
        clone: () => undefined,
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        json: () => Promise.resolve([
          {
            id: 1,
            status: 'Delivered',
            total: 100,
            createdAt: '2024-01-01',
            items: [
              {
                product: {
                  id: 'p1',
                  name: 'Test Product',
                  price: 50,
                  images: [{ url: 'https://placehold.co/100x100', alt: 'Test Product' }]
                },
                quantity: 2
              }
            ]
          }
        ]),
        text: () => Promise.resolve(''),
      } as unknown as Response)
    )
  })

  it.skip('renders the orders page', async () => {
    await act(async () => {
      render(<OrdersPage />)
    })

    await waitFor(() => {
      expect(screen.getByText('My Orders')).toBeInTheDocument()
    })
  }, 15000)
}) 