interface ShippingSettingsProps {
  settings: {
    shippingCost: number
    freeShippingThreshold: number
  }
}

export default function ShippingSettings({ settings }: ShippingSettingsProps) {
  return (
    <div className="mb-4">
      <h3 className="h5 mb-3">Shipping Settings</h3>
      <div className="mb-3">
        <label htmlFor="shippingCost" className="form-label">Standard Shipping Cost</label>
        <input
          type="number"
          className="form-control"
          id="shippingCost"
          name="shippingCost"
          defaultValue={settings.shippingCost}
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="freeShippingThreshold" className="form-label">
          Free Shipping Threshold
        </label>
        <input
          type="number"
          className="form-control"
          id="freeShippingThreshold"
          name="freeShippingThreshold"
          defaultValue={settings.freeShippingThreshold}
          min="0"
          step="0.01"
          required
        />
        <div className="form-text">
          Orders above this amount qualify for free shipping
        </div>
      </div>
    </div>
  )
} 