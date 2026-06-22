<template>
  <div class="detail-page">
    <div v-if="loading" class="empty-tip">加载中...</div>
    <div v-else-if="!order" class="empty-tip">工单不存在或已被删除</div>

    <template v-else>
      <section class="page-section info-section">
        <div class="info-top">
          <span class="order-no">{{ order.orderNo }}</span>
          <StatusTag :status="order.status" />
        </div>
        <div class="info-row">
          <span class="info-label">报修人</span>
          <span class="info-value">{{ order.reporterName }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">部门</span>
          <span class="info-value">{{ order.department }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">联系电话</span>
          <span class="info-value">{{ order.phone }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">故障类型</span>
          <span class="info-value">{{ RepairCategoryLabel[order.category] }}</span>
        </div>
        <div class="info-row" v-if="order.device">
          <span class="info-label">故障设备</span>
          <span class="info-value">{{ order.device }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">故障位置</span>
          <span class="info-value">{{ order.location }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">紧急程度</span>
          <PriorityTag :priority="order.priority" />
        </div>
        <div class="info-row">
          <span class="info-label">提交时间</span>
          <span class="info-value">{{ formatTime(order.createdAt) }}</span>
        </div>
        <div class="info-row" v-if="order.handler">
          <span class="info-label">处理人</span>
          <span class="info-value">{{ order.handler }}</span>
        </div>
        <div class="info-block">
          <span class="info-label">故障描述</span>
          <p class="info-desc">{{ order.description }}</p>
        </div>
        <div class="info-block" v-if="order.images.length">
          <span class="info-label">图片附件</span>
          <div class="image-list">
            <img v-for="(img, idx) in order.images" :key="idx" :src="img" alt="故障截图" />
          </div>
        </div>
        <div class="info-block" v-if="order.result">
          <span class="info-label">处理结果</span>
          <p class="info-desc">{{ order.result }}</p>
        </div>
      </section>

      <section class="page-section">
        <div class="section-title">处理进度</div>
        <div class="timeline">
          <div
            v-for="(node, idx) in timeline"
            :key="node.key"
            class="timeline-item"
            :class="{ done: node.done, last: idx === timeline.length - 1 }"
          >
            <span class="dot"></span>
            <div class="timeline-content">
              <div class="timeline-label">{{ node.label }}</div>
              <div v-if="node.time" class="timeline-time">{{ formatTime(node.time) }}</div>
            </div>
          </div>
        </div>
      </section>

      <div class="action-bar" v-if="order.status === 'completed' || order.status === 'pending'">
        <button
          v-if="order.status === 'completed'"
          class="action-btn primary"
          :disabled="actionLoading"
          @click="handleConfirm"
        >
          确认完成
        </button>
        <button
          v-if="order.status === 'pending'"
          class="action-btn danger"
          :disabled="actionLoading"
          @click="handleCancel"
        >
          撤销报修
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { cancelRepairOrder, confirmRepairFinished, getRepairDetail } from '@/api'
import type { RepairOrder } from '@/types'
import { RepairCategoryLabel } from '@/types'
import { formatTime, getOrderTimeline } from '@/utils/timeline'
import { showToast } from '@/composables/useToast'
import StatusTag from '@/components/StatusTag.vue'
import PriorityTag from '@/components/PriorityTag.vue'

const route = useRoute()
const order = ref<RepairOrder | null>(null)
const loading = ref(true)
const actionLoading = ref(false)

const timeline = computed(() => (order.value ? getOrderTimeline(order.value) : []))

async function load() {
  loading.value = true
  order.value = (await getRepairDetail(route.params.id as string)) ?? null
  loading.value = false
}

onMounted(load)

async function handleCancel() {
  if (!order.value) return
  if (!window.confirm('确认撤销该报修单？')) return
  actionLoading.value = true
  const ok = await cancelRepairOrder(order.value.id)
  actionLoading.value = false
  if (ok) {
    showToast('已撤销报修')
    await load()
  } else {
    showToast('撤销失败，请刷新后重试')
  }
}

async function handleConfirm() {
  if (!order.value) return
  actionLoading.value = true
  const ok = await confirmRepairFinished(order.value.id)
  actionLoading.value = false
  if (ok) {
    showToast('已确认完成')
    await load()
  } else {
    showToast('操作失败，请刷新后重试')
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

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.image-list img {
  width: 72px;
  height: 72px;
  border-radius: 6px;
  object-fit: cover;
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
  color: var(--color-text-secondary);
}

.timeline-item.done .timeline-label {
  color: var(--color-text);
  font-weight: 500;
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

.action-btn.primary {
  background: var(--color-primary);
  color: #fff;
}

.action-btn.danger {
  background: #fff;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}

.action-btn:disabled {
  opacity: 0.6;
}
</style>
