<template>
  <div class="w-full h-full">
    <AreaMap :areaData="areaData" :fieldworkData="fieldworkData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AreaMap from "@/components/AreaMap.vue";
import { searchByArea, type AreaData, searchFieldwork, type FieldworkData } from '@/services/areaService';

definePageMeta({
  layout: 'map'
});

const route = useRoute();
const areaData = ref<AreaData[]>([]);
const fieldworkData = ref<FieldworkData[]>([]);

onMounted(async () => {
  const district = route.query.district as string;
  const subdistrict = route.query.subdistrict as string;
  const province = route.query.province as string;
  
  if (district || subdistrict || province) {
    const [areaResult, fieldworkResult] = await Promise.all([
      searchByArea(district, subdistrict, province),
      searchFieldwork(district, subdistrict, province)
    ]);
    
    areaData.value = areaResult;
    fieldworkData.value = fieldworkResult;
  }
});
</script>
