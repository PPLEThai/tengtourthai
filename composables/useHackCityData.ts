import { ref, onMounted } from 'vue';

export interface HackCityItem {
    name: string;
    detail: string;
    geom: string;
    images: string[];
    created: string;
}

export const useHackCityData = () => {
    const hackCityData = ref<HackCityItem[]>([]);

    const fetchHackCityData = async () => {
        try {
            const response = await fetch('/data/hackcity.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            hackCityData.value = data.map((item: HackCityItem) => ({
                name: item.name,
                detail: item.detail,
                geom: item.geom,
                created: item.created,
                images: item.images
            }));
        } catch (error) {
            console.error('Error fetching hack city data:', error);
        }
    };

    onMounted(() => {
        fetchHackCityData();
    });

    return {
        hackCityData,
    };
};