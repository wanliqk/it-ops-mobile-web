<template>
  <div class="repair-card" @click="goDetail">
    <div class="card-top">
      <span class="order-no">{{ ticket.ticket_no }}</span>
      <StatusTag :status="ticket.status" />
    </div>
    <div class="card-title">{{ ticket.title }}</div>
    <div class="card-bottom">
      <span class="card-tags">
        <span class="card-category">{{ categoryLabel(ticket.category_id) }}</span>
        <PriorityTag :priority="ticket.priority" />
      </span>
      <span class="card-time">{{ formatTime(ticket.created_at) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { TicketBrief } from '@/types'
import { formatTime } from '@/utils/timeline'
import { useTicketCategories } from '@/composables/useTicketCategories'
import StatusTag from './StatusTag.vue'
import PriorityTag from './PriorityTag.vue'

const props = defineProps<{ ticket: TicketBrief }>()
const router = useRouter()
const { ensureLoaded, categoryLabel } = useTicketCategories()

onMounted(ensureLoaded)

function goDetail() {
  router.push(`/mobile/repair/detail/${props.ticket.id}`)
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

.card-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.card-tags {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-category {
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
