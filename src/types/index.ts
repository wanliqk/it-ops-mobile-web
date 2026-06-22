// ============ 用户 ============
export interface UserInfo {
  id: string
  name: string
  department: string
  phone: string
}

// ============ 登录 ============
export interface LoginForm {
  phone: string
  password: string
}

export interface LoginResult {
  token: string
  user: UserInfo
}

// ============ 工单状态 ============
export type RepairStatus = 'pending' | 'processing' | 'completed' | 'closed'

export const RepairStatusLabel: Record<RepairStatus, string> = {
  pending: '待受理',
  processing: '处理中',
  completed: '已完成',
  closed: '已关闭'
}

export const RepairStatusOptions: { value: RepairStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待受理' },
  { value: 'processing', label: '处理中' },
  { value: 'completed', label: '已完成' },
  { value: 'closed', label: '已关闭' }
]

// ============ 紧急程度 ============
export type RepairPriority = 'normal' | 'urgent' | 'critical'

export const RepairPriorityLabel: Record<RepairPriority, string> = {
  normal: '普通',
  urgent: '紧急',
  critical: '非常紧急'
}

export const RepairPriorityOptions: { value: RepairPriority; label: string }[] = [
  { value: 'normal', label: '普通' },
  { value: 'urgent', label: '紧急' },
  { value: 'critical', label: '非常紧急' }
]

// ============ 故障类型 ============
export type RepairCategory =
  | 'computer'
  | 'printer'
  | 'network'
  | 'account'
  | 'software'
  | 'other'

export const RepairCategoryLabel: Record<RepairCategory, string> = {
  computer: '电脑故障',
  printer: '打印机故障',
  network: '网络故障',
  account: '系统账号问题',
  software: '软件安装',
  other: '其他问题'
}

export const RepairCategoryOptions: { value: RepairCategory; label: string }[] = [
  { value: 'computer', label: '电脑故障' },
  { value: 'printer', label: '打印机故障' },
  { value: 'network', label: '网络故障' },
  { value: 'account', label: '系统账号问题' },
  { value: 'software', label: '软件安装' },
  { value: 'other', label: '其他问题' }
]

// ============ 工单 ============
export interface RepairOrder {
  id: string
  orderNo: string
  reporterName: string
  department: string
  phone: string
  category: RepairCategory
  /** 故障设备：资产编号 / 设备名称，可选 */
  device?: string
  location: string
  priority: RepairPriority
  description: string
  /** 故障截图，占位实现为本地预览地址 */
  images: string[]
  status: RepairStatus
  /** 提交时间 ISO 字符串 */
  createdAt: string
  /** 受理时间，未受理为空 */
  acceptedAt?: string
  /** 开始处理时间 */
  processingAt?: string
  /** 完成时间 */
  completedAt?: string
  /** 是否为用户主动撤销 */
  cancelled?: boolean
  handler?: string
  result?: string
}

// ============ 发起报修表单 ============
export interface RepairCreateForm {
  reporterName: string
  department: string
  phone: string
  category: RepairCategory | ''
  device?: string
  location: string
  priority: RepairPriority
  description: string
  images: string[]
}

// ============ 常见问题 ============
export interface FaqItem {
  id: string
  question: string
  answer: string
}

// ============ 可选资产（用于"选择已有资产"占位列表） ============
export interface AssetItem {
  id: string
  assetNo: string
  name: string
}
