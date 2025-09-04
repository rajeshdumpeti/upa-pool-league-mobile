let _token: string | null = null;

export function setAuthToken(t: string | null) {
  _token = t;
}
export function getAuthToken(): string | null {
  return _token;
}
