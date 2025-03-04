<template>
  <!-- Show selected province detail -->
  <div>
    <div class="font-light my-2 text-sm">
      <p>กำหนดการต่างๆ อาจมีการเปลี่ยนแปลงตามความเหมาะสม สามารถติดตามได้ที่</p>
      <a href="https://www.facebook.com/natthaphong.ruengpanyawut/" target="_blank"
        class="text-primary underline">ณัฐพงษ์ เรืองปัญญาวุฒิ - Natthaphong Ruengpanyawut</a>
    </div>
    <div class="text-sm font-medium mb-2">
      ทั้งหมด {{ filteredScheduleData.filter(item => item.status === 'plan').length }} แผนการเดินทาง
    </div>
    
    <div v-if="filteredScheduleData.filter(item => item.status === 'plan').length > 0">
      <div v-for="(item, index) in filteredScheduleData.filter(item => item.status === 'plan')" :key="index" class="mb-4 p-4 border rounded-lg shadow-sm">
         <p class="text-sm font-light">{{ item.date ? formatDate(item.date) : 'ไม่มีข้อมูล' }}</p>
        <h2 class="text-lg font-semibold">{{ item.province }}</h2>
      </div>
    </div>
    <div v-else class="mt-4 border border-gray-200 rounded-lg p-4 shadow-sm overflow-y-auto">
      <div class="flex flex-col justify-center items-center gap-2 text-sm text-gray-500 font-light">
        <img src="@/assets/images/teng-detail.png" alt="" class="w-20" />
        <div class="text-center">
          ตอนนี้ยังอยู่ในแผนการเดินทางครับ<br />
          แต่หากมีเรื่องไหนที่อยากส่งถึงผมก่อน ส่งมาได้เลยที่ <br />
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

function isValidDate(date: string): boolean {
  const [day, month, year] = date.split('/');
  const formattedDate = new Date(`${year}-${month}-${day}`);
  return !isNaN(formattedDate.getTime());
}

function formatDate(date: string): string {
  const [year, month, day] = date.split('-');
  const thaiYear = parseInt(year) + 543;
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${thaiYear}`;
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
