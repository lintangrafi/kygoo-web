function resolveApiOrigin(rawUrl?: string): string {
  const fallback = 'http://localhost:8080';

  if (!rawUrl) {
    return fallback;
  }

  const normalized = rawUrl.trim().replace(/\/+$/, '');
  if (!normalized) {
    return fallback;
  }

  if (/^https?:\/\//i.test(normalized)) {
    try {
      return new URL(normalized).origin;
    } catch {
      return fallback;
    }
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return fallback;
}

function ensureUploadsPath(path: string): string {
  if (!path) {
    return path;
  }

  const slashNormalized = path.replace(/\\/g, '/');
  if (slashNormalized.startsWith('/uploads/')) {
    return slashNormalized;
  }
  if (slashNormalized.startsWith('uploads/')) {
    return `/${slashNormalized}`;
  }
  if (slashNormalized.startsWith('/business-projects/')) {
    return `/uploads${slashNormalized}`;
  }
  if (slashNormalized.startsWith('business-projects/')) {
    return `/uploads/${slashNormalized}`;
  }

  const uploadsIndex = slashNormalized.indexOf('/uploads/');
  if (uploadsIndex >= 0) {
    return slashNormalized.slice(uploadsIndex);
  }

  return slashNormalized;
}

export function normalizeMediaUrl(url: string, apiUrl = process.env.NEXT_PUBLIC_API_URL): string {
  const value = (url || '').trim();
  if (!value) {
    return value;
  }

  if (/^(data:|blob:)/i.test(value)) {
    return value;
  }

  const apiOrigin = resolveApiOrigin(apiUrl);

  if (/^(\/uploads\/|uploads\/|\/business-projects\/|business-projects\/)/i.test(value)) {
    return `${apiOrigin}${ensureUploadsPath(value)}`;
  }

  try {
    const parsed = new URL(value);
    const normalizedPath = ensureUploadsPath(parsed.pathname);
    if (/^\/uploads\//i.test(normalizedPath)) {
      const suffix = `${parsed.search}${parsed.hash}`;
      return `${apiOrigin}${normalizedPath}${suffix}`;
    }
    return value;
  } catch {
    return value;
  }
}