import { ref, onMounted } from 'vue';

export interface KaitomItem {
    date: string;
    latitude: number;
    longitude: number;
    location_name: string;
    description: string;
    images: string[];
    full_name: string;
    role: 'mp' | 'province' | 'local';
}

export const useKaitomData = () => {
    const kaitomData = ref<KaitomItem[]>([]);
    const apiKaitomDataUrl = 'https://hackcity.pplethai.org/api/kaitom-fieldwork';

    const fetchKaitomData = async () => {
        try {
            const response = await fetch(apiKaitomDataUrl);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            kaitomData.value = data.data;
        } catch (error) {
            console.error('Error fetching kaitom data:', error);
        }
    };

    onMounted(() => {
        fetchKaitomData();
    });

    return {
        kaitomData,
    };
};