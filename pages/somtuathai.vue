<template>
    <div class="flex flex-col md:flex-row h-[calc(100vh-64px)]">

        <div class="w-full md:w-1/2 h-1/2 md:h-full">
            <SomMap :kaitom-data="kaitomData" />
        </div>

        <div class="w-full md:w-1/2 overflow-y-auto h-1/2 md:h-full">
            <SomDetail :kaitom-data="kaitomData" />
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useKaitomData } from "@/composables/useKaitomData";
// import type { KaitomItem } from "@/composables/useKaitomData";

const { kaitomData } = useKaitomData();

import SomMap from "@/components/SomMap.vue";
import SomDetail from "@/components/SomDetail.vue";

</script>
