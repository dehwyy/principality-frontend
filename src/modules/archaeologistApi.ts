import axios from 'axios'
import { api } from '../api'

const ACCESS_TOKEN_KEY = 'archaeologist_access_token'

export interface ArchaeologistCredentials {
  archaeologist_login: string
  archaeologist_password: string
}

interface ArchaeologistToken {
  access_token: string
  expires_in: number
  token_type: string
}

export const loginArchaeologist = async (credentials: ArchaeologistCredentials): Promise<string> => {
  const response = await axios.post<ArchaeologistToken>('/api/archaeologists/login', credentials)
  const accessToken = response.data.access_token
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  api.setSecurityData(accessToken)
  return accessToken
}

export const logoutArchaeologist = async (accessToken: string): Promise<void> => {
  try {
    await axios.post('/api/archaeologists/logout', null, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  } finally {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    api.setSecurityData(null)
  }
}
