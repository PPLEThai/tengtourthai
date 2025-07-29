<template>
  <div>
    <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">ปฏิทินการทำงาน</h3>
    <!-- ปฎิทินแบบตาราง -->
    <div class="mb-4">
      <!-- หัวข้อเดือนและปุ่มเปลี่ยนเดือน -->
      <div class="flex items-center justify-between mb-4">
        <button @click="changeMonth(-1)" 
          :disabled="isMinMonthReached"
          :class="[
            'text-[#0A2940] hover:text-[#FF6A13]',
            { 'opacity-50 cursor-not-allowed': isMinMonthReached }
          ]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <h4 class="text-[#0A2940] font-semibold">{{ currentMonthName }} {{ currentYear }}</h4>
        <button @click="changeMonth(1)" class="text-[#0A2940] hover:text-[#FF6A13]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center mb-2">
        <div v-for="day in ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']" :key="day"
          class="text-[#0A2940] text-xs font-semibold">
          {{ day }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1">
        
        <div v-for="day in calendarDays" :key="day.date"
          class="aspect-square relative p-1 border border-[#0A2940]/10 rounded">
          <!-- วันที่อยู่ด้านบน -->
          <div class="flex justify-center">
            <span class="text-[#0A2940] text-xs font-medium" :class="{ 'opacity-50': !day.isCurrentMonth }">
              {{ day.day }}
            </span>
          </div>
          
          <!-- จุด event อยู่ด้านล่าง -->
          <div v-if="day.events.length > 0" class="absolute bottom-1 left-1 right-1">
            <div class="flex justify-center items-end gap-0.5">
              <template v-if="day.events.length <= 4">
                <!-- แสดงจุดทั้งหมดถ้าไม่เกิน 4 จุด -->
                <div v-for="(event, index) in day.events" :key="index" 
                  class="w-1.5 h-1.5 rounded-full" 
                  :class="{
                    'bg-[#FF6A13]': event.type === 'กรรมาธิการ',
                    'bg-[#4CAF50]': event.type === 'ลงพื้นที่',
                    'bg-[#2196F3]': event.type === 'กิจกรรม',
                    'bg-[#9C27B0]': event.type === 'ประชุมสภา',
                  }">
                </div>
              </template>
              <template v-else>
                <!-- แสดง 4 จุดแรกเมื่อมีมากกว่า 4 จุด -->
                <div v-for="(event, index) in day.events.slice(0, 4)" :key="index" 
                  class="w-1.5 h-1.5 rounded-full" 
                  :class="{
                    'bg-[#FF6A13]': event.type === 'กรรมาธิการ',
                    'bg-[#4CAF50]': event.type === 'ลงพื้นที่',
                    'bg-[#2196F3]': event.type === 'กิจกรรม',
                    'bg-[#9C27B0]': event.type === 'ประชุมสภา',
                  }">
                </div>
              </template>
            </div>
          </div>
        </div>

      </div>
      <!-- คำอธิบายสี -->
      <div class="flex gap-4 mt-4 text-xs">
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-[#FF6A13]"></div>
          <span class="text-[#0A2940]">กมธ.</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-[#4CAF50]"></div>
          <span class="text-[#0A2940]">เข้าพื้นที่</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-[#2196F3]"></div>
          <span class="text-[#0A2940]">กิจกรรม</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-[#9C27B0]"></div>
          <span class="text-[#0A2940]">ประชุมสภา</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Event {
  date: string;
  committee_name?: string;
  sub_committee_name?: string | null;
  location_name?: string;
  news_name?: string;
  source_name?: string;
  permalink?: string;
  description: string;
  created_at: string;
  type: string;
}

interface ParliamentMeeting {
  date: string;
  type: string;
}

interface Props {
  events: Event[]
  parliamentMeetings?: string[]
}

const props = defineProps<Props>()

// สร้าง events สำหรับการเข้าประชุมสภา
const parliamentMeetingEvents = computed(() => {
  if (!props.parliamentMeetings) return [];
  
  return props.parliamentMeetings.map(date => ({
    date: date,
    description: 'ประชุมสภา',
    created_at: date,
    type: 'ประชุมสภา'
  } as Event));
});

// รวม events ทั้งหมด
const allEvents = computed(() => {
  return [...props.events, ...parliamentMeetingEvents.value];
});

// ตัวแปรสำหรับปฎิทิน
const currentDate = ref(new Date());
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString('th-TH', { month: 'long' });
});
const currentYear = computed(() => currentDate.value.getFullYear());

// ตรวจสอบว่าถึงเดือนกุมภาพันธ์ 2568 แล้วหรือยัง
const isMinMonthReached = computed(() => {
  const minDate = new Date(2025, 1, 1); // กุมภาพันธ์ 2568 (เดือนที่ 1 = กุมภาพันธ์)
  return currentDate.value.getTime() <= minDate.getTime();
});

// ฟังก์ชันสำหรับเปลี่ยนเดือน
const changeMonth = (delta: number) => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + delta);
  
  // ตรวจสอบว่าวันที่ใหม่ไม่น้อยกว่ากุมภาพันธ์ 2568
  const minDate = new Date(2025, 2, 1); // กุมภาพันธ์ 2568
  if (newDate.getTime() < minDate.getTime()) {
    return; // ไม่ทำการเปลี่ยนเดือนถ้าจะย้อนไปก่อนกุมภาพันธ์ 2568
  }
  
  currentDate.value = newDate;
  calendarDays.value = generateCalendarDays();
};

// ฟังก์ชันสำหรับสร้างข้อมูลปฎิทิน
const generateCalendarDays = () => {
  const today = currentDate.value;
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // หาวันแรกของเดือน
  const firstDay = new Date(currentYear, currentMonth, 1);
  // หาวันสุดท้ายของเดือน
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  // สร้างอาร์เรย์สำหรับเก็บข้อมูลวันในปฎิทิน
  const days = [];

  // เพิ่มวันจากเดือนก่อนหน้า
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth, -i);
    days.push({
      date: date.toISOString(),
      day: date.getDate(),
      isCurrentMonth: false,
      events: allEvents.value.filter(event =>
        new Date(event.date).toDateString() === date.toDateString()
      )
    });
  }

  // เพิ่มวันในเดือนปัจจุบัน
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear, currentMonth, i);
    days.push({
      date: date.toISOString(),
      day: i,
      isCurrentMonth: true,
      events: allEvents.value.filter(event =>
        new Date(event.date).toDateString() === date.toDateString()
      )
    });
  }

  // เพิ่มวันจากเดือนถัดไป
  const remainingDays = 42 - days.length; // 6 แถว x 7 วัน
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(currentYear, currentMonth + 1, i);
    days.push({
      date: date.toISOString(),
      day: i,
      isCurrentMonth: false,
      events: allEvents.value.filter(event =>
        new Date(event.date).toDateString() === date.toDateString()
      )
    });
  }

  return days;
};

const calendarDays = ref(generateCalendarDays());

// เพิ่ม watcher สำหรับ events และ parliamentMeetings เพื่ออัปเดตปฏิทิน
watch([() => props.events, () => props.parliamentMeetings], () => {
  nextTick(() => {
    calendarDays.value = generateCalendarDays();
  });
}, { deep: true });
</script> 