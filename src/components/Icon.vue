<template>
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <template v-if="name === 'home'">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10.5V20h12v-9.5" />
      <path d="M9.5 20v-5h5v5" />
    </template>
    <template v-else-if="name === 'repair'">
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4h6" />
      <path d="M12 10v6M9 13h6" />
    </template>
    <template v-else-if="name === 'list'">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </template>
    <template v-else-if="name === 'faq'">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.8 9.5a2.3 2.3 0 1 1 3.4 2c-.7.4-1.2.9-1.2 1.8" />
      <path d="M12 16.2h.01" />
    </template>
    <template v-else-if="name === 'arrow-right'">
      <path d="M9 6l6 6-6 6" />
    </template>
    <template v-else-if="name === 'camera'">
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13" r="3.2" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6 6 18" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name: 'home' | 'repair' | 'list' | 'faq' | 'arrow-right' | 'camera' | 'close'
}>()
</script>
