import axios from 'axios'
import { request } from '@/utils/request'
import { getToken, clearAuth } from '@/utils/storage'
import { showToast } from '@/composables/useToast'
import router from '@/router'
import type { MobileFileItem } from '@/types'

/** 单文件上传，用于报修图片等场景，成功后返回文件对象（含 id），创建工单时通过 attachment_file_ids 绑定 */
export function uploadFile(file: File): Promise<MobileFileItem> {
  const formData = new FormData()
  formData.append('file', file)
  return request({ url: '/api/mobile/files/upload', method: 'post', data: formData })
}

/** 批量上传图片，仅支持 jpg/jpeg/png/gif/webp，由后端校验并拒绝其他类型 */
export function batchUploadFiles(files: File[]): Promise<MobileFileItem[]> {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  return request({ url: '/api/mobile/files/batch-upload', method: 'post', data: formData })
}

/** 根据业务对象查询附件，目前仅支持 business_type=ticket_attachment，用于工单详情页展示图片 */
export function getFilesByBusiness(businessType: string, businessId: number | string): Promise<MobileFileItem[]> {
  return request({
    url: '/api/mobile/files/by-business',
    method: 'get',
    params: { business_type: businessType, business_id: businessId }
  })
}

/**
 * 获取文件预览的本地 blob URL。
 * 预览接口返回图片二进制流，而非统一的 { code, message, data } 包体，且需要携带
 * Authorization 头才能访问，因此不能把 access_url 直接拼进 <img src>，而是单独发起
 * 一个带 Bearer token 的请求把二进制转成 blob: URL 使用，用完需调用 URL.revokeObjectURL 释放。
 */
export async function getFilePreviewBlobUrl(fileId: number | string): Promise<string> {
  const token = getToken()
  try {
    const response = await axios.get(`/api/mobile/files/${fileId}/preview`, {
      baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL,
      responseType: 'blob',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
    return URL.createObjectURL(response.data as Blob)
  } catch (error: any) {
    if (error.response?.status === 401) {
      clearAuth()
      showToast('登录已失效，请重新登录')
      router.replace({ path: '/mobile/login', query: { redirect: router.currentRoute.value.fullPath } })
    }
    throw error
  }
}
