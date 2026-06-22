/** 格式化 ISO 时间为 "YYYY-MM-DD HH:mm" */
export function formatTime(iso?: string | null): string {
  if (!iso) return ''
  return iso.replace('T', ' ').slice(0, 16)
}
