<template>
  <section class="max-w-7xl mx-auto px-4 py-8 md:py-10 text-white">
    <div class="rounded-3xl border border-white/15 bg-gradient-to-r from-[#ff6900]/30 via-[#1a0f62]/30 to-transparent p-6 md:p-8">
      <h1 class="text-2xl md:text-4xl font-bold">เครือข่ายอาสาส้ม</h1>
      <p class="mt-3 text-white/80 max-w-3xl">
        ติดตามพลังของอาสาสมัครทั่วประเทศ ทั้งจำนวนผู้ลงทะเบียนใหม่ อัตราการเติบโต และความเคลื่อนไหวของสมาชิกในแต่ละเดือน
      </p>
      <div class="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
        <p class="text-sm md:text-base font-semibold">อยากเป็นอาสาส้ม ? มาเข้าร่วมกันได้ที่</p>
        <a
          href="https://line.me/R/ti/p/@ppleoranger"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-full bg-[#ff6900] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ff7f1f]"
        >
          @ppleoranger
        </a>
      </div>
    </div>

    <div v-if="pending" class="mt-6 text-white/70">กำลังโหลดข้อมูล...</div>
    <div v-else-if="error" class="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">
      ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง
    </div>

    <template v-else-if="stats">
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
          <p class="text-sm text-white/70">อาสาส้มที่ลงทะเบียน</p>
          <p class="text-2xl md:text-3xl font-bold mt-2">{{ formatCount(stats.total_volunteer_count) }}</p>
          <p class="text-xs text-[#ff6900] mt-1">รวมทั้งหมดในระบบ</p>
        </div>
        <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
          <p class="text-sm text-white/70">ลงทะเบียนใหม่ 30 วัน</p>
          <p class="text-2xl md:text-3xl font-bold mt-2">{{ formatCount(registrationsLast30Days) }}</p>
          <p class="text-xs text-[#ff6900] mt-1">จากแนวโน้มรายวันล่าสุด</p>
        </div>
        <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
          <p class="text-sm text-white/70">จังหวัดที่มีเครือข่าย</p>
          <p class="text-2xl md:text-3xl font-bold mt-2">{{ provincesWithVolunteers }}/77</p>
          <p class="text-xs text-white/70 mt-1">จังหวัดที่มีอาสาส้มลงทะเบียน</p>
        </div>
        <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
          <p class="text-sm text-white/70">จังหวัดที่มีอาสามากที่สุด</p>
          <p class="text-2xl md:text-3xl font-bold mt-2">{{ topProvince?.province ?? '—' }}</p>
          <p v-if="topProvince" class="text-xs text-[#ff6900] mt-1">{{ formatCount(topProvince.count) }} คน</p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div class="xl:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-lg md:text-xl font-semibold">การลงทะเบียนอาสาส้ม 30 วันล่าสุด</h2>
            <div class="flex flex-wrap items-center gap-3 text-xs text-white/60">
              <span>รวม {{ formatCount(registrationsLast30Days) }} คน</span>
              <span v-if="updatedAt">อัปเดตล่าสุด: {{ updatedAt }}</span>
            </div>
          </div>
          <div class="mt-6 h-72 overflow-visible">
            <div class="grid h-full grid-cols-[60px_1fr] gap-3 overflow-visible">
              <div class="h-full pb-8 flex flex-col justify-between text-[11px] text-white/60">
                <span v-for="tick in yAxisTicks" :key="tick">{{ formatVolunteerCountShort(tick) }}</span>
              </div>
              <div class="relative h-full overflow-visible">
                <div class="absolute inset-0 pb-8 flex flex-col justify-between">
                  <div v-for="tick in yAxisTicks" :key="`grid-${tick}`" class="border-t border-white/10" />
                </div>

                <div class="absolute inset-0 pb-8 flex items-end gap-0.5 md:gap-1">
                  <div
                    v-for="item in registrationTrend"
                    :key="item.date"
                    class="flex-1 h-full flex items-end justify-center relative cursor-pointer group"
                    @mouseenter="hoveredDate = item.date"
                    @mouseleave="hoveredDate = null"
                    @click="hoveredDate = hoveredDate === item.date ? null : item.date"
                  >
                    <div
                      v-if="hoveredDate === item.date"
                      class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-20 w-max max-w-[200px] rounded-xl border border-white/20 bg-[#1a0f62] px-3 py-2.5 text-xs shadow-xl pointer-events-none"
                    >
                      <p class="font-semibold text-white">{{ formatFullDate(item.date) }}</p>
                      <p class="mt-1.5 text-white/90">
                        ลงทะเบียน <span class="font-semibold text-[#ff6900]">{{ formatCount(item.count) }}</span> คน
                      </p>
                    </div>
                    <div
                      class="w-full rounded-t-sm md:rounded-t-lg bg-gradient-to-t from-[#1a0f62] to-[#ff6900] transition-all duration-150"
                      :class="hoveredDate === item.date ? 'ring-2 ring-white/60 brightness-110' : 'brightness-100'"
                      :style="{ height: `${getBarHeightPercent(item.count)}%` }"
                    />
                  </div>
                </div>

                <div class="absolute bottom-0 inset-x-0 h-8 flex items-end gap-0.5 md:gap-1">
                  <div
                    v-for="(item, index) in registrationTrend"
                    :key="`label-${item.date}`"
                    class="flex-1 text-center text-[9px] md:text-xs text-white/70 overflow-hidden"
                  >
                    <span v-if="index % 5 === 0 || index === registrationTrend.length - 1">{{ formatDateLabel(item.date) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl bg-white/5 border border-white/10 p-5">
          <h2 class="text-lg md:text-xl font-semibold">อาสาส้มตามจังหวัด (Top 5)</h2>
          <div class="mt-4 space-y-3">
            <div v-for="province in topProvinces" :key="province.province" class="rounded-xl bg-[#1a0f62]/40 p-3">
              <div class="flex items-center justify-between">
                <p class="text-sm">{{ province.province }}</p>
                <p class="text-sm font-semibold">{{ formatCount(province.count) }} คน</p>
              </div>
              <div class="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-[#1a0f62] to-[#ff6900]"
                  :style="{ width: `${getProvinceBarPercent(province.count)}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 rounded-3xl bg-white/5 border border-white/10 p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-lg md:text-xl font-semibold">อาสาส้มตามจังหวัด</h2>
          <div class="inline-flex rounded-xl bg-white/10 p-1">
            <button
              type="button"
              class="px-4 py-1.5 text-sm rounded-lg transition-colors"
              :class="provinceView === 'map' ? 'bg-[#ff6900] text-white font-semibold' : 'text-white/70 hover:text-white'"
              @click="provinceView = 'map'"
            >
              แผนที่
            </button>
            <button
              type="button"
              class="px-4 py-1.5 text-sm rounded-lg transition-colors"
              :class="provinceView === 'table' ? 'bg-[#ff6900] text-white font-semibold' : 'text-white/70 hover:text-white'"
              @click="provinceView = 'table'"
            >
              ตาราง
            </button>
          </div>
        </div>

        <div v-show="provinceView === 'map'" class="mt-4 h-[460px]">
          <ClientOnly>
            <VolunteerProvinceMap :by-province="sortedProvinces" />
            <template #fallback>
              <div class="h-full flex items-center justify-center text-white/60">กำลังโหลดแผนที่...</div>
            </template>
          </ClientOnly>
        </div>

        <div v-show="provinceView === 'table'" class="mt-4">
          <div class="overflow-x-auto rounded-2xl border border-white/10">
            <table class="w-full text-sm">
              <thead class="bg-white/10 text-white/80">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold w-16">อันดับ</th>
                  <th class="px-4 py-3 text-left font-semibold">จังหวัด</th>
                  <th class="px-4 py-3 text-right font-semibold">จำนวนอาสาส้ม</th>
                  <th class="px-4 py-3 text-right font-semibold w-28">สัดส่วน</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(province, index) in sortedProvinces"
                  :key="province.province"
                  class="border-t border-white/10 hover:bg-white/5"
                >
                  <td class="px-4 py-2.5 text-white/60">{{ index + 1 }}</td>
                  <td class="px-4 py-2.5">{{ province.province }}</td>
                  <td class="px-4 py-2.5 text-right font-semibold">{{ formatCount(province.count) }}</td>
                  <td class="px-4 py-2.5 text-right text-white/70">{{ provincePercent(province.count) }}%</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="border-t border-white/20 bg-white/10 font-semibold">
                  <td class="px-4 py-3" colspan="2">รวม {{ sortedProvinces.length }} จังหวัด</td>
                  <td class="px-4 py-3 text-right">{{ formatCount(stats.total_volunteer_count) }}</td>
                  <td class="px-4 py-3 text-right">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
type ProvinceCount = {
  province: string;
  count: number;
};

type RegistrationTrendItem = {
  date: string;
  count: number;
};

type VolunteerStats = {
  total_volunteer_count: number;
  by_province: ProvinceCount[];
  registration_trend_30d: RegistrationTrendItem[];
};

type VolunteerStatsResponse = {
  success: boolean;
  data: VolunteerStats;
  timestamp: string;
};

const THAI_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const config = useRuntimeConfig();

const { data: response, pending, error } = await useFetch<VolunteerStatsResponse>(config.public.apiVolunteerStats);

const stats = computed(() => (response.value?.success ? response.value.data : null));

const updatedAt = computed(() => {
  if (!response.value?.timestamp) return '';
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(response.value.timestamp));
});

const hoveredDate = ref<string | null>(null);

const registrationTrend = computed(() => stats.value?.registration_trend_30d ?? []);

const registrationsLast30Days = computed(() =>
  registrationTrend.value.reduce((sum, item) => sum + item.count, 0),
);

const provincesWithVolunteers = computed(
  () => stats.value?.by_province.filter((item) => item.count > 0).length ?? 0,
);

const provinceView = ref<'map' | 'table'>('map');

const sortedProvinces = computed(() => {
  if (!stats.value) return [];
  return [...stats.value.by_province]
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
});

const topProvinces = computed(() => sortedProvinces.value.slice(0, 5));

const topProvince = computed(() => topProvinces.value[0] ?? null);

const provincePercent = (count: number) => {
  const total = stats.value?.total_volunteer_count ?? 0;
  if (total === 0) return '0.0';
  return ((count / total) * 100).toFixed(1);
};

const maxProvinceCount = computed(() => topProvince.value?.count ?? 1);

const getProvinceBarPercent = (count: number) => Math.max(4, (count / maxProvinceCount.value) * 100);

const yAxisSegments = 5;

const yAxisTicks = computed(() => {
  if (registrationTrend.value.length === 0) return [0];

  const maxCount = Math.max(...registrationTrend.value.map((item) => item.count), 1);
  const yAxisStep = Math.ceil(maxCount / yAxisSegments) || 1;
  const yAxisMax = yAxisStep * yAxisSegments;

  return Array.from({ length: yAxisSegments + 1 }, (_, index) => yAxisMax - yAxisStep * index);
});

const yAxisMax = computed(() => yAxisTicks.value[0] ?? 1);

const getBarHeightPercent = (count: number) => Math.max(count > 0 ? 8 : 2, (count / yAxisMax.value) * 100);

const formatCount = (count: number) => new Intl.NumberFormat('th-TH').format(count);

const formatVolunteerCountShort = (count: number) => {
  if (count >= 1000) return `${Math.round(count / 1000)}K`;
  return String(count);
};

const formatDateLabel = (date: string) => {
  const [, month, day] = date.split('-');
  const monthIndex = Number(month) - 1;
  return `${Number(day)} ${THAI_MONTHS_SHORT[monthIndex] ?? month}`;
};

const formatFullDate = (date: string) => {
  const [year, month, day] = date.split('-');
  const monthIndex = Number(month) - 1;
  const buddhistYear = Number(year) + 543;
  return `${Number(day)} ${THAI_MONTHS_SHORT[monthIndex] ?? month} ${buddhistYear}`;
};
</script>
