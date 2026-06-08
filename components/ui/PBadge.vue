<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'default' | 'secondary' | 'destructive' | 'outline'

const props = withDefaults(defineProps<{
  variant?: Variant
}>(), {
  variant: 'default',
})

const base =
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none'

const variants: Record<Variant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  destructive: 'border-transparent bg-destructive text-destructive-foreground',
  outline: 'border-border text-foreground',
}

const classes = computed(() => [base, variants[props.variant]])
</script>
