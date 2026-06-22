/** 模拟网络请求耗时，后续接入真实接口后可删除 */
export function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
