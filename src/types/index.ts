// ============ 用户 ============
export interface UserInfo {
  id: number | string
  username: string
  name: string
  department?: string
  phone?: string
}

// ============ 登录 ============
export interface LoginForm {
  username: string
  password: string
}

export interface LoginResult {
  access_token: string
  token_type: string
  user: UserInfo
}

// ============ 工单状态 ============
export type TicketStatus = 'pending' | 'assigned' | 'processing' | 'completed' | 'cancelled'

export const ticketStatusMap: Record<TicketStatus, string> = {
  pending: '待受理',
  assigned: '已派单',
  processing: '处理中',
  completed: '已完成',
  cancelled: '已取消'
}

export const TicketStatusOptions: { value: TicketStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待受理' },
  { value: 'assigned', label: '已派单' },
  { value: 'processing', label: '处理中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

// ============ 优先级 ============
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent'

export const priorityMap: Record<TicketPriority, string> = {
  low: '低',
  normal: '普通',
  high: '高',
  urgent: '紧急'
}

// ============ 故障类型 ============
export type FaultType = 'hardware' | 'software' | 'network' | 'printer' | 'other'

export const faultTypeMap: Record<FaultType, string> = {
  hardware: '硬件故障',
  software: '软件故障',
  network: '网络故障',
  printer: '打印机故障',
  other: '其他问题'
}

// ============ 字典选项（来自后端 form-options 接口） ============
export interface DictOption {
  value: string
  label: string
}

export interface TicketFormOptions {
  fault_types: DictOption[]
  priorities: DictOption[]
}

// ============ 关联人 / 资产简要信息 ============
export interface BriefUser {
  id: number | string
  name: string
  department?: string
  phone?: string
}

export interface BriefAsset {
  id: number | string
  asset_no: string
  name: string
}

export interface AssetOption {
  id: number | string
  asset_no: string
  name: string
}

// ============ 工单流转记录 ============
export interface TicketRecord {
  id: number | string
  action: string
  content?: string
  operator?: string
  created_at: string
}

// ============ 工单 ============
export interface Ticket {
  id: number | string
  ticket_no: string
  title: string
  description: string
  fault_type: string
  priority: string
  status: TicketStatus
  reporter?: BriefUser | null
  assignee?: BriefUser | null
  asset?: BriefAsset | null
  result?: string | null
  created_at: string
  assigned_at?: string | null
  processing_at?: string | null
  completed_at?: string | null
  records?: TicketRecord[]
}

// ============ 发起报修表单 ============
export interface TicketCreateForm {
  title: string
  description: string
  fault_type: string
  priority: string
  asset_id?: number | string | null
}

// ============ 分页 ============
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  page_size: number
}

export interface TicketListQuery {
  page?: number
  page_size?: number
  status?: TicketStatus | 'all'
  keyword?: string
}

// ============ 首页统计 ============
export interface HomeSummary {
  total_count: number
  pending_count: number
  assigned_count: number
  processing_count: number
  completed_count: number
  cancelled_count: number
}

// ============ 常见问题 ============
export interface FaqCategory {
  value: string
  label: string
}

export interface FaqItem {
  id: number | string
  title: string
  summary?: string
  category: string
  view_count?: number
  created_at: string
  content?: string
}

export interface FaqListQuery {
  category?: string
  keyword?: string
  page?: number
  page_size?: number
}
