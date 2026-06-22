<template>
  <div class="app-shell">
    <NavBar :title="route.meta.title" :show-back="route.meta.showBack" />
    <main class="app-content">
      <router-view />
    </main>
    <TabBar v-if="route.meta.showTabBar" />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import TabBar from '@/components/TabBar.vue'
import Toast from '@/components/Toast.vue'

const route = useRoute()
</script>

<style scoped>
.app-shell {
  position: relative;
  /* 为内部 position:fixed 的浮层（Toast、弹出层）建立包含块，
     使其被限制在手机frame宽度内，而不是铺满整个桌面浏览器视口 */
  transform: translateZ(0);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-content {
  flex: 1;
}
</style>
