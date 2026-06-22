// ============ 用户 ============
export interface UserInfo {
  id: number | string
  username: string
  real_name: string
  role?: string
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

// ============ 工单流转记录 action 展示映射 ============
export const ticketRecordActionMap: Record<string, string> = {
  create: '提交工单',
  assign: '派单',
  process: '开始处理',
  complete: '完成处理',
  cancel: '撤销工单'
}

// ============ 字典选项（来自后端 form-options / faqs/categories 接口） ============
export interface DictOption {
  value: string
  label: string
}

export interface TicketFormOptions {
  fault_types: DictOption[]
  priorities: DictOption[]
}

// ============ 关联人信息 ============
export interface BriefUser {
  id: number | string
  username: string
  real_name: string
  department?: string
  phone?: string
}

// ============ 资产信息（发起报修页可选列表） ============
export interface AssetOption {
  id: number | string
  asset_no: string
  asset_name: string
  brand?: string
  model?: string
  status?: string
  location?: string
}

// ============ 资产信息（工单详情中关联资产） ============
export interface TicketAsset {
  id: number | string
  asset_no: string
  asset_name: string
  brand?: string
  model?: string
  serial_no?: string
  location?: string
  status?: string
}

// ============ 工单流转记录 ============
export interface TicketRecord {
  id: number | string
  action: string
  from_status?: TicketStatus | null
  to_status?: TicketStatus | null
  remark?: string | null
  operator?: BriefUser | null
  created_at: string
}

// ============ 工单（列表 / 最近报修，字段较精简） ============
export interface TicketBrief {
  id: number | string
  ticket_no: string
  title: string
  status: TicketStatus
  created_at: string
  fault_type: string
  priority: string
  asset_id?: number | string | null
}

// ============ 工单详情（字段完整） ============
export interface Ticket {
  id: number | string
  ticket_no: string
  title: string
  description: string
  fault_type: string
  priority: string
  status: TicketStatus
  result?: string | null
  reporter?: BriefUser | null
  handler?: BriefUser | null
  asset?: TicketAsset | null
  records?: TicketRecord[]
  created_at: string
  assigned_at?: string | null
  started_at?: string | null
  completed_at?: string | null
  updated_at?: string
}

// ============ 创建 / 撤销工单的精简返回 ============
export interface TicketActionResult {
  id: number | string
  ticket_no: string
  title?: string
  status: TicketStatus
  created_at?: string
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
  items: T[]
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
  updated_at?: string
  content?: string
}

export interface FaqListQuery {
  category?: string
  keyword?: string
  page?: number
  page_size?: number
}
