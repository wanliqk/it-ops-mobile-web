<template>
  <nav class="tabbar">
    <router-link
      v-for="item in items"
      :key="item.key"
      :to="item.path"
      class="tab-item"
      :class="{ active: isActive(item) }"
    >
      <Icon :name="item.icon" />
      <span class="tab-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Icon from './Icon.vue'

interface TabItem {
  key: string
  label: string
  path: string
  icon: 'home' | 'repair' | 'list' | 'faq'
}

const route = useRoute()

const items: TabItem[] = [
  { key: 'home', label: '首页', path: '/mobile/home', icon: 'home' },
  { key: 'repair', label: '报修', path: '/mobile/repair/create', icon: 'repair' },
  { key: 'list', label: '我的', path: '/mobile/repair/list', icon: 'list' },
  { key: 'faq', label: 'FAQ', path: '/mobile/faq', icon: 'faq' }
]

function isActive(item: TabItem): boolean {
  return route.path === item.path
}
</script>

<style scoped>
.tabbar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #fff;
  border-top: 1px solid var(--color-border);
  height: var(--tabbar-height);
  z-index: 50;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--color-text-secondary);
}

.tab-item.active {
  color: var(--color-primary);
}

.tab-label {
  font-size: 11px;
}
</style>
