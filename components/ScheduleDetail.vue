<template>
  <!-- Show selected province detail -->
  <div>
    <div class="font-light my-2 text-sm">
      <p>กำหนดการต่างๆ อาจมีการเปลี่ยนแปลงตามความเหมาะสม สามารถติดตามได้ที่</p>
      <a href="https://www.facebook.com/natthaphong.ruengpanyawut/" target="_blank" class="text-primary underline">ณัฐพงษ์ เรืองปัญญาวุฒิ - Natthaphong Ruengpanyawut</a>
    </div>
    <div v-if="scheduleData.length > 0">
      <div v-for="(item, index) in scheduleData" :key="index" class="mb-4 p-4 border rounded-lg shadow-sm">
        <h2 class="text-lg font-semibold">{{ item.province }}</h2>
        <p class="text-sm text-gray-500">Date: {{ item.date || 'รอระบุวัน' }}</p>
        <!-- <p class="text-sm" :class="getStatusClass(item.status)">
          Status: {{ item.status === 'plan' ? 'Planned' : 'Confirmed' }}
        </p> -->
      </div>
    </div>
    <div v-else>
      <div class="text-sm text-gray-500">
        อยู่ในแผนการเดินทาง แต่หากมีเรื่องไหนที่อยากส่งถึงผม ส่งมาได้เลยที่
          <a href="https://www.facebook.com/natthaphong.ruengpanyawut/" class="text-blue-500 underline">
            ณัฐพงษ์ เรืองปัญญาวุฒิ - Natthaphong Ruengpanyawut
          </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  scheduleData: {
    province: string;
    date: string;
    place: string;
    status: string;
  }[];
}>();

function getStatusClass(status: string) {
  return status === 'plan' ? 'text-blue-500' : 'text-green-500';
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
