<template>
    <div class="h-full relative">
        <!-- <div v-if="!isDataReady" class="loading-overlay">Loading...</div> -->
        <div ref="mapContainer" class="map-container"></div>
        <div class="map-controls flex flex-row gap-2">
            <button @click="zoomIn" class="text-primary">+</button>
            <button @click="zoomOut" class="text-primary">-</button>
            <button @click="resetZoom" class="text-primary">รีเซ็ต</button>
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
import { onMounted, ref, watch, computed } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps({
    kaitomData: {
        type: Array as PropType<KaitomItem[]>,
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

onMounted(() => {

    if (mapContainer.value) {
        map = new maplibregl.Map({
            container: mapContainer.value,
            // style: "https://demotiles.maplibre.org/style.json",
            style: "https://api.maptiler.com/maps/basic/style.json?key=SPy8tbXAIMMPKadG7FvD",
            center: [100.523186, 13.736717], // ศูนย์กลางประเทศไทย
            zoom: 5,
            minZoom: 5, // กำหนดการซูมต่ำสุด
            maxZoom: 11, // กำหนดการซูมสูงสุด
            maxBounds: [
                [93.0, 3.0], // พิกัดมุมซ้ายล่าง
                [108.0, 22.0]  // พิกัดมุมขวาบน
            ] // กำหนดขอบเขตการเลื่อนแผนที่
        });

        map.on("load", async () => {
            watch(props.kaitomData, (newValue) => {
                if (newValue.length === 0) {
                    const intervalId = setInterval(() => {
                        if (props.kaitomData.length > 0) {
                            clearInterval(intervalId);
                            console.log(props.kaitomData);
                            updateKaitomMarkers();
                        }
                    }, 500); // ตรวจสอบทุกๆ 500 มิลลิวินาที
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
</style>