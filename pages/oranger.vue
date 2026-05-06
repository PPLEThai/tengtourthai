<template>
  <section class="max-w-7xl mx-auto px-4 py-8 md:py-10 text-white">
    <div class="rounded-3xl border border-white/15 bg-gradient-to-r from-[#ff6900]/30 via-[#1a0f62]/30 to-transparent p-6 md:p-8">
      <h1 class="text-2xl md:text-4xl font-bold">เครือข่ายอาสาส้มและสมาชิกตื่นตัว</h1>
      <p class="mt-3 text-white/80 max-w-3xl">
        ติดตามพลังของอาสาสมัครทั่วประเทศ ทั้งจำนวนผู้ลงทะเบียนใหม่ อัตราการเติบโต และความเคลื่อนไหวของสมาชิกตื่นตัวในแต่ละเดือน
      </p>
    </div>

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">อาสาส้มที่ลงทะเบียน</p>
        <p class="text-3xl font-bold mt-2">58,420</p>
        <p class="text-xs text-[#ff6900] mt-1">+3,126 ในเดือนล่าสุด</p>
      </div>
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">สมาชิกตื่นตัว</p>
        <p class="text-3xl font-bold mt-2">22,980</p>
        <p class="text-xs text-[#ff6900] mt-1">+14.5% YoY</p>
      </div>
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">จังหวัดที่มีเครือข่าย</p>
        <p class="text-3xl font-bold mt-2">77/77</p>
        <p class="text-xs text-white/70 mt-1">ครอบคลุมทั่วประเทศ</p>
      </div>
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">กิจกรรมภาคสนาม</p>
        <p class="text-3xl font-bold mt-2">1,248</p>
        <p class="text-xs text-[#ff6900] mt-1">+96 กิจกรรมเดือนนี้</p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="xl:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-5">
        <h2 class="text-lg md:text-xl font-semibold">การเติบโตอาสาส้มรายเดือน</h2>
        <div class="mt-6 h-72">
          <div class="grid h-full grid-cols-[60px_1fr] gap-3">
            <div class="h-full pb-8 flex flex-col justify-between text-[11px] text-white/60">
              <span v-for="tick in yAxisTicks" :key="tick">{{ formatVolunteerCountShort(tick) }}</span>
            </div>
            <div class="relative h-full">
              <div class="absolute inset-0 pb-8 flex flex-col justify-between">
                <div v-for="tick in yAxisTicks" :key="`grid-${tick}`" class="border-t border-white/10" />
              </div>

              <div class="absolute inset-0 pb-8 flex items-end gap-3">
                <div v-for="item in growthTrend" :key="item.month" class="flex-1 h-full flex items-end justify-center">
                  <div
                    class="w-full max-w-14 rounded-t-lg bg-gradient-to-t from-[#1a0f62] to-[#ff6900]"
                    :style="{ height: `${getBarHeightPercent(item.total)}%` }"
                  />
                </div>
              </div>

              <div class="absolute bottom-0 inset-x-0 h-8 flex items-end gap-3">
                <div v-for="item in growthTrend" :key="`label-${item.month}`" class="flex-1 text-center text-xs text-white/70">
                  {{ item.month }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl bg-white/5 border border-white/10 p-5">
        <h2 class="text-lg md:text-xl font-semibold">กลุ่มสมาชิกตื่นตัว</h2>
        <div class="mt-4 space-y-3">
          <div v-for="segment in activeSegments" :key="segment.name" class="rounded-xl bg-[#1a0f62]/40 p-3">
            <div class="flex items-center justify-between">
              <p class="text-sm">{{ segment.name }}</p>
              <p class="text-sm font-semibold">{{ segment.count }} คน</p>
            </div>
            <p class="mt-1 text-xs text-white/60">{{ segment.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const growthTrend = [
  { month: "ม.ค.", total: 47000 },
  { month: "ก.พ.", total: 49000 },
  { month: "มี.ค.", total: 52000 },
  { month: "เม.ย.", total: 55000 },
  { month: "พ.ค.", total: 58420 },
];

const yAxisSegments = 5;
const maxVolunteerCount = Math.max(...growthTrend.map((item) => item.total));
const yAxisStep = Math.ceil(maxVolunteerCount / yAxisSegments / 1000) * 1000;
const yAxisMax = yAxisStep * yAxisSegments;
const yAxisTicks = Array.from({ length: yAxisSegments + 1 }, (_, index) => yAxisMax - yAxisStep * index);

const getBarHeightPercent = (total: number) => Math.max(8, (total / yAxisMax) * 100);
const formatVolunteerCountShort = (count: number) => `${Math.round(count / 1000)}K`;

const activeSegments = [
  {
    name: "ทีมรณรงค์พื้นที่",
    count: "8,420",
    desc: "ลงพื้นที่สื่อสารนโยบายและรับฟังปัญหาประชาชน",
  },
  {
    name: "ทีมดิจิทัลอาสา",
    count: "6,930",
    desc: "สนับสนุนการสื่อสารข้อมูลและกิจกรรมออนไลน์",
  },
  {
    name: "ทีมกิจกรรมชุมชน",
    count: "7,630",
    desc: "จัดเวิร์กช็อป พัฒนาพื้นที่ และกิจกรรมพลังพลเมือง",
  },
];
</script>
