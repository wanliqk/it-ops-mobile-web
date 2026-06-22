import { request } from '@/utils/request'
import type { LoginForm, LoginResult, UserInfo } from '@/types'
import { clearAuth } from '@/utils/storage'

/** 员工登录 */
export function login(data: LoginForm): Promise<LoginResult> {
  return request({ url: '/api/mobile/auth/login', method: 'post', data })
}

/** 获取当前登录用户信息，用于刷新页面后恢复登录状态 */
export function getMe(): Promise<UserInfo> {
  return request({ url: '/api/mobile/auth/me', method: 'get' })
}

/** 退出登录（后端暂无登出接口，仅清除本地登录态） */
export async function logout(): Promise<void> {
  clearAuth()
}
