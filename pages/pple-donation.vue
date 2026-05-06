<template>
  <section class="max-w-7xl mx-auto px-4 py-8 md:py-10 text-white">
    <div class="rounded-3xl border border-white/15 bg-gradient-to-r from-[#ff6900]/30 via-[#1a0f62]/30 to-transparent p-6 md:p-8">
      <h1 class="text-2xl md:text-4xl font-bold">แดชบอร์ดการสนับสนุนพรรคประชาชน</h1>
      <p class="mt-3 text-white/80 max-w-3xl">
        ภาพรวมยอดบริจาค จำนวนผู้บริจาค และแนวโน้มรายเดือน เพื่อช่วยให้เห็นพลังการสนับสนุนของประชาชนอย่างโปร่งใส
      </p>
    </div>

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">ยอดบริจาครวม</p>
        <p class="text-2xl md:text-3xl font-bold mt-2">฿12,480,000</p>
        <p class="text-xs text-[#ff6900] mt-1">+18.7% จากเดือนก่อน</p>
      </div>
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">จำนวนผู้บริจาค</p>
        <p class="text-2xl md:text-3xl font-bold mt-2">34,290 คน</p>
        <p class="text-xs text-[#ff6900] mt-1">+2,430 คน ใน 30 วัน</p>
      </div>
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">ยอดเฉลี่ยต่อคน</p>
        <p class="text-2xl md:text-3xl font-bold mt-2">฿364</p>
        <p class="text-xs text-white/70 mt-1">สะท้อนการสนับสนุนวงกว้าง</p>
      </div>
      <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
        <p class="text-sm text-white/70">ผู้บริจาคประจำ</p>
        <p class="text-2xl md:text-3xl font-bold mt-2">8,970 คน</p>
        <p class="text-xs text-[#ff6900] mt-1">จากยอดการตัดบัตรรายเดือน</p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="xl:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-5">
        <div class="flex items-center justify-between">
          <h2 class="text-lg md:text-xl font-semibold">แนวโน้มยอดบริจาครายเดือน</h2>
          <span class="text-xs text-white/60">อัปเดตล่าสุด: วันนี้</span>
        </div>

        <div class="mt-6 h-72">
          <div class="grid h-full grid-cols-[60px_1fr] gap-3">
            <div class="h-full pb-8 flex flex-col justify-between text-[11px] text-white/60">
              <span v-for="tick in yAxisTicks" :key="tick">{{ formatAmountShort(tick) }}</span>
            </div>
            <div class="relative h-full">
              <div class="absolute inset-0 pb-8 flex flex-col justify-between">
                <div v-for="tick in yAxisTicks" :key="`grid-${tick}`" class="border-t border-white/10" />
              </div>

              <div class="absolute inset-0 pb-8 flex items-end gap-3">
                <div v-for="item in monthlyDonations" :key="item.month" class="flex-1 h-full flex items-end justify-center">
                  <div
                    class="w-full max-w-14 rounded-t-lg bg-gradient-to-t from-[#1a0f62] to-[#ff6900]"
                    :style="{ height: `${getBarHeightPercent(item.amount)}%` }"
                  />
                </div>
              </div>

              <div class="absolute bottom-0 inset-x-0 h-8 flex items-end gap-3">
                <div v-for="item in monthlyDonations" :key="`label-${item.month}`" class="flex-1 text-center text-xs text-white/70">
                  {{ item.month }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl bg-white/5 border border-white/10 p-5">
        <h2 class="text-lg md:text-xl font-semibold">ช่องทางการบริจาค</h2>
        <div class="mt-4 space-y-3">
          <div v-for="channel in donationChannels" :key="channel.name" class="rounded-xl bg-[#1a0f62]/40 p-3">
            <div class="flex items-center justify-between text-sm">
              <span>{{ channel.name }}</span>
              <span class="font-semibold">{{ channel.value }}%</span>
            </div>
            <div class="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full rounded-full bg-[#ff6900]" :style="{ width: `${channel.value}%` }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type MonthlyDonation = {
  month: string;
  amount: number;
};

const mockMonthlyDonationApiResponse = [
  { month: "ม.ค.", amount: 1480000 },
  { month: "ก.พ.", amount: 1720000 },
  { month: "มี.ค.", amount: 2150000 },
  { month: "เม.ย.", amount: 1940000 },
  { month: "พ.ค.", amount: 2380000 },
  { month: "มิ.ย.", amount: 2690000 },
];

const monthlyDonations: MonthlyDonation[] = mockMonthlyDonationApiResponse;

const yAxisSegments = 5;
const maxDonationAmount = Math.max(...monthlyDonations.map((item) => item.amount));
const yAxisStep = Math.ceil(maxDonationAmount / yAxisSegments / 100000) * 100000;
const yAxisMax = yAxisStep * yAxisSegments;

const yAxisTicks = Array.from({ length: yAxisSegments + 1 }, (_, index) => yAxisMax - yAxisStep * index);

const getBarHeightPercent = (amount: number) => Math.max(8, (amount / yAxisMax) * 100);

const formatAmountShort = (amount: number) => `฿${(amount / 1_000_000).toFixed(1)}M`;

const donationChannels = [
  { name: "บริจาคครั้งเดียว", value: 42 },
  { name: "บริจาครายเดือน", value: 31 },
  { name: "รายการออฟไลน์", value: 19 }
];
</script>
