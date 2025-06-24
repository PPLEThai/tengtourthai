<template>
  <div class="min-h-screen bg-[#0A2940] py-8 px-2">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-8 text-center tracking-wide">รายชื่อผู้แทนราษฎร</h1>
    <div class="flex flex-col md:flex-row gap-3 md:gap-6 max-w-6xl mx-auto mb-8 items-center justify-between">
      <input
        v-model="search"
        type="text"
        placeholder="ค้นหาชื่อ สส. หรือเขต..."
        class="rounded-full px-4 py-2 w-full md:w-80 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6A13] shadow-sm"
      />
      <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <select v-model="selectedType" class="rounded-full px-4 py-2 w-full md:w-56 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6A13] shadow-sm">
          <option value="">ทุกประเภท</option>
          <option value="บัญชีรายชื่อ">บัญชีรายชื่อ</option>
          <option value="เขต">สส. เขต</option>
        </select>
        <select 
          v-if="selectedType === 'เขต'" 
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
        <img 
          :src="getImageUrl(mp.img)" 
          :alt="mp.fullname" 
          class="w-28 h-28 rounded-full object-cover border-4 border-[#001a2c] mb-4 shadow"
          loading="lazy"
          @error="handleImageError"
        />
        <div class="text-xl font-bold text-[#0A2940] text-center mb-1">{{ mp.fullname }}</div>
        <div class="text-sm text-[#FF6A13] mb-1">{{ mp.status }}</div>
        <router-link
          :to="`/mp/${mp.fullname.replace(/ /g, '_')}`"
          class="mt-auto bg-[#FF6A13] text-white px-6 py-2 rounded-full text-base font-semibold hover:bg-orange-600 transition-colors shadow"
        >
          ผู้แทนของฉัน
        </router-link>
      </div>
      <div v-if="filteredList.length === 0" class="col-span-full text-center text-white py-8">
        ไม่พบข้อมูลผู้แทนราษฎรที่ค้นหา
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
    {
      name: 'description',
      content: 'ข้อมูลและกิจกรรมของผู้แทน พรรคประชาชน'
    },
    {
      property: 'og:title',
      content: 'ผู้แทนของฉัน พรรคประชาชน'
    },
    {
      property: 'og:description',
      content: 'ข้อมูลและกิจกรรมของ พรรคประชาชน'
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
      content: 'https://tourthai.peoplesparty.or.th/mp'
    }
  ]
});

const { mpData } = useMPData();
const search = ref('');
const selectedType = ref('');
const selectedProvince = ref('');

// เคลียร์ค่า selectedProvince เมื่อ selectedType เปลี่ยน
watch(selectedType, (newType) => {
  if (newType !== 'เขต') {
    selectedProvince.value = '';
  }
});

const getImageUrl = (url: string) => {
  if (!url) return '';
  // ถ้าเป็น URL ของ Google Drive ให้แปลงเป็น format ที่ถูกต้อง
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/[-\w]{25,}/);
    if (fileId) {
      // ใช้ thumbnail URL แทน
      return `https://drive.google.com/thumbnail?id=${fileId[0]}&sz=w200`;
    }
  }
  return url;
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  // target.src = '/images/default-avatar.png'; // รูปภาพเริ่มต้นเมื่อโหลดไม่สำเร็จ
};

// คำนวณรายการจังหวัดที่มีในข้อมูล MP เขต
const availableProvinces = computed(() => {
  const provinces = new Set<string>();
  mpData.value.forEach((mp: MPItem) => {
    if (mp.status !== 'บัญชีรายชื่อ' && mp.status.includes('เขต')) {
      // แยกชื่อจังหวัดออกจาก status (เช่น "กรุงเทพมหานคร เขต 1" -> "กรุงเทพมหานคร")
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