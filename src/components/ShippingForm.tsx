"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const shippingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'),
  line1: z.string().min(5, 'Address must be at least 5 characters'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postalCode: z.string().regex(/^[\d\w\s-]{4,}$/, 'Please enter a valid postal code'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  shippingMethod: z.enum(['standard', 'express'])
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData, saveAddress: boolean) => Promise<void>;
  initialValues?: Partial<ShippingFormData>;
}

export default function ShippingForm({ onSubmit, initialValues }: ShippingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      line1: initialValues?.line1 || '',
      line2: initialValues?.line2 || '',
      city: initialValues?.city || '',
      state: initialValues?.state || '',
      postalCode: initialValues?.postalCode || '',
      country: initialValues?.country || '',
      shippingMethod: initialValues?.shippingMethod || 'standard'
    }
  });

  const onFormSubmit = async (data: ShippingFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(data, saveAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit shipping information');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="card p-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            id="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            {...register('name')}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="tel"
            id="phone"
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            {...register('phone')}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone.message}</div>
          )}
        </div>

        <div className="col-12">
          <label htmlFor="line1" className="form-label">Address Line 1</label>
          <input
            type="text"
            id="line1"
            className={`form-control ${errors.line1 ? 'is-invalid' : ''}`}
            {...register('line1')}
          />
          {errors.line1 && (
            <div className="invalid-feedback">{errors.line1.message}</div>
          )}
        </div>

        <div className="col-12">
          <label htmlFor="line2" className="form-label">Address Line 2 (Optional)</label>
          <input
            type="text"
            id="line2"
            className="form-control"
            {...register('line2')}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="city" className="form-label">City</label>
          <input
            type="text"
            id="city"
            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
            {...register('city')}
          />
          {errors.city && (
            <div className="invalid-feedback">{errors.city.message}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="state" className="form-label">State/Province</label>
          <input
            type="text"
            id="state"
            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
            {...register('state')}
          />
          {errors.state && (
            <div className="invalid-feedback">{errors.state.message}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="postalCode" className="form-label">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
            {...register('postalCode')}
          />
          {errors.postalCode && (
            <div className="invalid-feedback">{errors.postalCode.message}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="country" className="form-label">Country</label>
          <input
            type="text"
            id="country"
            className={`form-control ${errors.country ? 'is-invalid' : ''}`}
            {...register('country')}
          />
          {errors.country && (
            <div className="invalid-feedback">{errors.country.message}</div>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">Shipping Method</label>
          <div className="d-flex gap-3">
            <div className="form-check">
              <input
                type="radio"
                id="standard"
                value="standard"
                className="form-check-input"
                {...register('shippingMethod')}
              />
              <label htmlFor="standard" className="form-check-label">
                Standard Shipping
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="express"
                value="express"
                className="form-check-input"
                {...register('shippingMethod')}
              />
              <label htmlFor="express" className="form-check-label">
                Express Shipping
              </label>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check">
            <input
              type="checkbox"
              id="saveAddress"
              className="form-check-input"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
            />
            <label htmlFor="saveAddress" className="form-check-label">
              Save this address for future orders
            </label>
          </div>
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              'Continue to Payment'
            )}
          </button>
        </div>
      </div>
    </form>
  );
} 