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

const mapContainer = ref<HTMLElement | null>(null);
const emit = defineEmits(['province-click']);

let map: maplibregl.Map;
const zoomIn = () => map?.zoomIn();
const zoomOut = () => map?.zoomOut();
const resetZoom = () => map?.setZoom(5).setCenter([100.523186, 13.736717]);

// เพิ่มฟังก์ชันสำหรับยกเลิก highlight
const clearHighlight = () => {
    if (map) {
        map.setFilter('province-highlight', ['==', ['get', 'ADM1_TH'], '']);
    }
};

// ส่งฟังก์ชันไปให้ parent component เรียกใช้
defineExpose({
    clearHighlight
});

const props = defineProps<{
    provinces: any;
    projects: any;
}>();

const drawPolygon = (data: any) => {
    if (data && data.length > 0) {
        const fillColorExpression: any[] = ["case"];
        
        // สร้าง Set ของจังหวัดที่มีโครงการ
        const provincesWithProjects = new Set(data.map((project: any) => project.จังหวัด.จังหวัด));
        
        // เพิ่มเงื่อนไขสำหรับแต่ละจังหวัด
        fillColorExpression.push(
            ["in", ["get", "ADM1_TH"], ["literal", Array.from(provincesWithProjects)]],
            "#FF6A13" // สีส้มสำหรับจังหวัดที่มีโครงการ
        );
        
        // สีเริ่มต้นสำหรับจังหวัดที่ไม่มีโครงการ
        fillColorExpression.push("#B9B9B9");

        // ตรวจสอบว่า source มีอยู่จริงก่อนที่จะเพิ่ม layer
        if (!map.getSource('provinces')) {
            console.warn('Source "provinces" not found');
            return;
        }

        // ลบเลเยอร์เก่าถ้ามี
        if (map.getLayer("province-layer")) {
            map.removeLayer("province-layer");
        }
        if (map.getLayer("states-layer-outline")) {
            map.removeLayer("states-layer-outline");
        }
        if (map.getLayer("province-highlight")) {
            map.removeLayer("province-highlight");
        }

        // เพิ่มเลเยอร์ใหม่
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

        // เพิ่มเลเยอร์สำหรับ highlight จังหวัดที่เลือก
        map.addLayer({
            id: "province-highlight",
            type: "fill",
            source: "provinces",
            paint: {
                "fill-color": "#FFD700", // สีทองสำหรับ highlight
                "fill-opacity": 0.5,
            },
            filter: ["==", ["get", "ADM1_TH"], ""] // เริ่มต้นไม่มีจังหวัดที่ถูกเลือก
        });

        // เพิ่ม event listener สำหรับการคลิกที่จังหวัด
        map.on('click', 'province-layer', (e) => {
            if (e.features && e.features.length > 0) {
                const provinceName = e.features[0].properties.ADM1_TH;
                // ส่ง event ไปยัง parent component
                emit('province-click', provinceName);
                
                // Highlight จังหวัดที่คลิก
                map.setFilter('province-highlight', [
                    '==', ['get', 'ADM1_TH'], provinceName
                ]);
            }
        });

        // เพิ่ม hover effect
        map.on('mouseenter', 'province-layer', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'province-layer', () => {
            map.getCanvas().style.cursor = '';
        });
    }
}

// เพิ่ม watch เพื่อติดตามการเปลี่ยนแปลงของ projects
watch(() => props.projects, (newProjects) => {
    console.log(newProjects);
    console.log(map);
    if (newProjects && map && map.isStyleLoaded()) {
        drawPolygon(newProjects);
    }
}, { immediate: true });

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
            center: [100.523186, 13.736717],
            zoom: 5,
            minZoom: 5,
            maxZoom: 11,
            // maxBounds: [
            //     [93.0, 3.0],
            //     [108.0, 22.0]
            // ]
        });

        map.on("load", async () => {
            try {
                const response = await fetch('/data/province.geojson');
                if (!response.ok) {
                    throw new Error('Failed to load province data');
                }
                const geojsonData = await response.json();

                map.addSource("provinces", {
                    type: "geojson",
                    data: geojsonData,
                });

                // // เรียก drawPolygon เพื่อวาดเลเยอร์หลังจาก source ถูกโหลดเสร็จ
                // if (props.projects) {
                //     drawPolygon(props.projects);
                // }
            } catch (error) {
                console.error('Error loading province data:', error);
            }
        });

        // เพิ่ม error handling สำหรับการโหลดแผนที่
        map.on('error', (e) => {
            console.error('Map error:', e.error);
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
