<template>
  <div class="flex flex-col md:flex-row" style="height: calc(100vh - 64px);">

    <div id="map-container" class="w-full md:w-1/2 h-1/2 md:h-full">
      <Map :provinces="provinces" @select-province="handleSelectProvince" />
    </div>

    <div id="detail-container" class="w-full md:w-1/2 p-2 md:p-4 overflow-y-auto h-1/2 md:h-full">
      <Detail :provinces="provinces" />
    </div>

    <!-- <div class="w-full md:w-1/2 h-full">
      <Map :provinces="provinces" @select-province="handleSelectProvince" />
    </div>

    <div class="w-full md:w-1/2 p-2 md:p-4 overflow-y-auto h-1/2 md:h-full">
      <Detail :provinces="provinces" />
    </div> -->

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

<style scoped>
#map-container {
    height: 50%;
}

#detail-container {
    height: 50%;
}

@media (min-width: 768px) {
    #map-container {
        height: 100%;
    }

    #detail-container {
        height: 100%;
    }
}
</style>
