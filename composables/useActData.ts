import { ref, onMounted } from 'vue';

export interface ActMonthlyData {
    [key: string]: {
        [province: string]: number
    }
}

// สร้าง global state สำหรับเดือนที่เลือก
const selectedMonth = ref<string>('');

export const useActData = () => {
    const actData = ref<ActMonthlyData>({});
    const apiActDataUrl = 'https://storage.googleapis.com/pple-media/tengtourthai/act_data.json';

    const fetchActData = async () => {
        try {
            const response = await fetch(apiActDataUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            actData.value = data;
            
            // ตั้งค่าเดือนเริ่มต้นหลังจากโหลดข้อมูล
            if (!selectedMonth.value && Object.keys(data).length > 0) {
                const months = Object.keys(data).sort().reverse();
                selectedMonth.value = months[0];
            }
        } catch (error) {
            console.error('Error fetching act data:', error);
        }
    };

    onMounted(() => {
        fetchActData();
    });

    // คำนวณจำนวนกิจกรรมสำหรับเดือนที่เลือก
    const getActivityCount = () => {
        if (!selectedMonth.value || !actData.value[selectedMonth.value]) return 0;
        
        return Object.values(actData.value[selectedMonth.value]).reduce((sum, count) => sum + count, 0);
    };

    return {
        actData,
        selectedMonth,
        getActivityCount
    };
};