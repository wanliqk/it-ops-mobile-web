<template>
  <span class="priority-tag" :class="priority">{{ RepairPriorityLabel[priority] }}</span>
</template>

<script setup lang="ts">
import type { RepairPriority } from '@/types'
import { RepairPriorityLabel } from '@/types'

defineProps<{ priority: RepairPriority }>()
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

.priority-tag.normal {
  background: #f2f3f5;
  color: #86909c;
}

.priority-tag.urgent {
  background: #fff3e0;
  color: #ff9f40;
}

.priority-tag.critical {
  background: #fde8e8;
  color: #f56c6c;
}
</style>
