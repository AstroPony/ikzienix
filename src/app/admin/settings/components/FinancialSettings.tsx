interface FinancialSettingsProps {
  settings: {
    currency: string
    taxRate: number
  }
}

export default function FinancialSettings({ settings }: FinancialSettingsProps) {
  return (
    <div className="mb-4">
      <h3 className="h5 mb-3">Financial Settings</h3>
      <div className="mb-3">
        <label htmlFor="currency" className="form-label">Currency</label>
        <select
          className="form-select"
          id="currency"
          name="currency"
          defaultValue={settings.currency}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="taxRate" className="form-label">Tax Rate (%)</label>
        <input
          type="number"
          className="form-control"
          id="taxRate"
          name="taxRate"
          defaultValue={settings.taxRate}
          min="0"
          max="100"
          step="0.1"
          required
        />
      </div>
    </div>
  )
} 