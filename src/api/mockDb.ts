import type { FaqItem, RepairOrder, UserInfo, AssetItem } from '@/types'

/**
 * 内存态 mock 数据源。
 * 后续接入 FastAPI 后端后，本文件可整体删除，
 * 由 api/index.ts 中的真实 HTTP 请求取代。
 */

export const mockUser: UserInfo = {
  id: 'u-1001',
  name: '陈晓明',
  department: '研发中心-前端组',
  phone: '13812345678'
}

/** 演示账号：手机号 13812345678，密码 123456 */
export const mockAccounts: { phone: string; password: string; user: UserInfo }[] = [
  { phone: '13812345678', password: '123456', user: mockUser }
]

export const mockAssets: AssetItem[] = [
  { id: 'a1', assetNo: 'PC-00231', name: '联想ThinkCentre台式机' },
  { id: 'a2', assetNo: 'PC-00198', name: '惠普EliteBook笔记本' },
  { id: 'a3', assetNo: 'PR-00045', name: '佳能LBP2900打印机' },
  { id: 'a4', assetNo: 'NT-00012', name: '华为AR路由器' }
]

export const mockFaqList: FaqItem[] = [
  {
    id: 'faq-1',
    question: '打印机无法打印怎么办？',
    answer:
      '请先检查打印机是否通电、是否缺纸或卡纸，并确认电脑与打印机的连接（USB/网络）是否正常。如重启打印机和电脑后仍无法解决，请在本系统提交“打印机故障”报修单，IT人员会尽快上门处理。'
  },
  {
    id: 'faq-2',
    question: '电脑无法联网怎么办？',
    answer:
      '请检查网线是否插好或 WiFi 是否已连接，可尝试重启电脑。如同事的电脑可以正常上网，仅你的电脑无法联网，请提交“网络故障”报修单并备注具体现象，方便网络组排查。'
  },
  {
    id: 'faq-3',
    question: 'OA账号忘记密码怎么办？',
    answer:
      '可在OA登录页尝试“忘记密码”自助找回。如无法找回，请提交“系统账号问题”报修单，并提供您的工号和姓名，IT人员将协助重置密码。'
  },
  {
    id: 'faq-4',
    question: '邮箱无法登录怎么办？',
    answer:
      '请确认账号、密码输入是否正确，并检查是否开启大写锁定。若多次确认无误仍无法登录，请提交“系统账号问题”报修单，说明邮箱地址及错误提示内容。'
  }
]

export const mockOrders: RepairOrder[] = [
  {
    id: 'order-5',
    orderNo: 'IT202606210020',
    reporterName: '陈晓明',
    department: '研发中心-前端组',
    phone: '13812345678',
    category: 'software',
    device: 'PC-00198 惠普EliteBook笔记本',
    location: '3楼研发部',
    priority: 'urgent',
    description: '需要安装最新版开发工具，原版本无法编译项目，影响开发进度。',
    images: ['https://picsum.photos/seed/it-order-5/300/300'],
    status: 'completed',
    createdAt: '2026-06-21T11:20:00',
    acceptedAt: '2026-06-21T11:40:00',
    processingAt: '2026-06-21T13:10:00',
    completedAt: '2026-06-21T16:00:00',
    handler: '张伟(IT支持)',
    result: '已完成软件安装并测试可用。'
  },
  {
    id: 'order-4',
    orderNo: 'IT202606210005',
    reporterName: '陈晓明',
    department: '研发中心-前端组',
    phone: '13812345678',
    category: 'account',
    location: '4楼财务部',
    priority: 'normal',
    description: 'OA系统账号密码忘记，无法登录系统，需要重置密码。',
    images: [],
    status: 'closed',
    createdAt: '2026-06-21T16:45:00',
    acceptedAt: '2026-06-21T17:00:00',
    processingAt: '2026-06-21T17:05:00',
    completedAt: '2026-06-21T17:20:00',
    handler: '王芳(IT支持)',
    result: '已重置密码并发送至邮箱，用户确认可正常登录。'
  },
  {
    id: 'order-3',
    orderNo: 'IT202606200011',
    reporterName: '陈晓明',
    department: '研发中心-前端组',
    phone: '13812345678',
    category: 'printer',
    location: '2楼前台',
    priority: 'normal',
    description: '打印机卡纸，无法正常出纸，已尝试重启未解决。',
    images: [],
    status: 'pending',
    createdAt: '2026-06-20T10:05:00'
  },
  {
    id: 'order-2',
    orderNo: 'IT202606190003',
    reporterName: '陈晓明',
    department: '研发中心-前端组',
    phone: '13812345678',
    category: 'network',
    location: '5楼销售部',
    priority: 'critical',
    description: '办公区网络间歇性掉线，影响多人办公，且故障频率逐渐升高。',
    images: ['https://picsum.photos/seed/it-order-2/300/300', 'https://picsum.photos/seed/it-order-2b/300/300'],
    status: 'processing',
    createdAt: '2026-06-19T14:30:00',
    acceptedAt: '2026-06-19T15:00:00',
    processingAt: '2026-06-19T16:20:00',
    handler: '李娜(网络组)'
  },
  {
    id: 'order-1',
    orderNo: 'IT202606180007',
    reporterName: '陈晓明',
    department: '研发中心-前端组',
    phone: '13812345678',
    category: 'computer',
    device: 'PC-00231 联想ThinkCentre台式机',
    location: '3楼研发部',
    priority: 'urgent',
    description: '电脑无法开机，按电源键无反应，怀疑是电源适配器损坏。',
    images: [],
    status: 'completed',
    createdAt: '2026-06-18T09:12:00',
    acceptedAt: '2026-06-18T09:30:00',
    processingAt: '2026-06-18T10:00:00',
    completedAt: '2026-06-18T11:30:00',
    handler: '张伟(IT支持)',
    result: '已更换电源适配器，设备恢复正常。'
  }
]

let seq = 1

function pad(n: number, len: number): string {
  return n.toString().padStart(len, '0')
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1, 2)}${pad(d.getDate(), 2)}`
}

/** 生成形如 IT202606220001 的模拟工单编号 */
export function nextOrderNo(): string {
  const orderNo = `IT${formatDate(new Date())}${pad(seq, 4)}`
  seq++
  return orderNo
}

export function cloneOrder(order: RepairOrder): RepairOrder {
  return JSON.parse(JSON.stringify(order))
}
