<template>
  <nav id="app-navbar" class="bg-third shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo และ Brand -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center space-x-2">

            <img v-if="currentUrl === '/teng'" src="@/assets/images/teng-logo.png" alt="เท้งทั่วไทย Logo"
              class="h-10" />
            <img v-else-if="currentUrl === '/political-project'" src="@/assets/images/logo-pp.png" alt="วาระจังหวัด"
              class="h-8" />
            <img v-else src="@/assets/images/som-logo.svg" alt="ส้มทั่วไทย" class="h-8" />

            <div class="flex items-center">
              <a class="text-xl font-bold text-white mr-2">{{
                currentUrl === '/teng' ? '#เท้งทั่วไทย' :
                currentUrl === '/political-project' ? '#วาระจังหวัด' :
                '#ส้มทั่วไทย'
                }}</a>
              <img src="/images/arrow-down.svg" @click="toggleWebType" alt="Logo" class="h-4 cursor-pointer" />
            </div>
          </div>
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
            <a href="/teng" class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/teng-logo.png" alt="เท้งทั่วไทย Logo" class="h-10" />
              <div>
                <div class="font-bold">เท้งทั่วไทย</div>
                <div class="text-sm font-light">ภารกิจหัวหน้าพรรคประชาชน</div>
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

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-4">
          <a href="https://www.facebook.com/natthaphong.ruengpanyawut/" target="_blank"
            class="text-white hover:text-primary px-3 py-2 rounded-md">ติดตามเรา</a>
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
        <a href="https://www.facebook.com/natthaphong.ruengpanyawut/" target="_blank"
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

const isMenuOpen = ref(false);
const isWebTypeOpen = ref(false);
const route = useRoute();
const currentUrl = route.path;
const displayType = ref('visit');

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleWebType = () => {
  isWebTypeOpen.value = !isWebTypeOpen.value;
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

const kaitomStore = useKaitomStore();

const tengVisitedDigits = computed(() => tengVisitedProvinces.value.toString().split(""));

const visitedDigits = computed(() => {
  const count = kaitomStore.kaitomData.length.toString();
  return count.padStart(1, '0').split('');
});

const { actData, selectedMonth, getActivityCount } = useActData();

// คำนวณจำนวนกิจกรรมจากเดือนที่เลือก
const activityCount = computed(() => getActivityCount());

const activityDigits = computed(() => {
  return activityCount.value.toString().padStart(1, '0').split("");
});

// ไม่จำเป็นต้องมี updateSelectedMonth แล้ว เพราะใช้ global selectedMonth จาก useActData
</script>
