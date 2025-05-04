'use client'

import { useState, useEffect } from 'react'
import GeneralSettings from './components/GeneralSettings'
import FinancialSettings from './components/FinancialSettings'
import ShippingSettings from './components/ShippingSettings'

interface Settings {
  storeName: string
  storeDescription: string
  contactEmail: string
  currency: string
  taxRate: number
  shippingCost: number
  freeShippingThreshold: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    storeName: '',
    storeDescription: '',
    contactEmail: '',
    currency: 'USD',
    taxRate: 0,
    shippingCost: 0,
    freeShippingThreshold: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('Failed to fetch settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: 'Failed to load settings' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const updatedSettings = {
      storeName: formData.get('storeName'),
      storeDescription: formData.get('storeDescription'),
      contactEmail: formData.get('contactEmail'),
      currency: formData.get('currency'),
      taxRate: parseFloat(formData.get('taxRate') as string),
      shippingCost: parseFloat(formData.get('shippingCost') as string),
      freeShippingThreshold: parseFloat(formData.get('freeShippingThreshold') as string),
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      })

      if (!response.ok) throw new Error('Failed to update settings')
      setMessage({ type: 'success', text: 'Settings updated successfully' })
      setSettings(updatedSettings as Settings)
    } catch (error) {
      console.error('Error updating settings:', error)
      setMessage({ type: 'error', text: 'Failed to update settings' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-2">Store Settings</h1>
          <p className="text-muted">Configure your store settings</p>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-body">
              {message && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <GeneralSettings settings={settings} />
                <FinancialSettings settings={settings} />
                <ShippingSettings settings={settings} />

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 