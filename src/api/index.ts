import { Api } from './Api'

export const api = new Api<string | null>({
  baseURL: '/',
  securityWorker: (accessToken) =>
    accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {},
})
