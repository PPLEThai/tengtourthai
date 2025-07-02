<template>
  <div class="bg-[#FF6A13] rounded-2xl p-4 md:p-6 h-[400px] md:h-[630px] col-span-1 row-span-2 flex flex-col">
    <h3 class="text-white font-bold text-lg md:text-2xl mb-2">การเข้าพื้นที่/กิจกรรม</h3>

    <!-- แสดงสถานะการโหลดข้อมูล mpReport -->
    <div v-if="loading" class="text-white text-sm">
      กำลังโหลดข้อมูลการเข้าพื้นที่...
    </div>
    <div v-else-if="error" class="text-white text-sm">
      เกิดข้อผิดพลาด: {{ error }}
    </div>
    <div v-else-if="fieldReports && fieldReports.length > 0" class="text-white text-sm flex-1 overflow-hidden">
      <!-- แสดงข้อมูล mpReport เมื่อโหลดเสร็จ -->
      <div class="h-full flex flex-col">
        <p class="mb-3">พบข้อมูลการเข้าพื้นที่ {{ fieldReports.length }} รายการ</p>
        <!-- แสดงรายการข้อมูลการเข้าพื้นที่ -->
        <div class="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
          <div v-for="(report, index) in fieldReports.slice(0, 20)" :key="report.created_at || index"
            class="bg-white/10 rounded-lg p-3">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-semibold">{{ report.location_name || 'ไม่ระบุสถานที่' }}</p>
                <p class="text-xs opacity-90">{{ report.date ? new Date(report.date).toLocaleDateString('th-TH') :
                  'ไม่ระบุวันที่' }}</p>
              </div>
            </div>
            <p class="text-xs mt-1">{{ report.description || 'ไม่มีคำอธิบาย' }}</p>

            <!-- แสดงรูปภาพถ้ามี -->
            <div v-if="report.images && report.images.length > 0" class="mt-3">
              <div class="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                <div v-for="(image, imgIndex) in report.images.slice(0, 5)" :key="imgIndex"
                  class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                  <img :src="getLocalImageUrl(image)" :alt="`รูปภาพ ${imgIndex + 1}`"
                    class="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    @click="handleImageClick(image, report.location_name)" @error="handleImageError" />
                </div>
                <div v-if="report.images.length > 5"
                  class="flex-shrink-0 w-20 h-20 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-semibold">
                  +{{ report.images.length - 5 }}
                </div>
              </div>
            </div>

            <!-- แสดง tags ถ้ามี -->
            <div v-if="report.tags && report.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
              <span v-for="tag in report.tags" :key="tag"
                class="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-white/80">
      ยังไม่มีข้อมูลการเข้าพื้นที่
    </div>
  </div>
</template>

<script setup lang="ts">
interface FieldReport {
  created_at?: string;
  date?: string;
  location_name?: string;
  description?: string;
  images?: string[];
  tags?: string[];
  latitude?: number | string;
  longitude?: number | string;
}

interface Props {
  fieldReports: FieldReport[];
  loading: boolean;
  error: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  openImageModal: [imageUrl: string, title: string];
}>();

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  // target.src = '/images/news-placeholder.jpg';
};

const openImageModal = (imageUrl: string, title: string) => {
  emit('openImageModal', imageUrl, title);
};

const handleImageClick = (imageUrl: string, locationName?: string) => {
  openImageModal(imageUrl, locationName || 'ไม่ระบุสถานที่');
};

const getLocalImageUrl = (imageUrl: string) => {
  return `https://img.pplethai.org/unsafe/rs:fit:300:300:1/plain/${encodeURIComponent(imageUrl)}`;
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style> 