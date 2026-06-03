export function formatImageUrl(url) {
  if (!url) return null;
  return `/${url.replace(/^public\//, '').replace(/^\//, '')}`;
}
