<template>
  <header class="navbar">
    <button v-if="showBack" class="navbar-action" aria-label="返回" @click="goBack">
      <span class="back-icon">‹</span>
    </button>
    <div v-else class="navbar-action placeholder"></div>
    <div class="navbar-title">{{ title }}</div>
    <div class="navbar-action placeholder"></div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  title?: string
  showBack?: boolean
}>()

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped>
.navbar {
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar-action {
  width: 44px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.back-icon {
  font-size: 26px;
  line-height: 1;
  color: var(--color-text);
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
