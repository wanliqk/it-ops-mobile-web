<template>
  <div class="faq-page">
    <div class="search-bar">
      <input v-model="keyword" type="text" placeholder="搜索常见问题" @keyup.enter="reload" />
      <button type="button" class="search-btn" @click="reload">搜索</button>
    </div>

    <div class="filter-tabs">
      <span
        class="filter-tab"
        :class="{ active: activeCategory === '' }"
        @click="changeCategory('')"
      >
        全部
      </span>
      <span
        v-for="c in categories"
        :key="c.value"
        class="filter-tab"
        :class="{ active: activeCategory === c.value }"
        @click="changeCategory(c.value)"
      >
        {{ c.label }}
      </span>
    </div>

    <div v-if="loading" class="empty-tip">加载中...</div>
    <div v-else-if="list.length === 0" class="empty-tip">暂无相关问题</div>
    <div v-else class="faq-list">
      <div v-for="item in list" :key="item.id" class="faq-item" @click="toggle(item)">
        <div class="faq-question">
          <div class="faq-question-main">
            <span class="faq-title">{{ item.title }}</span>
            <span v-if="item.summary" class="faq-summary">{{ item.summary }}</span>
          </div>
          <span class="arrow" :class="{ open: openId === item.id }">
            <Icon name="arrow-right" />
          </span>
        </div>
        <div class="faq-meta">
          <span v-if="categoryLabel(item.category)">{{ categoryLabel(item.category) }}</span>
          <span v-if="item.view_count !== undefined">浏览 {{ item.view_count }}</span>
          <span>{{ formatTime(item.created_at) }}</span>
        </div>
        <div v-if="openId === item.id" class="faq-answer">
          <span v-if="detailLoading === item.id">加载中...</span>
          <span v-else>{{ detailMap[item.id]?.content || '暂无详细内容' }}</span>
        </div>
      </div>
    </div>

    <div v-if="!loading && hasMore" class="load-more" @click="loadMore">
      {{ loadingMore ? '加载中...' : '加载更多' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { getFaqCategories, getFaqDetail, getFaqs } from '@/api/mobile/faq'
import type { FaqCategory, FaqItem } from '@/types'
import { formatTime } from '@/utils/timeline'
import Icon from '@/components/Icon.vue'

const PAGE_SIZE = 10

const categories = ref<FaqCategory[]>([])
const activeCategory = ref('')
const keyword = ref('')
const list = ref<FaqItem[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)
const loadingMore = ref(false)
const openId = ref<string | number | null>(null)
const detailMap = reactive<Record<string | number, FaqItem>>({})
const detailLoading = ref<string | number | null>(null)

const hasMore = computed(() => list.value.length < total.value)

function categoryLabel(value: string): string {
  return categories.value.find(c => c.value === value)?.label ?? value
}

async function fetchPage(targetPage: number) {
  const result = await getFaqs({
    category: activeCategory.value || undefined,
    keyword: keyword.value.trim() || undefined,
    page: targetPage,
    page_size: PAGE_SIZE
  })
  total.value = result.total ?? 0
  if (targetPage === 1) {
    list.value = result.items ?? []
  } else {
    list.value.push(...(result.items ?? []))
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

function changeCategory(value: string) {
  activeCategory.value = value
  reload()
}

async function toggle(item: FaqItem) {
  if (openId.value === item.id) {
    openId.value = null
    return
  }
  openId.value = item.id
  if (!detailMap[item.id]) {
    detailLoading.value = item.id
    try {
      detailMap[item.id] = await getFaqDetail(item.id)
    } finally {
      detailLoading.value = null
    }
  }
}

onMounted(async () => {
  try {
    categories.value = await getFaqCategories()
  } catch {
    categories.value = []
  }
  await reload()
})
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 8px;
  padding: 12px 12px 0;
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

.faq-list {
  margin: 0 12px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.faq-item {
  padding: 14px;
  border-bottom: 1px solid var(--color-border);
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.faq-question-main {
  flex: 1;
  min-width: 0;
}

.faq-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
}

.faq-summary {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.arrow {
  flex-shrink: 0;
  display: flex;
  color: var(--color-text-secondary);
  transition: transform 0.2s;
  margin-top: 2px;
}

.arrow.open {
  transform: rotate(90deg);
}

.faq-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--color-text-secondary);
  margin-top: 8px;
}

.faq-answer {
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  border-top: 1px dashed var(--color-border);
  padding-top: 10px;
}

.load-more {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
  padding: 12px 0 20px;
}
</style>
