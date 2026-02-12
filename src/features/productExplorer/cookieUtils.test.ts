import { afterEach, describe, expect, it, vi } from 'vitest';

describe('productExplorer/cookieUtils view-model logic', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('uses fallback values in non-browser environments', async () => {
    const { getCookieBool, setCookie, deleteCookie } = await import('./cookieUtils');

    expect(getCookieBool('missing')).toBe(false);
    expect(getCookieBool('missing', true)).toBe(true);
    expect(() => setCookie('x', '1')).not.toThrow();
    expect(() => deleteCookie('x')).not.toThrow();
  });

  it('sets and reads cookie booleans in browser-like environments', async () => {
    vi.stubGlobal('window', {
      location: { protocol: 'https:' },
    } as any);
    vi.stubGlobal('document', {
      cookie: '',
    } as any);

    const { getCookieBool, setCookie, setCookieBool, deleteCookie } = await import(
      './cookieUtils'
    );

    setCookie('test_cookie', 'hello world', 1);
    expect((globalThis as any).document.cookie).toContain('test_cookie=hello%20world');
    expect((globalThis as any).document.cookie).toContain('Secure');

    setCookieBool('feature_x', true);
    expect(getCookieBool('feature_x')).toBe(true);

    setCookieBool('feature_x', false);
    expect(getCookieBool('feature_x', true)).toBe(false);

    deleteCookie('feature_x');
    expect((globalThis as any).document.cookie).toContain('Max-Age=0');
  });
});
