import { describe, expect, it } from 'vitest';
import {
  buildProductModalAuditLogRequest,
  isProductModalActionDisabled,
} from './productModalUtils';

describe('productModal view-model logic', () => {
  it('disables action until disclaimer is accepted and ToS is accepted', () => {
    expect(isProductModalActionDisabled(false, false)).toBe(true);
    expect(isProductModalActionDisabled(false, true)).toBe(true);
    expect(isProductModalActionDisabled(true, false)).toBe(true);
    expect(isProductModalActionDisabled(true, true)).toBe(false);
  });

  it('builds withdraw and deposit audit payloads with expected page keys', () => {
    const withdrawRequest = buildProductModalAuditLogRequest({
      isWithdraw: true,
      understandExternalWebsite: true,
      visitorId: 'visitor-1',
    });
    const depositRequest = buildProductModalAuditLogRequest({
      isWithdraw: false,
      understandExternalWebsite: false,
      visitorId: undefined,
    });

    expect(withdrawRequest).toEqual(
      expect.objectContaining({
        user: 'visitor-1',
        page: 'productDetail-withdraw-redirect',
        tosAgreement: 'accepted',
      })
    );
    expect(depositRequest).toEqual(
      expect.objectContaining({
        user: 'unknown',
        page: 'productDetail-deposit-redirect',
        tosAgreement: 'not accepted',
      })
    );
    expect(typeof withdrawRequest.timestamp).toBe('string');
  });
});
