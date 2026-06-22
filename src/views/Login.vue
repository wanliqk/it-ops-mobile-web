<template>
  <div class="login-page">
    <div class="login-header">
      <div class="logo">IT</div>
      <div class="login-title">IT报修服务</div>
      <div class="login-subtitle">企业内部 IT 报修与资产运维管理平台</div>
    </div>

    <form class="login-form" @submit.prevent="handleSubmit">
      <div class="form-item">
        <label class="required">用户名</label>
        <input v-model="form.username" type="text" placeholder="请输入用户名" maxlength="30" autocomplete="username" />
        <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
      </div>

      <div class="form-item">
        <label class="required">密码</label>
        <input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          maxlength="20"
          autocomplete="current-password"
        />
        <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
      </div>

      <button class="login-btn" type="submit" :disabled="submitting">
        {{ submitting ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/api/mobile/auth'
import type { LoginForm } from '@/types'
import { showToast } from '@/composables/useToast'
import { setAuth } from '@/utils/storage'

const router = useRouter()
const route = useRoute()

const form = reactive<LoginForm>({ username: '', password: '' })
const errors = reactive<Partial<Record<keyof LoginForm, string>>>({})
const submitting = ref(false)

function validate(): boolean {
  Object.keys(errors).forEach(key => delete errors[key as keyof LoginForm])

  if (!form.username.trim()) errors.username = '请输入用户名'
  if (!form.password) errors.password = '请输入密码'

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    const result = await login(form)
    setAuth(result.access_token, result.user)
    showToast('登录成功')
    const redirect = (route.query.redirect as string) || '/mobile/home'
    router.replace(redirect)
  } catch (e) {
    // 错误提示已由 request 拦截器统一通过 Toast 展示
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.login-page {
  padding: 36px 24px 0;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--color-primary);
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.login-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.login-subtitle {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 6px;
  text-align: center;
}

.login-form {
  background: #fff;
  border-radius: 10px;
  padding: 4px 16px;
}

.form-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}

.form-item:last-of-type {
  border-bottom: none;
}

.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-item input {
  width: 100%;
  height: 42px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: #fafafa;
}

.error-text {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--color-danger);
}

.login-btn {
  width: 100%;
  height: 46px;
  margin: 20px 0 14px;
  border-radius: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.login-btn:disabled {
  opacity: 0.6;
}
</style>
