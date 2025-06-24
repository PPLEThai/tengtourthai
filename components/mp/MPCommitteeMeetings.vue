<template>
  <div class="bg-white rounded-2xl p-4 md:p-6 h-[300px] md:h-[300px] col-span-1 flex flex-col">
    <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">การประชุมกรรมาธิการ</h3>
    <!-- เนื้อหา -->
    <div v-if="loading" class="text-[#0A2940] text-sm">
      กำลังโหลดข้อมูลการประชุมกรรมาธิการ...
    </div>
    <div v-else-if="error" class="text-red-500 text-sm">
      เกิดข้อผิดพลาด: {{ error }}
    </div>
    <div v-else-if="committeeMeetings && committeeMeetings.length > 0"
      class="flex-1 flex flex-col overflow-hidden">
      <p class="text-[#0A2940] text-sm mb-3">พบข้อมูลการประชุม {{ committeeMeetings.length }} รายการ</p>
      <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
        <div v-for="(meeting, index) in committeeMeetings.slice(0, 10)"
          :key="meeting.created_at || index" class="border-l-4 border-[#FF6A13] pl-3">
          <p class="text-[#0A2940] font-semibold text-sm">{{ meeting.committee_name || 'ไม่ระบุคณะกรรมาธิการ' }}
          </p>
          <p v-if="meeting.sub_committee_name" class="text-[#0A2940] text-xs opacity-75">{{
            meeting.sub_committee_name }}</p>
          <p class="text-[#0A2940] text-xs">{{ meeting.date ? new Date(meeting.date).toLocaleDateString('th-TH') :
            'ไม่ระบุวันที่' }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-[#0A2940] text-sm opacity-75">
      ยังไม่มีข้อมูลการประชุมกรรมาธิการ
    </div>
  </div>
</template>

<script setup lang="ts">
interface CommitteeMeeting {
  created_at?: string;
  date?: string;
  committee_name?: string;
  sub_committee_name?: string | null;
  description?: string;
}

interface Props {
  committeeMeetings: CommitteeMeeting[];
  loading: boolean;
  error: string | null;
}

defineProps<Props>();
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
</style> 