// Extracts the user-facing message from an API error thrown by $fetch
export const apiError = (err: any, fallback: string): string =>
  err?.data?.data?.message || err?.data?.message || fallback
