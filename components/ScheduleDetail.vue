<template>
  <!-- Show selected province detail -->
  <div>
    <div class="font-light my-2 text-sm">
      <p>กำหนดการต่างๆ อาจมีการเปลี่ยนแปลงตามความเหมาะสม สามารถติดตามได้ที่</p>
      <a href="https://www.facebook.com/natthaphong.ruengpanyawut/" target="_blank"
        class="text-primary underline">ณัฐพงษ์ เรืองปัญญาวุฒิ - Natthaphong Ruengpanyawut</a>
    </div>
    <div v-if="filteredScheduleData.length > 0">
      <div v-for="(item, index) in filteredScheduleData" :key="index" class="mb-4 p-4 border rounded-lg shadow-sm">
        <h2 class="text-lg font-semibold">{{ item.province }}</h2>
        <p class="text-sm text-gray-500">Date: {{ item.date || 'รอระบุวัน' }}</p>
        <p class="text-sm text-gray-500">Place: {{ item.place || 'รอระบุสถานที่' }}</p>
        <p class="text-sm" :class="getStatusClass(item.status)">
          Status: {{ item.status === 'plan' ? 'Planned' : 'Confirmed' }}
        </p>
      </div>
    </div>
    <div v-else class="mt-4 border border-gray-200 rounded-lg p-4 shadow-sm overflow-y-auto">
      <div class="flex flex-col justify-center items-center gap-2 text-sm text-gray-500 font-light">
        <img src="@/assets/images/teng-detail.png" alt="" class="w-20" />
        <div class="text-center">
          ตอนนี้ยังอยู่ในแผนการเดินทางครับ<br />
          แต่หากมีมีเรื่องไหนที่อยากส่งถึงผมก่อน ส่งมาได้เลยที่ <br />
          เพจ
          <a href="https://www.facebook.com/natthaphong.ruengpanyawut/" target="_blank" class="text-blue-500 underline">
            ณัฐพงษ์ เรืองปัญญาวุฒิ - Natthaphong Ruengpanyawut
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";

const props = defineProps<{
  scheduleData: {
    province: string;
    date: string;
    place: string;
    status: string;
  }[];
  selectedProvince: string | null;
}>();

const filteredScheduleData = computed(() => {
  if (!props.selectedProvince || props.selectedProvince === 'ทั้งหมด') {
    return props.scheduleData;
  }
  return props.scheduleData.filter((item: { province: string }) => item.province === props.selectedProvince);
});

function getStatusClass(status: string) {
  return status === 'plan' ? 'text-blue-500' : 'text-green-500';
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
