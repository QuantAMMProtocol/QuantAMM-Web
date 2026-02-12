import { describe, expect, it } from 'vitest';
import {
  buildTosAuditLogRequest,
  isContinueEnabledForLocation,
  shouldRedirectToIneligible,
} from './termsOfServiceModalUtils';

describe('termsOfServiceModal view-model logic', () => {
  it('enables continue only for explicitly non-UK location', () => {
    expect(isContinueEnabledForLocation('')).toBe(false);
    expect(isContinueEnabledForLocation('uk')).toBe(false);
    expect(isContinueEnabledForLocation('nonUk')).toBe(true);
  });

  it('redirects ineligible flows and allows only enabled non-UK continuation', () => {
    expect(shouldRedirectToIneligible('uk', false)).toBe(true);
    expect(shouldRedirectToIneligible('uk', true)).toBe(true);
    expect(shouldRedirectToIneligible('nonUk', false)).toBe(true);
    expect(shouldRedirectToIneligible('nonUk', true)).toBe(false);
  });

  it('builds the ToS audit payload with required fields', () => {
    const request = buildTosAuditLogRequest({
      hostname: 'quantamm.fi',
      page: 'productExplorer',
      isMobile: true,
    });

    expect(request).toEqual(
      expect.objectContaining({
        user: 'quantamm.fi',
        page: 'productExplorer-tos-gate',
        isMobile: true,
        tosAgreement: 'accepted',
      })
    );
    expect(typeof request.timestamp).toBe('string');
  });
});
