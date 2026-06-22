<template>
  <div class="list-page">
    <div class="filter-tabs">
      <span
        v-for="f in RepairStatusOptions"
        :key="f.value"
        class="filter-tab"
        :class="{ active: activeFilter === f.value }"
        @click="activeFilter = f.value"
      >
        {{ f.label }}
      </span>
    </div>

    <div class="list-body">
      <div v-if="loading" class="empty-tip">加载中...</div>
      <div v-else-if="filteredList.length === 0" class="empty-tip">暂无相关工单</div>
      <RepairCard v-for="o in filteredList" :key="o.id" :order="o" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getMyRepairList } from '@/api'
import type { RepairOrder, RepairStatus } from '@/types'
import { RepairStatusOptions } from '@/types'
import RepairCard from '@/components/RepairCard.vue'

const activeFilter = ref<RepairStatus | 'all'>('all')
const orders = ref<RepairOrder[]>([])
const loading = ref(true)

const filteredList = computed(() =>
  activeFilter.value === 'all' ? orders.value : orders.value.filter(o => o.status === activeFilter.value)
)

onMounted(async () => {
  orders.value = await getMyRepairList()
  loading.value = false
})
</script>

<style scoped>
.list-page {
  padding-top: 4px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  overflow-x: auto;
  background: var(--color-bg);
  position: sticky;
  top: var(--navbar-height);
  z-index: 20;
}

.filter-tab {
  flex-shrink: 0;
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 16px;
  background: #fff;
  color: var(--color-text-secondary);
}

.filter-tab.active {
  background: var(--color-primary);
  color: #fff;
}

.list-body {
  padding-top: 4px;
}
</style>
