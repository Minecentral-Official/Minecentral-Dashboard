export function sidebarLinkIsActive({
  pathname,
  url,
  exact = false,
}: {
  pathname: string;
  url: string;
  exact?: boolean;
}) {
  const normalizedPathname = normalizePath(pathname);
  const normalizedUrl = normalizePath(url);

  if (exact) return normalizedPathname === normalizedUrl;

  return (
    normalizedPathname === normalizedUrl ||
    normalizedPathname.startsWith(`${normalizedUrl}/`)
  );
}

function normalizePath(path: string) {
  if (path === '/') return path;
  return path.replace(/\/+$/, '');
}
