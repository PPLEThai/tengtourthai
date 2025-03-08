<template>
  <nav class="bg-third shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo และ Brand -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center space-x-2">
            <img src="/images/logo-pp.png" alt="Logo" class="h-8" />
            <div class="flex items-center">
              <a class="text-xl font-bold text-white mr-2">{{ currentUrl === '/somtuathai' ? '#ส้มทั่วไทย' : '#เท้งทั่วไทย' }}</a>
              <img src="/images/arrow-down.svg" @click="toggleWebType" alt="Logo" class="h-4 cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- Dropdown Menu -->
        <div v-show="isWebTypeOpen" class="absolute bg-third shadow-lg rounded-md mt-2 top-16 z-30">
          <div class="px-4 py-4">
            <a href="/" class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/teng-logo.png" alt="เท้งทั่วไทย Logo" class="h-10" />
              <div>
                <div class="font-bold">เท้งทั่วไทย</div>
                <div class="text-sm font-light">ภารกิจหัวหน้าพรรคประชาชน</div>
              </div>
            </a>
            <!-- <div class="border-t border-gray-200 my-2"></div> -->
            <a href="/somtuathai" class="text-white hover:bg-secondary px-3 py-2 flex items-center space-x-2 rounded-md">
              <img src="@/assets/images/som-logo.svg" alt="ส้มทั่วไทย Logo" class="h-8" />
              <div>
                <div class="font-bold">ส้มทั่วไทย</div>
                <div class="text-sm font-light">การเดินทางขององคาพยพ</div>
              </div>
            </a>
          </div>
        </div>

        <!-- จังหวัดที่ไปมาแล้ว -->
        <div v-if="currentUrl !== '/somtuathai'" class="flex items-center space-x-2">
          <span class="text-white hidden md:block md:text-lg">ไปมาแล้ว</span>
          <div class="flex space-x-1">
            <span v-for="digit in visitedDigits" :key="digit"
              class="bg-gradient-to-b from-orange-500 to-orange-800 text-white font-bold px-2 py-1 rounded-md shadow-md">
              {{ digit }}
            </span>
          </div>
          <span class="text-white text-sm md:text-lg">จังหวัด</span>
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
import { ref, computed } from "vue";
import { useMockupStore } from "@/stores/mockupStore";
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);
const isWebTypeOpen = ref(false);
const route = useRoute();
const currentUrl = route.path;

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleWebType = () => {
  isWebTypeOpen.value = !isWebTypeOpen.value;
};

const mockupStore = useMockupStore();
const groupedData = computed(() => mockupStore.groupedData);

// Compute the number of visited provinces
const visitedProvinces = computed(() => {
  return Object.keys(groupedData.value).length;
});

// แยกตัวเลขเป็น Array เพื่อให้แต่ละหลักเป็นกล่องแยก
const visitedDigits = computed(() => visitedProvinces.value.toString().split(""));
</script>
