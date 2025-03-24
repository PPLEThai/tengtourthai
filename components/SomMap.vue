<template>
    <div class="h-full relative">
        <!-- <div v-if="!isDataReady" class="loading-overlay">Loading...</div> -->
        <div ref="mapContainer" class="map-container"></div>
        <div class="map-controls flex flex-row gap-2">
            <button @click="zoomIn" class="text-primary">+</button>
            <button @click="zoomOut" class="text-primary">-</button>
            <button @click="resetZoom" class="text-primary">รีเซ็ต</button>
            <select v-model="selectedMonth" class="select select-bordered select-sm" @change="drawActDataLayer">
                <option value="all">ทุกเดือน</option>
                <option v-for="month in availableMonths" :key="month" :value="month" v-show="month !== 'all'">
                    {{ month }}
                </option>
            </select>
        </div>
        <div class="timeline-slider">
            <button @click="playTimeline" class="text-primary" :disabled="isPlaying">Play</button>
            <button @click="pauseTimeline" class="text-primary">Pause</button>
            <span class="text-black"> | {{ formattedDate }}</span>
            <input type="range" min="0" max="7" v-model.number="timelineValue" @input="updateKaitomTimeline">
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, type PropType } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { KaitomItem } from "@/composables/useKaitomData";
import type { ActMonthlyData } from "@/composables/useActData";

const props = defineProps({
    kaitomData: {
        type: Array as PropType<KaitomItem[]>,
        required: true
    },
    actData: {
        type: Object as PropType<ActMonthlyData>,
        required: true
    }
});

const mapContainer = ref<HTMLElement | null>(null);
const isDataReady = ref(false);

let map: maplibregl.Map;
const markers: maplibregl.Marker[] = [];
let interval: ReturnType<typeof setInterval> | null = null;
const isPlaying = ref(false);

const zoomIn = () => map?.zoomIn();
const zoomOut = () => map?.zoomOut();
const resetZoom = () => map?.setZoom(5).setCenter([100.523186, 13.736717]);

const timelineValue = ref(7);
const formattedDate = computed(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (7 - timelineValue.value));
    return startDate.toISOString().split('T')[0];
});

const selectedMonth = ref<string>('all');
const availableMonths = computed(() => {
    return ['all', ...Object.keys(props.actData)].sort();
});

const updateKaitomMarkers = () => {
    markers.forEach(marker => marker.remove());
    markers.length = 0;

    if (props.kaitomData.length > 0) {
        props.kaitomData.forEach((item: KaitomItem) => {
            if (new Date(item.date) <= new Date(formattedDate.value + "T00:00:00")) {
                const marker = new maplibregl.Marker()
                    .setLngLat([item.longitude, item.latitude])
                    .setPopup(new maplibregl.Popup().setHTML(`
                        <h3>${item.location_name}</h3>
                        <p>${item.description}</p>
                        <p><strong>โดย:</strong> ${item.full_name}</p>
                        <p><strong>วันที่:</strong> ${new Date(item.date).toLocaleDateString()}</p>
                    `))
                    .addTo(map);
                markers.push(marker);
            }
        });
    }
};

const updateKaitomTimeline = () => {
    updateKaitomMarkers(); // ฟังก์ชันอัปเดตข้อมูลแผนที่
};

const playTimeline = () => {
    if (isPlaying.value) return; // ถ้า isPlaying เป็น true ให้ return ออกไป
    isPlaying.value = true; // ตั้งค่า isPlaying เป็น true

    if (timelineValue.value >= 7) {
        timelineValue.value = 0;
    } else {
        timelineValue.value += 1;
    }

    interval = setInterval(() => {
        if (timelineValue.value < 7) {
            timelineValue.value += 1;
        } else {
            if (interval !== null) {
                clearInterval(interval);
            }
            interval = null;
            isPlaying.value = false; // ตั้งค่า isPlaying เป็น false เมื่อหยุดเล่น
        }
        updateKaitomTimeline();
    }, 500); // Adjust the speed of the timeline as needed
};

const pauseTimeline = () => {
    if (interval) {
        clearInterval(interval);
        interval = null;
        isPlaying.value = false; // ตั้งค่า isPlaying เป็น false เมื่อหยุดเล่น
    }
};

const calculateTotalActivities = (province: string) => {
    let total = 0;
    if (selectedMonth.value === 'all') {
        // รวมจำนวนกิจกรรมจากทุกเดือน
        Object.values(props.actData).forEach(monthData => {
            if (monthData[province]) {
                total += monthData[province];
            }
        });
    } else {
        // รวมจำนวนกิจกรรมเฉพาะเดือนที่เลือก
        const monthData = props.actData[selectedMonth.value];
        if (monthData && monthData[province]) {
            total = monthData[province];
        }
    }
    return total;
};

const getProvinceColor = (total: number) => {
    // กำหนดเฉดสีตามจำนวนกิจกรรม
    if (total === 0) return '#B9B9B9';
    if (total <= 3) return '#FFE5CC';
    if (total <= 6) return '#FFB366';
    if (total <= 9) return '#FF8000';
    return '#FF6A13'; // มากกว่า 9 กิจกรรม
};

const drawActDataLayer = async () => {
    try {
        const response = await fetch("/data/province.geojson");
        const geojsonData = await response.json() as GeoJSON.FeatureCollection;

        if (!map.getSource("provinces")) {
            map.addSource("provinces", {
                type: "geojson",
                data: geojsonData
            });
        }

        if (map.getLayer("province-layer")) {
            map.removeLayer("province-layer");
        }
        if (map.getLayer("states-layer-outline")) {
            map.removeLayer("states-layer-outline");
        }

        const fillColorExpression: (string | string[])[] = [
            "match",
            ["get", "ADM1_TH"]
        ];
        
        // รวบรวมรายชื่อจังหวัดทั้งหมดจากทุกเดือน
        const allProvinces = new Set<string>();
        Object.values(props.actData).forEach(monthData => {
            Object.keys(monthData).forEach(province => {
                allProvinces.add(province);
            });
        });
        
        // วนลูปผ่านทุกจังหวัด
        Array.from(allProvinces).sort().forEach(province => {
            const total = calculateTotalActivities(province);
            fillColorExpression.push(province, getProvinceColor(total));
        });

        fillColorExpression.push("#B9B9B9"); // สีเริ่มต้นสำหรับจังหวัดที่ไม่มีข้อมูล

        map.addLayer({
            id: "province-layer",
            type: "fill",
            // @ts-ignore
            source: "provinces",
            paint: {
                // @ts-ignore
                "fill-color": fillColorExpression,
                "fill-opacity": 0.7,
            },
        });

        map.addLayer({
            id: "states-layer-outline",
            type: "line",
            source: "provinces",
            paint: {
                "line-color": "#000000",
                "line-width": 0.5,
            },
        });

        // เพิ่ม popup แสดงจำนวนกิจกรรม
        map.on("click", "province-layer", (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
            if (e.features && e.features.length > 0) {
                const provinceName = e.features[0].properties.ADM1_TH;
                const total = calculateTotalActivities(provinceName);
                
                new maplibregl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`
                        <h3>${provinceName}</h3>
                        <p>จำนวนกิจกรรมทั้งหมด: ${total}</p>
                    `)
                    .addTo(map);
            }
        });
    } catch (error) {
        console.error("Error loading province data:", error);
    }
};

onMounted(() => {
    if (mapContainer.value) {
        map = new maplibregl.Map({
            container: mapContainer.value,
            style: "https://api.maptiler.com/maps/basic/style.json?key=SPy8tbXAIMMPKadG7FvD",
            center: [100.523186, 13.736717],
            zoom: 5,
            minZoom: 5,
            maxZoom: 11,
            maxBounds: [[93.0, 3.0], [108.0, 22.0]]
        });

        map.on("load", () => {
            // เฝ้าดูการเปลี่ยนแปลงของ actData
            watch(() => props.actData, (newActData) => {
                if (Object.keys(newActData).length > 0) {
                    drawActDataLayer();
                }
            }, { immediate: true });

            // เฝ้าดูการเปลี่ยนแปลงของ kaitomData
            watch(props.kaitomData, (newValue) => {
                if (newValue.length === 0) {
                    const intervalId = setInterval(() => {
                        if (props.kaitomData.length > 0) {
                            clearInterval(intervalId);
                            updateKaitomMarkers();
                        }
                    }, 500);
                } else {
                    updateKaitomMarkers();
                }
            }, { immediate: true });
        });
    }
});
</script>

<style>
.map-container {
    width: 100%;
    height: 100%;
}

.map-controls {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    /* flex-direction: column; */
    gap: 5px;
}

.map-controls button {
    background-color: #fff;
    border: none;
    padding: 5px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    min-width: 40px;
}

.map-controls button:hover {
    background-color: #f0f0f0;
}

.timeline-slider {
    position: absolute;
    bottom: 20px;
    left: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    /* เพิ่ม flex-wrap เพื่อให้รองรับ responsive */
}

.timeline-slider input[type="range"] {
    width: 100%;
    /* เปลี่ยนเป็น 100% เพื่อให้รองรับ responsive */
    max-width: 300px;
    /* กำหนด max-width เพื่อไม่ให้กว้างเกินไป */
}

@media (max-width: 768px) {
    .timeline-slider {
        max-width: 250px;
    }
}

.map-controls .select {
    background-color: white;
    border: none;
    font-size: 14px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    min-width: 120px;
}

.map-controls .select:focus {
    outline: none;
    border-color: #FF6A13;
}
</style>