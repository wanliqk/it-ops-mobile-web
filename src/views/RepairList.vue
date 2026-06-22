<template>
  <div class="list-page">
    <div class="search-bar">
      <input v-model="keyword" type="text" placeholder="搜索工单编号 / 标题" @keyup.enter="reload" />
      <button type="button" class="search-btn" @click="reload">搜索</button>
    </div>

    <div class="filter-tabs">
      <span
        v-for="f in TicketStatusOptions"
        :key="f.value"
        class="filter-tab"
        :class="{ active: activeFilter === f.value }"
        @click="changeFilter(f.value)"
      >
        {{ f.label }}
      </span>
    </div>

    <div class="list-body">
      <div v-if="loading" class="empty-tip">加载中...</div>
      <div v-else-if="tickets.length === 0" class="empty-tip">暂无相关工单</div>
      <RepairCard v-for="t in tickets" :key="t.id" :ticket="t" />
      <div v-if="!loading && hasMore" class="load-more" @click="loadMore">
        {{ loadingMore ? '加载中...' : '加载更多' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getTickets } from '@/api/mobile/ticket'
import type { Ticket, TicketStatus } from '@/types'
import { TicketStatusOptions } from '@/types'
import RepairCard from '@/components/RepairCard.vue'

const PAGE_SIZE = 10

const activeFilter = ref<TicketStatus | 'all'>('all')
const keyword = ref('')
const tickets = ref<Ticket[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)
const loadingMore = ref(false)

const hasMore = computed(() => tickets.value.length < total.value)

async function fetchPage(targetPage: number) {
  const result = await getTickets({
    page: targetPage,
    page_size: PAGE_SIZE,
    status: activeFilter.value,
    keyword: keyword.value.trim() || undefined
  })
  total.value = result.total ?? 0
  if (targetPage === 1) {
    tickets.value = result.list ?? []
  } else {
    tickets.value.push(...(result.list ?? []))
  }
  page.value = targetPage
}

async function reload() {
  loading.value = true
  try {
    await fetchPage(1)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  loadingMore.value = true
  try {
    await fetchPage(page.value + 1)
  } finally {
    loadingMore.value = false
  }
}

function changeFilter(value: TicketStatus | 'all') {
  activeFilter.value = value
  reload()
}

onMounted(reload)
</script>

<style scoped>
.list-page {
  padding-top: 4px;
}

.search-bar {
  display: flex;
  gap: 8px;
  padding: 10px 12px 0;
}

.search-bar input {
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 13px;
  background: #fff;
}

.search-btn {
  flex-shrink: 0;
  height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  background: var(--color-primary);
  color: #fff;
  font-size: 13px;
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

.load-more {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
  padding: 12px 0 20px;
}
</style>
