<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <a 
        href="https://election69.peoplesparty.or.th/" 
        target="_blank" 
        rel="noopener noreferrer"
        class="banner-link"
      >
        <img 
          src="/images/election69-banner.jpg" 
          alt="เลือกตั้ง 8 กุมภาพันธ์ 2569 - election69.peoplesparty.or.th"
          class="banner-image"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const showModal = ref(false);

onMounted(() => {
  // แสดง Modal ทุกครั้งที่เข้าหน้า
  showModal.value = true;
});

const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;
  z-index: 10000;
}

.close-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.banner-link {
  display: block;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.banner-link:hover {
  transform: scale(1.02);
}

.banner-image {
  max-width: 100%;
  max-height: 90vh;
  height: auto;
  width: auto;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
  }
  
  .close-button {
    top: -35px;
    width: 35px;
    height: 35px;
  }
}
</style>

