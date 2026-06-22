import { request } from '@/utils/request'
import type {
  PageResult,
  Ticket,
  TicketActionResult,
  TicketBrief,
  TicketCreateForm,
  TicketFormOptions,
  TicketListQuery
} from '@/types'

/** 故障类型 / 紧急程度 选项 */
export function getFormOptions(): Promise<TicketFormOptions> {
  return request({ url: '/api/mobile/tickets/form-options', method: 'get' })
}

/** 创建报修工单（reporter_id 由后端根据登录用户确定，前端不传） */
export function createTicket(data: TicketCreateForm): Promise<TicketActionResult> {
  return request({ url: '/api/mobile/tickets', method: 'post', data })
}

/** 我的报修列表（分页 + 状态筛选 + 关键词搜索） */
export function getTickets(query: TicketListQuery): Promise<PageResult<TicketBrief>> {
  const params = { ...query, status: query.status === 'all' ? undefined : query.status }
  return request({ url: '/api/mobile/tickets', method: 'get', params })
}

/** 报修详情 */
export function getTicketDetail(id: string | number): Promise<Ticket> {
  return request({ url: `/api/mobile/tickets/${id}`, method: 'get' })
}

/** 取消报修（仅 pending 状态、且仅报修人本人可撤销） */
export function cancelTicket(id: string | number, reason?: string): Promise<TicketActionResult> {
  return request({ url: `/api/mobile/tickets/${id}/cancel`, method: 'post', data: { reason } })
}
