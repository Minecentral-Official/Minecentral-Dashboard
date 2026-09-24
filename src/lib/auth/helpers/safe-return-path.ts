export function safeReturnPath(value: unknown, fallback = '/dashboard') {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    /[\\\u0000-\u0020]/.test(value)
  )
    return fallback;
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith('//') || /[\\\u0000-\u0020]/.test(decoded))
      return fallback;
    const url = new URL(value, 'https://return.invalid');
    if (
      url.origin !== 'https://return.invalid' ||
      /^\/(sign-in|api\/auth)(\/|$)/.test(decodeURIComponent(url.pathname))
    )
      return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
