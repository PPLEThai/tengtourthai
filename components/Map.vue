<template>
    <div class="h-full relative">
        <div ref="mapContainer" class="map-container"></div>
        <div class="map-controls flex flex-row gap-2">
            <button @click="zoomIn" class="text-primary">+</button>
            <button @click="zoomOut" class="text-primary">-</button>
            <button @click="resetZoom" class="text-primary">รีเซ็ต</button>
        </div>
        <div class="timeline-slider">
            <button @click="playTimeline" class="text-primary" :disabled="isPlaying">Play</button>
            <button @click="pauseTimeline" class="text-primary">Pause</button> 
            <span class="text-white"> | {{ formattedDate }}</span>
            <input type="range" min="0" max="30" v-model.number="timelineValue" @input="updateTimeline">
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMockupStore } from "@/stores/mockupStore";
import { useHackCityData } from "@/composables/useHackCityData"; // Import useHackCityData
import type { HackCityItem } from "@/composables/useHackCityData"; // Import HackCityItem interface
import { selectedProvince } from "@/composables/eventBus"; // Import the event bus
import type { Feature, LineString, Polygon } from "geojson"; // Import GeoJSON types
import { activeTab } from "@/composables/eventBus"; // Import activeTab from event bus

const mapContainer = ref<HTMLElement | null>(null);
const mockupStore = useMockupStore();
const groupedData = computed(() => mockupStore.groupedData);
const scheduleData = computed(() => mockupStore.scheduleData);

const { hackCityData } = useHackCityData(); // Get hackCityData

let map: maplibregl.Map;
const markers: maplibregl.Marker[] = []; // เก็บ markers ทั้งหมด
let interval: ReturnType<typeof setInterval> | null = null; // Correctly type the interval
const isPlaying = ref(false); // เพิ่มตัวแปร isPlaying

const zoomIn = () => {
    if (map) {
        map.zoomIn();
    }
};

const zoomOut = () => {
    if (map) {
        map.zoomOut();
    }
};

const resetZoom = () => {
    if (map) {
        map.setZoom(5);
        map.setCenter([100.523186, 13.736717]);
    }
};

const today = new Date(); // วันที่ปัจจุบัน
const timelineValue = ref(30); // เริ่มต้นที่ 30 วันก่อนหน้า
const formattedDate = computed(() => {
    const startDate = new Date(); // วันที่ปัจจุบัน
    startDate.setDate(startDate.getDate() - (30 - timelineValue.value)); // ย้อนหลังจาก 30 วันไปจนถึงวันนี้
    return startDate.toISOString().split('T')[0]; // แปลงเป็น YYYY-MM-DD
});

const updateTimeline = () => {
    updateMarkers(); // ฟังก์ชันอัปเดตข้อมูลแผนที่
};

const playTimeline = () => {
    if (isPlaying.value) return; // ถ้า isPlaying เป็น true ให้ return ออกไป
    isPlaying.value = true; // ตั้งค่า isPlaying เป็น true

    if (timelineValue.value >= 30) {
        timelineValue.value = 0;
    } else {
        timelineValue.value += 1;
    }

    interval = setInterval(() => {
        if (timelineValue.value < 30) {
            timelineValue.value += 1;
        } else {
            if (interval !== null) {
                clearInterval(interval);
            }
            interval = null;
            isPlaying.value = false; // ตั้งค่า isPlaying เป็น false เมื่อหยุดเล่น
        }
        updateTimeline();
    }, 500); // Adjust the speed of the timeline as needed
};

const pauseTimeline = () => {
    if (interval) {
        clearInterval(interval);
        interval = null;
        isPlaying.value = false; // ตั้งค่า isPlaying เป็น false เมื่อหยุดเล่น
    }
};

const updateMarkers = () => {
    // ลบ markers ที่มีอยู่ทั้งหมด
    markers.forEach(marker => marker.remove());
    markers.length = 0;

    // ลบ sources และ layers ที่มีอยู่ทั้งหมด
    map.getStyle().layers.forEach((layer) => {
        if (layer.id.startsWith("line-") || layer.id.startsWith("polygon-")) {
            if (map.getLayer(layer.id)) {
                map.removeLayer(layer.id);
            }
            if (map.getSource(layer.id)) {
                map.removeSource(layer.id);
            }
        }
    });

    // เพิ่ม markers ใหม่ตามวันที่ที่เลือก
    hackCityData.value.forEach((item: HackCityItem, index: number) => {
        if (new Date(item.created) <= new Date(formattedDate.value + "T00:00:00")) {
            if (item.geom.startsWith("POINT")) {
                const match = item.geom.match(/POINT\(([^)]+)\)/);
                if (match) {
                    const [lng, lat] = match[1].split(' ').map(Number);
                    // const popupContent = `
                    //     ${item.images.length > 0 ? `<img src="${item.images[0]}" alt="${item.name}" style="width:400px;height:auto;">` : ''}
                    //     <h3>${item.name}</h3>
                    //     <p>${item.detail}</p>
                    // `;
                    const popupContent = `
                        <h3>${item.name}</h3>
                        <p>${item.detail}</p>
                    `;
                    const marker = new maplibregl.Marker()
                        .setLngLat([lng, lat])
                        .setPopup(new maplibregl.Popup().setHTML(popupContent))
                        .addTo(map);
                    markers.push(marker);
                }
            } else if (item.geom.startsWith("LINESTRING")) {
                const match = item.geom.match(/LINESTRING\(([^)]+)\)/);
                if (match) {
                    const coordinates = match[1].split(',').map((coord: string) => coord.trim().split(' ').map(Number));
                    const lineString: Feature<LineString> = {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: coordinates
                        },
                        properties: {
                            name: item.name,
                            detail: item.detail
                        }
                    };
                    map.addSource(`line-${index}`, {
                        type: "geojson",
                        data: lineString
                    });
                    map.addLayer({
                        id: `line-${index}`,
                        type: "line",
                        source: `line-${index}`,
                        paint: {
                            "line-color": "#FF0000",
                            "line-width": 2
                        }
                    });

                    // ปักหมุดที่จุดแรกของ LINESTRING
                    const [lng, lat] = coordinates[0];
                    // const popupContent = `
                    //     ${item.images.length > 0 ? `<img src="${item.images[0]}" alt="${item.name}" style="width:400px;height:auto;">` : ''}
                    //     <h3>${item.name}</h3>
                    //     <p>${item.detail}</p>
                    // `;
                    const popupContent = `
                        <h3>${item.name}</h3>
                        <p>${item.detail}</p>
                    `;
                    const marker = new maplibregl.Marker()
                        .setLngLat([lng, lat])
                        .setPopup(new maplibregl.Popup().setHTML(popupContent))
                        .addTo(map);
                    markers.push(marker);
                }
            } else if (item.geom.startsWith("POLYGON")) {
                const match = item.geom.match(/POLYGON\(\(([^)]+)\)\)/);
                if (match) {
                    const coordinates = match[1].split(',').map((coord: string) => coord.trim().split(' ').map(Number));
                    const polygon: Feature<Polygon> = {
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [coordinates]
                        },
                        properties: {
                            name: item.name,
                            detail: item.detail
                        }
                    };
                    map.addSource(`polygon-${index}`, {
                        type: "geojson",
                        data: polygon
                    });
                    map.addLayer({
                        id: `polygon-${index}`,
                        type: "fill",
                        source: `polygon-${index}`,
                        paint: {
                            "fill-color": "#00FF00",
                            "fill-opacity": 0.5
                        }
                    });

                    // ปักหมุดที่จุดแรกของ POLYGON
                    const [lng, lat] = coordinates[0];
                    // const popupContent = `
                    //     ${item.images.length > 0 ? `<img src="${item.images[0]}" alt="${item.name}" style="width:400px;height:auto;">` : ''}
                    //     <h3>${item.name}</h3>
                    //     <p>${item.detail}</p>
                    // `;
                    const popupContent = `
                        <h3>${item.name}</h3>
                        <p>${item.detail}</p>
                    `;
                    const marker = new maplibregl.Marker()
                        .setLngLat([lng, lat])
                        .setPopup(new maplibregl.Popup().setHTML(popupContent))
                        .addTo(map);
                    markers.push(marker);
                }
            }
        }
    });
};

const drawGroupedDataLayer = (newGroupedData: any) => {
    if (Object.keys(newGroupedData).length > 0) {
        if (map.getLayer("province-layer")) {
            map.removeLayer("province-layer");
        }
        if (map.getLayer("states-layer-outline")) {
            map.removeLayer("states-layer-outline");
        }
        const fillColorExpression: any[] = ["case"];
        for (const provinceName in newGroupedData) {
            const province = newGroupedData[provinceName as keyof typeof newGroupedData];
            fillColorExpression.push(
                (["==", ["get", "ADM1_TH"], provinceName] as unknown) as string,
                province.visits > 0 ? "#FF6A13" : "#B9B9B9"
            );
        }

        fillColorExpression.push(("#B9B9B9" as unknown) as string); // สีเริ่มต้น

        map.addLayer({
            id: "province-layer",
            type: "fill",
            source: "provinces",
            paint: {
                "fill-color": (fillColorExpression as unknown) as string,
                "fill-opacity": 1,
            },
        });

        map.addLayer({
            id: "states-layer-outline",
            type: "line",
            source: "provinces",
            paint: {
                "line-color": "rgba(0, 0, 0, 1)",
                "line-width": 0.5,
            },
        });

        map.on("click", "province-layer", (e: any) => {
            if (e.features && e.features.length > 0) {
                const provinceName = e.features[0].properties.ADM1_TH;
                selectedProvince.value = provinceName; // Set the selected province

                // ลบไฮไลท์ที่มีอยู่ก่อนหน้านี้
                if (map.getLayer("highlighted-province")) {
                    map.removeLayer("highlighted-province");
                }
                if (map.getSource("highlighted-province")) {
                    map.removeSource("highlighted-province");
                }
            }
        });

        // Add markers for each hack city data point
        updateMarkers();
    }
}

const drawScheduleLayer = (newScheduleData: any) => {

    if (map.getLayer("province-layer")) {
        map.removeLayer("province-layer");
    }
    if (map.getLayer("states-layer-outline")) {
        map.removeLayer("states-layer-outline");
    }

    const fillColorExpression: any[] = ["case"];
    newScheduleData.forEach((item: any) => {
        fillColorExpression.push(
            (["==", ["get", "ADM1_TH"], item.province] as unknown) as string,
            item.status === "plan" ? "#3b82f6" : "#B9B9B9"
        );
    });

    fillColorExpression.push(("#B9B9B9" as unknown) as string); // สีเริ่มต้น

    map.addLayer({
        id: "province-layer",
        type: "fill",
        source: "provinces",
        paint: {
            "fill-color": (fillColorExpression as unknown) as string,
            "fill-opacity": 1,
        },
    });

    map.addLayer({
        id: "states-layer-outline",
        type: "line",
        source: "provinces",
        paint: {
            "line-color": "rgba(0, 0, 0, 1)",
            "line-width": 0.5,
        },
    });

    // เพิ่มไฮไลท์ใหม่หลังจากวาด layer ใหม่
    if (selectedProvince.value && selectedProvince.value !== "ทั้งหมด") {
        const feature = map.queryRenderedFeatures({
            layers: ["province-layer"],
            filter: ["==", ["get", "ADM1_TH"], selectedProvince.value || ""]
        })[0];

        if (feature) {
            // ลบไฮไลท์ที่มีอยู่ก่อนหน้านี้
            if (map.getLayer("highlighted-province")) {
                map.removeLayer("highlighted-province");
            }
            if (map.getSource("highlighted-province")) {
                map.removeSource("highlighted-province");
            }

            // เพิ่มไฮไลท์ใหม่
            map.addSource("highlighted-province", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [feature],
                },
            });

            map.addLayer({
                id: "highlighted-province",
                type: "line",
                source: "highlighted-province",
                paint: {
                    "line-color": "#FFFFFF",
                    "line-width": 2,
                },
            });
        }
    }
}

watch(selectedProvince, (newProvince) => {
    if (map) {
        if (newProvince === "ทั้งหมด") {
            if (map.getLayer("highlighted-province")) {
                map.removeLayer("highlighted-province");
            }
            if (map.getSource("highlighted-province")) {
                map.removeSource("highlighted-province");
            }
            return;
        }

        const feature = map.queryRenderedFeatures({
            layers: ["province-layer"],
            filter: ["==", ["get", "ADM1_TH"], newProvince || ""]
        })[0];

        // ลบไฮไลท์ที่มีอยู่ก่อนหน้านี้
        if (map.getLayer("highlighted-province")) {
            map.removeLayer("highlighted-province");
        }
        if (map.getSource("highlighted-province")) {
            map.removeSource("highlighted-province");
        }

        // เพิ่มไฮไลท์ใหม่
        map.addSource("highlighted-province", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [feature],
            },
        });

        map.addLayer({
            id: "highlighted-province",
            type: "line",
            source: "highlighted-province",
            paint: {
                "line-color": "#FFFFFF",
                "line-width": 2,
            },
        });

        // พาไปที่ขอบเขตของ polygon
        if (feature) {
            const bounds = new maplibregl.LngLatBounds();
            const geometry = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;

            // if (geometry.type === "Polygon") {
            //     geometry.coordinates[0].forEach((coord) => {
            //         bounds.extend(coord as [number, number]);
            //     });
            // } else if (geometry.type === "MultiPolygon") {
            //     geometry.coordinates.forEach(polygon => {
            //         polygon[0].forEach((coord) => {
            //             bounds.extend(coord as [number, number]);
            //         });
            //     });
            // }
            // map.fitBounds(bounds, { padding: 20 });
        }
    }
})

watch(activeTab, (newTab) => {
    if (newTab === 'fieldwork') {
        // ทำสิ่งที่ต้องการเมื่อ activeTab เป็น 'fieldwork'
        drawGroupedDataLayer(groupedData.value);
    } else if (newTab === 'schedule') {
        // ทำสิ่งที่ต้องการเมื่อ activeTab เป็น 'schedule'
        drawScheduleLayer(scheduleData.value);
    }

    // เพิ่มไฮไลท์ใหม่หลังจากเปลี่ยนแท็บ
    if (selectedProvince.value && selectedProvince.value !== "ทั้งหมด") {
        const feature = map.queryRenderedFeatures({
            layers: ["province-layer"],
            filter: ["==", ["get", "ADM1_TH"], selectedProvince.value || ""]
        })[0];

        if (feature) {
            // ลบไฮไลท์ที่มีอยู่ก่อนหน้านี้
            if (map.getLayer("highlighted-province")) {
                map.removeLayer("highlighted-province");
            }
            if (map.getSource("highlighted-province")) {
                map.removeSource("highlighted-province");
            }

            // เพิ่มไฮไลท์ใหม่
            map.addSource("highlighted-province", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [feature],
                },
            });

            map.addLayer({
                id: "highlighted-province",
                type: "line",
                source: "highlighted-province",
                paint: {
                    "line-color": "#FFFFFF",
                    "line-width": 2,
                },
            });
        }
    }
});

onMounted(() => {
    if (mapContainer.value) {
        map = new maplibregl.Map({
            container: mapContainer.value,
            style: {
                version: 8,
                sources: {},
                layers: [
                    {
                        id: "background",
                        type: "background",
                        paint: {
                            "background-color": "#002B49",
                        },
                    },
                ],
            },
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
            const response = await fetch("/data/province.geojson");
            const geojsonData = await response.json();

            map.addSource("provinces", {
                type: "geojson",
                data: geojsonData,
            });
            watch(groupedData, (newGroupedData: object) => {
                drawGroupedDataLayer(newGroupedData);
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
