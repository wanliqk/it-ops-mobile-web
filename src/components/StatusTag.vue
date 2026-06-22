<template>
  <span class="status-tag" :class="status">{{ RepairStatusLabel[status] }}</span>
</template>

<script setup lang="ts">
import type { RepairStatus } from '@/types'
import { RepairStatusLabel } from '@/types'

defineProps<{ status: RepairStatus }>()
</script>

<style scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  flex-shrink: 0;
}

.status-tag.pending {
  background: #fff3e0;
  color: #ff9f40;
}

.status-tag.processing {
  background: #e8f0fe;
  color: #2468f2;
}

.status-tag.completed {
  background: #e6f7ef;
  color: #2ba471;
}

.status-tag.closed {
  background: #f2f3f5;
  color: #909399;
}
</style>
