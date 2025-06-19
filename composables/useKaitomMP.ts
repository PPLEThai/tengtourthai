import { ref, onMounted } from 'vue';

export interface FieldReport {
    date: string | null;
    latitude: number | null;
    longitude: number | null;
    location_name: string;
    description: string;
    tags: string[];
    images: string[];
    created_at: string | null;
    owner_full_name: string;
}

export interface CommitteeMeeting {
    date: string;
    committee_name: string;
    sub_committee_name: string | null;
    description: string;
    created_at: string;
    owner_full_name: string;
}

export interface MPReport {
    field_reports: FieldReport[];
    committee_meetings: CommitteeMeeting[];
}

export const useKaitomMP = (fullname: string) => {
    const mpReport = ref<MPReport | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchMPReport = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await fetch(`https://storage.googleapis.com/mp-assistant-bot/reports/somtourthai/${fullname}.json`);
 
            if (!response.ok) {
                throw new Error('ไม่สามารถโหลดข้อมูลได้');
            }
            
            const text = await response.text();
            
            // ตรวจสอบและแก้ไขค่า NaN ใน JSON
            const cleanedText = text.replace(/:\s*NaN/g, ': null');
            
            let data;
            try {
                data = JSON.parse(cleanedText);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Original text:', text);
                console.error('Cleaned text:', cleanedText);
                throw new Error('ข้อมูลไม่ถูกต้อง (JSON parse error)');
            }
            
            // Validate และ clean ข้อมูล
            if (data && typeof data === 'object') {
                // Clean field_reports
                if (Array.isArray(data.field_reports)) {
                    data.field_reports = data.field_reports.map((report: any) => ({
                        ...report,
                        latitude: typeof report.latitude === 'number' && !isNaN(report.latitude) ? report.latitude : null,
                        longitude: typeof report.longitude === 'number' && !isNaN(report.longitude) ? report.longitude : null,
                        date: report.date || null,
                        location_name: report.location_name || '',
                        description: report.description || '',
                        tags: Array.isArray(report.tags) ? report.tags : [],
                        images: Array.isArray(report.images) ? report.images : [],
                        created_at: report.created_at || null,
                        owner_full_name: report.owner_full_name || ''
                    }));
                }
                
                // Clean committee_meetings
                if (Array.isArray(data.committee_meetings)) {
                    data.committee_meetings = data.committee_meetings.map((meeting: any) => ({
                        ...meeting,
                        date: meeting.date || null,
                        committee_name: meeting.committee_name || '',
                        sub_committee_name: meeting.sub_committee_name || null,
                        description: meeting.description || '',
                        created_at: meeting.created_at || null,
                        owner_full_name: meeting.owner_full_name || ''
                    }));
                }
            }
            
            mpReport.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
            console.error('Error fetching MP report:', err);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchMPReport();
    });

    return {
        mpReport,
        loading,
        error,
        fetchMPReport
    };
};