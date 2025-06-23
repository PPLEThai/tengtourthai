<template>
  <div class="min-h-screen bg-[#0A2940] flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white py-3 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2">
          <router-link to="/mp" class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#FF6A13]" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="font-bold text-[#FF6A13] text-xl">หน้ารวมผู้แทน</span>
          </router-link>
        </div>
      </div>
    </nav>
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-white">กำลังโหลดข้อมูล...</div>
    </div>
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-white">{{ error }}</div>
    </div>
    <div v-else-if="mp"
      class="flex flex-col md:flex-row flex-1 w-full max-w-7xl mx-auto py-4 md:py-8 gap-4 md:gap-6 px-2 md:px-0">
      <!-- Sidebar -->
      <aside
        class="w-full md:max-w-xs bg-white rounded-2xl p-4 md:p-6 flex flex-col gap-4 md:gap-6 mb-4 md:mb-0 h-[100%]">
        <div class="flex flex-col items-center">
          <img :src="getImageUrl(mp.img)"
            class="w-48 h-48 md:w-56 md:h-56 rounded-xl object-cover border-4 border-[#001a2c]"
            @error="handleImageError" />
          <h2 class="text-xl md:text-2xl font-bold mt-4 text-[#0A2940] text-center">{{ mp.fullname }}</h2>
          <div class="text-[#FF6A13] font-semibold mt-1 text-center text-sm md:text-base">{{ mp.status }}</div>
        </div>
        <!-- ประเด็นที่ผลักดัน -->
        <div>
          <div v-if="mp.topics && mp.topics.length > 0">
            <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">ประเด็นที่ผลักดันปัจจุบัน</h3>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="topic in mp.topics" :key="topic" class="flex items-center gap-2">
                <span class="text-[#0A2940] text-xs md:text-sm">• {{ topic }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- ประวัติ สส. -->
        <div>
          <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">การศึกษา</h3>
          <div class="text-[#0A2940] text-xs md:text-sm">
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(item, index) in mp.edu?.split('\n').filter(item => item.trim())" :key="index">
                {{ item.trim() }}
              </li>
            </ul>
          </div>
        </div>
        <!-- การทำงาน -->
        <div>
          <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">การทำงาน</h3>
          <div class="text-[#0A2940] text-xs md:text-sm">
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(item, index) in mp.work?.split('\n').filter(item => item.trim())" :key="index">
                {{ item.trim() }}
              </li>
            </ul>
          </div>
        </div>

        <!-- ปฏิทินการทำงานเป็นรายเดือน -->
        <div>
          <h3 class="font-bold text-[#0A2940] mb-2 text-base md:text-lg">ปฏิทินการทำงาน</h3>
          <!-- ปฎิทินแบบตาราง -->
          <div class="mb-4">
            <!-- หัวข้อเดือนและปุ่มเปลี่ยนเดือน -->
            <div class="flex items-center justify-between mb-4">
              <button @click="changeMonth(-1)" class="text-[#0A2940] hover:text-[#FF6A13]">
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
                <span class="text-[#0A2940]">กรรมาธิการ</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-[#4CAF50]"></div>
                <span class="text-[#0A2940]">เข้าพื้นที่</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-[#2196F3]"></div>
                <span class="text-[#0A2940]">กิจกรรม</span>
              </div>
            </div>
          </div>
          <!-- รายการกิจกรรม -->
          <!-- <div class="space-y-2">
            <div v-for="event in allEvents.slice(0, 5)" :key="event.created_at" class="flex items-start gap-2">
              <div class="flex flex-col">
                <span class="text-[#FF6A13] text-xs font-semibold">{{ new Date(event.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }) }}</span>
                <span class="text-[#0A2940] text-xs">
                  {{ event.type === 'กรรมาธิการ' ? event.committee_name : 
                     event.type === 'ลงพื้นที่' ? event.location_name : event.location_name }}
                </span>
                <span v-if="event.type === 'กรรมาธิการ' && event.sub_committee_name" class="text-[#0A2940] text-xs opacity-75">{{ event.sub_committee_name }}</span>
                <span class="text-[#0A2940] text-xs opacity-75">{{ event.type }}</span>
              </div>
            </div>
          </div> -->
        </div>

        <!-- ช่องทางติดต่อ -->
        <div class="flex gap-3 md:gap-4 justify-center mt-2">
          <a v-if="mp.fb" :href="mp.fb" target="_blank" rel="noopener noreferrer"
            class="hover:scale-110 transition-transform duration-200">
            <svg class="w-6 h-6 md:w-8 md:h-8 text-[#FF6A13]" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a v-if="mp.ig" :href="mp.ig" target="_blank" rel="noopener noreferrer"
            class="hover:scale-110 transition-transform duration-200">
            <svg class="w-6 h-6 md:w-8 md:h-8 text-[#FF6A13]" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a v-if="mp.x" :href="mp.x" target="_blank" rel="noopener noreferrer"
            class="hover:scale-110 transition-transform duration-200">
            <svg class="w-6 h-6 md:w-8 md:h-8 text-[#FF6A13]" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a v-if="mp.tiktok" :href="mp.tiktok" target="_blank" rel="noopener noreferrer"
            class="hover:scale-110 transition-transform duration-200">
            <svg class="w-6 h-6 md:w-8 md:h-8 text-[#FF6A13]" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </a>
        </div>
      </aside>
      <!-- Main Content -->
      <main class="w-full md:flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        
        <!-- Disclaimer -->
        <div class="col-span-1 md:col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-yellow-800 text-sm">
              <strong>หมายเหตุ:</strong> ข้อมูลที่ปรากฎนี้ เป็นเพียงบางส่วนของการนำเข้าเบื้องต้น ยังไม่ครบถ้วนทั้งหมด
            </p>
          </div>
        </div>

        <!-- ไข่ต้ม -->
        <div v-if="getKaitomDataForMP(mp?.fullname || '').length > 0 && mpReport && mpReport.field_reports && mpReport.field_reports.length > 0"
          class="bg-[#FF6A13] rounded-2xl p-4 md:p-6 h-[400px] md:h-[630px] col-span-1 row-span-2 flex flex-col">
          <h3 class="text-white font-bold text-lg md:text-2xl mb-2">การเข้าพื้นที่/กิจกรรม</h3>

          <!-- แสดงสถานะการโหลดข้อมูล mpReport -->
          <div v-if="kaitomLoading" class="text-white text-sm">
            กำลังโหลดข้อมูลการเข้าพื้นที่...
          </div>
          <div v-else-if="kaitomError" class="text-white text-sm">
            เกิดข้อผิดพลาด: {{ kaitomError }}
          </div>
          <div v-else-if="mpReport" class="text-white text-sm flex-1 overflow-hidden">
            <!-- แสดงข้อมูล mpReport เมื่อโหลดเสร็จ -->
            <div v-if="mpReport.field_reports && mpReport.field_reports.length > 0" class="h-full flex flex-col">
              <p class="mb-3">พบข้อมูลการเข้าพื้นที่ {{ mpReport.field_reports.length }} รายการ</p>
              <!-- แสดงรายการข้อมูลการเข้าพื้นที่ -->
              <div class="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                <div v-for="(report, index) in mpReport.field_reports.slice(0, 20)" :key="report.created_at || index"
                  class="bg-white/10 rounded-lg p-3">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-semibold">{{ report.location_name || 'ไม่ระบุสถานที่' }}</p>
                      <p class="text-xs opacity-90">{{ report.date ? new Date(report.date).toLocaleDateString('th-TH') :
                        'ไม่ระบุวันที่' }}</p>
                    </div>
                  </div>
                  <p class="text-xs mt-1">{{ report.description || 'ไม่มีคำอธิบาย' }}</p>

                  <!-- แสดงรูปภาพถ้ามี -->
                  <div v-if="report.images && report.images.length > 0" class="mt-3">
                    <div class="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                      <div v-for="(image, imgIndex) in report.images.slice(0, 5)" :key="imgIndex"
                        class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                        <img :src="image" :alt="`รูปภาพ ${imgIndex + 1}`"
                          class="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          @click="openImageModal(image, report.location_name)" @error="handleImageError" />
                      </div>
                      <div v-if="report.images.length > 5"
                        class="flex-shrink-0 w-20 h-20 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-semibold">
                        +{{ report.images.length - 5 }}
                      </div>
                    </div>
                  </div>

                  <!-- แสดง tags ถ้ามี -->
                  <div v-if="report.tags && report.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
                    <span v-for="tag in report.tags" :key="tag"
                      class="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-white/80">
              ยังไม่มีข้อมูลการเข้าพื้นที่
            </div>
          </div>
          <div v-else class="text-white text-sm">
            ไม่พบข้อมูลการเข้าพื้นที่
          </div>

        </div>

        <!-- การประชุมกรรมาธิการ -->
        <div v-if="mpReport && mpReport.committee_meetings && mpReport.committee_meetings.length > 0" class="bg-white rounded-2xl p-4 md:p-6 h-[300px] md:h-[300px] col-span-1 flex flex-col">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">การประชุมกรรมาธิการ</h3>
          <!-- เนื้อหา -->
          <div v-if="kaitomLoading" class="text-[#0A2940] text-sm">
            กำลังโหลดข้อมูลการประชุมกรรมาธิการ...
          </div>
          <div v-else-if="kaitomError" class="text-red-500 text-sm">
            เกิดข้อผิดพลาด: {{ kaitomError }}
          </div>
          <div v-else-if="mpReport && mpReport.committee_meetings && mpReport.committee_meetings.length > 0"
            class="flex-1 flex flex-col overflow-hidden">
            <p class="text-[#0A2940] text-sm mb-3">พบข้อมูลการประชุม {{ mpReport.committee_meetings.length }} รายการ</p>
            <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
              <div v-for="(meeting, index) in mpReport.committee_meetings.slice(0, 10)"
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
                <!-- กฎหมายที่ผลักดันอยู่ -->
        <div class="bg-white rounded-2xl p-4 md:p-6 h-[200px] md:h-[300px] col-span-1 flex flex-col">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">กฎหมายที่ผลักดันอยู่</h3>
          <div class="text-[#0A2940] text-sm opacity-75">
            อยู่ระหว่างการนำเข้าข้อมูลอัตโนมัติจากสภา
          </div>

          <div class="flex-1"></div>
          <a href="https://promise.peoplesparty.or.th/" target="_blank"
            class="text-[#FF6A13] text-sm hover:underline">*สามารถติดตามกฎหมายของพรรคได้ที่นี่</a>
        </div>

        <!-- ข่าวที่ถูกพูดถึง -->
        <div class="bg-white rounded-2xl p-4 md:p-6 h-[450px] md:h-[500px] col-span-1 md:col-span-2 flex flex-col">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">ข่าวที่ถูกพูดถึงล่าสุด</h3>
          <!-- เนื้อหา -->
          <div v-if="kaitomLoading" class="text-[#0A2940] text-sm">
            กำลังโหลดข้อมูลข่าว...
          </div>
          <div v-else-if="kaitomError" class="text-red-500 text-sm">
            เกิดข้อผิดพลาด: {{ kaitomError }}
          </div>
          <div v-else-if="mpReport && mpReport.news && mpReport.news.length > 0"
            class="flex-1 flex flex-col overflow-hidden">
            <p class="text-[#0A2940] text-sm mb-3">พบข่าวที่ถูกพูดถึง 10 ข่าวล่าสุด จาก Social Listening</p>
            <div class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              <div v-for="(news, index) in newsWithMetaImages" :key="news.permalink || index" 
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <a :href="news.permalink" target="_blank" rel="noopener noreferrer" 
                  class="block hover:no-underline">
                  <div class="flex gap-4">
                    <!-- รูปภาพ preview -->
                    <div class="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img v-if="news.photos || news.metaImage" :src="news.photos || news.metaImage" :alt="news.news_name"
                        class="w-full h-full object-cover" @error="handleImageError" />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                        </svg>
                      </div>
                    </div>
                    <!-- เนื้อหาข่าว -->
                    <div class="flex-1 min-w-0">
                      <h4 class="text-[#0A2940] font-semibold text-sm md:text-base line-clamp-3 mb-2 hover:text-[#4CAF50] transition-colors">
                        {{ news.news_name }}
                      </h4>
                      <div class="flex items-center justify-between text-xs text-gray-600">
                        <span class="bg-[#4CAF50]/10 text-[#4CAF50] px-2 py-1 rounded-full font-medium">
                          {{ news.source_name }}
                        </span>
                        <span>{{ news.posted_at ? new Date(news.posted_at).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่' }}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div v-else class="text-[#0A2940] text-sm opacity-75">
            ไม่มีข่าวที่ถูกพูดถึง 14 วันที่ผ่านมา
          </div>
        </div>

        <div v-if="mpReport && mpReport.field_reports && mpReport.field_reports.length > 0" class="bg-white rounded-2xl p-4 md:p-6 h-[450px] md:h-[500px] col-span-1 md:col-span-2 flex flex-col">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">แผนที่การลงพื้นที่</h3>
          <div class="flex-1 w-full rounded-lg overflow-hidden">
            <div ref="mapContainer" class="w-full h-full bg-gray-100">
              <div v-if="!map" class="flex items-center justify-center h-full">
                <p class="text-[#0A2940] text-sm">กำลังโหลดแผนที่...</p>
              </div>
              <div v-else-if="kaitomLoading" class="flex items-center justify-center h-full">
                <p class="text-[#0A2940] text-sm">กำลังโหลดข้อมูลการลงพื้นที่...</p>
              </div>
              <div v-else-if="!mpReport?.field_reports || mpReport.field_reports.length === 0" class="flex items-center justify-center h-full">
                <div class="text-center">
                  <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <p class="text-[#0A2940] text-sm">ยังไม่มีข้อมูลการลงพื้นที่</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Facebook -->
        <div v-if="mp?.fb" class="bg-white rounded-2xl p-4 md:p-6 h-[300px] md:h-[400px] col-span-1 flex flex-col">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2 flex items-center gap-2">
            <svg class="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </h3>
          
          <div class="flex-1 flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between mb-3">
              <a :href="mp.fb" target="_blank" rel="noopener noreferrer"
                class="text-[#1877F2] text-sm hover:underline font-medium">
                {{ getSocialMediaDisplayName(mp.fb) }}
              </a>
              <a :href="mp.fb" target="_blank" rel="noopener noreferrer"
                class="text-[#1877F2] text-xs hover:underline">
                ดูหน้าเพจ →
              </a>
            </div>
            
            <!-- Loading state -->
            <div v-if="facebookLoading" class="flex-1 flex items-center justify-center">
              <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1877F2] mx-auto mb-2"></div>
                <p class="text-xs text-gray-600">กำลังโหลดหน้า Facebook...</p>
              </div>
            </div>
            
            <!-- Error state -->
            <div v-else-if="facebookError" class="flex-1 flex items-center justify-center">
              <div class="text-center">
                <p class="text-xs text-red-500 mb-2">{{ facebookError }}</p>
                <a :href="mp.fb" target="_blank" rel="noopener noreferrer"
                  class="text-[#1877F2] text-xs hover:underline">
                  เปิดหน้า Facebook ในแท็บใหม่
                </a>
              </div>
            </div>
            
            <!-- Facebook Page Plugin Container -->
            <div v-else-if="facebookPageUrl" class="flex-1">
              <div 
                class="fb-page h-full" 
                :data-href="facebookPageUrl"
                data-tabs="timeline"
                data-width="300"
                data-height="300"
                data-small-header="true"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="false">
              </div>
            </div>
            
            <!-- Fallback -->
            <div v-else class="flex-1 flex items-center justify-center">
              <div class="text-center">
                <p class="text-xs text-gray-600">
                  ติดตามข่าวสารและกิจกรรมล่าสุดของ {{ mp.fullname }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Instagram -->
        <div v-if="mp?.ig" class="bg-white rounded-2xl p-4 md:p-6 h-[300px] md:h-[400px] col-span-1 flex flex-col">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2 flex items-center gap-2">
            <svg class="w-6 h-6 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Instagram
          </h3>
          
          <div class="flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-3">
              <a :href="mp.ig" target="_blank" rel="noopener noreferrer"
                class="text-[#E4405F] text-sm hover:underline font-medium">
                {{ getSocialMediaDisplayName(mp.ig) }}
              </a>
              <a :href="mp.ig" target="_blank" rel="noopener noreferrer"
                class="text-[#E4405F] text-xs hover:underline">
                ดูโปรไฟล์ →
              </a>
            </div>
            
            <div class="flex-1 flex items-center justify-center">
              <div class="text-center">
                <div class="text-gray-400 mb-4">
                  <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <p class="text-[#0A2940] text-sm mb-2">ดูภาพและสตอรี่ล่าสุด</p>
                <p class="text-xs text-gray-600">ติดตาม {{ mp.fullname }} บน Instagram</p>
              </div>
            </div>
          </div>
        </div>

        <!-- X (Twitter) -->
        <div v-if="mp?.x" class="bg-white rounded-2xl p-4 md:p-6 h-[300px] md:h-[400px] col-span-1 flex flex-col">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2 flex items-center gap-2">
            <svg class="w-6 h-6 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X (Twitter)
          </h3>
          
          <div class="flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-3">
              <a :href="mp.x" target="_blank" rel="noopener noreferrer"
                class="text-[#000000] text-sm hover:underline font-medium">
                {{ getSocialMediaDisplayName(mp.x) }}
              </a>
              <a :href="mp.x" target="_blank" rel="noopener noreferrer"
                class="text-[#000000] text-xs hover:underline">
                ดูทวิตเตอร์ →
              </a>
            </div>
            
            <div class="flex-1 flex items-center justify-center">
              <div class="text-center">
                <div class="text-gray-400 mb-4">
                  <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <p class="text-[#0A2940] text-sm mb-2">ติดตามความคิดเห็นและข่าวสารล่าสุด</p>
                <p class="text-xs text-gray-600">ติดตาม {{ mp.fullname }} บน X (Twitter)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- TikTok -->
        <div v-if="mp?.tiktok" class="bg-white rounded-2xl p-4 md:p-6 h-[300px] md:h-[400px] col-span-1 flex flex-col">
          <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2 flex items-center gap-2">
            <svg class="w-6 h-6 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
            TikTok
          </h3>
          
          <div class="flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-3">
              <a :href="mp.tiktok" target="_blank" rel="noopener noreferrer"
                class="text-[#000000] text-sm hover:underline font-medium">
                {{ getSocialMediaDisplayName(mp.tiktok) }}
              </a>
              <a :href="mp.tiktok" target="_blank" rel="noopener noreferrer"
                class="text-[#000000] text-xs hover:underline">
                ดูวิดีโอ →
              </a>
            </div>
            
            <div class="flex-1 flex items-center justify-center">
              <div class="text-center">
                <div class="text-gray-400 mb-4">
                  <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </div>
                <p class="text-[#0A2940] text-sm mb-2">ดูวิดีโอและเนื้อหาสั้นๆ</p>
                <p class="text-xs text-gray-600">ติดตาม {{ mp.fullname }} บน TikTok</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click="closeImageModal">
      <div class="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden" @click.stop>
        <div class="absolute top-4 right-4 z-10">
          <button @click="closeImageModal"
            class="bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="p-4 bg-white border-b">
          <h3 class="text-lg font-semibold text-[#0A2940]">{{ selectedImageTitle }}</h3>
        </div>
        <div class="flex items-center justify-center bg-gray-100">
          <img :src="selectedImage" :alt="selectedImageTitle" class="max-w-full max-h-[70vh] object-contain"
            @error="handleImageError" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useMPData, type MPItem } from '@/composables/useMPData'
import { useKaitomMP } from '@/composables/useKaitomMP'
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const { mpData } = useMPData();
const route = useRoute();
const mpName = decodeURIComponent(route.params.name as string).replace(/_/g, ' ');

const { mpReport, loading: kaitomLoading, error: kaitomError } = useKaitomMP(mpName.replace(/ /g, '_'));

const mp = ref<MPItem | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// ใช้ข้อมูลจาก mpReport แทน mockup
const committeeMeetings = computed(() => {
  if (!mpReport.value || !mpReport.value.committee_meetings) {
    return [];
  }

  return mpReport.value.committee_meetings.map(meeting => ({
    date: meeting.date || '',
    committee_name: meeting.committee_name || '',
    sub_committee_name: meeting.sub_committee_name || null,
    description: meeting.description || '',
    created_at: meeting.created_at || '',
    type: 'กรรมาธิการ'
  }));
});

// เพิ่ม field reports สำหรับปฏิทิน
const fieldReports = computed(() => {
  if (!mpReport.value || !mpReport.value.field_reports) {
    return [];
  }
  return mpReport.value.field_reports.map(report => ({
    date: report.date || '',
    location_name: report.location_name || '',
    description: report.description || '',
    created_at: report.created_at || '',
    type: 'ลงพื้นที่'
  }));
});

// เพิ่มข่าวสำหรับปฏิทิน
const newsEvents = computed(() => {
  if (!mpReport.value || !mpReport.value.news) {
    return [];
  }

  return mpReport.value.news.map(news => ({
    date: news.posted_at || '',
    news_name: news.news_name || '',
    source_name: news.source_name || '',
    permalink: news.permalink || '',
    description: news.news_name || '', // ใช้ news_name เป็น description
    created_at: news.posted_at || '',
    type: 'ข่าว'
  }));
});

// รวมข้อมูลทั้งหมดสำหรับปฏิทิน
const allEvents = computed(() => {
  const events: Array<{
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
  }> = [];

  // เพิ่ม committee meetings
  committeeMeetings.value.forEach(meeting => {
    if (meeting.date) {
      events.push(meeting);
    }
  });

  // เพิ่ม field reports
  fieldReports.value.forEach(report => {
    if (report.date) {
      events.push(report);
    }
  });

  return events;
});

const getSocialMediaDisplayName = (url: string) => {
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // สำหรับ Facebook
    if (url.includes('facebook.com')) {
      if (pathname.includes('/people/')) {
        // กรณี URL แบบ /people/name/...
        const match = pathname.match(/\/people\/([^\/]+)/);
        return match ? decodeURIComponent(match[1].replace(/-/g, ' ')) : 'Facebook Page';
      } else {
        // กรณี URL แบบ /username
        const username = pathname.split('/').filter(Boolean)[0];
        return username ? `@${username}` : 'Facebook Page';
      }
    }

    // สำหรับ Instagram
    if (url.includes('instagram.com')) {
      const username = pathname.split('/').filter(Boolean)[0];
      return username ? `@${username}` : 'Instagram Profile';
    }

    // สำหรับ X (Twitter)
    if (url.includes('x.com') || url.includes('twitter.com')) {
      const username = pathname.split('/').filter(Boolean)[0];
      return username ? `@${username}` : 'X Profile';
    }

    // สำหรับ TikTok
    if (url.includes('tiktok.com')) {
      const username = pathname.split('/').filter(Boolean)[0];
      return username ? `@${username}` : 'TikTok Profile';
    }

    return 'Social Media Profile';
  } catch (error) {
    return 'Social Media Profile';
  }
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  //   target.src = '/images/news-placeholder.jpg';
};

const fetchMPData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const mpName = decodeURIComponent(route.params.name as string).replace(/_/g, ' ');
    mp.value = mpData.value.find(mp => mp.fullname === mpName) || null;

    if (mp.value) {
      // เรียก GraphQL API เพื่อดึงข้อมูล content
      // await fetchContent('กัณตภณ-ดวงอัมพร');

      useHead({
        title: `${mp.value.fullname} - ผู้แทนของฉัน`,
        meta: [
          {
            name: 'description',
            content: `ข้อมูลและกิจกรรมของ ${mp.value.fullname}`
          },
          {
            property: 'og:title',
            content: `${mp.value.fullname} - ผู้แทนของฉัน`
          },
          {
            property: 'og:description',
            content: `ข้อมูลและกิจกรรมของ ${mp.value.fullname}`
          }
        ]
      });

      // โหลด Facebook Page Plugin ถ้ามี Facebook URL
      if (mp.value.fb) {
        loadFacebookPagePlugin();
      }
    }
  } catch (err) {
    error.value = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
    console.error('Error fetching MP data:', err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (url: string) => {
  if (!url) return '';

  // ถ้าเป็น URL ของ Google Drive ให้แปลงเป็น format ที่ถูกต้อง
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/[-\w]{25,}/);
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId[0]}&sz=w300`;
    }
  }

  // ถ้าเป็น URL ของ storage.googleapis.com ให้ใช้ image server
  if (url.includes('storage.googleapis.com')) {
    return `https://img.pplethai.org/unsafe/rs:fit:1000:1000:1/plain/${encodeURIComponent(url)}`;
  }

  return url;
};

const getKaitomDataForMP = (mpName: string) => {
  return mpData.value.filter(item => item.fullname === mpName);
};

const facebookPageUrl = ref('');

// เพิ่มตัวแปรสำหรับ Facebook Page Plugin
const facebookLoading = ref(false);
const facebookError = ref<string | null>(null);

// ฟังก์ชันสำหรับแปลง Facebook URL เป็นรูปแบบที่ใช้กับ Page Plugin
const getFacebookPageUrl = (url: string) => {
  if (!url || !url.includes('facebook.com')) {
    return '';
  }

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // กรณี URL แบบ /people/name/...
    if (pathname.includes('/people/')) {
      return url; // ใช้ URL เดิม
    }
    
    // กรณี URL แบบ /username
    const username = pathname.split('/').filter(Boolean)[0];
    if (username) {
      const pageUrl = `https://www.facebook.com/${username}`;
      return pageUrl;
    }
    
    return url;
  } catch (error) {
    console.error('Error parsing Facebook URL:', error);
    return '';
  }
};

// ฟังก์ชันสำหรับโหลด Facebook SDK
const loadFacebookSDK = () => {
  return new Promise<void>((resolve, reject) => {
    // ตรวจสอบว่า SDK โหลดแล้วหรือยัง
    if (window.FB) {
      resolve();
      return;
    }

    // เพิ่ม Facebook SDK script
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/th_TH/sdk.js#xfbml=1&version=v18.0';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      // รอให้ FB SDK พร้อมใช้งาน
      const checkFB = () => {
        if (window.FB) {
          resolve();
        } else {
          setTimeout(checkFB, 100);
        }
      };
      checkFB();
    };

    script.onerror = () => {
      reject(new Error('ไม่สามารถโหลด Facebook SDK ได้'));
    };

    document.head.appendChild(script);
  });
};

// ฟังก์ชันสำหรับโหลด Facebook Page Plugin
const loadFacebookPagePlugin = async () => {
  if (!mp.value?.fb) {
    return;
  }

  facebookLoading.value = true;
  facebookError.value = null;

  try {
    // แปลง URL เป็นรูปแบบที่ใช้กับ Page Plugin
    const pageUrl = getFacebookPageUrl(mp.value.fb);
    
    if (!pageUrl) {
      throw new Error('ไม่สามารถแปลง Facebook URL ได้');
    }

    facebookPageUrl.value = pageUrl;

    // โหลด Facebook SDK
    await loadFacebookSDK();

    // รอให้ DOM อัปเดตแล้วค่อย render Page Plugin
    await nextTick();
    
    // เรียกใช้ FB.XFBML.parse() เพื่อ render Page Plugin
    if (window.FB && window.FB.XFBML) {
      window.FB.XFBML.parse();
    } else {
      console.warn('Facebook SDK not available for XFBML parsing');
    }

  } catch (error) {
    console.error('Error loading Facebook Page Plugin:', error);
    facebookError.value = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการโหลดหน้า Facebook';
  } finally {
    facebookLoading.value = false;
  }
};

// ตัวแปรสำหรับปฎิทิน
const currentDate = ref(new Date());
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString('th-TH', { month: 'long' });
});
const currentYear = computed(() => currentDate.value.getFullYear());

// ฟังก์ชันสำหรับเปลี่ยนเดือน
const changeMonth = (delta: number) => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + delta);
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

const mapContainer = ref<HTMLElement | null>(null);
let map: maplibregl.Map | null = null;

// State สำหรับ image modal
const showImageModal = ref(false);
const selectedImage = ref('');
const selectedImageTitle = ref('');

const openImageModal = (imageUrl: string, title: string) => {
  selectedImage.value = imageUrl;
  selectedImageTitle.value = title;
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  selectedImage.value = '';
  selectedImageTitle.value = '';
};

const initMap = () => {
  if (!mapContainer.value) {
    console.log('Map container not found');
    return;
  }

  try {
    // สร้าง map instance
    map = new maplibregl.Map({
      container: mapContainer.value,
      style: 'https://api.maptiler.com/maps/basic/style.json?key=SPy8tbXAIMMPKadG7FvD',
      center: [100.5018, 13.7563], // พิกัดกรุงเทพฯ
      zoom: 5,
      attributionControl: false
    });

    // เพิ่ม attribution control
    map.addControl(new maplibregl.AttributionControl({
      compact: true
    }));

    // รอให้ map โหลดเสร็จแล้วเพิ่ม markers
    map.on('load', () => {
      addMarkersToMap();
    });

  } catch (error) {
    console.error('Error initializing map:', error);
  }
};

// ฟังก์ชันสำหรับเพิ่ม markers บนแผนที่
const addMarkersToMap = () => {
  if (!map || !mpReport.value || !mpReport.value.field_reports) {
    return;
  }

  // ลบ markers เก่าทั้งหมด
  const existingMarkers = document.querySelectorAll('.maplibregl-marker');
  existingMarkers.forEach(marker => marker.remove());

  // เพิ่ม markers ใหม่
  mpReport.value.field_reports.forEach((report, index) => {
    if (report.latitude && report.longitude) {
      const lat = parseFloat(String(report.latitude));
      const lng = parseFloat(String(report.longitude));
      
      if (!isNaN(lat) && !isNaN(lng)) {
        // สร้าง marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'maplibregl-marker';
        markerEl.style.backgroundImage = 'url(/images/pin-red.png)';
        markerEl.style.backgroundSize = 'contain';
        markerEl.style.backgroundRepeat = 'no-repeat';
        markerEl.style.width = '30px';
        markerEl.style.height = '30px';
        markerEl.style.cursor = 'pointer';

        // สร้าง popup content
        const popupContent = `
          <div class="p-3">
            <h3 class="font-semibold text-sm mb-1">${report.location_name || 'ไม่ระบุสถานที่'}</h3>
            <p class="text-xs text-gray-600 mb-1">${report.date ? new Date(report.date).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่'}</p>
            <p class="text-xs">${report.description || 'ไม่มีคำอธิบาย'}</p>
          </div>
        `;

        // สร้าง popup
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(popupContent);

        // สร้าง marker
        const marker = new maplibregl.Marker(markerEl)
          .setLngLat([lng, lat] as [number, number])
          .setPopup(popup)
          .addTo(map!);

        // เพิ่ม event listener สำหรับคลิก marker
        markerEl.addEventListener('click', () => {
          popup.addTo(map!);
        });
      }
    }
  });

  // ปรับ zoom และ center ถ้ามี markers
  const validReports = mpReport.value.field_reports.filter(report => 
    report.latitude && report.longitude && 
    !isNaN(parseFloat(String(report.latitude))) && 
    !isNaN(parseFloat(String(report.longitude)))
  );

  if (validReports.length > 0 && map) {
    const bounds = new maplibregl.LngLatBounds();
    validReports.forEach(report => {
      const lat = parseFloat(String(report.latitude));
      const lng = parseFloat(String(report.longitude));
      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.extend([lng, lat] as [number, number]);
      }
    });
    map.fitBounds(bounds, { padding: 50 });
  }
};

onMounted(() => {
  fetchMPData();

  // เพิ่ม keyboard event listener สำหรับปิด modal
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && showImageModal.value) {
      closeImageModal();
    }
  };

  document.addEventListener('keydown', handleKeydown);

  // เริ่มต้นแผนที่
  nextTick(() => {
    initMap();
  });

  // โหลด Facebook Page Plugin ถ้ามี Facebook URL
  if (mp.value?.fb) {
    loadFacebookPagePlugin();
  }

  // Cleanup function
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
});

// ทำความสะอาด map เมื่อ component unmount
onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

// เพิ่มการติดตามสถานะของ mpReport
watch(mpReport, (newValue) => {

  if (newValue) {
    // อัปเดตปฏิทินเมื่อข้อมูลเปลี่ยน
    nextTick(() => {
      calendarDays.value = generateCalendarDays();
      // อัปเดตแผนที่เมื่อข้อมูลเปลี่ยน
      if (map) {
        addMarkersToMap();
      }
    });
    // อัปเดต meta images สำหรับข่าว
    updateNewsWithMetaImages();
  }
});

// เพิ่ม watcher สำหรับ allEvents เพื่ออัปเดตปฏิทิน
watch(allEvents, () => {
  nextTick(() => {
    calendarDays.value = generateCalendarDays();
  });
}, { deep: true });

watch(kaitomLoading, (newValue, oldValue) => {
  // เมื่อโหลดเสร็จและมีข้อมูล
  if (oldValue && !newValue && mpReport.value && map) {
    nextTick(() => {
      addMarkersToMap();
    });
  }
});

watch(kaitomError, (newValue) => {
  if (newValue) {
    console.log('kaitomError:', newValue);
  }
});

// เพิ่ม watcher สำหรับ mp.value เพื่อโหลด Facebook Page Plugin
watch(mp, (newValue, oldValue) => {
  console.log('MP data changed:', newValue?.fullname);
  if (newValue && newValue.fb && (!oldValue || oldValue.fb !== newValue.fb)) {
    console.log('Loading Facebook Page Plugin for new MP');
    loadFacebookPagePlugin();
  }
}, { immediate: true });

definePageMeta({ layout: 'mp' })

// ฟังก์ชันสำหรับดึง meta image จาก permalink
const fetchNewsMetaImage = async (permalink: string) => {
  try {
    const response = await fetch(`/api/meta?url=${encodeURIComponent(permalink)}`);
    const data = await response.json();
    return data.image || '';
  } catch (error) {
    console.error('Error fetching meta image:', error);
    return '';
  }
};

// อัปเดตข่าวด้วย meta image
const newsWithMetaImages = ref<Array<News & { metaImage?: string }>>([]);

const updateNewsWithMetaImages = async () => {
  if (!mpReport.value?.news) {
    newsWithMetaImages.value = [];
    return;
  }

  // ดึงแค่ 10 ข่าวล่าสุด และ sort ตามวันที่ล่าสุด
  const latestNews = mpReport.value.news
    .sort((a, b) => {
      const dateA = new Date(a.posted_at || '');
      const dateB = new Date(b.posted_at || '');
      return dateB.getTime() - dateA.getTime(); // เรียงจากใหม่ไปเก่า
    })
    .slice(0, 10);

  const newsWithImages = await Promise.all(
    latestNews.map(async (news) => {
      const metaImage = await fetchNewsMetaImage(news.permalink);
      return {
        ...news,
        metaImage
      };
    })
  );

  newsWithMetaImages.value = newsWithImages;
};
</script>

<style>
.prose {
  max-width: 65ch;
  color: #374151;
}

.prose h1 {
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
}

.prose h2 {
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3333333;
}

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

/* เพิ่ม CSS สำหรับ map */
.maplibregl-map {
  width: 100%;
  height: 100%;
}

.maplibregl-popup-content {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.maplibregl-popup-close-button {
  padding: 4px 8px;
  font-size: 16px;
  color: #666;
}

.maplibregl-popup-close-button:hover {
  background-color: #f0f0f0;
  color: #333;
}

/* CSS สำหรับ Facebook Page Plugin */
.fb-page {
  margin: 0 auto;
  max-width: 100%;
}

.fb-page iframe {
  border: none;
  overflow: hidden;
  width: 100% !important;
  height: 200px !important;
}

/* Responsive design สำหรับ Facebook Page Plugin */
@media (max-width: 768px) {
  .fb-page iframe {
    height: 150px !important;
  }
}

/* Loading animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>