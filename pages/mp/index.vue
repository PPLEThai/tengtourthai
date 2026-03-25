<template>
  <div class="min-h-screen bg-[#0A2940] py-8 px-4">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-4xl font-bold text-white tracking-wide mb-1">รายชื่อผู้แทนราษฎร</h1>
        <p class="text-white/50 text-sm">พรรคประชาชน</p>
      </div>

      <!-- Search & Filter Panel -->
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/10">
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search Input -->
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="ค้นหาชื่อ สส. หรือจังหวัด"
              class="w-full bg-white/20 text-white placeholder-white/40 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A13] transition"
            />
          </div>

          <!-- Type Filter -->
          <select
            v-model="selectedType"
            class="bg-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A13] transition appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="" class="bg-[#0A2940]">ทุกประเภท</option>
            <option value="บัญชีรายชื่อ" class="bg-[#0A2940]">บัญชีรายชื่อ</option>
            <option value="เขต" class="bg-[#0A2940]">สส. เขต</option>
          </select>

          <!-- Province Filter -->
          <select
            v-if="selectedType === 'เขต'"
            v-model="selectedProvince"
            class="bg-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A13] transition appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="" class="bg-[#0A2940]">ทุกจังหวัด</option>
            <option v-for="province in availableProvinces" :key="province" :value="province" class="bg-[#0A2940]">
              {{ province }}
            </option>
          </select>
        </div>
      </div>

      <!-- Result Count -->
      <p class="text-white/50 text-xs text-right mb-4 pr-1">
        พบ <span class="text-[#FF6A13] font-bold text-sm">{{ filteredList.length }}</span> คน
      </p>

      <!-- MP Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        <router-link
          v-for="mp in filteredList"
          :key="mp.id"
          :to="`/mp/${mp.fullname.replace(/ /g, '_')}`"
          class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer block"
        >
          <!-- Image -->
          <div class="relative overflow-hidden bg-gradient-to-b from-[#ff6b15] via-[#ff9a3d] to-[#0A2940]" style="aspect-ratio: 3/4;">
            <img
              :src="getLocalImageUrl(mp.img)"
              :alt="mp.fullname"
              class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              @error="handleImageError"
            />
            <!-- Gradient overlay at bottom -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <!-- Status Badge -->
            <div class="absolute top-2 left-2">
              <span
                :class="mp.status === 'บัญชีรายชื่อ'
                  ? 'bg-[#FF6A13] text-white'
                  : 'bg-[#0A2940] text-white'"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md leading-tight"
              >
                {{ mp.status === 'บัญชีรายชื่อ' ? 'บัญชีรายชื่อ' : 'เขต' }}
              </span>
            </div>
            <!-- Arrow icon on hover -->
            <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <div class="bg-[#FF6A13] rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="p-3 md:p-4">
            <p class="font-bold text-[#0A2940] text-sm md:text-base leading-snug line-clamp-2 mb-0.5 group-hover:text-[#FF6A13] transition-colors duration-200">
              {{ mp.fullname }}
            </p>
            <p class="text-[11px] md:text-xs text-gray-400 line-clamp-1 mb-3">
              {{ mp.status }}
            </p>
            <div
              class="text-center bg-[#0A2940] group-hover:bg-[#FF6A13] text-white text-xs md:text-sm font-semibold py-2 rounded-xl transition-colors duration-200"
            >
              ผู้แทนของฉัน
            </div>
          </div>
        </router-link>

        <!-- Empty State -->
        <div v-if="filteredList.length === 0" class="col-span-full py-20 flex flex-col items-center gap-3">
          <svg class="w-12 h-12 text-white/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <p class="text-white/40 text-base">ไม่พบข้อมูลผู้แทนราษฎรที่ค้นหา</p>
          <button @click="resetFilters" class="text-[#FF6A13] text-sm underline hover:no-underline">ล้างการค้นหา</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useMPData, type MPItem } from '@/composables/useMPData';

definePageMeta({ layout: 'mp' })

useHead({
  title: 'ผู้แทนของฉัน พรรคประชาชน',
  meta: [
    { name: 'description', content: 'ข้อมูลและกิจกรรมของผู้แทน พรรคประชาชน' },
    { property: 'og:title', content: 'ผู้แทนของฉัน พรรคประชาชน' },
    { property: 'og:description', content: 'ข้อมูลและกิจกรรมของ พรรคประชาชน' },
    { property: 'og:image', content: 'https://tourthai.peoplesparty.or.th/images/thumbnail-mp.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://tourthai.peoplesparty.or.th/mp' }
  ]
});

const { mpData } = useMPData();
const search = ref('');
const selectedType = ref('');
const selectedProvince = ref('');

watch(selectedType, (newType) => {
  if (newType !== 'เขต') selectedProvince.value = '';
});

const getLocalImageUrl = (img: string) => {
  // return img;
  return `https://img.pplethai.org/unsafe/rs:fit:800:8000:1/plain/${img}`;
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.style.opacity = '0.3';
};

const resetFilters = () => {
  search.value = '';
  selectedType.value = '';
  selectedProvince.value = '';
};

const availableProvinces = computed(() => {
  const provinces = new Set<string>();
  mpData.value.forEach((mp: MPItem) => {
    if (mp.status !== 'บัญชีรายชื่อ' && mp.status.includes('เขต')) {
      const provinceName = mp.status.split(' เขต ')[0];
      provinces.add(provinceName);
    }
  });
  return Array.from(provinces).sort();
});

const filteredList = computed(() => {
  return mpData.value.filter((mp: MPItem) => {
    const matchSearch =
      mp.fullname.toLowerCase().includes(search.value.toLowerCase()) ||
      mp.status.toLowerCase().includes(search.value.toLowerCase());

    const matchType =
      !selectedType.value ||
      (selectedType.value === 'เขต' && mp.status !== 'บัญชีรายชื่อ') ||
      (selectedType.value === 'บัญชีรายชื่อ' && mp.status === 'บัญชีรายชื่อ');

    const matchProvince =
      !selectedProvince.value ||
      (selectedType.value === 'เขต' && mp.status.startsWith(selectedProvince.value));

    return matchSearch && matchType && matchProvince;
  });
});
</script>
