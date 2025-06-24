import { ref, onMounted } from 'vue';

export interface LawItem {
    title: string;
}

export interface ConsultationItem {
    title: string;
    link: string;
}

export interface MPLawsData {
    name: string;
    id_sapa: string;
    list_laws: LawItem[];
    list_consultations: ConsultationItem[];
}

export const useMPLaws = (mpName: string) => {
    const mpLawsData = ref<MPLawsData | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchMPLaws = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            // สร้าง URL สำหรับ API โดยใช้ชื่อ ส.ส.
            const encodedName = encodeURIComponent(mpName);
            const url = `https://storage.googleapis.com/mp-laws/list/${encodedName}.json`;
            
            const response = await fetch(url);
 
            if (!response.ok) {
                throw new Error('ไม่สามารถโหลดข้อมูลกฎหมายได้');
            }
            
            const data: MPLawsData = await response.json();
            
            // Validate และ clean ข้อมูล
            if (data && typeof data === 'object') {
                // Clean list_laws
                if (Array.isArray(data.list_laws)) {
                    data.list_laws = data.list_laws.map((law: any) => ({
                        title: law.title || ''
                    }));
                } else {
                    data.list_laws = [];
                }
                
                // Clean list_consultations
                if (Array.isArray(data.list_consultations)) {
                    data.list_consultations = data.list_consultations.map((consultation: any) => ({
                        title: consultation.title || '',
                        link: consultation.link || ''
                    }));
                } else {
                    data.list_consultations = [];
                }
                
                // Clean basic fields
                data.name = data.name || '';
                data.id_sapa = data.id_sapa || '';
            }
            
            mpLawsData.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลกฎหมาย';
            console.error('Error fetching MP laws:', err);
        } finally {
            loading.value = false;
        }
    };

    const refetch = () => {
        fetchMPLaws();
    };

    onMounted(() => {
        if (mpName) {
            fetchMPLaws();
        }
    });

    return {
        mpLawsData,
        loading,
        error,
        fetchMPLaws,
        refetch
    };
}; 