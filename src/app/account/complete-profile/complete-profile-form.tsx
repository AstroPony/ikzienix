'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'
import { getAuth } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

interface FormData {
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
  sameAsShipping: boolean;
}

// Dutch postal code validation (4 digits, 2 letters)
const isValidDutchPostalCode = (postalCode: string) => {
  return /^[1-9][0-9]{3}\s?[A-Z]{2}$/i.test(postalCode)
}

// Dutch phone number validation
const isValidDutchPhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  // Check if it's a valid Dutch phone number (10 digits starting with 06 or 9 digits starting with 0)
  return /^(06\d{8}|0\d{8})$/.test(digits)
}

interface ProfileFormProps {
  userId: string;
  initialValues?: FormData;
  title?: string;
  submitLabel?: string;
}

const addressSchema = z.object({
  line1: z.string().min(2, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().regex(/^[1-9][0-9]{3}\s?[A-Z]{2}$/i, 'Invalid Dutch postal code'),
  country: z.string().min(2, 'Country is required'),
})
const profileSchema = z.object({
  phone: z.string().regex(/^(06\d{8}|0\d{8})$/, 'Invalid Dutch phone number'),
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  sameAsShipping: z.boolean(),
})
type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileForm({ userId, initialValues, title = 'Complete Your Profile', submitLabel }: ProfileFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues || {
      phone: '',
      shippingAddress: { line1: '', line2: '', city: '', state: '', postalCode: '', country: 'NL' },
      billingAddress: { line1: '', line2: '', city: '', state: '', postalCode: '', country: 'NL' },
      sameAsShipping: true,
    },
  })
  const sameAsShipping = watch('sameAsShipping')

  const onFormSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/account/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: data.phone,
          shippingAddress: data.shippingAddress,
          billingAddress: data.sameAsShipping ? data.shippingAddress : data.billingAddress,
          profileCompleted: true
        })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to update profile')
      router.push('/account')
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(t('common.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="needs-validation" noValidate>
      {/* Phone Number */}
      <div className="mb-4">
        <label htmlFor="phone" className="form-label">{t('account.phone')}</label>
        <input
          type="tel"
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          id="phone"
          {...register('phone')}
          placeholder="06 12345678"
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
      </div>

      {/* Shipping Address */}
      <h3 className="h5 mb-3">{t('account.shippingAddress')}</h3>
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="shipping.line1" className="form-label">{t('address.line1')}</label>
          <input
            type="text"
            className={`form-control ${errors.shippingAddress?.line1 ? 'is-invalid' : ''}`}
            id="shipping.line1"
            {...register('shippingAddress.line1')}
          />
          {errors.shippingAddress?.line1 && <div className="invalid-feedback">{errors.shippingAddress.line1.message}</div>}
        </div>
        <div className="col-12">
          <label htmlFor="shipping.line2" className="form-label">{t('address.line2')}</label>
          <input
            type="text"
            className="form-control"
            id="shipping.line2"
            {...register('shippingAddress.line2')}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="shipping.city" className="form-label">{t('address.city')}</label>
          <input
            type="text"
            className={`form-control ${errors.shippingAddress?.city ? 'is-invalid' : ''}`}
            id="shipping.city"
            {...register('shippingAddress.city')}
          />
          {errors.shippingAddress?.city && <div className="invalid-feedback">{errors.shippingAddress.city.message}</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="shipping.state" className="form-label">{t('address.state')}</label>
          <input
            type="text"
            className="form-control"
            id="shipping.state"
            {...register('shippingAddress.state')}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="shipping.postalCode" className="form-label">{t('address.postalCode')}</label>
          <input
            type="text"
            className={`form-control ${errors.shippingAddress?.postalCode ? 'is-invalid' : ''}`}
            id="shipping.postalCode"
            {...register('shippingAddress.postalCode')}
          />
          {errors.shippingAddress?.postalCode && <div className="invalid-feedback">{errors.shippingAddress.postalCode.message}</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="shipping.country" className="form-label">{t('address.country')}</label>
          <input
            type="text"
            className={`form-control ${errors.shippingAddress?.country ? 'is-invalid' : ''}`}
            id="shipping.country"
            {...register('shippingAddress.country')}
          />
          {errors.shippingAddress?.country && <div className="invalid-feedback">{errors.shippingAddress.country.message}</div>}
        </div>
      </div>

      {/* Same as Shipping Checkbox */}
      <div className="form-check mt-3 mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="sameAsShipping"
          {...register('sameAsShipping')}
        />
        <label className="form-check-label" htmlFor="sameAsShipping">
          {t('account.sameAsShipping')}
        </label>
      </div>

      {/* Billing Address */}
      {!sameAsShipping && (
        <>
          <h3 className="h5 mb-3">{t('account.billingAddress')}</h3>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="billing.line1" className="form-label">{t('address.line1')}</label>
              <input
                type="text"
                className={`form-control ${errors.billingAddress?.line1 ? 'is-invalid' : ''}`}
                id="billing.line1"
                {...register('billingAddress.line1')}
              />
              {errors.billingAddress?.line1 && <div className="invalid-feedback">{errors.billingAddress.line1.message}</div>}
            </div>
            <div className="col-12">
              <label htmlFor="billing.line2" className="form-label">{t('address.line2')}</label>
              <input
                type="text"
                className="form-control"
                id="billing.line2"
                {...register('billingAddress.line2')}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="billing.city" className="form-label">{t('address.city')}</label>
              <input
                type="text"
                className={`form-control ${errors.billingAddress?.city ? 'is-invalid' : ''}`}
                id="billing.city"
                {...register('billingAddress.city')}
              />
              {errors.billingAddress?.city && <div className="invalid-feedback">{errors.billingAddress.city.message}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="billing.state" className="form-label">{t('address.state')}</label>
              <input
                type="text"
                className="form-control"
                id="billing.state"
                {...register('billingAddress.state')}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="billing.postalCode" className="form-label">{t('address.postalCode')}</label>
              <input
                type="text"
                className={`form-control ${errors.billingAddress?.postalCode ? 'is-invalid' : ''}`}
                id="billing.postalCode"
                {...register('billingAddress.postalCode')}
              />
              {errors.billingAddress?.postalCode && <div className="invalid-feedback">{errors.billingAddress.postalCode.message}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="billing.country" className="form-label">{t('address.country')}</label>
              <input
                type="text"
                className={`form-control ${errors.billingAddress?.country ? 'is-invalid' : ''}`}
                id="billing.country"
                {...register('billingAddress.country')}
              />
              {errors.billingAddress?.country && <div className="invalid-feedback">{errors.billingAddress.country.message}</div>}
            </div>
          </div>
        </>
      )}

      <button type="submit" className="btn btn-primary mt-4" disabled={isLoading}>
        {isLoading ? t('common.saving') : (submitLabel || t('common.save'))}
      </button>
    </form>
  )
} 