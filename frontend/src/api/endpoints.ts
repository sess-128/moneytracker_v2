const V1 = '/api/v1'

export const API_ENDPOINTS = {
  auth: {
    login: `${V1}/users/login`,
    register: `${V1}/users/registration`,
    me: `${V1}/users/me`,
  },
  categories: {
    root: `${V1}/categories`,
  },
  transactions: {
    root: `${V1}/transactions`,
    byFilter: `${V1}/transactions/by-filter`,
  },
} as const