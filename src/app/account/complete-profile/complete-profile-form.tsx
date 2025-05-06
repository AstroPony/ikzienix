'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'
import { getAuth } from 'firebase/auth'

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

export default function ProfileForm({ userId, initialValues, title = 'Complete Your Profile', submitLabel }: ProfileFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<FormData>(
    initialValues || {
      phone: '',
      shippingAddress: {
        line1: '',
        line2: '',
        city: '',
        postalCode: '',
        country: 'NL',
      },
      billingAddress: {
        line1: '',
        line2: '',
        city: '',
        postalCode: '',
        country: 'NL',
      },
      sameAsShipping: true,
    }
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!isValidDutchPhoneNumber(formData.phone)) {
      newErrors.phone = t('address.invalidPhone')
    }

    if (!isValidDutchPostalCode(formData.shippingAddress.postalCode)) {
      newErrors['shipping.postalCode'] = t('address.invalidPostalCode')
    }

    if (!formData.sameAsShipping && !isValidDutchPostalCode(formData.billingAddress.postalCode)) {
      newErrors['billing.postalCode'] = t('address.invalidPostalCode')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith('shipping.') || name.startsWith('billing.')) {
      const [address, field] = name.split('.')
      const addressKey = address === 'shipping' ? 'shippingAddress' : 'billingAddress'
      setFormData(prev => ({
        ...prev,
        [addressKey]: {
          ...prev[addressKey],
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSameAsShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setFormData(prev => ({
      ...prev,
      sameAsShipping: checked,
      billingAddress: checked ? prev.shippingAddress : prev.billingAddress
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    // Debug logs
    console.log('userId prop:', userId)
    try {
      // Submit to API route
      const response = await fetch('/api/account/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.sameAsShipping ? formData.shippingAddress : formData.billingAddress,
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
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      {/* Phone Number */}
      <div className="mb-4">
        <label htmlFor="phone" className="form-label">{t('account.phone')}</label>
        <input
          type="tel"
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="06 12345678"
          required
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
      </div>

      {/* Shipping Address */}
      <h3 className="h5 mb-3">{t('account.shippingAddress')}</h3>
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="shipping.line1" className="form-label">{t('address.line1')}</label>
          <input
            type="text"
            className="form-control"
            id="shipping.line1"
            name="shipping.line1"
            value={formData.shippingAddress.line1}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-12">
          <label htmlFor="shipping.line2" className="form-label">{t('address.line2')}</label>
          <input
            type="text"
            className="form-control"
            id="shipping.line2"
            name="shipping.line2"
            value={formData.shippingAddress.line2}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="shipping.city" className="form-label">{t('address.city')}</label>
          <input
            type="text"
            className="form-control"
            id="shipping.city"
            name="shipping.city"
            value={formData.shippingAddress.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="shipping.postalCode" className="form-label">{t('address.postalCode')}</label>
          <input
            type="text"
            className={`form-control ${errors['shipping.postalCode'] ? 'is-invalid' : ''}`}
            id="shipping.postalCode"
            name="shipping.postalCode"
            value={formData.shippingAddress.postalCode}
            onChange={handleInputChange}
            placeholder="1234 AB"
            required
          />
          {errors['shipping.postalCode'] && (
            <div className="invalid-feedback">{errors['shipping.postalCode']}</div>
          )}
        </div>
      </div>

      {/* Same as Shipping Checkbox */}
      <div className="mb-4">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="sameAsShipping"
            name="sameAsShipping"
            checked={formData.sameAsShipping}
            onChange={handleSameAsShippingChange}
          />
          <label className="form-check-label" htmlFor="sameAsShipping">
            {t('address.sameAsShipping')}
          </label>
        </div>
      </div>

      {/* Billing Address */}
      {!formData.sameAsShipping && (
        <div className="mb-4">
          <h3 className="h5 mb-3">{t('account.billingAddress')}</h3>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="billing.line1" className="form-label">{t('address.line1')}</label>
              <input
                type="text"
                className="form-control"
                id="billing.line1"
                name="billing.line1"
                value={formData.billingAddress.line1}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="billing.line2" className="form-label">{t('address.line2')}</label>
              <input
                type="text"
                className="form-control"
                id="billing.line2"
                name="billing.line2"
                value={formData.billingAddress.line2}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="billing.city" className="form-label">{t('address.city')}</label>
              <input
                type="text"
                className="form-control"
                id="billing.city"
                name="billing.city"
                value={formData.billingAddress.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="billing.postalCode" className="form-label">{t('address.postalCode')}</label>
              <input
                type="text"
                className={`form-control ${errors['billing.postalCode'] ? 'is-invalid' : ''}`}
                id="billing.postalCode"
                name="billing.postalCode"
                value={formData.billingAddress.postalCode}
                onChange={handleInputChange}
                placeholder="1234 AB"
                required
              />
              {errors['billing.postalCode'] && (
                <div className="invalid-feedback">{errors['billing.postalCode']}</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          disabled={isLoading}
        >
          {isLoading ? t('common.saving') : (submitLabel || t('common.save'))}
        </button>
      </div>
    </form>
  )
} 