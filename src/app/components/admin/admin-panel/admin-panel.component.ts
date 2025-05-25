import { Component } from '@angular/core';
import { FeatureFlagService } from '../../../services/feature-flag.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  imports: [FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  featureFlags: { name: string; enabled: boolean }[] = [];

  constructor(private featureFlagService: FeatureFlagService) {
    this.loadFeatureFlags();
  }

  loadFeatureFlags() {
    // For demo, use a static list. In a real app, fetch from backend or service.
    const flagNames = ['auth', 'adminPanel', 'productList', 'productCRUD'];
    this.featureFlags = flagNames.map(name => ({
      name,
      enabled: this.featureFlagService.isFeatureEnabled(name)
    }));
  }

  toggleFlag(flag: { name: string; enabled: boolean }) {
    flag.enabled = !flag.enabled;
    this.featureFlagService.setFeatureFlag(flag.name, flag.enabled);
  }

  readableFlagName(flag: string): string {
    // Convert camelCase or similar to Title Case with spaces
    return flag
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('Crud', 'CRUD')
      .replace('Id', 'ID');
  }
}
