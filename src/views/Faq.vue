<template>
  <div class="faq-page">
    <div v-if="loading" class="empty-tip">加载中...</div>
    <div v-else class="faq-list">
      <div v-for="item in list" :key="item.id" class="faq-item" @click="toggle(item.id)">
        <div class="faq-question">
          <span>{{ item.question }}</span>
          <span class="arrow" :class="{ open: openId === item.id }">
            <Icon name="arrow-right" />
          </span>
        </div>
        <p v-if="openId === item.id" class="faq-answer">{{ item.answer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFaqList } from '@/api'
import type { FaqItem } from '@/types'
import Icon from '@/components/Icon.vue'

const list = ref<FaqItem[]>([])
const loading = ref(true)
const openId = ref<string | null>(null)

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}

onMounted(async () => {
  list.value = await getFaqList()
  loading.value = false
})
</script>

<style scoped>
.faq-list {
  margin: 12px;
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
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  gap: 8px;
}

.arrow {
  flex-shrink: 0;
  display: flex;
  color: var(--color-text-secondary);
  transition: transform 0.2s;
}

.arrow.open {
  transform: rotate(90deg);
}

.faq-answer {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
</style>
