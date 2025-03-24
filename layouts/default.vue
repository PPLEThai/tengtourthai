<template>
  <div class="h-screen flex flex-col bg-secondary font-anakotmai">
    <Navbar />
    <div class="flex-1 overflow-hidden">
      <div class="flex h-full">
        <main class="flex-1">
          <slot />
        </main>
      </div>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      กำลังโหลด...
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance, ref } from "vue";
import { createPinia } from 'pinia'
import { useMockupStore } from "@/stores/mockupStore";

// import Navbar from "@/components/Navbar.vue";

const instance = getCurrentInstance();
if (instance) {
  const { appContext } = instance;
  const pinia = createPinia();
  appContext.app.use(pinia);
}

const mockupStore = useMockupStore();
const isLoading = ref(true);

onMounted(async () => {
  await mockupStore.fetchData();
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
