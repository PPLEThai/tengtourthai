<template>
  <div class="min-h-screen bg-[#0A2940] flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white py-3 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
      <div class="flex items-center gap-2">
        <!-- <img src="/logo.png" alt="logo" class="h-8" /> -->
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#FF6A13]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="font-bold text-[#FF6A13] text-xl"><router-link to="/mp">หน้ารวมผู้แทน</router-link></span>
        </div>
      </div>
    </nav>
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-white">กำลังโหลดข้อมูล...</div>
    </div>
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-white">{{ error }}</div>
    </div>
    <div v-else-if="mp" class="flex flex-col md:flex-row flex-1 w-full max-w-7xl mx-auto py-4 md:py-8 gap-4 md:gap-6 px-2 md:px-0">
      <!-- Sidebar -->
      <aside class="w-full md:max-w-xs bg-white rounded-2xl p-4 md:p-6 flex flex-col gap-4 md:gap-6 mb-4 md:mb-0">
        <div class="flex flex-col items-center">
          <img :src="getImageUrl(mp.img)" class="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover border-4 border-[#001a2c]" @error="handleImageError" />
          <h2 class="text-xl md:text-2xl font-bold mt-4 text-[#0A2940] text-center">{{ mp.fullname }}</h2>
          <div class="text-[#FF6A13] font-semibold mt-1 text-center text-sm md:text-base">{{ mp.status }}</div>
          <div class="flex gap-2 mt-2" v-if="mp.status !== 'บัญชีรายชื่อ'">
            <button class="bg-[#FF6A13] text-white px-3 py-1 rounded-full text-xs md:text-sm">หาดูง</button>
            <button class="bg-[#FF6A13] text-white px-3 py-1 rounded-full text-xs md:text-sm">สันทอง</button>
          </div>
        </div>
        <!-- ประเด็นที่ผลักดัน -->
        <div>
          <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">ประเด็นที่ผลักดันปัจจุบัน</h3>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="topic in mp.topics" :key="topic" class="flex items-center gap-2">
              <span class="text-[#0A2940] text-xs md:text-sm">• {{ topic }}</span>
            </div>
          </div>
        </div>
        <!-- ประวัติ สส. -->
        <div>
          <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">ประวัติ สส.</h3>
          <ul class="list-disc pl-5 text-[#0A2940] text-xs md:text-sm">
            <li>{{ mp.status }}</li>
          </ul>
        </div>
        <!-- การทำงาน -->
        <div>
          <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">การทำงาน</h3>
          <ul class="list-disc pl-5 text-[#0A2940] text-xs md:text-sm">
            <li>{{ mp.firstname }} {{ mp.lastname }}</li>
          </ul>
        </div>
        <!-- ช่องทางติดต่อ -->
        <div class="flex gap-3 md:gap-4 justify-center mt-2">
          <!-- <a v-if="mpData.socialMedia.facebook" :href="mpData.socialMedia.facebook" target="_blank"><i class="fab fa-facebook text-xl md:text-2xl text-[#FF6A13]"></i></a>
          <a v-if="mpData.socialMedia.instagram" :href="mpData.socialMedia.instagram" target="_blank"><i class="fab fa-instagram text-xl md:text-2xl text-[#FF6A13]"></i></a>
          <a v-if="mpData.socialMedia.line" :href="mpData.socialMedia.line" target="_blank"><i class="fab fa-line text-xl md:text-2xl text-[#FF6A13]"></i></a>
          <a v-if="mpData.socialMedia.email" :href="'mailto:' + mpData.socialMedia.email"><i class="fas fa-envelope text-xl md:text-2xl text-[#FF6A13]"></i></a> -->
        </div>
      </aside>
      <!-- Main Content -->
      <main class="w-full md:flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div class="bg-white rounded-2xl p-4 md:p-6 min-h-[120px] md:min-h-[200px] col-span-1">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">กฎหมายที่ผลักดันอยู่</h3>
          <div class="space-y-2 mb-4">
            <div v-for="(law, index) in randomLaws" :key="index" class="flex items-start gap-2">
              <span class="text-[#0A2940] text-sm">•</span>
              <span class="text-[#0A2940] text-sm">{{ law }}</span>
            </div>
          </div>
          <a href="https://promise.peoplesparty.or.th/" target="_blank" class="text-[#FF6A13] text-sm hover:underline">*สามารถติดตามกฎหมายของพรรคได้ที่นี่</a>
        </div>
        <div class="bg-[#FF6A13] rounded-2xl p-4 md:p-6 min-h-[200px] md:min-h-[420px] col-span-1 row-span-2">
          <h3 class="text-white font-bold text-lg md:text-2xl mb-2">การเข้าพื้นที่/กิจกรรม</h3>
          <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <template v-if="getKaitomDataForMP(mp?.fullname || '').length > 0">
              <div v-for="activity in getKaitomDataForMP(mp?.fullname || '')" :key="activity.date" class="bg-white/10 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-white font-semibold">{{ activity.location_name }}</h4>
                  <span class="text-white/80 text-sm">{{ new Date(activity.date).toLocaleDateString('th-TH') }}</span>
                </div>
                <p class="text-white/90 text-sm mb-3">{{ activity.description }}</p>
                <div v-if="activity.images.length > 0" class="flex gap-2 overflow-x-auto pb-2">
                  <img 
                    v-for="(image, index) in activity.images" 
                    :key="index"
                    :src="getImageUrl(image)"
                    class="w-20 h-20 object-cover rounded-lg"
                    @error="handleImageError"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center justify-center h-[200px]">
                <p class="text-white/80 text-lg">ไม่มีข้อมูล</p>
              </div>
            </template>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-4 md:p-6 min-h-[120px] md:min-h-[200px] col-span-1">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">การประชุมกรรมาธิการ</h3>
          <!-- เนื้อหา -->
        </div>
        <div class="bg-white rounded-2xl p-4 md:p-6 min-h-[120px] md:min-h-[200px] col-span-1 md:col-span-2">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">เนื้อหาที่อยากเล่า</h3>
          <!-- เนื้อหา -->
        </div>
        <div class="bg-white rounded-2xl p-4 md:p-6 min-h-[120px] md:min-h-[200px] col-span-1 md:col-span-2">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">Facebook</h3>
          <div v-if="facebookPageUrl" class="w-full">
            <iframe 
              :src="`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookPageUrl)}&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId=148173948530677`"
              width="100%"
              height="500"
              style="border:none;overflow:hidden"
              scrolling="no"
              frameborder="0"
              allowfullscreen="true"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
            </iframe>
          </div>
          <div v-else class="flex items-center justify-center h-[200px]">
            <p class="text-[#0A2940] text-sm">ไม่พบ Facebook Fanpage</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import { useMPData, type MPItem } from '@/composables/useMPData'
import { useKaitomData, type KaitomItem } from '@/composables/useKaitomData'

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const { mpData } = useMPData();
const { kaitomData } = useKaitomData();
const mp = ref<MPItem | null>(null);
const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);

const laws = [
  "ร่าง พ.ร.บ. แก้ไขเพิ่มเติมประมวลกฎหมายที่ดิน (แก้ปัญหาหน้าบ้าน)",
  "ร่าง พ.ร.บ. แก้ไขเพิ่มเติมประมวลกฎหมายแพ่งและพาณิชย์ (แก้กฎหมายไม่ตีเด็ก)",
  "ร่าง พ.ร.บ. แก้ไขเพิ่มเติมประมวลกฎหมายแพ่งและพาณิชย์ (สมรสเท่าเทียม)",
  "ร่าง พ.ร.บ. แก้ไขเพิ่มเติมประมวลกฎหมายอาญา (ปลดล็อกการสไตรค์)",
  "ร่าง พ.ร.บ. ป่าสงวนแห่งชาติ",
  "ร่าง พ.ร.บ. รับราชการทหาร (ยกเลิกบังคับเกณฑ์ทหาร)",
  "ร่าง พ.ร.ป. ว่าด้วยการป้องกันและปราบปรามการทุจริต",
  "ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม (สิทธิในกระบวนการยุติธรรม)",
  "ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม (เสรีภาพในการแสดงออก)",
  "ร่าง พ.ร.บ. ให้ใช้ประมวลกฎหมายวิธีพิจารณาความอาญา",
  "ร่าง พ.ร.บ. ส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ",
  "ร่าง พ.ร.บ. ว่าด้วยการเวนคืนและการได้มาซึ่งอสังหาริมทรัพย์ (ปลดล็อกเวนคืน)",
  "ร่าง พ.ร.บ. ระเบียบบริหารงานบุคคลส่วนท้องถิ่น",
  "ร่าง พ.ร.บ. ประกันชีวิต"
];

const randomLaws = ref<string[]>([]);

const getRandomLaws = (mpName: string) => {
  // ใช้ชื่อ สส. เป็น seed สำหรับการสุ่ม
  const seed = mpName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...laws].sort(() => 0.5 - Math.sin(seed));
  return shuffled.slice(0, 3); // สุ่ม 3 รายการ
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/images/kaitom-logo.png';
};

const fetchMPData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const mpName = decodeURIComponent(route.params.name as string);
    mp.value = mpData.value.find(mp => mp.fullname === mpName) || null;

    if (mp.value) {
      useHead({
        title: `${mp.value.fullname} - ผู้แทนของฉัน`,
        meta: [
          {
            name: 'description',
            content: `ข้อมูลและกิจกรรมของ ${mp.value.fullname}`
          },
          {
            property: 'og:title',
            content: `${mp.value.fullname} - ผู้แทนของฉัน`
          },
          {
            property: 'og:description',
            content: `ข้อมูลและกิจกรรมของ ${mp.value.fullname}`
          }
        ]
      });
    }
  } catch (err) {
    error.value = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
    console.error('Error fetching MP data:', err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (url: string) => {
  if (!url) return '';
  
  // ถ้าเป็น URL ของ Google Drive ให้แปลงเป็น format ที่ถูกต้อง
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/[-\w]{25,}/);
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId[0]}&sz=w200`;
    }
  }

  // ถ้าเป็น URL ของ storage.googleapis.com ให้ใช้ image server
  if (url.includes('storage.googleapis.com')) {
    return `https://img.pplethai.org/unsafe/rs:fit:1000:1000:1/plain/${encodeURIComponent(url)}`;
  }

  return url;
};

const getKaitomDataForMP = (mpName: string) => {
  return kaitomData.value.filter(item => item.full_name === mpName);
};

const getFacebookPageUrl = (mpName: string) => {
  // ตัวอย่างการ map ชื่อ สส. กับ Facebook URL
  return 'https://www.facebook.com/natthaphong.ruengpanyawut';
//   const facebookMap: { [key: string]: string } = {
//     'ณัฐพงษ์ เรืองปัญญาวุฒิ': 'https://www.facebook.com/natthaphong.ruengpanyawut',
//     // เพิ่ม สส. คนอื่นๆ ตามต้องการ
//   };
  
//   return facebookMap[mpName] || '';
};

const facebookPageUrl = ref('');

watch(() => mp.value?.fullname, (newName) => {
  if (newName) {
    facebookPageUrl.value = getFacebookPageUrl(newName);
  }
}, { immediate: true });

onMounted(() => {
  fetchMPData();
  if (mp.value) {
    randomLaws.value = getRandomLaws(mp.value.fullname);
  }
});

definePageMeta({ layout: 'mp' })
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
</style> 