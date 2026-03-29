import { ref, onMounted } from 'vue';
import mockData from '../assets/data/mock-mp-data.json';

/** รายการ mock — รองรับทั้งคีย์ `id` (string) และ `Id` (number) ตามแหล่ง JSON */
interface MockMPItem {
    id?: string;
    Id?: number;
    firstname: string;
    lastname: string;
    fullname: string;
    status: string;
    img: string;
    topic: string | null;
    fb: string | null;
    tiktok: string | null;
    ig: string | null;
    x: string | null;
    edu: string | null;
    work: string | null;
    youtube: string | null;
    area: string | null;
}

export interface MPItem {
    id: string;
    firstname: string;
    lastname: string;
    fullname: string;
    status: string;
    img: string;
    topics: string[];
    fb: string | null;
    tiktok: string | null;
    ig: string | null;
    x: string | null;
    edu: string | null;
    work: string | null;
}

export const useMPData = () => {
    const mpData = ref<MPItem[]>([]);

    const fetchMPData = async () => {
        try {
            // ใช้ข้อมูล mockup แทนการเรียก API
            mpData.value = mockData.list.map((item) => {
                const r = item as MockMPItem;
                return {
                    id: r.id ?? String(r.Id ?? ''),
                    firstname: r.firstname,
                    lastname: r.lastname,
                    fullname: r.fullname,
                    status: r.status,
                    img: r.img,
                    topics: r.topic ? r.topic.split(',') : [],
                    fb: r.fb || null,
                    tiktok: r.tiktok || null,
                    ig: r.ig || null,
                    x: r.x || null,
                    edu: r.edu || null,
                    work: r.work || null
                };
            });
        } catch (error) {
            console.error('Error loading mock data:', error);
        }
    };

    onMounted(() => {
        fetchMPData();
    });

    return {
        mpData,
    };
};