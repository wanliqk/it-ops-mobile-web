<template>
  <div class="home-page">
    <section class="user-card" v-if="user">
      <div class="avatar">{{ user.name.charAt(0) }}</div>
      <div class="user-info">
        <div class="user-name">{{ user.name }}</div>
        <div class="user-meta">{{ user.department }}</div>
        <div class="user-meta">{{ user.phone }}</div>
      </div>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </section>

    <section class="quick-entries">
      <div class="entry-item" @click="router.push('/mobile/repair/create')">
        <div class="entry-icon entry-icon-repair">
          <Icon name="repair" />
        </div>
        <span>发起报修</span>
      </div>
      <div class="entry-item" @click="router.push('/mobile/repair/list')">
        <div class="entry-icon entry-icon-list">
          <Icon name="list" />
        </div>
        <span>我的报修</span>
      </div>
      <div class="entry-item" @click="router.push('/mobile/faq')">
        <div class="entry-icon entry-icon-faq">
          <Icon name="faq" />
        </div>
        <span>常见问题</span>
      </div>
    </section>

    <section class="recent-section">
      <div class="section-header">
        <span class="section-title">最近报修</span>
        <router-link to="/mobile/repair/list" class="more-link">
          查看全部
          <Icon name="arrow-right" />
        </router-link>
      </div>
      <div v-if="loading" class="empty-tip">加载中...</div>
      <div v-else-if="recentOrders.length === 0" class="empty-tip">暂无报修记录</div>
      <RepairCard v-for="o in recentOrders" :key="o.id" :order="o" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, getMyRepairList, logout } from '@/api'
import type { RepairOrder, UserInfo } from '@/types'
import { showToast } from '@/composables/useToast'
import Icon from '@/components/Icon.vue'
import RepairCard from '@/components/RepairCard.vue'

const router = useRouter()
const user = ref<UserInfo | null>(null)
const recentOrders = ref<RepairOrder[]>([])
const loading = ref(true)

async function handleLogout() {
  if (!window.confirm('确认退出登录？')) return
  await logout()
  showToast('已退出登录')
  router.replace('/mobile/login')
}

onMounted(async () => {
  const [u, list] = await Promise.all([getCurrentUser(), getMyRepairList()])
  user.value = u
  recentOrders.value = list.slice(0, 3)
  loading.value = false
})
</script>

<style scoped>
.home-page {
  padding-bottom: 12px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #2468f2, #4f8bfb);
  color: #fff;
  margin: 12px;
  padding: 16px;
  border-radius: 10px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.user-meta {
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.5;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.logout-btn {
  flex-shrink: 0;
  height: 28px;
  padding: 0 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 12px;
}

.quick-entries {
  display: flex;
  justify-content: space-between;
  background: #fff;
  margin: 0 12px 12px;
  padding: 16px 8px;
  border-radius: 10px;
}

.entry-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text);
}

.entry-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.entry-icon-repair {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.entry-icon-list {
  background: #fff3e0;
  color: var(--color-warning);
}

.entry-icon-faq {
  background: #e6f7ef;
  color: var(--color-success);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 12px 10px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
}

.more-link {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
