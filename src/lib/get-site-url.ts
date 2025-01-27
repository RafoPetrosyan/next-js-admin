export function getSiteURL(): string {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000/';

  url = url.includes('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
}
