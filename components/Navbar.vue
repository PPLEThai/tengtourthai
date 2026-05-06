<template>
  <nav id="app-navbar" class="bg-third shadow-lg relative">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo และ Brand -->
        <div class="flex items-center">
          <button type="button" @click="toggleWebType"
            class="flex-shrink-0 flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-md">

            <img :src="brandLogoSrc" :alt="brandLogoAlt" class="h-8" />

            <div class="flex items-center">
              <a class="text-xl font-bold text-white mr-2">{{ brandLabel }}</a>
              <img src="/images/arrow-down.svg" alt="Logo" class="h-4 cursor-pointer" />
            </div>
            

          </button>
        </div>

        <!-- Dropdown Menu -->
        <div v-show="isWebTypeOpen" class="absolute bg-third shadow-lg rounded-md mt-2 top-16 z-30">
          <div class="px-4 py-4">
            <a href="/" class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/som-logo.svg" alt="ส้มทั่วไทย Logo" class="h-8" />
              <div>
                <div class="font-bold">ส้มทั่วไทย</div>
                <div class="text-sm font-light">การเดินทางขององคาพยพ</div>
              </div>
            </a>
            <a href="/political-project"
              class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/logo-pp.png" alt="วาระจังหวัด Logo" class="h-8" />
              <div>
                <div class="font-bold">วาระจังหวัด</div>
                <div class="text-sm font-light">เป้าหมายการขับเคลื่อนจังหวัด</div>
              </div>
            </a>
            <a href="/mp" class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/kaitom-logo.png" alt="ผู้แทนของฉัน Logo" class="h-8" />
              <div>
                <div class="font-bold">ผู้แทน สส.ของฉัน</div>
                <div class="text-sm font-light">เรื่องราวการทำงานของ สส.</div>
              </div>
            </a>
            <a href="/local" class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/kaitom-logo.png" alt="ผู้แทนของฉัน Logo" class="h-8" />
              <div>
                <div class="font-bold">ผู้แทนท้องถิ่นของฉัน</div>
                <div class="text-sm font-light">เร่ื่องราวการทำงานของผู้แทนท้องถิ่น</div>
              </div>
            </a>
            <a href="/future-mp-candidate"
              class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/kaitom-logo.png" alt="ผู้แทน สส.ในอนาคตของฉัน Logo" class="h-8" />
              <div>
                <div class="font-bold">ผู้แทน สส.ในอนาคตของฉัน</div>
                <div class="text-sm font-light">ติดตามว่าที่ผู้แทน สส.</div>
              </div>
            </a>
            <a href="/future-local-candidate"
              class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/kaitom-logo.png" alt="ผู้แทนท้องถิ่นในอนาคตของฉัน Logo" class="h-8" />
              <div>
                <div class="font-bold">ผู้แทนท้องถิ่นในอนาคตของฉัน</div>
                <div class="text-sm font-light">ติดตามว่าที่ผู้แทนท้องถิ่น</div>
              </div>
            </a>
            <a href="/pple-donation" class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/som-logo.svg" alt="การสนับสนุน/บริจาค Logo" class="h-8" />
              <div>
                <div class="font-bold">การสนับสนุน/บริจาค</div>
                <div class="text-sm font-light">ข้อมูลการสนับสนุนพรรค</div>
              </div>
            </a>
            <a href="/oranger" class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/som-logo.svg" alt="อาสาสมัครส้ม Logo" class="h-8" />
              <div>
                <div class="font-bold">อาสาสมัครส้ม</div>
                <div class="text-sm font-light">เครือข่ายอาสาสมัครพื้นที่</div>
              </div>
            </a>
            <a href="/case" class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/som-logo.svg" alt="จากพื้นที่สู่สภา Logo" class="h-8" />
              <div>
                <div class="font-bold">จากพื้นที่สู่สภา</div>
                <div class="text-sm font-light">เคสงานจากพื้นที่สู่สภา</div>
              </div>
            </a>
          </div>
        </div>

        <!-- จังหวัดที่ไปมาแล้ว -->
        <div v-if="currentUrl === '/teng'" class="flex items-center space-x-2">
          <span class="text-white hidden md:block md:text-lg">ไปมาแล้ว</span>
          <div class="flex space-x-1">
            <span v-for="digit in tengVisitedDigits" :key="digit"
              class="bg-gradient-to-b from-orange-500 to-orange-800 text-white font-bold px-2 py-1 rounded-md shadow-md">
              {{ digit }}
            </span>
          </div>
          <span class="text-white text-sm md:text-lg">จังหวัด</span>
        </div>

        <!-- Desktop View -->
        <div v-if="currentUrl === '/'" class="hidden md:flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span class="text-white text-lg">เข้าพื้นที่</span>
            <div class="flex space-x-1">
              <span v-for="digit in visitedDigits" :key="digit"
                class="bg-gradient-to-b from-orange-500 to-orange-800 text-white font-bold px-2 py-1 rounded-md shadow-md">
                {{ digit }}
              </span>
            </div>
            <span class="text-white text-lg">ครั้ง</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-white text-lg">กิจกรรม</span>
            <div class="flex space-x-1">
              <span v-for="digit in activityDigits" :key="digit"
                class="bg-gradient-to-b from-orange-500 to-orange-800 text-white font-bold px-2 py-1 rounded-md shadow-md">
                {{ digit }}
              </span>
            </div>
            <span class="text-white text-lg">ครั้ง</span>
          </div>
        </div>

        <!-- Mobile View -->
        <div v-if="currentUrl === '/'" class="md:hidden flex items-center space-x-2">
          <div class="flex items-center space-x-2">
            <!-- <button class="text-white text-lg flex items-center">
              <span class="mr-2">{{ displayType === 'visit' ? 'เข้าพื้นที่' : 'กิจกรรม' }}</span>
            </button> -->
          </div>
          <div class="flex space-x-1">
            <span v-for="digit in displayType === 'visit' ? visitedDigits : activityDigits" :key="digit"
              class="bg-gradient-to-b from-orange-500 to-orange-800 text-white font-bold px-1.5 py-0.5 rounded-md shadow-md text-sm">
              {{ digit }}
            </span>
          </div>
          <span class="text-white text-sm">ครั้ง</span>
          <button @click="toggleDisplayType" class="text-white text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button @click="toggleMenu" class="text-white hover:text-primary">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a href="https://www.facebook.com/PPLEThai" target="_blank"
          class="block text-white hover:text-primary px-3 py-2 rounded-md">ติดต่อเรา</a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useMockupStore } from "@/stores/mockupStore";
import { useRoute } from 'vue-router';
import { useKaitomStore } from "@/stores/kaitomStore";
import { useActData } from "@/composables/useActData";
import logoSom from "@/assets/images/som-logo.svg";
import logoPoliticalProject from "@/assets/images/logo-pp.png";
import logoRepresentative from "@/assets/images/kaitom-logo.png";

const isMenuOpen = ref(false);
const isWebTypeOpen = ref(false);
const isInsightMenuOpen = ref(false);
const route = useRoute();
const currentUrl = computed(() => route.path);
const displayType = ref('visit');

const representativePaths = ['/mp', '/local', '/future-mp-candidate', '/future-local-candidate'];
const socialPaths = ['/pple-donation', '/oranger', '/case'];

const isPoliticalProjectPage = computed(() => currentUrl.value === '/political-project');
const isRepresentativePage = computed(() =>
  representativePaths.some(path => currentUrl.value.startsWith(path))
);
const isSocialPage = computed(() => socialPaths.some(path => currentUrl.value.startsWith(path)));

const brandLogoSrc = computed(() => {
  if (isPoliticalProjectPage.value) return logoPoliticalProject;
  if (isRepresentativePage.value) return logoRepresentative;
  return logoSom;
});

const brandLogoAlt = computed(() => {
  if (isPoliticalProjectPage.value) return 'วาระจังหวัด';
  if (isRepresentativePage.value) return 'ผู้แทนของฉัน';
  if (isSocialPage.value) return 'ภารกิจเครือข่ายพรรค';
  return 'ส้มทั่วไทย';
});

const brandLabel = computed(() => {
  if (isPoliticalProjectPage.value) return '#วาระจังหวัด';
  if (currentUrl.value.startsWith('/future-mp-candidate')) return '#ผู้แทน สส.ในอนาคตของฉัน';
  if (currentUrl.value.startsWith('/future-local-candidate')) return '#ผู้แทนท้องถิ่นในอนาคตของฉัน';
  if (currentUrl.value.startsWith('/mp')) return '#ผู้แทน สส.ของฉัน';
  if (currentUrl.value.startsWith('/local')) return '#ผู้แทนท้องถิ่นของฉัน';
  if (currentUrl.value.startsWith('/pple-donation')) return '#ยอดการสนับสนุน (บริจาค)';
  if (currentUrl.value.startsWith('/oranger')) return '#อาสาสมัครส้ม';
  if (currentUrl.value.startsWith('/case')) return '#จากพื้นที่สู่สภา';
  return '#ส้มทั่วไทย';
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleWebType = () => {
  isWebTypeOpen.value = !isWebTypeOpen.value;
};

const toggleInsightMenu = () => {
  isInsightMenuOpen.value = !isInsightMenuOpen.value;
};

const toggleDisplayType = () => {
  displayType.value = displayType.value === 'visit' ? 'activity' : 'visit';
};

const mockupStore = useMockupStore();
const groupedData = computed(() => mockupStore.groupedData);

// Compute the number of visited provinces
const tengVisitedProvinces = computed(() => {
  return Object.keys(groupedData.value).length;
});

// ตรวจสอบว่าไม่ใช่หน้า /mp ก่อนเรียกใช้ services
const isMPPage = computed(() => currentUrl.value.startsWith('/mp'));

// เรียกใช้ services เฉพาะเมื่อไม่ใช่หน้า /mp
const kaitomStore = !isMPPage.value ? useKaitomStore() : null;
const { actData, selectedMonth, getActivityCount } = !isMPPage.value ? useActData() : { actData: ref([]), selectedMonth: ref(''), getActivityCount: () => 0 };

const tengVisitedDigits = computed(() => tengVisitedProvinces.value.toString().split(""));

const visitedDigits = computed(() => {
  if (isMPPage.value) return ['0'];
  const count = kaitomStore?.kaitomData.length.toString() || '0';
  return count.padStart(1, '0').split('');
});

// คำนวณจำนวนกิจกรรมจากเดือนที่เลือก
const activityCount = computed(() => {
  if (isMPPage.value) return 0;
  return getActivityCount();
});

const activityDigits = computed(() => {
  return activityCount.value.toString().padStart(1, '0').split("");
});
</script>
