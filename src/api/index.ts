import type { FaqItem, RepairCreateForm, RepairOrder, RepairStatus, UserInfo } from '@/types'
import { delay } from '@/utils/delay'
import { cloneOrder, mockFaqList, mockOrders, mockUser, nextOrderNo } from './mockDb'

/**
 * Mock API 层。
 *
 * 当前阶段所有接口均基于内存数据模拟，函数签名已按照真实后端接口设计，
 * 后续接入 FastAPI 后端时，只需将函数体替换为真实的 HTTP 请求即可，
 * 页面侧调用方式无需改动。例如：
 *
 *   export async function getCurrentUser(): Promise<UserInfo> {
 *     const { data } = await axios.get('/api/user/current')
 *     return data
 *   }
 */

/** 获取当前登录用户信息 */
export async function getCurrentUser(): Promise<UserInfo> {
  // TODO: 替换为 GET /api/user/current
  await delay()
  return { ...mockUser }
}

/** 获取我的报修工单列表，按提交时间倒序，可选按状态筛选 */
export async function getMyRepairList(params?: { status?: RepairStatus | 'all' }): Promise<RepairOrder[]> {
  // TODO: 替换为 GET /api/repair/my-list，并将筛选条件传给后端
  await delay()
  let list = mockOrders.map(cloneOrder)
  list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  if (params?.status && params.status !== 'all') {
    list = list.filter(o => o.status === params.status)
  }
  return list
}

/** 获取报修工单详情 */
export async function getRepairDetail(id: string): Promise<RepairOrder | undefined> {
  // TODO: 替换为 GET /api/repair/detail/{id}
  await delay()
  const order = mockOrders.find(o => o.id === id)
  return order ? cloneOrder(order) : undefined
}

/** 创建报修工单 */
export async function createRepairOrder(data: RepairCreateForm): Promise<RepairOrder> {
  // TODO: 替换为 POST /api/repair/create，传入 data
  await delay(500)
  if (!data.category) {
    throw new Error('故障类型不能为空')
  }
  const order: RepairOrder = {
    id: `order-${mockOrders.length + 1}-${Date.now()}`,
    orderNo: nextOrderNo(),
    reporterName: data.reporterName.trim(),
    department: data.department.trim(),
    phone: data.phone.trim(),
    category: data.category,
    device: data.device?.trim() || undefined,
    location: data.location.trim(),
    priority: data.priority,
    description: data.description.trim(),
    images: [...data.images],
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  mockOrders.unshift(order)
  return cloneOrder(order)
}

/** 撤销报修（仅“待受理”状态可撤销） */
export async function cancelRepairOrder(id: string): Promise<boolean> {
  // TODO: 替换为 POST /api/repair/cancel/{id}
  await delay()
  const order = mockOrders.find(o => o.id === id)
  if (!order || order.status !== 'pending') return false
  order.status = 'closed'
  order.cancelled = true
  return true
}

/** 用户确认工单已完成（仅“已完成”状态可确认，确认后转为已关闭） */
export async function confirmRepairFinished(id: string): Promise<boolean> {
  // TODO: 替换为 POST /api/repair/confirm/{id}
  await delay()
  const order = mockOrders.find(o => o.id === id)
  if (!order || order.status !== 'completed') return false
  order.status = 'closed'
  return true
}

/** 获取常见问题列表 */
export async function getFaqList(): Promise<FaqItem[]> {
  // TODO: 替换为 GET /api/faq/list
  await delay()
  return mockFaqList.map(item => ({ ...item }))
}
