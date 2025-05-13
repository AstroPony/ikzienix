// TODO: Skipped due to Firebase/auth issues. Revisit and fix these tests later.
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '@/app/auth/forgot-password/page';
import { SessionProvider } from 'next-auth/react';

describe('ForgotPasswordPage', () => {
  it('renders forgot password page', () => {
    render(
      <SessionProvider session={null}>
        <ForgotPasswordPage />
      </SessionProvider>
    );

    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(
      <SessionProvider session={null}>
        <ForgotPasswordPage />
      </SessionProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/check your email for reset instructions/i)).toBeInTheDocument();
    });
  });
}); 