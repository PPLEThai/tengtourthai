<template>
  <div class="flex flex-col items-center">
    <div v-if="profileImageUrl" class="relative">
      <img
        :src="profileImageUrl"
        class="w-48 h-48 md:w-56 md:h-56 rounded-xl object-cover border-4 border-[#001a2c]"
        @error="handleImageError"
      />
    </div>
    <h2 class="text-xl md:text-2xl font-bold mt-4 text-[#0A2940] text-center">{{ mp.fullname }}</h2>
    <div class="text-[#FF6A13] font-semibold mt-1 text-center text-sm md:text-base">{{ mp.status }}</div>
    <div v-if="mp.position" class="text-[#0A2940] text-center text-xs md:text-sm mt-2 opacity-90">
      {{ mp.position }}
    </div>
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

  <!-- การศึกษา -->
  <div>
    <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">การศึกษา</h3>
    <div class="text-[#0A2940] text-md md:text-sm">
      <ul class="list-disc list-inside space-y-1">
        <li v-for="(item, index) in mp.edu?.split('\n').filter((line) => line.trim())" :key="index">
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
        <li v-for="(item, index) in mp.work?.split('\n').filter((line) => line.trim())" :key="index">
          {{ item.trim() }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LocalMPItem } from '@/composables/useLocalData';

const props = withDefaults(
  defineProps<{
    mp: LocalMPItem;
    /** URL ต้นทางของ image server (proxy) ต่อท้ายด้วย URL รูปจริงที่ encode แล้ว */
    imageServerBase?: string;
    /** ถ้า `mp.img` เป็น path ไม่ใช่ http(s) จะต่อหน้าด้วยค่านี้ก่อนส่งเข้า image server */
    imageAssetBase?: string;
  }>(),
  {
    imageServerBase: 'https://img.pplethai.org/unsafe/rs:fit:300:300:1/plain/',
    imageAssetBase: 'https://storage.googleapis.com/mp-laws/local-img/'
  }
);

const resolvedImageTarget = computed(() => {
  const raw = props.mp.img?.trim();
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  const path = raw.replace(/^\//, '');
  const base = props.imageAssetBase.replace(/\/?$/, '/');
  return `${base}${path}`;
});

const profileImageUrl = computed(() => {
  const target = resolvedImageTarget.value;
  if (!target) return '';
  return `${props.imageServerBase}${encodeURIComponent(target)}`;
});

const handleImageError = (_e: Event) => {
  // placeholder: ใส่รูปสำรองได้ถ้าต้องการ
};
</script>
