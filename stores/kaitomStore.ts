import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { KaitomItem } from '@/composables/useKaitomData';

export const useKaitomStore = defineStore('kaitom', () => {
    const kaitomData = ref<KaitomItem[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const apiKaitomDataUrl = 'https://hackcity.pplethai.org/api/kaitom-fieldwork';

    const fetchKaitomData = async () => {
        if (kaitomData.value.length > 0) return; // ถ้ามีข้อมูลแล้วไม่ต้อง fetch ใหม่
        
        try {
            isLoading.value = true;
            const response = await fetch(apiKaitomDataUrl);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            kaitomData.value = data.data;
        } catch (e) {
            console.error('Error fetching kaitom data:', e);
            error.value = e instanceof Error ? e.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        } finally {
            isLoading.value = false;
        }
    };

    // เรียก fetchKaitomData ทันทีที่สร้าง store
    fetchKaitomData();

    return {
        kaitomData,
        isLoading,
        error,
        fetchKaitomData
    };
}); 