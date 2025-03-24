import { ref, onMounted } from 'vue';

export interface ActMonthlyData {
    [key: string]: {
        [province: string]: number
    }
}

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
        } catch (error) {
            console.error('Error fetching act data:', error);
        }
    };

    onMounted(() => {
        fetchActData();
    });

    return {
        actData,
    };
};