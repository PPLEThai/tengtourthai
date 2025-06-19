import { ref, onMounted } from 'vue';
import mockData from '../assets/data/mock-mp-data.json';

interface MockMPItem {
    Id: number;
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
}

export interface MPItem {
    id: number;
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
                id: item.Id,
                firstname: item.firstname,
                lastname: item.lastname,
                fullname: item.fullname,
                status: item.status,
                img: item.img,
                topics: item.topic ? item.topic.split(',') : [],
                fb: item.fb,
                tiktok: item.tiktok,
                ig: item.ig,
                x: item.x,
                edu: item.edu,
                work: item.work
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