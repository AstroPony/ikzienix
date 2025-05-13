import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import { LanguageProvider } from '@/lib/i18n/context'
import EditProfilePage from '../page'

describe('EditProfilePage', () => {
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
        json: () => Promise.resolve({
          phone: '123-456-7890',
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          sameAsShipping: true,
          name: 'Test User',
          email: 'test@example.com',
          country: 'USA',
          city: 'Test City',
          zip: '12345',
          state: 'Test State',
        }),
        text: () => Promise.resolve(''),
      } as unknown as Response)
    )
  })

  it.skip('renders the edit profile form', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <EditProfilePage />
        </LanguageProvider>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    })
  }, 10000)
}) 