<template>
  <span class="priority-tag" :class="priority">{{ priorityMap[priority as TicketPriority] ?? priority }}</span>
</template>

<script setup lang="ts">
import type { TicketPriority } from '@/types'
import { priorityMap } from '@/types'

defineProps<{ priority: string }>()
</script>

<style scoped>
.priority-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  flex-shrink: 0;
}

.priority-tag.low {
  background: #f2f3f5;
  color: #86909c;
}

.priority-tag.normal {
  background: #e8f0fe;
  color: #2468f2;
}

.priority-tag.high {
  background: #fff3e0;
  color: #ff9f40;
}

.priority-tag.urgent {
  background: #fde8e8;
  color: #f56c6c;
}
</style>
