import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private featureFlags: Map<string, boolean> = new Map();

  constructor() {
    // Initialize with default values
    this.featureFlags.set('auth', true);
    this.featureFlags.set('adminPanel', true);
    this.featureFlags.set('productList', true);
    this.featureFlags.set('productCRUD', true);
  }

  isFeatureEnabled(featureName: string): boolean {
    return this.featureFlags.get(featureName) || false;
  }

  setFeatureFlag(featureName: string, enabled: boolean): void {
    this.featureFlags.set(featureName, enabled);
  }
}
