<template>
  <div class="min-h-screen bg-[#1a0f62] py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-4xl font-bold text-white tracking-wide mb-1">ผู้แทน สส.ในอนาคตของฉัน</h1>
        <p class="text-white/60 text-sm">รายชื่อผู้สมัครและทีมขับเคลื่อนพื้นที่</p>
      </div>

      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/15">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="ค้นหาชื่อผู้สมัคร หรือจังหวัด"
              class="w-full bg-white/20 text-white placeholder-white/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6900] transition"
            />
          </div>
          <select
            v-model="selectedProvince"
            class="bg-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6900] transition appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="" class="bg-[#1a0f62]">ทุกจังหวัด</option>
            <option v-for="province in availableProvinces" :key="province" :value="province" class="bg-[#1a0f62]">
              {{ province }}
            </option>
          </select>
        </div>
      </div>

      <p class="text-white/60 text-xs text-right mb-4 pr-1">
        พบ <span class="text-[#ff6900] font-bold text-sm">{{ filteredList.length }}</span> คน
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        <article
          v-for="mp in filteredList"
          :key="mp.id"
          class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="relative overflow-hidden bg-gradient-to-b from-[#ff6900] via-[#ff8f43] to-[#1a0f62]" style="aspect-ratio: 3/4;">
            <img
              :src="getImageUrl(mp.img)"
              :alt="mp.fullname"
              class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              @error="handleImageError"
            />
            <div class="absolute top-2 left-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md leading-tight bg-[#1a0f62] text-white border border-[#ff6900]/60">
                ผู้สมัคร
              </span>
            </div>
          </div>

          <div class="p-3 md:p-4">
            <p class="font-bold text-[#1a0f62] text-sm md:text-base leading-snug line-clamp-2 mb-0.5">
              {{ mp.fullname }}
            </p>
            <p class="text-[11px] md:text-xs text-[#1a0f62]/70 line-clamp-1 mb-3">
              {{ mp.status }}
            </p>
            <div class="grid grid-cols-2 gap-2">
              <a
                v-if="mp.socialmedia"
                :href="mp.socialmedia"
                target="_blank"
                rel="noopener noreferrer"
                class="text-center bg-[#ff6900] hover:bg-[#ff7c21] text-white text-xs md:text-sm font-semibold py-2 rounded-xl transition-colors duration-200"
              >
                ความเคลื่อนไหว
              </a>
              <button
                v-else
                disabled
                class="text-center bg-[#ff6900]/40 text-white/70 text-xs md:text-sm font-semibold py-2 rounded-xl cursor-not-allowed"
              >
                ความเคลื่อนไหว
              </button>
              <button
                type="button"
                class="text-center bg-[#1a0f62] hover:bg-[#2a1b84] text-white text-xs md:text-sm font-semibold py-2 rounded-xl transition-colors duration-200"
                @click="openComplaintModal(mp)"
              >
                ร้องเรียน
              </button>
            </div>
          </div>
        </article>

        <div v-if="filteredList.length === 0" class="col-span-full py-20 flex flex-col items-center gap-3">
          <p class="text-white/50 text-base">ไม่พบข้อมูลผู้สมัครที่ค้นหา</p>
        </div>
      </div>
    </div>

    <FutureCandidateComplaintModal
      :show="complaintModal.show"
      :candidate-id="complaintModal.candidate?.id ?? ''"
      :candidate-name="complaintModal.candidate?.fullname ?? ''"
      :candidate-area="complaintModal.candidate?.status ?? ''"
      @close="closeComplaintModal"
      @submit="handleComplaintSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useFutureMPData, type FutureMPItem } from "@/composables/useFutureMPData";
import FutureCandidateComplaintModal, { type ComplaintFormPayload } from "@/components/mp/FutureCandidateComplaintModal.vue";

definePageMeta({ layout: "mp" });

const { futureMPData } = useFutureMPData();
const search = ref("");
const selectedProvince = ref("");

const complaintModal = ref<{ show: boolean; candidate: FutureMPItem | null }>({
  show: false,
  candidate: null,
});

const openComplaintModal = (mp: FutureMPItem) => {
  complaintModal.value = { show: true, candidate: mp };
};

const closeComplaintModal = () => {
  complaintModal.value = { show: false, candidate: null };
};

const handleComplaintSubmit = (payload: ComplaintFormPayload) => {
  // TODO: เชื่อมต่อ backend แจ้งปัญหาเกี่ยวกับผู้สมัครถึงพรรคประชาชน
  console.log('[candidate-report]', payload);
};

const getImageUrl = (img: string) => {
  if (!img?.trim()) return "";
  if (img.startsWith("http")) return img.trim();
  return `https://img.pplethai.org/unsafe/rs:fit:800:8000:1/plain/${img.trim()}`;
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.style.opacity = "0.35";
};

const availableProvinces = computed(() => {
  const set = new Set<string>();
  futureMPData.value.forEach((item: FutureMPItem) => {
    if (item.province) set.add(item.province);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, "th"));
});

const filteredList = computed(() => {
  return futureMPData.value.filter((mp: FutureMPItem) => {
    const keyword = search.value.toLowerCase();
    const matchSearch =
      mp.fullname.toLowerCase().includes(keyword) ||
      mp.status.toLowerCase().includes(keyword) ||
      mp.province.toLowerCase().includes(keyword);

    const matchProvince = !selectedProvince.value || mp.province === selectedProvince.value;

    return matchSearch && matchProvince;
  });
});
</script>
