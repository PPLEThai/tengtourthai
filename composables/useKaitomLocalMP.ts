import { ref, onMounted } from 'vue';
import type { MPReport } from '@/composables/useKaitomMP';

const LOCAL_REPORT_BASE =
  'https://storage.googleapis.com/mp-assistant-bot/reports/somtourthai/local';

export const useKaitomLocalMP = (fullnameUnderscore: string) => {
  const mpReport = ref<MPReport | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchMPReport = async () => {
    loading.value = true;
    error.value = null;

    try {
      const encoded = encodeURIComponent(fullnameUnderscore);
      const response = await fetch(`${LOCAL_REPORT_BASE}/${encoded}.json`);

      if (!response.ok) {
        throw new Error('ไม่สามารถโหลดข้อมูลได้');
      }

      const text = await response.text();
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

      // บางไฟล์เป็น array ของรายการลงพื้นที่ที่ root โดยตรง — แปลงให้รูปแบบเดียวกับ MPReport
      if (Array.isArray(data)) {
        data = {
          field_reports: data,
          committee_meetings: [],
          news: [],
          attendances: { parliament_meeting: [] }
        };
      }

      if (data && typeof data === 'object' && !Array.isArray(data)) {
        if (Array.isArray(data.field_reports)) {
          data.field_reports = data.field_reports.map((report: any) => ({
            ...report,
            latitude:
              typeof report.latitude === 'number' && !isNaN(report.latitude)
                ? report.latitude
                : null,
            longitude:
              typeof report.longitude === 'number' && !isNaN(report.longitude)
                ? report.longitude
                : null,
            date: report.date || null,
            location_name: report.location_name || '',
            description: report.description ?? '',
            tags: Array.isArray(report.tags) ? report.tags : [],
            images: Array.isArray(report.images) ? report.images : [],
            created_at: report.created_at || null,
            owner_full_name: report.owner_full_name || ''
          }));
        } else {
          data.field_reports = [];
        }

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

        if (Array.isArray(data.news)) {
          data.news = data.news.map((news: any) => ({
            ...news,
            news_name: news.news_name || '',
            source_name: news.source_name || '',
            permalink: news.permalink || '',
            photos: news.photos || '',
            posted_at: news.posted_at || null
          }));
        }

        if (data.attendances && typeof data.attendances === 'object') {
          data.attendances = {
            parliament_meeting: Array.isArray(data.attendances.parliament_meeting)
              ? data.attendances.parliament_meeting.filter(
                  (date: any) => typeof date === 'string' && date.trim() !== ''
                )
              : []
          };
        } else {
          data.attendances = {
            parliament_meeting: []
          };
        }
      }

      mpReport.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
      console.error('Error fetching local MP report:', err);
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
