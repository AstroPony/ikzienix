import { TestBed } from '@angular/core/testing';

import { FeatureFlagService } from './feature-flag.service';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true for enabled features', () => {
    expect(service.isFeatureEnabled('auth')).toBeTrue();
    expect(service.isFeatureEnabled('adminPanel')).toBeTrue();
  });

  it('should return false for disabled features', () => {
    service.setFeatureFlag('auth', false);
    expect(service.isFeatureEnabled('auth')).toBeFalse();
  });

  it('should allow toggling feature flags', () => {
    service.setFeatureFlag('productList', false);
    expect(service.isFeatureEnabled('productList')).toBeFalse();
    service.setFeatureFlag('productList', true);
    expect(service.isFeatureEnabled('productList')).toBeTrue();
  });
});
