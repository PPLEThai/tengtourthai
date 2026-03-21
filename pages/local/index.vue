<template>
  <div class="min-h-screen bg-[#0A2940] py-8 px-2">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-8 text-center tracking-wide">รายชื่อผู้แทนท้องถิ่น</h1>
    <div class="flex flex-col md:flex-row gap-3 md:gap-6 max-w-6xl mx-auto mb-8 items-center justify-between">
      <input
        v-model="search"
        type="text"
        placeholder="ค้นหาชื่อหรือพื้นที่"
        class="rounded-full px-4 py-2 w-full md:w-80 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6A13] shadow-sm"
      />
      <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <select v-model="selectedPosition" class="rounded-full px-4 py-2 w-full md:w-56 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6A13] shadow-sm">
          <option value="">ทุกตำแหน่ง</option>
          <option v-for="pos in availablePositions" :key="pos" :value="pos">
            {{ pos }}
          </option>
        </select>
        <select
          v-model="selectedProvince"
          class="rounded-full px-4 py-2 w-full md:w-56 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6A13] shadow-sm"
        >
          <option value="">ทุกจังหวัด</option>
          <option v-for="province in availableProvinces" :key="province" :value="province">
            {{ province }}
          </option>
        </select>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div
        v-for="mp in filteredList"
        :key="mp.id"
        class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-2xl border border-[#FF6A13]/10"
      >
        <!-- <img 
          :src="getImageUrl(mp.img)" 
          :alt="mp.fullname" 
          class="w-28 h-28 rounded-full object-cover border-4 border-[#001a2c] mb-4 shadow"
          loading="lazy"
          @error="handleImageError"
        /> -->
        <img 
          :src="getLocalImageUrl(mp.img)" 
          :alt="mp.fullname" 
          class="w-28 h-28 rounded-full object-cover border-4 border-[#001a2c] mb-4 shadow"
          loading="lazy"
          @error="handleImageError"
        />
        <div class="text-xl font-bold text-[#0A2940] text-center mb-1">{{ mp.fullname }}</div>
        <div class="text-sm text-[#FF6A13] mb-1">{{ mp.status }}</div>
        <router-link
          :to="`/local/${mp.fullname.replace(/ /g, '_')}`"
          class="mt-auto bg-[#FF6A13] text-white px-6 py-2 rounded-full text-base font-semibold hover:bg-orange-600 transition-colors shadow"
        >
          ดูรายละเอียด
        </router-link>
      </div>
      <div v-if="filteredList.length === 0" class="col-span-full text-center text-white py-8">
        ไม่พบข้อมูลผู้แทนท้องถิ่นที่ค้นหา
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLocalData, type LocalMPItem } from '@/composables/useLocalData';

definePageMeta({ layout: 'mp' })

useHead({
  title: 'ผู้แทนท้องถิ่น พรรคประชาชน',
  meta: [
    {
      name: 'description',
      content: 'ข้อมูลผู้แทนท้องถิ่น พรรคประชาชน'
    },
    {
      property: 'og:title',
      content: 'ผู้แทนท้องถิ่น พรรคประชาชน'
    },
    {
      property: 'og:description',
      content: 'ข้อมูลผู้แทนท้องถิ่น พรรคประชาชน'
    },
    {
      property: 'og:image',
      content: 'https://tourthai.peoplesparty.or.th/images/thumbnail-mp.png'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://tourthai.peoplesparty.or.th/local'
    }
  ]
});

const { localData } = useLocalData();
const search = ref('');
const selectedPosition = ref('');
const selectedProvince = ref('');

const IMG_PROXY_PREFIX = 'https://img.pplethai.org/unsafe/rs:fit:300:300:1/plain/';

const getLocalImageUrl = (img: string) => {
  if (!img?.trim()) return '';
  return `${IMG_PROXY_PREFIX}${encodeURIComponent(img.trim())}`;
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  // target.src = '/images/default-avatar.png'; // รูปภาพเริ่มต้นเมื่อโหลดไม่สำเร็จ
};

const provinceFromStatus = (status: string) => {
  const t = status.trim();
  if (!t) return '';
  return t.split(/\s+/)[0] ?? '';
};

const availablePositions = computed(() => {
  const set = new Set<string>();
  localData.value.forEach((mp: LocalMPItem) => {
    if (mp.position) set.add(mp.position);
  });
  return Array.from(set).sort();
});

const availableProvinces = computed(() => {
  const provinces = new Set<string>();
  localData.value.forEach((mp: LocalMPItem) => {
    const p = provinceFromStatus(mp.status);
    if (p) provinces.add(p);
  });
  return Array.from(provinces).sort((a, b) => a.localeCompare(b, 'th'));
});

const filteredList = computed(() => {
  return localData.value.filter((mp: LocalMPItem) => {
    const matchSearch =
      mp.fullname.toLowerCase().includes(search.value.toLowerCase()) ||
      mp.status.toLowerCase().includes(search.value.toLowerCase()) ||
      mp.position.toLowerCase().includes(search.value.toLowerCase());

    const matchPosition =
      !selectedPosition.value || mp.position === selectedPosition.value;

    const matchProvince =
      !selectedProvince.value ||
      provinceFromStatus(mp.status) === selectedProvince.value;

    return matchSearch && matchPosition && matchProvince;
  });
});
</script> 