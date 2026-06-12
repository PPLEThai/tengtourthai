<template>
    <div class="flex flex-col md:flex-row" style="height: calc(100vh - 64px);">

        <div id="map-container" class="w-full md:w-1/2 h-1/2 md:h-full">
            <SomMap :kaitom-data="kaitomStore.kaitomData" :act-data="actData" />
        </div>

        <div id="detail-container" class="w-full md:w-1/2 overflow-y-auto h-1/2 md:h-full">
            <SomDetail :kaitom-data="kaitomStore.kaitomData" />
        </div>

    </div>
</template>

<script setup lang="ts">
import { useKaitomStore } from "@/stores/kaitomStore";
import { useActData } from "@/composables/useActData";

useHead({
  title: 'เว็บไซต์ส้มทั่วไทย พรรคประชาชน',
  meta: [
    {
      name: 'description',
      content: 'การเดินทางขององคาพยพ พรรคประชาชน'
    },
    {
      property: 'og:title',
      content: 'ส้มทั่วไทย พรรคประชาชน'
    },
    {
      property: 'og:description',
      content: 'การเดินทางขององคาพยพ พรรคประชาชน'
    }
  ]
});

const kaitomStore = useKaitomStore();
const { actData } = useActData();

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