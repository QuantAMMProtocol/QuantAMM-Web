export const TOS_COOKIE = 'quantamm_tos_accepted_v1.0';

export const LOC_COOKIE = 'quantamm_tos_location_v1.0';

export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

export function setCookie(name: string, value: string, days = 365) {
  if (!isBrowser) return;
  const maxAge = days * 24 * 60 * 60;
  const secure =
    window.location && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

export function setCookieBool(name: string, on: boolean) {
  setCookie(name, on ? '1' : '0');
}

export function deleteCookie(name: string) {
  if (!isBrowser) return;
  const secure =
    typeof window !== 'undefined' && window.location?.protocol === 'https:'
      ? '; Secure'
      : '';
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
}

function getCookie(name: string): string | null {
  if (!isBrowser) return null;
  const match = document.cookie.match(
    new RegExp(
      '(?:^|; )' + name.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&') + '=([^;]*)'
    )
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function getCookieBool(name: string, fallback = false): boolean {
  const v = getCookie(name);
  if (v === null) return fallback;
  return v === '1';
}
