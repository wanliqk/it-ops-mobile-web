import { request } from '@/utils/request'
import type { HomeSummary, Ticket } from '@/types'

/** 报修首页统计 */
export function getSummary(): Promise<HomeSummary> {
  return request({ url: '/api/mobile/home/summary', method: 'get' })
}

/** 最近报修记录 */
export function getRecentTickets(limit = 5): Promise<Ticket[]> {
  return request({ url: '/api/mobile/tickets/recent', method: 'get', params: { limit } })
}
