/** Production API base (used when env is missing on live site so requests still hit backend). */
const PRODUCTION_API_BASE = 'https://the-consultant-backend.vercel.app/api';

/** Normalize backend URL to full API base (https + /api). Supports REACT_APP_BACKEND_URL (host only) or REACT_APP_API_URL (full base). */
function normalizeApiBase(value) {
  if (!value || typeof value !== 'string') return '';
  const s = value.trim();
  const url = s.startsWith('http://') || s.startsWith('https://') ? s : `https://${s}`;
  try {
    const parsed = new URL(url);
    const path = (parsed.pathname || '/').replace(/\/+$/, '') || '';
    const base = path.endsWith('api') ? `${parsed.origin}/${path}` : `${parsed.origin}/${path ? path + '/' : ''}api`;
    return base;
  } catch {
    return '';
  }
}

/**
 * API base URL for backend requests.
 * - REACT_APP_API_URL (full base, e.g. https://.../api) is used as-is.
 * - REACT_APP_BACKEND_URL (host only, e.g. the-consultant-backend.vercel.app) is normalized to https + /api.
 * - When running on live host and both unset: use production backend.
 * - Otherwise (local dev): empty string so relative /api/... uses the dev server proxy.
 */
export const getApiBase = () => {
  const apiUrlEnv = process.env.REACT_APP_API_URL;
  if (apiUrlEnv) return normalizeApiBase(apiUrlEnv);
  const backendUrlEnv = process.env.REACT_APP_BACKEND_URL;
  if (backendUrlEnv) return normalizeApiBase(backendUrlEnv);
  if (typeof window !== 'undefined') {
    const isLocal = /^localhost$|^127\.\d+\.\d+\.\d+$/.test(window.location.hostname);
    if (!isLocal) return PRODUCTION_API_BASE;
  }
  return '';
};

/** Build full API URL for a path (e.g. 'seeker/register' or '/api/seeker/register'). */
export const apiUrl = (path) => {
  const base = getApiBase();
  const pathNorm = path.replace(/^\/api\/?/, ''); // e.g. 'login', 'seeker/register'
  if (base) {
    // Base already includes /api (e.g. .../api), so append only the path segment
    return `${base.replace(/\/$/, '')}/${pathNorm}`;
  }
  return `/api/${pathNorm}`;
};
