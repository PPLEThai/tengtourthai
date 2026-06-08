<template>
  <section class="max-w-7xl mx-auto px-4 py-8 md:py-10 text-secondary">
    <div class="rounded-3xl bg-gradient-primary text-white shadow-md p-6 md:p-8">
      <h1 class="text-2xl md:text-4xl font-heading font-medium">Funnel Future Candidate</h1>
      <p class="mt-3 text-white/90 max-w-3xl">
        เส้นทางการบ่มเพาะว่าที่ผู้สมัคร
      </p>
    </div>

    <div v-if="pending" class="mt-6 text-muted-foreground">กำลังโหลดข้อมูล...</div>
    <div v-else-if="error" class="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">
      ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง
    </div>

    <template v-else-if="pp101 && pc101">
      <!-- Summary cards -->
      <div class="mt-6 grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
          <p class="text-sm text-muted-foreground">PP101 · ผู้เข้าอบรม</p>
          <p class="text-2xl md:text-3xl font-bold mt-2 text-primary">{{ formatCount(pp101.total_count) }}</p>
          <p class="text-xs text-[#ff6900] mt-1">ผ่าน {{ passRate(pp101) }}%</p>
        </div>
        <div class="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
          <p class="text-sm text-muted-foreground">PP101 · ผ่านอบรม</p>
          <p class="text-2xl md:text-3xl font-bold mt-2">{{ formatCount(pp101.passed.total) }}</p>
          <p class="text-xs text-muted-foreground mt-1">ไม่ผ่าน {{ formatCount(pp101.not_passed.total) }} คน</p>
        </div>
        <div class="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
          <p class="text-sm text-muted-foreground">PC101 · ผู้เข้าอบรม</p>
          <p class="text-2xl md:text-3xl font-bold mt-2 text-primary">{{ formatCount(pc101.total_count) }}</p>
          <p class="text-xs text-[#ff6900] mt-1">ผ่าน {{ passRate(pc101) }}%</p>
        </div>
        <div class="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
          <p class="text-sm text-muted-foreground">PC101 · ผ่านอบรม</p>
          <p class="text-2xl md:text-3xl font-bold mt-2">{{ formatCount(pc101.passed.total) }}</p>
          <p class="text-xs text-muted-foreground mt-1">ไม่ผ่าน {{ formatCount(pc101.not_passed.total) }} คน</p>
        </div>
      </div>

      <!-- Sankey diagram -->
      <div class="mt-6 rounded-3xl bg-secondary text-white border border-white/10 shadow-md p-5 md:p-8">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-lg md:text-xl font-semibold">เส้นทางการบ่มเพาะว่าที่ผู้สมัคร พรรคประชาชน</h2>
          <div class="flex flex-wrap items-center gap-4 text-xs text-white/70">
            <span class="inline-flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-[#ff8f43]" />
              ผ่าน / ไปต่อ
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-[#64748b]" />
              ไม่ผ่าน / ไม่ได้ไปต่อ
            </span>
            <span v-if="updatedAt" class="text-white/60">อัปเดตล่าสุด: {{ updatedAt }}</span>
          </div>
        </div>

        <div class="mt-6">
          <ClientOnly>
            <svg
              v-if="diagram"
              :viewBox="`0 0 ${diagram.width} ${diagram.height}`"
              class="w-full h-auto"
              :style="{ fontFamily: 'inherit' }"
              role="img"
              aria-label="Sankey diagram PP101 to PC101"
            >
              <!-- links -->
              <path
                v-for="link in diagram.links"
                :key="link.id"
                :d="link.d"
                :fill="link.fill"
                fill-opacity="0.45"
              >
                <title>{{ link.title }}</title>
              </path>

              <!-- nodes -->
              <g v-for="node in diagram.nodes" :key="node.id">
                <rect
                  :x="node.x"
                  :y="node.y"
                  :width="node.w"
                  :height="node.h"
                  :fill="node.fill"
                  rx="3"
                >
                  <title>{{ node.label }} · {{ formatCount(node.value) }} คน</title>
                </rect>
                <text
                  :x="node.labelX"
                  :y="node.countY"
                  text-anchor="middle"
                  fill="#ff9a52"
                  :font-size="diagram.countSize"
                  font-weight="700"
                >
                  {{ formatCount(node.value) }}
                </text>
                <text
                  :x="node.labelX"
                  :y="node.nameY"
                  text-anchor="middle"
                  fill="#ffffff"
                  :font-size="diagram.fontSize"
                  font-weight="600"
                >
                  {{ node.label }}
                </text>
              </g>
            </svg>
            <template #fallback>
              <div class="h-72 flex items-center justify-center text-white/60">กำลังโหลดแผนภาพ...</div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Per-course pass/fail + gender breakdown -->
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div v-for="course in courses" :key="course.course" class="rounded-3xl bg-secondary text-white border border-white/10 shadow-md p-5">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ course.course }}</h3>
            <span class="text-sm text-white/70">ผู้เข้าอบรม {{ formatCount(course.total_count) }} คน</span>
          </div>

          <!-- pass/fail bar -->
          <div class="mt-4 h-3 w-full rounded-full bg-white/10 overflow-hidden flex">
            <div
              class="h-full bg-gradient-to-r from-[#ff6900] to-[#ff8f43]"
              :style="{ width: `${course.total_count > 0 ? (course.passed.total / course.total_count) * 100 : 0}%` }"
            />
          </div>
          <div class="mt-2 flex items-center justify-between text-xs">
            <span class="text-[#ff6900] font-semibold">ผ่าน {{ formatCount(course.passed.total) }} ({{ passRate(course) }}%)</span>
            <span class="text-white/60">ไม่ผ่าน {{ formatCount(course.not_passed.total) }} ({{ failRate(course) }}%)</span>
          </div>

          <!-- gender breakdown -->
          <div class="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-white/60 mb-2">ผู้ผ่านตามเพศ</p>
              <div class="space-y-2">
                <div v-for="g in course.passed.by_gender" :key="`p-${g.gender}`" class="text-xs">
                  <div class="flex items-center justify-between mb-1">
                    <span>{{ g.gender }}</span>
                    <span class="text-white/70">{{ formatCount(g.count) }}</span>
                  </div>
                  <div class="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      class="h-full rounded-full bg-[#ff6900]"
                      :style="{ width: `${genderPercent(g.count, course.passed.total)}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p class="text-xs text-white/60 mb-2">ผู้ไม่ผ่านตามเพศ</p>
              <div class="space-y-2">
                <div v-for="g in course.not_passed.by_gender" :key="`np-${g.gender}`" class="text-xs">
                  <div class="flex items-center justify-between mb-1">
                    <span>{{ g.gender }}</span>
                    <span class="text-white/70">{{ formatCount(g.count) }}</span>
                  </div>
                  <div class="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      class="h-full rounded-full bg-white/40"
                      :style="{ width: `${genderPercent(g.count, course.not_passed.total)}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Age & Province dashboard -->
    <div v-if="ageProvincePending" class="mt-6 text-muted-foreground">กำลังโหลดข้อมูลอายุ/จังหวัด...</div>
    <div v-else-if="ageProvinceError" class="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">
      ไม่สามารถโหลดข้อมูลการกระจายตัวได้ กรุณาลองใหม่อีกครั้ง
    </div>

    <template v-else-if="currentAgeProvince">
      <div class="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="text-xl md:text-2xl font-heading font-medium">การกระจายตัวผู้เข้าอบรม</h2>
          <p class="text-sm text-muted-foreground mt-1">ช่วงอายุ และพื้นที่จังหวัดของผู้เข้าอบรมแต่ละหลักสูตร</p>
        </div>
        <div class="inline-flex rounded-xl bg-secondary/10 p-1">
          <button
            v-for="course in availableCourses"
            :key="course"
            type="button"
            class="px-4 py-1.5 text-sm rounded-lg transition-colors"
            :class="selectedCourse === course ? 'bg-[#ff6900] text-white font-semibold' : 'text-secondary/70 hover:text-secondary'"
            @click="setCourse(course)"
          >
            {{ course }}
          </button>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-5">
        <!-- Age distribution -->
        <div class="xl:col-span-2 rounded-3xl bg-secondary text-white border border-white/10 shadow-md p-5">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">ช่วงอายุ ({{ selectedCourse }})</h3>
            <span class="text-xs text-white/60">รวม {{ formatCount(ageTotal) }} คน</span>
          </div>

          <div class="mt-5 space-y-3">
            <div v-for="group in ageGroups" :key="group.age_group">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="font-medium">{{ group.age_group }}</span>
                <span class="text-white/70">
                  {{ formatCount(group.count) }}
                  <span class="text-white/40">({{ agePercentOfTotal(group.count) }}%)</span>
                </span>
              </div>
              <div class="h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-[#1a0f62] to-[#ff6900] transition-all duration-500"
                  :style="{ width: `${ageBarPercent(group.count)}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Province map -->
        <div class="xl:col-span-3 rounded-3xl bg-secondary text-white border border-white/10 shadow-md p-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-lg font-semibold">ตามจังหวัดที่อบรม ({{ selectedCourse }})</h3>
            <div class="flex items-center gap-3 text-xs text-white/60">
              <span>{{ provincesWithData }}/77 จังหวัด</span>
              <span v-if="ageProvinceUpdatedAt">อัปเดต: {{ ageProvinceUpdatedAt }}</span>
            </div>
          </div>

          <div class="mt-4 h-[460px]">
            <ClientOnly>
              <CandidateProvinceMap
                :by-province="provinceItems"
                :legend-title="`ผู้เข้าอบรม ${selectedCourse} (คน)`"
              />
              <template #fallback>
                <div class="h-full flex items-center justify-center text-white/60">กำลังโหลดแผนที่...</div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Top provinces -->
      <div class="mt-5 rounded-3xl bg-secondary text-white border border-white/10 shadow-md p-5">
        <h3 class="text-lg font-semibold">จังหวัดที่มีผู้เข้าอบรมมากที่สุด (Top 10 · {{ selectedCourse }})</h3>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          <div v-for="(item, index) in topProvinceItems" :key="item.province" class="flex items-center gap-3">
            <span class="w-6 text-right text-sm text-white/50">{{ index + 1 }}</span>
            <div class="flex-1">
              <div class="flex items-center justify-between text-sm mb-1">
                <span>{{ item.province }}</span>
                <span class="font-semibold">{{ formatCount(item.count) }}</span>
              </div>
              <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-[#1a0f62] to-[#ff6900]"
                  :style="{ width: `${provinceListBarPercent(item.count)}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

type GenderCount = {
  gender: string;
  count: number;
};

type PassGroup = {
  total: number;
  by_gender: GenderCount[];
};

type CourseStats = {
  course: string;
  total_count: number;
  passed: PassGroup;
  not_passed: PassGroup;
};

type CourseStatsResponse = {
  success: boolean;
  data: CourseStats[];
  timestamp: string;
};

type AgeGroupCount = {
  age_group: string;
  count: number;
};

type ProvinceCountItem = {
  province: string;
  count: number;
};

type AgeProvinceCourse = {
  course: string;
  total_count: number;
  age: { by_age_group: AgeGroupCount[] };
  province: { by_province: ProvinceCountItem[] };
};

type AgeProvinceResponse = {
  success: boolean;
  data: AgeProvinceCourse[];
  timestamp: string;
};

const config = useRuntimeConfig();

const { data: response, pending, error } = await useFetch<CourseStatsResponse>(config.public.apiCourseStats);

const {
  data: ageProvinceResponse,
  pending: ageProvincePending,
  error: ageProvinceError,
} = await useFetch<AgeProvinceResponse>(config.public.apiAgeProvinceStats);

const courses = computed<CourseStats[]>(() => {
  if (!response.value?.success) return [];
  // เรียงตามลำดับ funnel: PP101 ก่อน แล้ว PC101
  const order = ["PP101", "PC101"];
  return [...response.value.data].sort(
    (a, b) => order.indexOf(a.course) - order.indexOf(b.course),
  );
});

const findCourse = (name: string) => courses.value.find((c) => c.course === name) ?? null;

const pp101 = computed(() => findCourse("PP101"));
const pc101 = computed(() => findCourse("PC101"));

const updatedAt = computed(() => {
  if (!response.value?.timestamp) return "";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(response.value.timestamp));
});

const passRate = (course: CourseStats) =>
  course.total_count > 0 ? ((course.passed.total / course.total_count) * 100).toFixed(1) : "0.0";

const failRate = (course: CourseStats) =>
  course.total_count > 0 ? ((course.not_passed.total / course.total_count) * 100).toFixed(1) : "0.0";

const genderPercent = (count: number, total: number) =>
  total > 0 ? Math.max(2, (count / total) * 100) : 0;

const formatCount = (count: number) => new Intl.NumberFormat("th-TH").format(count);

/* ---------- Age & Province dashboard ---------- */

const selectedCourse = ref<"PP101" | "PC101">("PP101");

const setCourse = (course: string) => {
  selectedCourse.value = course as "PP101" | "PC101";
};

const ageProvinceCourses = computed<AgeProvinceCourse[]>(() =>
  ageProvinceResponse.value?.success ? ageProvinceResponse.value.data : [],
);

const availableCourses = computed(() =>
  ["PP101", "PC101"].filter((name) =>
    ageProvinceCourses.value.some((c) => c.course === name),
  ),
);

const currentAgeProvince = computed(
  () => ageProvinceCourses.value.find((c) => c.course === selectedCourse.value) ?? null,
);

watch(
  availableCourses,
  (list) => {
    if (list.length > 0 && !list.includes(selectedCourse.value)) {
      selectedCourse.value = list[0] as "PP101" | "PC101";
    }
  },
  { immediate: true },
);

const ageGroups = computed(() => currentAgeProvince.value?.age.by_age_group ?? []);

const maxAgeCount = computed(() =>
  Math.max(1, ...ageGroups.value.map((g) => g.count)),
);

const ageTotal = computed(() =>
  ageGroups.value.reduce((sum, g) => sum + g.count, 0),
);

const ageBarPercent = (count: number) =>
  Math.max(2, (count / maxAgeCount.value) * 100);

const agePercentOfTotal = (count: number) =>
  ageTotal.value > 0 ? ((count / ageTotal.value) * 100).toFixed(1) : "0.0";

// แยก "ไม่ระบุ" ออกจากแผนที่ (ไม่มีพิกัด) แต่ยังนับรวมในสรุป
const provinceItems = computed(() =>
  (currentAgeProvince.value?.province.by_province ?? []).filter(
    (p) => p.province !== "ไม่ระบุ" && p.count > 0,
  ),
);

const sortedProvinceItems = computed(() =>
  [...provinceItems.value].sort((a, b) => b.count - a.count),
);

const topProvinceItems = computed(() => sortedProvinceItems.value.slice(0, 10));

const provincesWithData = computed(() => provinceItems.value.length);

const maxProvinceItemCount = computed(
  () => sortedProvinceItems.value[0]?.count ?? 1,
);

const provinceListBarPercent = (count: number) =>
  Math.max(4, (count / maxProvinceItemCount.value) * 100);

const ageProvinceUpdatedAt = computed(() => {
  if (!ageProvinceResponse.value?.timestamp) return "";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ageProvinceResponse.value.timestamp));
});

/* ---------- Sankey layout (pure SVG, responsive) ---------- */

type Tone = "base" | "pass" | "fail";

type SankeyNodeDef = {
  id: string;
  label: string;
  layer: number;
  order: number;
  value: number;
  tone: Tone;
};

type SankeyLinkDef = {
  source: string;
  target: string;
  value: number;
};

type LaidOutNode = SankeyNodeDef & {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  labelX: number;
  nameY: number;
  countY: number;
};

type SankeyConfig = {
  vertical: boolean;
  width: number;
  height: number;
  band: number;
  padMainStart: number;
  padMainEnd: number;
  padCrossStart: number;
  padCrossEnd: number;
  gap: number;
  layers: number;
  fontSize: number;
  countSize: number;
};

const TONE_FILL: Record<Tone, string> = {
  base: "#ff6900",
  pass: "#ff8f43",
  fail: "#64748b",
};

// flow ทิศ "main" คือทิศทางการไหล, "cross" คือแกนที่ node เรียงต่อกัน
const HORIZONTAL_CONFIG: SankeyConfig = {
  vertical: false,
  width: 920,
  height: 600,
  band: 22,
  padMainStart: 90,
  padMainEnd: 90,
  padCrossStart: 48,
  padCrossEnd: 30,
  gap: 46,
  layers: 4,
  fontSize: 13,
  countSize: 12,
};

const VERTICAL_CONFIG: SankeyConfig = {
  vertical: true,
  width: 380,
  height: 880,
  band: 26,
  padMainStart: 56,
  padMainEnd: 56,
  padCrossStart: 16,
  padCrossEnd: 16,
  gap: 22,
  layers: 4,
  fontSize: 13,
  countSize: 12,
};

const isMobile = ref(false);
let mediaQuery: MediaQueryList | null = null;

const updateIsMobile = () => {
  isMobile.value = mediaQuery?.matches ?? false;
};

onMounted(() => {
  mediaQuery = window.matchMedia("(max-width: 767px)");
  updateIsMobile();
  mediaQuery.addEventListener("change", updateIsMobile);
});

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener("change", updateIsMobile);
});

const diagram = computed(() => {
  const pp = pp101.value;
  const pc = pc101.value;
  if (!pp || !pc) return null;

  const cfg = isMobile.value ? VERTICAL_CONFIG : HORIZONTAL_CONFIG;

  const ppTotal = pp.total_count;
  const ppPass = pp.passed.total;
  const ppFail = pp.not_passed.total;
  const pcTotal = Math.min(pc.total_count, ppPass);
  const dropAfterPP = Math.max(0, ppPass - pcTotal);
  const pcPass = pc.passed.total;
  const pcFail = pc.not_passed.total;

  const allNodeDefs: SankeyNodeDef[] = [
    { id: "pp", label: "PP101", layer: 0, order: 0, value: ppTotal, tone: "base" },
    { id: "ppPass", label: "ผ่าน PP101", layer: 1, order: 0, value: ppPass, tone: "pass" },
    { id: "ppFail", label: "ไม่ผ่าน PP101", layer: 1, order: 1, value: ppFail, tone: "fail" },
    { id: "pc", label: "PC101", layer: 2, order: 0, value: pcTotal, tone: "base" },
    { id: "ppDrop", label: "ไม่ได้ไปต่อ PC101", layer: 2, order: 1, value: dropAfterPP, tone: "fail" },
    { id: "pcPass", label: "ผ่าน PC101", layer: 3, order: 0, value: pcPass, tone: "pass" },
    { id: "pcFail", label: "ไม่ผ่าน PC101", layer: 3, order: 1, value: pcFail, tone: "fail" },
  ];
  const nodeDefs = allNodeDefs.filter((n) => n.value > 0);

  const allLinkDefs: SankeyLinkDef[] = [
    { source: "pp", target: "ppPass", value: ppPass },
    { source: "pp", target: "ppFail", value: ppFail },
    { source: "ppPass", target: "pc", value: pcTotal },
    { source: "ppPass", target: "ppDrop", value: dropAfterPP },
    { source: "pc", target: "pcPass", value: pcPass },
    { source: "pc", target: "pcFail", value: pcFail },
  ];
  const linkDefs = allLinkDefs.filter((l) => l.value > 0);

  const mainLength = cfg.vertical ? cfg.height : cfg.width;
  const crossLength = cfg.vertical ? cfg.width : cfg.height;
  const crossDrawable = crossLength - cfg.padCrossStart - cfg.padCrossEnd;

  // scale (px ต่อคน) ให้คอลัมน์ที่หนักที่สุดพอดีกรอบ
  const layerIndexes = Array.from(new Set(nodeDefs.map((n) => n.layer)));
  let scale = Infinity;
  for (const layer of layerIndexes) {
    const layerNodes = nodeDefs.filter((n) => n.layer === layer);
    const sum = layerNodes.reduce((acc, n) => acc + n.value, 0);
    if (sum <= 0) continue;
    const gaps = (layerNodes.length - 1) * cfg.gap;
    scale = Math.min(scale, (crossDrawable - gaps) / sum);
  }
  if (!Number.isFinite(scale) || scale <= 0) scale = crossDrawable / Math.max(ppTotal, 1);

  const layerMain = (layer: number) =>
    cfg.padMainStart +
    (layer * (mainLength - cfg.padMainStart - cfg.padMainEnd - cfg.band)) / (cfg.layers - 1);

  const nodeMap = new Map<string, LaidOutNode>();
  const nodes: LaidOutNode[] = [];

  for (const layer of layerIndexes) {
    const layerNodes = nodeDefs
      .filter((n) => n.layer === layer)
      .sort((a, b) => a.order - b.order);
    const colLen =
      layerNodes.reduce((acc, n) => acc + n.value * scale, 0) +
      (layerNodes.length - 1) * cfg.gap;
    let cross = cfg.padCrossStart + (crossDrawable - colLen) / 2;
    const main = layerMain(layer);

    for (const def of layerNodes) {
      const len = Math.max(2, def.value * scale);

      let x: number;
      let y: number;
      let w: number;
      let h: number;
      let labelX: number;
      let nameY: number;
      let countY: number;

      if (cfg.vertical) {
        x = cross;
        y = main;
        w = len;
        h = cfg.band;
        labelX = cross + len / 2;
        // node บน (order คู่) วางป้ายด้านบน, node ล่าง (order คี่) วางป้ายด้านล่าง กันชนกัน
        if (def.order % 2 === 0) {
          nameY = y - 10;
          countY = y - 26;
        } else {
          nameY = y + cfg.band + 18;
          countY = y + cfg.band + 34;
        }
      } else {
        x = main;
        y = cross;
        w = cfg.band;
        h = len;
        labelX = main + cfg.band / 2;
        nameY = y - 8;
        countY = y - 23;
      }

      const node: LaidOutNode = {
        ...def,
        x,
        y,
        w,
        h,
        fill: TONE_FILL[def.tone],
        labelX,
        nameY,
        countY,
      };
      nodeMap.set(def.id, node);
      nodes.push(node);
      cross += len + cfg.gap;
    }
  }

  // links: สะสม offset ตามแกน cross ของแต่ละ node
  const outOffset = new Map<string, number>();
  const inOffset = new Map<string, number>();
  for (const n of nodes) {
    const crossStart = cfg.vertical ? n.x : n.y;
    outOffset.set(n.id, crossStart);
    inOffset.set(n.id, crossStart);
  }

  const orderedLinks = [...linkDefs].sort((a, b) => {
    const sa = nodeMap.get(a.source);
    const sb = nodeMap.get(b.source);
    if (sa && sb && sa.layer !== sb.layer) return sa.layer - sb.layer;
    if (sa && sb && sa.order !== sb.order) return sa.order - sb.order;
    const ta = nodeMap.get(a.target);
    const tb = nodeMap.get(b.target);
    return (ta?.order ?? 0) - (tb?.order ?? 0);
  });

  const links = orderedLinks
    .map((link, index) => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      if (!source || !target) return null;

      const ribbon = link.value * scale;
      const s0 = outOffset.get(source.id) ?? 0;
      const s1 = s0 + ribbon;
      outOffset.set(source.id, s1);

      const t0 = inOffset.get(target.id) ?? 0;
      const t1 = t0 + ribbon;
      inOffset.set(target.id, t1);

      let d: string;
      if (cfg.vertical) {
        const sMain = source.y + source.h; // ขอบล่างของ source
        const tMain = target.y; // ขอบบนของ target
        const mid = (sMain + tMain) / 2;
        d = [
          `M ${s0},${sMain}`,
          `C ${s0},${mid} ${t0},${mid} ${t0},${tMain}`,
          `L ${t1},${tMain}`,
          `C ${t1},${mid} ${s1},${mid} ${s1},${sMain}`,
          "Z",
        ].join(" ");
      } else {
        const sMain = source.x + source.w; // ขอบขวาของ source
        const tMain = target.x; // ขอบซ้ายของ target
        const mid = (sMain + tMain) / 2;
        d = [
          `M ${sMain},${s0}`,
          `C ${mid},${s0} ${mid},${t0} ${tMain},${t0}`,
          `L ${tMain},${t1}`,
          `C ${mid},${t1} ${mid},${s1} ${sMain},${s1}`,
          "Z",
        ].join(" ");
      }

      const fill = target.tone === "fail" ? "#64748b" : "#ff8f43";

      return {
        id: `${link.source}-${link.target}-${index}`,
        d,
        fill,
        title: `${source.label} → ${target.label}: ${formatCount(link.value)} คน`,
      };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  return {
    width: cfg.width,
    height: cfg.height,
    fontSize: cfg.fontSize,
    countSize: cfg.countSize,
    nodes,
    links,
  };
});
</script>
