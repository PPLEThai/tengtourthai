<template>
  <div class="flex flex-col items-center">
    <!-- <div v-if="mp.img" class="relative">
      <img :src="getImageUrl(mp.img)"
        class="w-48 h-48 md:w-56 md:h-56 rounded-xl object-cover border-4 border-[#001a2c]"
        @error="handleImageError" />
    </div> -->
    <div class="relative">
      <img :src="getLocalImageUrl(mp.firstname, mp.lastname)"
        class="w-48 h-48 md:w-56 md:h-56 rounded-xl object-cover border-4 border-[#001a2c]"
        @error="handleImageError" />
    </div>
    <h2 class="text-xl md:text-2xl font-bold mt-4 text-[#0A2940] text-center">{{ mp.fullname }}</h2>
    <div class="text-[#FF6A13] font-semibold mt-1 text-center text-sm md:text-base">{{ mp.status }}</div>
  </div>
  
  <!-- ประเด็นที่ผลักดัน -->
  <div v-if="mp.topics && mp.topics.length > 0">
    <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">ประเด็นที่ผลักดันปัจจุบัน</h3>
    <div class="grid grid-cols-2 gap-2">
      <div v-for="topic in mp.topics" :key="topic" class="flex items-center gap-2">
        <span class="text-[#0A2940] text-xs md:text-sm">• {{ topic }}</span>
      </div>
    </div>
  </div>
  
  <!-- ประวัติ สส. -->
  <div>
    <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">การศึกษา</h3>
    <div class="text-[#0A2940] text-md md:text-sm">
      <ul class="list-disc list-inside space-y-1">
        <li v-for="(item, index) in mp.edu?.split('\n').filter(item => item.trim())" :key="index">
          {{ item.trim() }}
        </li>
      </ul>
    </div>
  </div>
  
  <!-- การทำงาน -->
  <div>
    <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">การทำงาน</h3>
    <div class="text-[#0A2940] text-md md:text-sm">
      <ul class="list-disc list-inside space-y-1">
        <li v-for="(item, index) in mp.work?.split('\n').filter(item => item.trim())" :key="index">
          {{ item.trim() }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MPItem } from '@/composables/useMPData'

interface Props {
  mp: MPItem
}

const props = defineProps<Props>()

const getImageUrl = (url: string) => {
  if (!url) return '';

  // ถ้าเป็น URL ของ Google Drive ให้แปลงเป็น format ที่ถูกต้อง
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/[-\w]{25,}/);
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId[0]}&sz=w300`;
    }
  }

  // ถ้าเป็น URL ของ storage.googleapis.com ให้ใช้ image server
  if (url.includes('storage.googleapis.com')) {
    return `https://img.pplethai.org/unsafe/rs:fit:1000:1000:1/plain/${encodeURIComponent(url)}`;
  }

  return url;
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  // target.src = '/images/news-placeholder.jpg';
};

const getLocalImageUrl = (firstname: string, lastname: string) => {
  const thaiName = `${firstname}_${lastname}`;
  const encodedName = encodeURIComponent(thaiName);
  return `https://img.pplethai.org/unsafe/rs:fit:300:300:1/plain/https://storage.googleapis.com/mp-laws/img/${encodedName}.png?ff`;
};

</script> 