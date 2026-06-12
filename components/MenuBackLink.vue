<template>
  <div v-if="showLink" class="max-w-7xl mx-auto w-full px-4 pt-4 shrink-0">
    <NuxtLink
      to="/menu"
      :class="linkClass"
      aria-label="กลับไปหน้าสารบัญ"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      สารบัญ
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'on-dark' | 'on-light'
}>(), {
  variant: 'on-light',
})

const route = useRoute()

const allowedPaths = ['/volunteers']
const showLink = computed(() => allowedPaths.includes(route.path))

const linkClass = computed(() => {
  const base = 'inline-flex items-center gap-1.5 text-sm font-heading font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md'
  if (props.variant === 'on-dark') {
    return `${base} text-white/80 hover:text-white px-1 py-1`
  }
  return `${base} text-primary hover:text-primary/80 px-1 py-1`
})
</script>
