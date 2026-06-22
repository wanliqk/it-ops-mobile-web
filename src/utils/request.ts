import axios, { type AxiosRequestConfig } from 'axios'
import router from '@/router'
import { showToast } from '@/composables/useToast'
import { clearAuth, getToken } from '@/utils/storage'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
    const message = error.response?.data?.message || error.message || '网络异常，请稍后重试'
    showToast(message)
    return Promise.reject(new Error(message))
  }
)

/** 统一请求方法，响应拦截器已将 data 字段解包，故返回值类型即为业务数据本身 */
export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as unknown as Promise<T>
}

export default instance
