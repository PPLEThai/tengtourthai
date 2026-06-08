import { ref, onMounted } from 'vue';
import futureData from '../assets/data/future-candidate-local.json';

export interface FutureLocalItem {
    id: string;
    fullname: string;
    position: string;
    status: string;
    socialmedia: string | null;
    img: string;
}

export const useFutureLocalData = () => {
    const futureLocalData = ref<FutureLocalItem[]>([]);

    const fetchFutureLocalData = async () => {
        try {
            futureLocalData.value = futureData.list as FutureLocalItem[];
        } catch (error) {
            console.error('Error loading future local candidate data:', error);
        }
    };

    onMounted(() => {
        fetchFutureLocalData();
    });

    return {
        futureLocalData,
    };
};
