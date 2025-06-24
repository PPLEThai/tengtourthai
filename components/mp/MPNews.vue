<template>
  <div class="bg-white rounded-2xl p-4 md:p-6 h-[450px] md:h-[500px] col-span-1 md:col-span-2 flex flex-col">
    <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">ข่าวที่ถูกพูดถึงล่าสุด</h3>
    <!-- เนื้อหา -->
    <div v-if="loading" class="text-[#0A2940] text-sm">
      กำลังโหลดข้อมูลข่าว...
    </div>
    <div v-else-if="error" class="text-red-500 text-sm">
      เกิดข้อผิดพลาด: {{ error }}
    </div>
    <div v-else-if="news && news.length > 0"
      class="flex-1 flex flex-col overflow-hidden">
      <p class="text-[#0A2940] text-sm mb-3">พบข่าวที่ถูกพูดถึง 10 ข่าวล่าสุด จาก Social Listening</p>
      <div class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        <div v-for="(newsItem, index) in news" :key="newsItem.permalink || index" 
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <a :href="newsItem.permalink" target="_blank" rel="noopener noreferrer" 
            class="block hover:no-underline">
            <div class="flex gap-4">
              <!-- รูปภาพ preview -->
              <div class="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100">
                <img v-if="newsItem.photos || newsItem.metaImage" :src="newsItem.photos || newsItem.metaImage" :alt="newsItem.news_name"
                  class="w-full h-full object-cover" @error="handleImageError" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                  </svg>
                </div>
              </div>
              <!-- เนื้อหาข่าว -->
              <div class="flex-1 min-w-0">
                <h4 class="text-[#0A2940] font-semibold text-sm md:text-base line-clamp-3 mb-2 hover:text-[#4CAF50] transition-colors">
                  {{ newsItem.news_name }}
                </h4>
                <div class="flex items-center justify-between text-xs text-gray-600">
                  <span class="bg-[#4CAF50]/10 text-[#4CAF50] px-2 py-1 rounded-full font-medium">
                    {{ newsItem.source_name }}
                  </span>
                  <span>{{ newsItem.posted_at ? new Date(newsItem.posted_at).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่' }}</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div v-else class="text-[#0A2940] text-sm opacity-75">
      ไม่มีข่าวที่ถูกพูดถึง 14 วันที่ผ่านมา
    </div>
  </div>
</template>

<script setup lang="ts">
interface News {
  permalink?: string;
  news_name?: string;
  source_name?: string;
  posted_at?: string;
  photos?: string;
  metaImage?: string;
}

interface Props {
  news: News[];
  loading: boolean;
  error: string | null;
}

defineProps<Props>();

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  // target.src = '/images/news-placeholder.jpg';
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 