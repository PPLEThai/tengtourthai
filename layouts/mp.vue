<template>
  <div class="flex flex-col bg-secondary font-anakotmai min-h-screen">
    <Navbar />
    <div class="flex-1">
      <div class="flex">
        <main class="flex-1">
          <slot />
        </main>
      </div>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      กำลังโหลด...
    </div>
    <ElectionBannerModal />
  </div>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance, ref } from "vue";
import { createPinia } from 'pinia'
import ElectionBannerModal from "@/components/ElectionBannerModal.vue";

const instance = getCurrentInstance();
if (instance) {
  const { appContext } = instance;
  const pinia = createPinia();
  appContext.app.use(pinia);
}

const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = false;
});
</script>

<style scoped>
body {
  font-family: 'Anakotmai', sans-serif !important;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  z-index: 1000;
}
</style> 