import { ref, onMounted } from 'vue';
import localJson from '../assets/data/local-data.json';
import type { MPItem } from '@/composables/useMPData';

interface LocalJsonItem {
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
    youtube: string | null;
    position: string;
}

export interface LocalMPItem extends MPItem {
    position: string;
    youtube: string | null;
}

const mapToLocalMPItem = (item: LocalJsonItem): LocalMPItem => ({
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
    work: item.work,
    position: item.position,
    youtube: item.youtube,
});

export const useLocalData = () => {
    const localData = ref<LocalMPItem[]>([]);

    const loadLocalData = () => {
        try {
            localData.value = (localJson as { list: LocalJsonItem[] }).list.map(mapToLocalMPItem);
        } catch (error) {
            console.error('Error loading local data:', error);
        }
    };

    onMounted(() => {
        loadLocalData();
    });

    return {
        localData,
    };
};
