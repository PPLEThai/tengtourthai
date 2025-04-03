import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { KaitomItem } from '@/composables/useKaitomData';

export const useKaitomStore = defineStore('kaitom', () => {
    const kaitomData = ref<KaitomItem[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const apiKaitomDataUrl = 'https://hackcity.pplethai.org/api/kaitom-fieldwork';

    const fetchKaitomDataByMonth = async (month: string) => {
        // ถ้ากำลังโหลดข้อมูลอยู่ ไม่ต้องเรียก API ซ้ำ
        if (isLoading.value) return;
        
        try {
            isLoading.value = true;
            // แยกปีและเดือนจาก string (เช่น "2025-02")
            const [year, monthStr] = month.split('-');
            const yearNum = parseInt(year);
            const monthNum = parseInt(monthStr);
            
            // สร้างวันแรกของเดือน
            const from = `${year}-${monthStr.padStart(2, '0')}-01`;
            
            // คำนวณวันสุดท้ายของเดือน
            const lastDay = new Date(yearNum, monthNum, 0).getDate();
            const to = `${year}-${monthStr.padStart(2, '0')}-${lastDay}`;
            
            const response = await fetch(`${apiKaitomDataUrl}?from=${from}&to=${to}`);

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

    // เรียกข้อมูลเดือนปัจจุบันเมื่อเริ่มต้น (เรียกครั้งเดียวตอนสร้าง store)
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    fetchKaitomDataByMonth(currentMonth);

    return {
        kaitomData,
        isLoading,
        error,
        fetchKaitomDataByMonth
    };
}); 