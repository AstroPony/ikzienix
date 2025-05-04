interface GeneralSettingsProps {
  settings: {
    storeName: string
    storeDescription: string
    contactEmail: string
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
    </div>
  )
} 