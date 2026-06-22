<template>
  <div class="repair-card" @click="goDetail">
    <div class="card-top">
      <span class="order-no">{{ order.orderNo }}</span>
      <StatusTag :status="order.status" />
    </div>
    <div class="card-category">{{ RepairCategoryLabel[order.category] }}</div>
    <div class="card-desc">{{ order.description }}</div>
    <div class="card-bottom">
      <span class="card-time">{{ formatTime(order.createdAt) }}</span>
      <span v-if="order.handler" class="card-handler">处理人：{{ order.handler }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RepairOrder } from '@/types'
import { RepairCategoryLabel } from '@/types'
import { formatTime } from '@/utils/timeline'
import StatusTag from './StatusTag.vue'

const props = defineProps<{ order: RepairOrder }>()
const router = useRouter()

function goDetail() {
  router.push(`/mobile/repair/detail/${props.order.id}`)
}
</script>

<style scoped>
.repair-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  margin: 0 12px 10px;
}

.repair-card:active {
  background: #f7f8fa;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.order-no {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.card-category {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
  line-height: 1.5;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
