// @ts-nocheck
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import SocialShare from '../social/SocialShare';

expect.extend(toHaveNoViolations);

describe('SocialShare accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<SocialShare />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 