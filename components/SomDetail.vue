<template>
    <div class="card bg-base-100 md:h-full w-full shadow-xl rounded-none px-4 py-6 overflow-y-auto">
        <div class="flex flex-row gap-2">
            <div class="flex flex-col gap-2">
                <img src="@/assets/images/som-logo.png" alt="logo" class="w-6">
            </div>
            <div class="flex flex-col">
                <h1 class="text-xl md:text-2xl font-bold">กิจกรรมส้มทั่วไทย พรรคประชาชน</h1>
                <h4 class="text-gray-500 text-sm">กระจายตัวทำงานทั่วประเทศ เพื่อเจ้านายที่เป็นประชาชน</h4>
            </div>
        </div>
        
        <div class="divider text-primary">ข้อมูลกิจกรรมใน  7 วันที่ผ่านมา</div>
        <div class="h-[calc(100%-140px)]">
            <div v-for="(item, index) in props.kaitomData.slice(-20)" :key="index" class="card bg-white shadow-md rounded-md p-4 mb-4 flex flex-row">
                <div v-if="item.images && item.images.length > 0" class="w-1/4">
                    <img :src="item.images[0]" alt="activity image" class="w-full h-auto rounded-md">
                </div>
                <div class="w-3/4 pl-4">
                    <h3 class="text-lg font-bold">{{ truncateText(item.location_name, 100) }}</h3>
                    <p class="text-sm font-light">ผู้นำเข้าข้อมูล: {{ item.full_name }}</p>
                    <p class="text-sm font-light">วันที่: {{ formatThaiDate(item.date) }}</p>
                    <p v-if="item.description" class="text-sm font-light">คำอธิบาย: {{ truncateText(item.description, 300) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { KaitomItem } from "@/composables/useKaitomData";

const props = defineProps({
    kaitomData: {
        type: Array as PropType<KaitomItem[]>,
        required: true
    }
});

const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const formatThaiDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
};

</script>