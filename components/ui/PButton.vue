<template>
  <component :is="tag" :class="classes" :type="tag === 'button' ? type : undefined">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type Size = 'default' | 'sm' | 'lg' | 'icon'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  tag?: string
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'default',
  size: 'default',
  tag: 'button',
  type: 'button',
})

const base =
  'font-heading inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0'

const gradientButton = 'gradient-hover-animate active:brightness-90'

const variants: Record<Variant, string> = {
  default: `bg-gradient-primary-button text-primary-foreground shadow-md ${gradientButton}`,
  destructive: `bg-gradient-destructive text-destructive-foreground shadow-md ${gradientButton}`,
  outline:
    `border border-secondary bg-background text-secondary hover:border-transparent hover:bg-gradient-secondary-button hover:text-secondary-foreground hover:shadow-md ${gradientButton} active:brightness-95`,
  secondary: `bg-gradient-secondary-button text-secondary-foreground shadow-md ${gradientButton} active:brightness-95`,
  ghost: 'hover:bg-secondary/10 hover:text-secondary',
  link: 'text-primary underline-offset-4 hover:underline',
}

const sizes: Record<Size, string> = {
  default: 'h-10 px-4 py-2 [&_svg]:size-4',
  sm: 'h-7 rounded-md px-2.5 text-xs [&_svg]:size-3.5',
  lg: 'h-12 rounded-md px-10 text-base [&_svg]:size-5',
  icon: 'h-10 w-10 [&_svg]:size-4',
}

const classes = computed(() => [base, variants[props.variant], sizes[props.size]])
</script>
