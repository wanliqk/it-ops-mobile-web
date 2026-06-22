import { request } from '@/utils/request'
import type { AssetOption } from '@/types'

/** 可选择资产列表，支持关键词搜索 */
export function getAssetOptions(keyword?: string): Promise<AssetOption[]> {
  return request({ url: '/api/mobile/assets/options', method: 'get', params: { keyword } })
}
