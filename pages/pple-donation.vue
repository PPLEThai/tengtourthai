<template>
  <section class="max-w-7xl mx-auto px-4 py-8 md:py-10 text-white">
    <div class="rounded-3xl border border-white/15 bg-gradient-to-r from-[#ff6900]/30 via-[#1a0f62]/30 to-transparent p-6 md:p-8">
      <h1 class="text-2xl md:text-4xl font-bold">แดชบอร์ดการสนับสนุนพรรคประชาชน</h1>
      <p class="mt-3 text-white/80 max-w-3xl">
        ภาพรวมยอดบริจาค จำนวนผู้บริจาค และแนวโน้มรายเดือน เพื่อช่วยให้เห็นพลังการสนับสนุนของประชาชนอย่างโปร่งใส
      </p>
    </div>

    <div v-if="pending" class="mt-6 text-white/70">กำลังโหลดข้อมูล...</div>
    <div v-else-if="error" class="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">
      ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง
    </div>

    <template v-else-if="stats">
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
          <p class="text-sm text-white/70">ยอดบริจาครวม</p>
          <p class="text-2xl md:text-3xl font-bold mt-2">{{ formatCurrency(stats.total_donation_amount) }}</p>
          <p v-if="monthOverMonthChange !== null" class="text-xs text-[#ff6900] mt-1">
            นับรวมตั้งแต่ก่อตั้งพรรคประชาชน
          </p>
        </div>
        <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
          <p class="text-sm text-white/70">จำนวนผู้บริจาค</p>
          <p class="text-2xl md:text-3xl font-bold mt-2">{{ formatCount(stats.total_donor_count) }} คน</p>
          <p class="text-xs text-white/70 mt-1">รวมผู้บริจาคทั้งหมด</p>
        </div>
        <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
          <p class="text-sm text-white/70">ยอดเฉลี่ยต่อคน</p>
          <p class="text-2xl md:text-3xl font-bold mt-2">{{ formatCurrency(averagePerDonor) }}</p>
          <!-- <p class="text-xs text-white/70 mt-1"></p> -->
        </div>
        <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
          <p class="text-sm text-white/70">ผู้บริจาคประจำ</p>
          <p class="text-2xl md:text-3xl font-bold mt-2">{{ formatCount(stats.recurring_donor_last_30_days) }} คน</p>
          <p class="text-xs text-[#ff6900] mt-1">บริจาครายเดือนใน 30 วันล่าสุด</p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div class="xl:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-lg md:text-xl font-semibold">แนวโน้มยอดบริจาครายเดือน</h2>
            <div class="flex flex-wrap items-center gap-4 text-xs text-white/70">
              <span class="inline-flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-sm bg-[#ff6900]" />
                บริจาคแบบรายครั้ง
              </span>
              <span class="inline-flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-sm bg-[#5b4fc7]" />
                บริจาคแบบตัดบัตร
              </span>
              <span v-if="updatedAt" class="text-white/60">อัปเดตล่าสุด: {{ updatedAt }}</span>
            </div>
          </div>

          <div class="mt-6 h-72 overflow-visible">
            <div class="grid h-full grid-cols-[60px_1fr] gap-3 overflow-visible">
              <div class="h-full pb-8 flex flex-col justify-between text-[11px] text-white/60">
                <span v-for="tick in yAxisTicks" :key="tick">{{ formatAmountShort(tick) }}</span>
              </div>
              <div class="relative h-full overflow-visible">
                <div class="absolute inset-0 pb-8 flex flex-col justify-between">
                  <div v-for="tick in yAxisTicks" :key="`grid-${tick}`" class="border-t border-white/10" />
                </div>

                <div class="absolute inset-0 pb-8 flex items-end gap-3">
                  <div
                    v-for="item in monthlyDonations"
                    :key="item.monthKey"
                    class="flex-1 h-full flex items-end justify-center relative cursor-pointer"
                    @mouseenter="hoveredMonthKey = item.monthKey"
                    @mouseleave="hoveredMonthKey = null"
                  >
                    <div
                      v-if="hoveredMonthKey === item.monthKey"
                      class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-20 w-max max-w-[220px] rounded-xl border border-white/20 bg-[#1a0f62] px-3 py-2.5 text-xs shadow-xl pointer-events-none"
                    >
                      <p class="font-semibold text-white">{{ formatMonthYear(item.monthKey) }}</p>
                      <p class="mt-1.5 text-white/90">
                        รวม <span class="font-semibold text-white">{{ formatCurrency(item.total) }}</span>
                      </p>
                      <div class="mt-2 space-y-1 border-t border-white/10 pt-2">
                        <p class="flex items-center justify-between gap-3">
                          <span class="inline-flex items-center gap-1.5 text-white/70">
                            <span class="w-2 h-2 rounded-sm bg-[#ff6900]" />
                            รายครั้ง
                          </span>
                          <span class="font-medium">{{ formatCurrency(item.oneTime) }}</span>
                        </p>
                        <p class="flex items-center justify-between gap-3">
                          <span class="inline-flex items-center gap-1.5 text-white/70">
                            <span class="w-2 h-2 rounded-sm bg-[#5b4fc7]" />
                            ตัดบัตร
                          </span>
                          <span class="font-medium">{{ formatCurrency(item.recurring) }}</span>
                        </p>
                      </div>
                    </div>

                    <div
                      class="w-full max-w-14 flex flex-col justify-end rounded-t-lg overflow-hidden min-h-[8px] transition-all duration-150"
                      :class="hoveredMonthKey === item.monthKey ? 'ring-2 ring-white/60 brightness-110' : 'brightness-100'"
                      :style="{ height: `${getTotalBarHeightPercent(item.total)}%` }"
                    >
                      <div
                        v-if="item.oneTime > 0"
                        class="w-full bg-[#ff6900]"
                        :style="{ height: `${getSegmentPercent(item.oneTime, item.total)}%` }"
                      />
                      <div
                        v-if="item.recurring > 0"
                        class="w-full bg-[#5b4fc7]"
                        :style="{ height: `${getSegmentPercent(item.recurring, item.total)}%` }"
                      />
                    </div>
                  </div>
                </div>

                <div class="absolute bottom-0 inset-x-0 h-8 flex items-end gap-3">
                  <div
                    v-for="item in monthlyDonations"
                    :key="`label-${item.monthKey}`"
                    class="flex-1 text-center text-xs text-white/70"
                  >
                    {{ item.month }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl bg-white/5 border border-white/10 p-5">
          <h2 class="text-lg md:text-xl font-semibold">สัดส่วนการบริจาค (6 เดือนล่าสุด)</h2>
          <div class="mt-4 space-y-3">
            <div v-for="channel in donationChannels" :key="channel.name" class="rounded-xl bg-[#1a0f62]/40 p-3">
              <div class="flex items-center justify-between text-sm">
                <span class="inline-flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-sm shrink-0" :class="channel.colorClass" />
                  {{ channel.name }}
                </span>
                <span class="font-semibold">{{ channel.value }}%</span>
              </div>
              <div class="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                <div class="h-full rounded-full" :class="channel.colorClass" :style="{ width: `${channel.value}%` }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
type MonthlyTrendItem = {
  month: string;
  total_donation_amount: number;
};

type RecurringTrendItem = {
  month: string;
  recurring_paid_amount: number;
};

type DonationStats = {
  total_donation_amount: number;
  total_donor_count: number;
  recurring_donor_last_30_days: number;
  monthly_trend: MonthlyTrendItem[];
  recurring_monthly_trend: RecurringTrendItem[];
};

type DonationStatsResponse = {
  success: boolean;
  data: DonationStats;
  timestamp: string;
};

type MonthlyDonation = {
  monthKey: string;
  month: string;
  total: number;
  oneTime: number;
  recurring: number;
};

const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const hoveredMonthKey = ref<string | null>(null);

const config = useRuntimeConfig();

const { data: response, pending, error } = await useFetch<DonationStatsResponse>(config.public.apiDonationStats);

const stats = computed(() => (response.value?.success ? response.value.data : null));

const updatedAt = computed(() => {
  if (!response.value?.timestamp) return '';
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(response.value.timestamp));
});

const averagePerDonor = computed(() => {
  if (!stats.value || stats.value.total_donor_count === 0) return 0;
  return Math.round(stats.value.total_donation_amount / stats.value.total_donor_count);
});

const monthOverMonthChange = computed(() => {
  const trend = stats.value?.monthly_trend;
  if (!trend || trend.length < 2) return null;

  const last = trend[trend.length - 1].total_donation_amount;
  const prev = trend[trend.length - 2].total_donation_amount;
  if (prev === 0) return null;

  return ((last - prev) / prev) * 100;
});

const monthlyDonations = computed<MonthlyDonation[]>(() => {
  if (!stats.value) return [];

  const recurringByMonth = new Map(
    stats.value.recurring_monthly_trend.map((item) => [item.month, item.recurring_paid_amount]),
  );

  return stats.value.monthly_trend.map((item) => {
    const recurring = recurringByMonth.get(item.month) ?? 0;
    const oneTime = Math.max(0, item.total_donation_amount - recurring);
    const monthIndex = Number(item.month.split('-')[1]) - 1;

    return {
      monthKey: item.month,
      month: THAI_MONTHS[monthIndex] ?? item.month,
      total: item.total_donation_amount,
      oneTime,
      recurring,
    };
  });
});

const yAxisSegments = 5;

const yAxisTicks = computed(() => {
  if (monthlyDonations.value.length === 0) return [0];

  const maxDonationAmount = Math.max(...monthlyDonations.value.map((item) => item.total));
  const yAxisStep = Math.ceil(maxDonationAmount / yAxisSegments / 1_000_000) * 1_000_000 || 1;
  const yAxisMax = yAxisStep * yAxisSegments;

  return Array.from({ length: yAxisSegments + 1 }, (_, index) => yAxisMax - yAxisStep * index);
});

const yAxisMax = computed(() => yAxisTicks.value[0] ?? 1);

const getTotalBarHeightPercent = (total: number) => Math.max(8, (total / yAxisMax.value) * 100);

const getSegmentPercent = (segment: number, total: number) => {
  if (total === 0) return 0;
  return (segment / total) * 100;
};

const donationChannels = computed(() => {
  if (!stats.value) return [];

  const monthlyTotal = stats.value.monthly_trend.reduce((sum, item) => sum + item.total_donation_amount, 0);
  const recurringTotal = stats.value.recurring_monthly_trend.reduce((sum, item) => sum + item.recurring_paid_amount, 0);
  const oneTimeTotal = Math.max(0, monthlyTotal - recurringTotal);

  if (monthlyTotal === 0) return [];

  const recurringPercent = Math.round((recurringTotal / monthlyTotal) * 100);
  const oneTimePercent = 100 - recurringPercent;

  return [
    { name: 'บริจาคแบบรายครั้ง', value: oneTimePercent, colorClass: 'bg-[#ff6900]' },
    { name: 'บริจาคแบบตัดบัตร', value: recurringPercent, colorClass: 'bg-[#5b4fc7]' },
  ];
});

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(amount);

const formatCount = (count: number) => new Intl.NumberFormat('th-TH').format(count);

const formatAmountShort = (amount: number) => {
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `฿${(amount / 1_000).toFixed(0)}K`;
  return `฿${amount}`;
};

const formatPercentChange = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

const formatMonthYear = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const monthIndex = Number(month) - 1;
  const buddhistYear = Number(year) + 543;
  const monthName = THAI_MONTHS_FULL[monthIndex] ?? monthKey;
  return `${monthName} ${buddhistYear}`;
};
</script>
