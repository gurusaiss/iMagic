const CSRF_COOKIE = "csrf_token";

function readCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method ?? "GET").toUpperCase();
  if (method === "GET" || method === "HEAD") return fetch(url, options);

  const token = readCsrfToken();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { "x-csrf-token": token } : {}),
    },
  });
}
