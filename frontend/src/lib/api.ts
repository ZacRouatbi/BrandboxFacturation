const BASE_URL = process.env.NEST_BASEURL

export const api = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) throw new Error(await res.text())
  return res.json()
}