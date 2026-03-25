import { ref, onMounted } from 'vue';
import mockData from '../assets/data/mock-mp-data.json';

interface MockMPItem {
    id: string;
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
            mpData.value = mockData.list.map((item: MockMPItem) => ({
                id: item.id,
                firstname: item.firstname,
                lastname: item.lastname,
                fullname: item.fullname,
                status: item.status,
                img: item.img,
                topics: item.topic ? item.topic.split(',') : [],
                fb: item.fb || null,
                tiktok: item.tiktok || null,
                ig: item.ig || null,
                x: item.x || null,
                edu: item.edu || null,
                work: item.work || null
            }));
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