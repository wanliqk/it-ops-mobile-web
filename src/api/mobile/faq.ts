import { request } from '@/utils/request'
import type { FaqCategory, FaqItem, FaqListQuery, PageResult } from '@/types'

/** FAQ 分类 */
export function getFaqCategories(): Promise<FaqCategory[]> {
  return request({ url: '/api/mobile/faqs/categories', method: 'get' })
}

/** FAQ 列表（分类筛选 + 关键词搜索 + 分页） */
export function getFaqs(query: FaqListQuery): Promise<PageResult<FaqItem>> {
  return request({ url: '/api/mobile/faqs', method: 'get', params: query })
}

/** FAQ 详情（后端会自动增加 view_count） */
export function getFaqDetail(id: string | number): Promise<FaqItem> {
  return request({ url: `/api/mobile/faqs/${id}`, method: 'get' })
}
