<template>
  <div class="relative h-full w-full">
    <div v-if="isLoading" class="absolute inset-0 z-[1000] flex items-center justify-center bg-black/40 rounded-2xl">
      <div class="loading-spinner"></div>
      <div class="ml-2 text-white font-semibold">กำลังโหลดแผนที่...</div>
    </div>

    <div ref="mapContainer" class="map-container rounded-2xl overflow-hidden"></div>

    <div class="absolute top-3 right-3 z-[500] flex flex-col gap-1">
      <button @click="zoomIn" class="map-btn">+</button>
      <button @click="zoomOut" class="map-btn">-</button>
      <button @click="resetZoom" class="map-btn text-xs">รีเซ็ต</button>
    </div>

    <div class="absolute bottom-3 left-3 z-[500] rounded-xl bg-[#1a0f62]/90 border border-white/15 p-3 text-xs text-white">
      <p class="font-semibold mb-1.5">{{ legendTitle }}</p>
      <div class="space-y-1">
        <div v-for="bucket in legendBuckets" :key="bucket.label" class="flex items-center gap-2">
          <span class="w-4 h-3 rounded-sm" :style="{ backgroundColor: bucket.color }" />
          <span>{{ bucket.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref, computed, type PropType } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type ProvinceCount = {
  province: string;
  count: number;
};

const props = defineProps({
  byProvince: {
    type: Array as PropType<ProvinceCount[]>,
    required: true,
  },
  legendTitle: {
    type: String,
    default: "จำนวน (คน)",
  },
  unitLabel: {
    type: String,
    default: "คน",
  },
});

const RAMP = ["#ffe5cc", "#ffc694", "#ffa561", "#ff8030", "#ff6a14"];

const mapContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const isMapReady = ref(false);
let map: maplibregl.Map | null = null;

const maxCount = computed(() =>
  Math.max(1, ...props.byProvince.map((p) => p.count)),
);

// สร้าง threshold 5 ระดับแบบเพิ่มขึ้นเสมอ ปรับตามค่าสูงสุดของข้อมูล
const thresholds = computed(() => {
  const max = maxCount.value;
  const fractions = [0.02, 0.08, 0.2, 0.45, 0.75];
  let prev = 0;
  return fractions.map((f) => {
    const value = Math.max(prev + 1, Math.round(max * f));
    prev = value;
    return value;
  });
});

const legendBuckets = computed(() => {
  const t = thresholds.value;
  const fmt = (n: number) => n.toLocaleString("th-TH");
  return [
    { label: "ไม่มีข้อมูล", color: "#B9B9B9" },
    { label: `${fmt(t[0])} - ${fmt(t[1] - 1)}`, color: RAMP[0] },
    { label: `${fmt(t[1])} - ${fmt(t[2] - 1)}`, color: RAMP[1] },
    { label: `${fmt(t[2])} - ${fmt(t[3] - 1)}`, color: RAMP[2] },
    { label: `${fmt(t[3])} - ${fmt(t[4] - 1)}`, color: RAMP[3] },
    { label: `${fmt(t[4])}+`, color: RAMP[4] },
  ];
});

const stepExpression = (): maplibregl.ExpressionSpecification => {
  const t = thresholds.value;
  return [
    "step",
    ["get", "value"],
    "#B9B9B9",
    t[0], RAMP[0],
    t[1], RAMP[1],
    t[2], RAMP[2],
    t[3], RAMP[3],
    t[4], RAMP[4],
  ] as unknown as maplibregl.ExpressionSpecification;
};

const zoomIn = () => map?.zoomIn();
const zoomOut = () => map?.zoomOut();
const resetZoom = () => map?.setZoom(4.6).setCenter([100.9925, 13.36]);

const countByProvince = () => {
  const lookup = new Map<string, number>();
  props.byProvince.forEach((item) => lookup.set(item.province, item.count));
  return lookup;
};

const applyData = () => {
  if (!map || !isMapReady.value) return;
  const source = map.getSource("provinces") as maplibregl.GeoJSONSource | undefined;
  if (!source) return;

  const data = source.serialize().data;
  if (!data || typeof data !== "object" || !("features" in data)) return;

  const lookup = countByProvince();
  const updatedFeatures = (data.features as GeoJSON.Feature[]).map((feature) => {
    if (feature.properties) {
      const name = feature.properties.ADM1_TH as string;
      feature.properties.value = lookup.get(name) ?? 0;
    }
    return feature;
  });

  source.setData({ type: "FeatureCollection", features: updatedFeatures });
  // ปรับสเกลสีตามชุดข้อมูลปัจจุบัน (เช่นสลับหลักสูตร PP101/PC101)
  map.setPaintProperty("province-fill", "fill-color", stepExpression());
};

onMounted(() => {
  if (!mapContainer.value) return;

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    center: [100.9925, 13.36],
    zoom: 4.6,
    minZoom: 4,
    maxZoom: 11,
  });

  map.on("load", async () => {
    isLoading.value = true;
    try {
      const response = await fetch("/data/province.geojson");
      const geojsonData = (await response.json()) as GeoJSON.FeatureCollection;

      const lookup = countByProvince();
      geojsonData.features.forEach((feature) => {
        if (!feature.properties) feature.properties = {};
        const name = feature.properties.ADM1_TH as string;
        feature.properties.value = lookup.get(name) ?? 0;
      });

      map!.addSource("provinces", { type: "geojson", data: geojsonData });

      map!.addLayer({
        id: "province-fill",
        type: "fill",
        source: "provinces",
        paint: {
          "fill-color": stepExpression(),
          "fill-opacity": 0.78,
        },
      });

      map!.addLayer({
        id: "province-outline",
        type: "line",
        source: "provinces",
        paint: { "line-color": "#1a0f62", "line-width": 0.4 },
      });

      map!.on("click", "province-fill", (e) => {
        if (!e.features || e.features.length === 0) return;
        const props2 = e.features[0].properties || {};
        const name = props2.ADM1_TH ?? "";
        const count = props2.value ?? 0;
        new maplibregl.Popup({ className: "candidate-popup" })
          .setLngLat(e.lngLat)
          .setHTML(
            `<div style="font-family:inherit;color:#1a0f62"><strong>${name}</strong><br/><span style="color:#ff6a14;font-weight:600">${Number(count).toLocaleString("th-TH")}</span> ${props.unitLabel}</div>`,
          )
          .addTo(map!);
      });

      map!.on("mouseenter", "province-fill", () => {
        if (map) map.getCanvas().style.cursor = "pointer";
      });
      map!.on("mouseleave", "province-fill", () => {
        if (map) map.getCanvas().style.cursor = "";
      });

      isMapReady.value = true;
    } catch (err) {
      console.error("Error loading province map:", err);
    } finally {
      isLoading.value = false;
    }
  });
});

watch(
  () => props.byProvince,
  () => applyData(),
  { deep: true },
);

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 420px;
}

.map-btn {
  background-color: #fff;
  color: #1a0f62;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 36px;
  font-weight: 600;
}

.map-btn:hover {
  background-color: #f0f0f0;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ff6a14;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<style>
.candidate-popup .maplibregl-popup-content {
  background-color: #ffffff;
  color: #1a0f62;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  font-size: 13px;
}

.candidate-popup .maplibregl-popup-tip {
  border-top-color: #ffffff;
  border-bottom-color: #ffffff;
}

.candidate-popup .maplibregl-popup-close-button {
  color: #1a0f62;
  font-size: 16px;
  padding: 0 6px;
}
</style>
