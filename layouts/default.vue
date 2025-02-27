<template>
  <div class="h-screen flex flex-col bg-secondary">
    <Navbar />
    <div class="flex-1 overflow-hidden">
      <div class="flex h-full">
        <main class="flex-1">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
</script>
