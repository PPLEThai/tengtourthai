<template>
    <div class="h-full relative">
        <!-- loading overlay -->
        <div v-if="isLoading" class="loading-overlay flex items-center justify-center">
            <div class="loading-spinner"></div>
            <div class="ml-2 text-white font-semibold">กำลังโหลดข้อมูล...</div>
        </div>
        <div ref="mapContainer" class="map-container"></div>
        <div class="map-controls flex flex-row gap-2">
            <button @click="zoomIn" class="text-primary">+</button>
            <button @click="zoomOut" class="text-primary">-</button>
            <button @click="resetZoom" class="text-primary">รีเซ็ต</button>
            <select v-model="selectedMonth" class="select select-bordered select-sm" @change="drawActDataLayer">
                <option v-for="month in availableMonths" :key="month" :value="month">
                    {{ formatMonthThai(month) }}
                </option>
            </select>
        </div>
        <div class="timeline-slider">
            <button @click="playTimeline" class="text-primary" :disabled="isPlaying">Play</button>
            <button @click="pauseTimeline" class="text-primary">Pause</button>
            <span class="text-black"> | {{ formattedDate }}</span>
            <input type="range" min="1" :max="daysInSelectedMonth" v-model.number="timelineValue"
                @input="updateKaitomTimeline">
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, type PropType } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { KaitomItem } from "@/composables/useKaitomData";
import type { ActMonthlyData } from "@/composables/useActData";
import { useKaitomStore } from "@/stores/kaitomStore";

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

const kaitomStore = useKaitomStore();
const isLoading = ref(false);
const mapContainer = ref<HTMLElement | null>(null);
const isDataReady = ref(false);

let map: maplibregl.Map;
const markers: maplibregl.Marker[] = [];
let interval: ReturnType<typeof setInterval> | null = null;
const isPlaying = ref(false);

const zoomIn = () => map?.zoomIn();
const zoomOut = () => map?.zoomOut();
const resetZoom = () => map?.setZoom(5).setCenter([100.523186, 13.736717]);

const timelineValue = ref(1);
const formattedDate = computed(() => {
    if (!selectedMonth.value) return '';

    const [year, month] = selectedMonth.value.split('-');
    // สร้างวันที่โดยใช้ค่า timelineValue
    return `${year}-${month.padStart(2, '0')}-${String(timelineValue.value).padStart(2, '0')}`;
});

const selectedMonth = ref<string>('');
const availableMonths = computed(() => {
    const months = Object.keys(props.actData).sort().reverse();
    if (months.length > 0 && !selectedMonth.value) {
        // หาเดือนปัจจุบัน
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        // ถ้ามีเดือนปัจจุบันในข้อมูล ให้เลือกเดือนปัจจุบัน ถ้าไม่มีให้เลือกเดือนล่าสุดในข้อมูล
        const monthToSelect = months.includes(currentMonth) ? currentMonth : months[0];
        selectedMonth.value = monthToSelect;
        // เรียกข้อมูลทันทีเมื่อได้เดือนที่ต้องการ
        kaitomStore.fetchKaitomDataByMonth(monthToSelect);
    }
    return months;
});

const daysInSelectedMonth = computed(() => {
    if (!selectedMonth.value) return 31;
    const [year, month] = selectedMonth.value.split('-');
    return new Date(parseInt(year), parseInt(month), 0).getDate();
});

const updateKaitomMarkers = () => {
    // isLoading.value = true;
    markers.forEach(marker => marker.remove());
    markers.length = 0;

    if (props.kaitomData.length > 0) {
        props.kaitomData.forEach((item: KaitomItem) => {
            // แสดงหมุดตามวันที่เลือกใน timeline
            const itemDate = new Date(item.date).toISOString().split('T')[0];
            if (itemDate <= formattedDate.value) {
                const marker = new maplibregl.Marker()
                    .setLngLat([item.longitude, item.latitude])
                    .setPopup(new maplibregl.Popup().setHTML(`
                        <h3>${item.location_name}</h3>
                        <p>${item.description || ''}</p>
                        <p><strong>โดย:</strong> ${item.full_name}</p>
                        <p><strong>วันที่:</strong> ${new Date(item.date).toLocaleDateString('th-TH')}</p>
                    `))
                    .addTo(map);
                markers.push(marker);
            }
        });
    }
    
    // delay ให้ map ได้วาดเสร็จ
    // setTimeout(() => {
    //     isLoading.value = false;
    // }, 500);
};

const updateKaitomTimeline = () => {
    updateKaitomMarkers(); // ฟังก์ชันอัปเดตข้อมูลแผนที่
};

const playTimeline = () => {
    if (isPlaying.value) return;
    isPlaying.value = true;

    if (timelineValue.value >= daysInSelectedMonth.value) {
        timelineValue.value = 1;
    }

    interval = setInterval(() => {
        if (timelineValue.value < daysInSelectedMonth.value) {
            timelineValue.value += 1;
        } else {
            if (interval !== null) {
                clearInterval(interval);
            }
            interval = null;
            isPlaying.value = false;
        }
        updateKaitomTimeline();
    }, 100);
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
    isLoading.value = true;
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
    } finally {
        isLoading.value = false;
    }
};

// เมื่อเปลี่ยนเดือน
watch(selectedMonth, async (newMonth) => {
    if (newMonth) {
        // isLoading.value = true;
        try {
            await kaitomStore.fetchKaitomDataByMonth(newMonth);
            const currentDate = new Date();
            const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
            
            // ถ้าเป็นเดือนปัจจุบัน ให้ใช้วันที่ปัจจุบัน
            if (newMonth === currentMonth) {
                timelineValue.value = currentDate.getDate();
            } else {
                // ถ้าเป็นเดือนอื่น ให้ใช้วันสุดท้ายของเดือน
                const [year, month] = newMonth.split('-');
                timelineValue.value = new Date(parseInt(year), parseInt(month), 0).getDate();
            }
            updateKaitomMarkers();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            // delay เล็กน้อยให้ UI มีเวลาอัพเดท
            // setTimeout(() => {
            //     isLoading.value = false;
            // }, 500);
        }
    }
});

const formatMonthThai = (monthStr: string) => {
    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const [year, month] = monthStr.split('-');
    const thaiYear = parseInt(year) + 543;
    return `${thaiMonths[parseInt(month) - 1]} ${thaiYear}`;
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
            // maxBounds: [[93.0, 3.0], [108.0, 22.0]]
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
    bottom: 45px;
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

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #FF6A13;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>