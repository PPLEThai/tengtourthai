<template>
  <section class="max-w-7xl mx-auto px-4 py-8 md:py-10 text-white">
    <div class="rounded-3xl border border-white/15 bg-gradient-to-r from-[#ff6900]/30 via-[#1a0f62]/30 to-transparent p-6 md:p-8">
      <h1 class="text-2xl md:text-4xl font-bold">แดชบอร์ดเคสขับเคลื่อนจากพื้นที่</h1>
      <p class="mt-3 text-white/80 max-w-3xl">
        แสดงสถานะเรื่องร้องเรียนที่เปิดรับ เรื่องที่ปิดได้แล้ว และประสิทธิภาพการขับเคลื่อนจากระดับพื้นที่สู่การแก้ปัญหาเชิงนโยบาย
      </p>
    </div>

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">เรื่องร้องเรียนทั้งหมด</p>
        <p class="text-3xl font-bold mt-2">3,286</p>
        <p class="text-xs text-white/70 mt-1">สะสมตั้งแต่เปิดระบบ</p>
      </div>
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">เคสที่เปิดรับ</p>
        <p class="text-3xl font-bold mt-2 text-[#ff6900]">842</p>
        <p class="text-xs text-[#ff6900]/90 mt-1">กำลังดำเนินการ</p>
      </div>
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">เคสที่ปิดได้</p>
        <p class="text-3xl font-bold mt-2 text-white">2,444</p>
        <p class="text-xs text-[#ff6900] mt-1">อัตราปิดเคส 74.4%</p>
      </div>
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">เวลาปิดเคสเฉลี่ย</p>
        <p class="text-3xl font-bold mt-2">11 วัน</p>
        <p class="text-xs text-[#ff6900] mt-1">เร็วขึ้น 1.8 วัน</p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="xl:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-5">
        <h2 class="text-lg md:text-xl font-semibold">สถานะเคสรายเดือน</h2>
        <div class="mt-5 grid gap-3">
          <div
            v-for="item in caseStatusByMonth"
            :key="item.month"
            class="grid grid-cols-[60px_1fr_1fr] items-center gap-3"
          >
            <span class="text-sm text-white/70">{{ item.month }}</span>
            <div class="h-3 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full rounded-full bg-[#ff6900]" :style="{ width: `${item.openPercent}%` }" />
            </div>
            <div class="h-3 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full rounded-full bg-[#1a0f62]" :style="{ width: `${item.closedPercent}%` }" />
            </div>
          </div>
        </div>
        <div class="mt-4 flex items-center gap-4 text-xs text-white/70">
          <span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-[#ff6900]" /> เปิดรับ</span>
          <span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-[#1a0f62]" /> ปิดได้</span>
        </div>
      </div>

      <div class="rounded-3xl bg-white/5 border border-white/10 p-5">
        <h2 class="text-lg md:text-xl font-semibold">หมวดปัญหายอดนิยม</h2>
        <div class="mt-4 space-y-3">
          <div v-for="topic in topCaseTopics" :key="topic.name" class="rounded-xl bg-[#1a0f62]/40 p-3">
            <div class="flex items-center justify-between text-sm">
              <span>{{ topic.name }}</span>
              <span class="font-semibold">{{ topic.count }} เคส</span>
            </div>
            <p class="text-xs text-white/60 mt-1">ปิดได้แล้ว {{ topic.closed }} เคส</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const caseStatusByMonth = [
  { month: "ม.ค.", openPercent: 48, closedPercent: 62 },
  { month: "ก.พ.", openPercent: 44, closedPercent: 66 },
  { month: "มี.ค.", openPercent: 40, closedPercent: 71 },
  { month: "เม.ย.", openPercent: 36, closedPercent: 77 },
  { month: "พ.ค.", openPercent: 31, closedPercent: 83 },
];

const topCaseTopics = [
  { name: "สาธารณูปโภค", count: 692, closed: 541 },
  { name: "คมนาคมและความปลอดภัย", count: 587, closed: 419 },
  { name: "สิทธิชุมชนและสิ่งแวดล้อม", count: 474, closed: 362 },
  { name: "สวัสดิการและงานบริการรัฐ", count: 431, closed: 328 },
];
</script>
