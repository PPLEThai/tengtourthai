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
}

export interface MPItem {
    id: number;
    firstname: string;
    lastname: string;
    fullname: string;
    status: string;
    img: string;
    topics: string[];
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
                topics: item.topic ? item.topic.split(',') : []
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