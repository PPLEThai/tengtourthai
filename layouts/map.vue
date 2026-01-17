<template>
  <div class="w-full h-screen">
    <slot />
    <ElectionBannerModal />
  </div>
</template>
 
<script setup lang="ts">
import ElectionBannerModal from "@/components/ElectionBannerModal.vue";
</script> 