import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminOrdersPage from '../orders/page';
import { SessionProvider } from 'next-auth/react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}));

// Mock the session
const mockSession = {
  user: {
    id: '1',
    email: 'admin@example.com',
    role: 'admin'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
};

// Mock fetch
const mockOrders = [
  {
    id: '1',
    userId: 'user1',
    status: 'pending',
    total: 100,
    createdAt: new Date().toISOString(),
    user: {
      name: 'Test User',
      email: 'test@example.com'
    }
  }
];

const mockResponse = {
  orders: mockOrders,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
    hasNextPage: false,
    hasPrevPage: false
  }
};

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockResponse)
  })
);

describe('AdminOrdersPage', () => {
  it('renders orders correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <AdminOrdersPage />
      </SessionProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Orders')).toBeInTheDocument();
    });

    // Check for order details
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Mock fetch to return error
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.reject(new Error('Failed to fetch'))
      })
    );

    render(
      <SessionProvider session={mockSession}>
        <AdminOrdersPage />
      </SessionProvider>
    );

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to load orders')).toBeInTheDocument();
  });

  it('handles order status update', async () => {
    // Mock fetch to return success
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );

    render(
      <SessionProvider session={mockSession}>
        <AdminOrdersPage />
      </SessionProvider>
    );

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText('Orders')).toBeInTheDocument();
    });

    // Click status dropdown
    const statusButton = screen.getByText('Change Status');
    fireEvent.click(statusButton);

    // Click new status
    const newStatus = screen.getByText('Processing');
    fireEvent.click(newStatus);

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Order status updated')).toBeInTheDocument();
    });
  });

  it('handles unauthorized access', async () => {
    // Mock session without admin role
    const nonAdminSession = {
      user: {
        id: '2',
        email: 'user@example.com',
        role: 'user'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    render(
      <SessionProvider session={nonAdminSession}>
        <AdminOrdersPage />
      </SessionProvider>
    );

    // Check for unauthorized message
    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    expect(screen.getByText('You do not have permission to access this page.')).toBeInTheDocument();
  });
}); 