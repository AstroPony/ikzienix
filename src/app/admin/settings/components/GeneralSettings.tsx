interface GeneralSettingsProps {
  settings: {
    storeName: string
    storeDescription: string
    contactEmail: string
    storePhone?: string
    storeLogo?: string
    storeAddress?: string
    maintenanceMode?: boolean
    orderEmailNotifications?: boolean
  }
}

export default function GeneralSettings({ settings }: GeneralSettingsProps) {
  return (
    <div className="mb-4">
      <h3 className="h5 mb-3">General Settings</h3>
      <div className="mb-3">
        <label htmlFor="storeName" className="form-label">Store Name</label>
        <input
          type="text"
          className="form-control"
          id="storeName"
          name="storeName"
          defaultValue={settings.storeName}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="storeDescription" className="form-label">Store Description</label>
        <textarea
          className="form-control"
          id="storeDescription"
          name="storeDescription"
          defaultValue={settings.storeDescription}
          rows={3}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="contactEmail" className="form-label">Contact Email</label>
        <input
          type="email"
          className="form-control"
          id="contactEmail"
          name="contactEmail"
          defaultValue={settings.contactEmail}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="storePhone" className="form-label">Store Phone</label>
        <input
          type="tel"
          className="form-control"
          id="storePhone"
          name="storePhone"
          defaultValue={settings.storePhone || ''}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="storeLogo" className="form-label">Store Logo URL</label>
        <input
          type="url"
          className="form-control"
          id="storeLogo"
          name="storeLogo"
          defaultValue={settings.storeLogo || ''}
          onInput={e => {
            const img = document.getElementById('logo-preview') as HTMLImageElement;
            if (img) img.src = (e.target as HTMLInputElement).value || 'https://via.placeholder.com/120x60?text=Logo';
          }}
        />
        <div className="mt-2">
          <img
            id="logo-preview"
            src={settings.storeLogo || 'https://via.placeholder.com/120x60?text=Logo'}
            alt="Logo Preview"
            style={{ maxHeight: 60, maxWidth: 120, objectFit: 'contain', border: '1px solid #ddd', background: '#fff' }}
          />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="storeAddress" className="form-label">Store Address</label>
        <textarea
          className="form-control"
          id="storeAddress"
          name="storeAddress"
          defaultValue={settings.storeAddress || ''}
          rows={2}
        />
      </div>
      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="maintenanceMode"
          name="maintenanceMode"
          defaultChecked={settings.maintenanceMode || false}
        />
        <label className="form-check-label" htmlFor="maintenanceMode">
          Maintenance Mode
        </label>
      </div>
      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="orderEmailNotifications"
          name="orderEmailNotifications"
          defaultChecked={settings.orderEmailNotifications || false}
        />
        <label className="form-check-label" htmlFor="orderEmailNotifications">
          Order Email Notifications
        </label>
      </div>
    </div>
  )
} 