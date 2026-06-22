<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast">{{ message }}</div>
  </transition>
</template>

<script setup lang="ts">
import { useToastState } from '@/composables/useToast'

const { visible, message } = useToastState()
</script>

<style scoped>
.toast {
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 999;
  max-width: 80%;
  text-align: center;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}
</style>
