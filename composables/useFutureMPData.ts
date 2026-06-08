import { ref, onMounted } from 'vue';
import futureData from '../assets/data/future-candidate-mp.json';

export interface FutureMPItem {
    id: string;
    fullname: string;
    province: string;
    district: string;
    status: string;
    socialmedia: string | null;
    img: string;
}

export const useFutureMPData = () => {
    const futureMPData = ref<FutureMPItem[]>([]);

    const fetchFutureMPData = async () => {
        try {
            futureMPData.value = futureData.list as FutureMPItem[];
        } catch (error) {
            console.error('Error loading future MP candidate data:', error);
        }
    };

    onMounted(() => {
        fetchFutureMPData();
    });

    return {
        futureMPData,
    };
};
