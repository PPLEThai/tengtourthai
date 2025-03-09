<template>
    <div class="h-full relative">
        <div ref="mapContainer" class="map-container"></div>
        <div class="map-controls flex flex-row gap-2">
            <button @click="zoomIn" class="text-primary">+</button>
            <button @click="zoomOut" class="text-primary">-</button>
            <button @click="resetZoom" class="text-primary">รีเซ็ต</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMockupStore } from "@/stores/mockupStore";
// import { useHackCityData } from "@/composables/useHackCityData";
// import type { HackCityItem } from "@/composables/useHackCityData";
import { selectedProvince, activeTab } from "@/composables/eventBus";
import type { Feature, LineString, Polygon } from "geojson";

const mapContainer = ref<HTMLElement | null>(null);
const mockupStore = useMockupStore();
const groupedData = computed(() => mockupStore.groupedData);
const scheduleData = computed(() => mockupStore.scheduleData);

// const { hackCityData } = useHackCityData();

let map: maplibregl.Map;
const zoomIn = () => map?.zoomIn();
const zoomOut = () => map?.zoomOut();
const resetZoom = () => map?.setZoom(5).setCenter([100.523186, 13.736717]);

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

@media (max-width: 768px) {
    .timeline-slider {
        max-width: 250px;
    }
}
</style>
