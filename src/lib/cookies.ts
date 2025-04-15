import { cookies } from 'next/headers';

export async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = cookies();
  return (await cookieStore).get(name)?.value;
}

export function createSetCookieHeader(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
  } = {}
): string {
  const pairs = [`${name}=${encodeURIComponent(value)}`];
  
  if (options.maxAge) pairs.push(`Max-Age=${options.maxAge}`);
  if (options.expires) pairs.push(`Expires=${options.expires.toUTCString()}`);
  if (options.path) pairs.push(`Path=${options.path}`);
  if (options.domain) pairs.push(`Domain=${options.domain}`);
  if (options.secure) pairs.push('Secure');
  if (options.httpOnly) pairs.push('HttpOnly');
  if (options.sameSite) pairs.push(`SameSite=${options.sameSite}`);

  return pairs.join('; ');
}