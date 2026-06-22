import axios, { type AxiosRequestConfig } from 'axios'
import router from '@/router'
import { showToast } from '@/composables/useToast'
import { clearAuth, getToken } from '@/utils/storage'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 提取错误提示文本。
 * 后端业务错误走统一格式 { code, message, data }；
 * 但 422 参数校验失败由 FastAPI 默认异常处理器返回，格式是 { detail: [{ loc, msg, type }] }，
 * 需要单独兼容提取，否则会落到 error.message 这种不可读的英文提示上。
 */
function extractErrorMessage(error: any): string {
  const data = error.response?.data
  if (data?.message) return data.message
  if (Array.isArray(data?.detail)) {
    return data.detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join('；') || '参数校验失败'
  }
  if (typeof data?.detail === 'string') return data.detail
  return error.message || '网络异常，请稍后重试'
}

/**
 * 开发环境下使用相对路径（空 baseURL），请求会落到 Vite Dev Server 自身的 origin 上，
 * 由 vite.config.ts 中的 server.proxy 转发给后端，避免浏览器直接跨域触发 CORS 限制。
 * 生产环境没有 Dev Server 代理，直接请求 VITE_API_BASE_URL 指向的后端地址
 * （需后端或反向代理自行配置好 CORS / 同源转发）。
 */
const instance = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

instance.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (response): any => {
    const body = response.data as ApiResponse<unknown>
    if (body.code !== 200) {
      showToast(body.message || '请求失败')
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return body.data
  },
  error => {
    if (error.response?.status === 401) {
      clearAuth()
      showToast('登录已失效，请重新登录')
      router.replace({ path: '/mobile/login', query: { redirect: router.currentRoute.value.fullPath } })
      return Promise.reject(error)
    }
    const message = extractErrorMessage(error)
    showToast(message)
    return Promise.reject(new Error(message))
  }
)

/** 统一请求方法，响应拦截器已将 data 字段解包，故返回值类型即为业务数据本身 */
export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as unknown as Promise<T>
}

export default instance
