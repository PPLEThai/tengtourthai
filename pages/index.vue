<template>
  <div class="flex flex-col md:flex-row h-[calc(100vh-64px)]">
    <!-- Map Section -->
    <div class="w-full md:w-1/2">
      <Map :provinces="provinces" @select-province="handleSelectProvince" />
    </div>

    <!-- Province Cards Section -->
    <div class="w-full md:w-1/2 p-4 overflow-y-auto">
      <Detail :provinces="provinces" />
      <!-- <ProvinceList :selectedProvinceId="selectedProvinceId" :provinces="provinces" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Map from "@/components/Map.vue";
import Detail from "@/components/Detail.vue";
import { useProvinces } from "@/composables/useProvince";

const { provinces } = useProvinces();

// เก็บจังหวัดที่ถูกเลือก
const selectedProvinceId = ref<number | null>(null);

const handleSelectProvince = (provinceId: number) => {
  selectedProvinceId.value = provinceId;
};
</script>
