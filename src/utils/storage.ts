import type { UserInfo } from '@/types'

/**
 * 登录态本地持久化。
 * 后续接入 FastAPI 后端后，token 仍可沿用此方式存储，
 * 仅需将 api/index.ts 中 login()/logout() 替换为真实请求。
 */

const TOKEN_KEY = 'it_ops_token'
const USER_KEY = 'it_ops_user'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): UserInfo | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as UserInfo) : null
}

export function setAuth(token: string, user: UserInfo): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
