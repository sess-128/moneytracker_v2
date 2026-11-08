/** Decode expiry only; token authenticity is always verified by the server. */
export const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(payload))
    return typeof exp === 'number' && Number.isFinite(exp) ? exp * 1000 : null
  } catch {
    return null
  }
}

export const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token)
  return expiry !== null && expiry <= Date.now()
}
