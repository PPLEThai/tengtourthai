<template>
  <div class="min-h-screen bg-[#0A2940] flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white py-3 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2">
          <router-link to="/local" class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#FF6A13]" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="font-bold text-[#FF6A13] text-xl">หน้ารวมผู้แทนท้องถิ่น</span>
          </router-link>
        </div>
      </div>
    </nav>
    
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-white">กำลังโหลดข้อมูล...</div>
    </div>
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-white">{{ error }}</div>
    </div>
    <div v-else-if="mp"
      class="flex flex-col md:flex-row flex-1 w-full max-w-7xl mx-auto py-4 md:py-8 gap-4 md:gap-6 px-2 md:px-0">
      
      <!-- Sidebar -->
      <aside class="w-full md:max-w-xs bg-white rounded-2xl p-4 md:p-6 flex flex-col gap-4 md:gap-6 mb-4 md:mb-0 h-[100%]">
        <!-- MP Profile -->
        <LocalProfile :mp="mp" />
        
        <!-- Calendar -->
        <!-- <MPCalendar 
          :events="allEvents" 
          :parliament-meetings="mpReport?.attendances?.parliament_meeting || []"
        /> -->
        
        <!-- Social Media Links -->
        <MPSocialMedia :mp="mp" />
      </aside>
      
      <!-- Main Content -->
      <main class="w-full md:flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        
        <!-- Disclaimer -->
        <!-- <div class="col-span-1 md:col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-yellow-800 text-sm">
              <strong>หมายเหตุ:</strong> ข้อมูลที่ปรากฎนี้ เป็นเพียงบางส่วนของการนำเข้าเบื้องต้น ยังไม่ครบถ้วนทั้งหมด
            </p>
          </div>
        </div> -->

        <!-- Field Reports (JSON จาก path .../somtourthai/local/...) -->
        <LocalFieldReports
          v-if="localFieldLoading || localFieldError || (localKaitomReport && (localKaitomReport.field_reports?.length ?? 0) > 0)"
          :field-reports="(localKaitomReport?.field_reports ?? []).map(report => ({
            ...report,
            created_at: report.created_at || undefined,
            date: report.date || undefined,
            latitude: report.latitude || undefined,
            longitude: report.longitude || undefined
          }))"
          :loading="localFieldLoading"
          :error="localFieldError"
          @open-image-modal="openImageModal"
        />

        <!-- News -->
        <MPNews 
          :news="newsWithMetaImages"
          :loading="localFieldLoading"
          :error="localFieldError"
        />

        <!-- Map -->
        <MPMap 
          v-if="localKaitomReport && localKaitomReport.field_reports && localKaitomReport.field_reports.length > 2"
          :field-reports="localKaitomReport.field_reports.map(report => ({
            ...report,
            created_at: report.created_at || undefined,
            date: report.date || undefined,
            latitude: report.latitude || undefined,
            longitude: report.longitude || undefined
          }))"
          :loading="localFieldLoading"
        />

        <!-- Social Media Cards -->
        <MPSocialMediaCard 
          v-if="mp?.fb"
          platform="facebook"
          :url="mp.fb"
          :mp-name="mp.fullname"
          :facebook-loading="facebookLoading"
          :facebook-error="facebookError"
          :facebook-page-url="facebookPageUrl"
        />

        <MPSocialMediaCard 
          v-if="mp?.ig"
          platform="instagram"
          :url="mp.ig"
          :mp-name="mp.fullname"
        />

        <MPSocialMediaCard 
          v-if="mp?.x"
          platform="x"
          :url="mp.x"
          :mp-name="mp.fullname"
        />

        <MPSocialMediaCard 
          v-if="mp?.tiktok"
          platform="tiktok"
          :url="mp.tiktok"
          :mp-name="mp.fullname"
        />

      </main>
    </div>

    <!-- Image Modal -->
    <MPImageModal 
      :show="showImageModal"
      :image-url="selectedImage"
      :title="selectedImageTitle"
      @close="closeImageModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useLocalData, type LocalMPItem } from '@/composables/useLocalData'
import { useKaitomLocalMP } from '@/composables/useKaitomLocalMP'

// Import components
// ใช้ auto-import ของ Nuxt 3 แทนการ import แบบปกติ
// import MPProfile from '@/components/mp/MPProfile.vue'
// import MPCalendar from '@/components/mp/MPCalendar.vue'
// import MPSocialMedia from '@/components/mp/MPSocialMedia.vue'
// import MPFieldReports from '@/components/mp/MPFieldReports.vue'
// import MPCommitteeMeetings from '@/components/mp/MPCommitteeMeetings.vue'
// import MPNews from '@/components/mp/MPNews.vue'
// import MPMap from '@/components/mp/MPMap.vue'
// import MPSocialMediaCard from '@/components/mp/MPSocialMediaCard.vue'
// import MPImageModal from '@/components/mp/MPImageModal.vue'

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const { localData } = useLocalData();
const route = useRoute();
const mpName = decodeURIComponent(route.params.name as string).replace(/_/g, ' ');

const {
  mpReport: localKaitomReport,
  loading: localFieldLoading,
  error: localFieldError
} = useKaitomLocalMP(mpName.replace(/ /g, '_'));

const mp = ref<LocalMPItem | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const facebookPageUrl = ref('');

// เพิ่มตัวแปรสำหรับ Facebook Page Plugin
const facebookLoading = ref(false);
const facebookError = ref<string | null>(null);

// ฟังก์ชันสำหรับแปลง Facebook URL เป็นรูปแบบที่ใช้กับ Page Plugin
const getFacebookPageUrl = (url: string) => {
  if (!url || !url.includes('facebook.com')) {
    return '';
  }

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // กรณี URL แบบ /people/name/...
    if (pathname.includes('/people/')) {
      return url; // ใช้ URL เดิม
    }
    
    // กรณี URL แบบ /username
    const username = pathname.split('/').filter(Boolean)[0];
    if (username) {
      const pageUrl = `https://www.facebook.com/${username}`;
      return pageUrl;
    }
    
    return url;
  } catch (error) {
    console.error('Error parsing Facebook URL:', error);
    return '';
  }
};

// ฟังก์ชันสำหรับโหลด Facebook SDK
const loadFacebookSDK = () => {
  return new Promise<void>((resolve, reject) => {
    // ตรวจสอบว่า SDK โหลดแล้วหรือยัง
    if (window.FB) {
      resolve();
      return;
    }

    // เพิ่ม Facebook SDK script
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/th_TH/sdk.js#xfbml=1&version=v18.0';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      // รอให้ FB SDK พร้อมใช้งาน
      const checkFB = () => {
        if (window.FB) {
          resolve();
        } else {
          setTimeout(checkFB, 100);
        }
      };
      checkFB();
    };

    script.onerror = () => {
      reject(new Error('ไม่สามารถโหลด Facebook SDK ได้'));
    };

    document.head.appendChild(script);
  });
};

// ฟังก์ชันสำหรับโหลด Facebook Page Plugin
const loadFacebookPagePlugin = async () => {
  if (!mp.value?.fb) {
    return;
  }

  facebookLoading.value = true;
  facebookError.value = null;

  try {
    // แปลง URL เป็นรูปแบบที่ใช้กับ Page Plugin
    const pageUrl = getFacebookPageUrl(mp.value.fb);
    
    if (!pageUrl) {
      throw new Error('ไม่สามารถแปลง Facebook URL ได้');
    }

    facebookPageUrl.value = pageUrl;

    // โหลด Facebook SDK
    await loadFacebookSDK();

    // รอให้ DOM อัปเดตแล้วค่อย render Page Plugin
    await nextTick();
    
    // เรียกใช้ FB.XFBML.parse() เพื่อ render Page Plugin
    if (window.FB && window.FB.XFBML) {
      window.FB.XFBML.parse();
    } else {
      console.warn('Facebook SDK not available for XFBML parsing');
    }

  } catch (error) {
    console.error('Error loading Facebook Page Plugin:', error);
    facebookError.value = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการโหลดหน้า Facebook';
  } finally {
    facebookLoading.value = false;
  }
};

// State สำหรับ image modal
const showImageModal = ref(false);
const selectedImage = ref('');
const selectedImageTitle = ref('');

const openImageModal = (imageUrl: string, title: string) => {
  selectedImage.value = imageUrl;
  selectedImageTitle.value = title;
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  selectedImage.value = '';
  selectedImageTitle.value = '';
};

const fetchMPData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const mpName = decodeURIComponent(route.params.name as string).replace(/_/g, ' ');
    mp.value = localData.value.find(m => m.fullname === mpName) || null;

    if (mp.value) {
      useHead({
        title: `${mp.value.fullname} - ผู้แทนท้องถิ่น`,
        meta: [
          {
            name: 'description',
            content: `ข้อมูลผู้แทนท้องถิ่น ${mp.value.fullname}`
          },
          {
            property: 'og:title',
            content: `${mp.value.fullname} - ผู้แทนท้องถิ่น`
          },
          {
            property: 'og:description',
            content: `ข้อมูลผู้แทนท้องถิ่น ${mp.value.fullname}`
          }
        ]
      });

      // โหลด Facebook Page Plugin ถ้ามี Facebook URL
      if (mp.value.fb) {
        loadFacebookPagePlugin();
      }
    }
  } catch (err) {
    error.value = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
    console.error('Error fetching MP data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMPData();

  // เพิ่ม keyboard event listener สำหรับปิด modal
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && showImageModal.value) {
      closeImageModal();
    }
  };

  document.addEventListener('keydown', handleKeydown);

  // Cleanup function
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
});

// เพิ่ม watcher สำหรับ localKaitomReport เพื่ออัปเดตข้อมูล
watch(localKaitomReport, (newValue) => {
  if (newValue) {
    // อัปเดต meta images สำหรับข่าว
    updateNewsWithMetaImages();
  }
});

// เพิ่ม watcher สำหรับ mp.value เพื่อโหลด Facebook Page Plugin
watch(mp, (newValue, oldValue) => {
  if (newValue && newValue.fb && (!oldValue || oldValue.fb !== newValue.fb)) {
    loadFacebookPagePlugin();
  }
}, { immediate: true });

definePageMeta({ layout: 'mp' })

// ฟังก์ชันสำหรับดึง meta image จาก permalink
const fetchNewsMetaImage = async (permalink: string) => {
  try {
    const response = await fetch(`/api/meta?url=${encodeURIComponent(permalink)}`);
    const data = await response.json();
    return data.image || '';
  } catch (error) {
    console.error('Error fetching meta image:', error);
    return '';
  }
};

// อัปเดตข่าวด้วย meta image
const newsWithMetaImages = ref<Array<News & { metaImage?: string }>>([]);

const updateNewsWithMetaImages = async () => {
  if (!localKaitomReport.value?.news) {
    newsWithMetaImages.value = [];
    return;
  }

  // ดึงแค่ 10 ข่าวล่าสุด และ sort ตามวันที่ล่าสุด
  const latestNews = localKaitomReport.value.news
    .sort((a, b) => {
      const dateA = new Date(a.posted_at || '');
      const dateB = new Date(b.posted_at || '');
      return dateB.getTime() - dateA.getTime(); // เรียงจากใหม่ไปเก่า
    })
    .slice(0, 10);

  const newsWithImages = await Promise.all(
    latestNews.map(async (news) => {
      const metaImage = await fetchNewsMetaImage(news.permalink);
      return {
        ...news,
        metaImage
      };
    })
  );

  newsWithMetaImages.value = newsWithImages;
};
</script>

<style>
.prose {
  max-width: 65ch;
  color: #374151;
}

.prose h1 {
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
}

.prose h2 {
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3333333;
}

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

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

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>