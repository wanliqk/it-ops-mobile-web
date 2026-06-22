import type { RepairOrder } from '@/types'

export interface TimelineNode {
  key: 'submitted' | 'accepted' | 'processing' | 'completed'
  label: string
  time?: string
  done: boolean
}

/** 根据工单的各阶段时间戳生成处理进度时间线 */
export function getOrderTimeline(order: RepairOrder): TimelineNode[] {
  return [
    { key: 'submitted', label: '已提交', time: order.createdAt, done: true },
    { key: 'accepted', label: '已受理', time: order.acceptedAt, done: !!order.acceptedAt },
    { key: 'processing', label: '处理中', time: order.processingAt, done: !!order.processingAt },
    { key: 'completed', label: '已完成', time: order.completedAt, done: !!order.completedAt }
  ]
}

/** 格式化 ISO 时间为 "YYYY-MM-DD HH:mm" */
export function formatTime(iso?: string): string {
  if (!iso) return ''
  return iso.replace('T', ' ').slice(0, 16)
}
