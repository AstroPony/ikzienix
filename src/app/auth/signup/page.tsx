"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface AddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  shippingAddress: AddressData;
  billingAddress: AddressData;
  useSameAddress: boolean;
}

const initialAddressData: AddressData = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

function SignupPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    shippingAddress: { ...initialAddressData },
    billingAddress: { ...initialAddressData },
    useSameAddress: true,
  });

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s+/g, ''))) return 'Invalid phone number';
    
    // Validate shipping address
    const shipping = formData.shippingAddress;
    if (!shipping.line1.trim()) return 'Shipping address line 1 is required';
    if (!shipping.city.trim()) return 'Shipping city is required';
    if (!shipping.state.trim()) return 'Shipping state is required';
    if (!shipping.postalCode.trim()) return 'Shipping postal code is required';
    if (!shipping.country.trim()) return 'Shipping country is required';

    // Validate billing address if different from shipping
    if (!formData.useSameAddress) {
      const billing = formData.billingAddress;
      if (!billing.line1.trim()) return 'Billing address line 1 is required';
      if (!billing.city.trim()) return 'Billing city is required';
      if (!billing.state.trim()) return 'Billing state is required';
      if (!billing.postalCode.trim()) return 'Billing postal code is required';
      if (!billing.country.trim()) return 'Billing country is required';
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof Pick<FormData, 'shippingAddress' | 'billingAddress'>],
          [field]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // If using same address, copy shipping to billing
        ...(name === 'useSameAddress' && checked
          ? { billingAddress: prev.shippingAddress }
          : {})
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          billingAddress: formData.useSameAddress ? formData.shippingAddress : formData.billingAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      
      // Auto-login after signup
      const loginResult = await signIn('firebase', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (loginResult?.error) throw new Error('Account created, but failed to sign in. Please sign in manually.');
      
      const redirectTo = searchParams.get('redirect') || '/account';
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAddressFields = (type: 'shipping' | 'billing') => (
    <div className="mb-4">
      <h3 className="h5 mb-3">{type === 'shipping' ? 'Shipping' : 'Billing'} Address</h3>
      <div className="mb-3">
        <label htmlFor={`${type}.line1`} className="form-label">Address Line 1</label>
        <input
          type="text"
          className="form-control"
          id={`${type}.line1`}
          name={`${type}Address.line1`}
          value={formData[`${type}Address`].line1}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor={`${type}.line2`} className="form-label">Address Line 2 (Optional)</label>
        <input
          type="text"
          className="form-control"
          id={`${type}.line2`}
          name={`${type}Address.line2`}
          value={formData[`${type}Address`].line2}
          onChange={handleChange}
        />
      </div>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor={`${type}.city`} className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            id={`${type}.city`}
            name={`${type}Address.city`}
            value={formData[`${type}Address`].city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col">
          <label htmlFor={`${type}.state`} className="form-label">State</label>
          <input
            type="text"
            className="form-control"
            id={`${type}.state`}
            name={`${type}Address.state`}
            value={formData[`${type}Address`].state}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <label htmlFor={`${type}.postalCode`} className="form-label">Postal Code</label>
          <input
            type="text"
            className="form-control"
            id={`${type}.postalCode`}
            name={`${type}Address.postalCode`}
            value={formData[`${type}Address`].postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col">
          <label htmlFor={`${type}.country`} className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            id={`${type}.country`}
            name={`${type}Address.country`}
            value={formData[`${type}Address`].country}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="display-5 mb-4 text-center">Create Account</h1>
              <button
                className="btn btn-outline-danger w-100 mb-3"
                type="button"
                onClick={() => signIn('google', { callbackUrl: searchParams.get('redirect') || '/account' })}
              >
                <i className="bi bi-google me-2"></i> Sign up with Google
              </button>
              <div className="text-center mb-3 text-muted">or</div>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h3 className="h5 mb-3">Personal Information</h3>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                    <div className="form-text">Password must be at least 6 characters long</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {renderAddressFields('shipping')}

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="useSameAddress"
                    name="useSameAddress"
                    checked={formData.useSameAddress}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="useSameAddress">
                    Use same address for billing
                  </label>
                </div>

                {!formData.useSameAddress && renderAddressFields('billing')}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
              <div className="text-center mt-3">
                <span>Already have an account? </span>
                <a href="/auth/signin">Sign in</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageInner />
    </Suspense>
  );
} 