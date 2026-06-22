<template>
  <div class="detail-page">
    <div v-if="loading" class="empty-tip">加载中...</div>
    <div v-else-if="!ticket" class="empty-tip">工单不存在或已被删除</div>

    <template v-else>
      <section class="page-section info-section">
        <div class="info-top">
          <span class="order-no">{{ ticket.ticket_no }}</span>
          <StatusTag :status="ticket.status" />
        </div>
        <div class="info-row">
          <span class="info-label">工单标题</span>
          <span class="info-value">{{ ticket.title }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">故障类型</span>
          <span class="info-value">{{ faultTypeMap[ticket.fault_type as FaultType] ?? ticket.fault_type }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">紧急程度</span>
          <PriorityTag :priority="ticket.priority" />
        </div>
        <div class="info-row">
          <span class="info-label">报修人</span>
          <span class="info-value">{{ ticket.reporter?.name ?? '暂无' }}</span>
        </div>
        <div class="info-row" v-if="ticket.reporter?.department">
          <span class="info-label">部门</span>
          <span class="info-value">{{ ticket.reporter.department }}</span>
        </div>
        <div class="info-row" v-if="ticket.reporter?.phone">
          <span class="info-label">联系电话</span>
          <span class="info-value">{{ ticket.reporter.phone }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">处理人</span>
          <span class="info-value">{{ ticket.assignee?.name ?? '未分配' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">关联资产</span>
          <span class="info-value">
            {{ ticket.asset ? `${ticket.asset.asset_no} ${ticket.asset.name}` : '未关联资产' }}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">提交时间</span>
          <span class="info-value">{{ formatTime(ticket.created_at) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">派单时间</span>
          <span class="info-value">{{ ticket.assigned_at ? formatTime(ticket.assigned_at) : '未派单' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">开始处理时间</span>
          <span class="info-value">{{ ticket.processing_at ? formatTime(ticket.processing_at) : '未处理' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">完成时间</span>
          <span class="info-value">{{ ticket.completed_at ? formatTime(ticket.completed_at) : '未完成' }}</span>
        </div>
        <div class="info-block">
          <span class="info-label">故障描述</span>
          <p class="info-desc">{{ ticket.description }}</p>
        </div>
        <div class="info-block">
          <span class="info-label">处理结果</span>
          <p class="info-desc">{{ ticket.result || '暂无' }}</p>
        </div>
      </section>

      <section class="page-section">
        <div class="section-title">工单流转记录</div>
        <div v-if="!ticket.records || ticket.records.length === 0" class="empty-tip">暂无流转记录</div>
        <div v-else class="timeline">
          <div
            v-for="(rec, idx) in ticket.records"
            :key="rec.id"
            class="timeline-item done"
            :class="{ last: idx === ticket.records!.length - 1 }"
          >
            <span class="dot"></span>
            <div class="timeline-content">
              <div class="timeline-label">{{ rec.action }}</div>
              <div v-if="rec.content" class="timeline-desc">{{ rec.content }}</div>
              <div class="timeline-time">
                <span v-if="rec.operator">{{ rec.operator }} · </span>{{ formatTime(rec.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="action-bar" v-if="ticket.status === 'pending'">
        <button class="action-btn danger" :disabled="actionLoading" @click="showCancelSheet = true">
          撤销报修
        </button>
      </div>
    </template>

    <!-- 取消报修 弹层 -->
    <div v-if="showCancelSheet" class="cancel-overlay" @click.self="showCancelSheet = false">
      <div class="cancel-sheet">
        <div class="cancel-title">撤销报修</div>
        <textarea v-model="cancelReason" rows="3" placeholder="请输入撤销原因（选填）" maxlength="100"></textarea>
        <div class="cancel-actions">
          <button type="button" class="cancel-btn secondary" @click="showCancelSheet = false">取消</button>
          <button type="button" class="cancel-btn primary" :disabled="actionLoading" @click="handleCancel">
            确认撤销
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { cancelTicket, getTicketDetail } from '@/api/mobile/ticket'
import type { FaultType, Ticket } from '@/types'
import { faultTypeMap } from '@/types'
import { formatTime } from '@/utils/timeline'
import { showToast } from '@/composables/useToast'
import StatusTag from '@/components/StatusTag.vue'
import PriorityTag from '@/components/PriorityTag.vue'

const route = useRoute()
const ticket = ref<Ticket | null>(null)
const loading = ref(true)
const actionLoading = ref(false)
const showCancelSheet = ref(false)
const cancelReason = ref('')

async function load() {
  loading.value = true
  try {
    ticket.value = await getTicketDetail(route.params.id as string)
  } catch {
    ticket.value = null
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function handleCancel() {
  if (!ticket.value) return
  actionLoading.value = true
  try {
    await cancelTicket(ticket.value.id, cancelReason.value.trim() || undefined)
    showToast('已撤销报修')
    showCancelSheet.value = false
    cancelReason.value = ''
    await load()
  } catch {
    // 后端不允许取消时的提示已由 request 拦截器统一展示
  } finally {
    actionLoading.value = false
  }
}
</script>

<style scoped>
.detail-page {
  padding-bottom: 24px;
}

.info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.order-no {
  font-size: 15px;
  font-weight: 600;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}

.info-row:last-of-type {
  border-bottom: none;
}

.info-label {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.info-value {
  text-align: right;
  margin-left: 12px;
}

.info-block {
  padding: 10px 0;
  border-top: 1px solid var(--color-border);
}

.info-block .info-label {
  display: block;
  margin-bottom: 6px;
}

.info-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text);
  white-space: pre-wrap;
}

.timeline {
  padding: 4px 0 4px 6px;
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 12px;
  padding-bottom: 22px;
  padding-left: 18px;
}

.timeline-item.last {
  padding-bottom: 0;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 14px;
  bottom: 0;
  width: 1px;
  background: var(--color-border);
}

.timeline-item.last::before {
  display: none;
}

.dot {
  position: absolute;
  left: 0;
  top: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
}

.timeline-item.done .dot {
  background: var(--color-primary);
}

.timeline-label {
  font-size: 14px;
  color: var(--color-text);
  font-weight: 500;
}

.timeline-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.timeline-time {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.action-bar {
  display: flex;
  gap: 10px;
  margin: 12px;
}

.action-btn {
  flex: 1;
  height: 44px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
}

.action-btn.danger {
  background: #fff;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}

.action-btn:disabled {
  opacity: 0.6;
}

.cancel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  z-index: 200;
}

.cancel-sheet {
  width: 100%;
  background: #fff;
  border-radius: 12px 12px 0 0;
  padding: 16px;
}

.cancel-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
}

.cancel-sheet textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: #fafafa;
  resize: none;
}

.cancel-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.cancel-btn {
  flex: 1;
  height: 44px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
}

.cancel-btn.secondary {
  background: #f2f3f5;
  color: var(--color-text-secondary);
}

.cancel-btn.primary {
  background: var(--color-danger);
  color: #fff;
}

.cancel-btn:disabled {
  opacity: 0.6;
}
</style>
