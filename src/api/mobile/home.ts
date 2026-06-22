import { request } from '@/utils/request'
import type { HomeSummary, TicketBrief } from '@/types'

/** 报修首页统计 */
export function getSummary(): Promise<HomeSummary> {
  return request({ url: '/api/mobile/home/summary', method: 'get' })
}

/** 最近报修记录，limit 范围 1-100，默认 5 */
export function getRecentTickets(limit = 5): Promise<TicketBrief[]> {
  return request({ url: '/api/mobile/tickets/recent', method: 'get', params: { limit } })
}
