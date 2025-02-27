<template>
  <div>
    <h2 v-if="selectedProvince" class="text-xl font-bold mb-4">
      จังหวัด {{ selectedProvince.name }}
    </h2>
    
    <!-- <ProvinceCard v-if="selectedProvince" :province="selectedProvince" />
    <p v-else class="text-gray-500 text-center">เลือกจังหวัดจากแผนที่</p> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProvinceCard from "@/components/ProvinceCard.vue";
import type { Province } from "@/types/province";

const props = defineProps<{ selectedProvinceId: number | null; provinces: Province[] }>();

// หาจังหวัดที่ถูกเลือก
const selectedProvince = computed(() => {
  return props.provinces.find((p) => p.id === props.selectedProvinceId) || null;
});
</script>
