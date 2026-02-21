/** Production API base (used when env is missing on live site so requests still hit backend). */
const PRODUCTION_API_BASE = 'https://the-consultant-backend.vercel.app/api';

/** Normalize backend URL to full API base (https + /api), no trailing slash. */
function normalizeApiBase(value) {
  if (!value || typeof value !== 'string') return '';
  const s = value.trim();
  const url = s.startsWith('http://') || s.startsWith('https://') ? s : `https://${s}`;
  try {
    const parsed = new URL(url);
    const path = (parsed.pathname || '/').replace(/\/+$/, '').replace(/^\/+/, '') || '';
    const base = path.endsWith('api') ? `${parsed.origin}/${path}` : `${parsed.origin}/${path ? path + '/' : ''}api`;
    return base.replace(/\/+$/, '').replace(/([^:])\/\/+/g, '$1/');
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
  let out = '';
  const apiUrlEnv = process.env.REACT_APP_API_URL;
  if (apiUrlEnv) out = normalizeApiBase(apiUrlEnv);
  else if (process.env.REACT_APP_BACKEND_URL) out = normalizeApiBase(process.env.REACT_APP_BACKEND_URL);
  else if (typeof window !== 'undefined') {
    const isLocal = /^localhost$|^127\.\d+\.\d+\.\d+$/.test(window.location.hostname);
    if (!isLocal) out = PRODUCTION_API_BASE;
  }
  return collapseSlashes(out).replace(/\/+$/, '');
};

/** Collapse all duplicate slashes (keep :// only). Guarantees no // in path. */
function collapseSlashes(url) {
  const i = url.indexOf('://');
  if (i === -1) return url.replace(/\/+/g, '/');
  return url.slice(0, i + 3) + url.slice(i + 3).replace(/\/+/g, '/');
}

/** Build full API URL for a path. Never produces double slashes. */
export const apiUrl = (path) => {
  const base = getApiBase();
  const pathNorm = (path || '').replace(/^\/?api\/?/, '').replace(/^\/+/, '') || '';
  if (base) {
    const baseClean = base.replace(/\/+$/, '');
    const full = pathNorm ? `${baseClean}/${pathNorm}` : baseClean;
    return collapseSlashes(full);
  }
  return `/api/${pathNorm}`;
};

/** Exact URL for consultant register (avoids any base+path slash issues). */
export const consultantRegisterUrl = () => {
  const base = getApiBase().replace(/\/+$/, '');
  return base ? collapseSlashes(`${base}/consultant/register`) : '/api/consultant/register';
};
