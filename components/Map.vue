<template>
  <div class="h-full">
    <div ref="mapContainer" class="map-container"></div>
    <div class="map-controls flex">
      <button @click="zoomIn" class="text-primary">+</button>
      <button @click="zoomOut" class="text-primary">-</button>
      <button @click="resetZoom" class="text-primary">รีเซ็ต</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// import { provinces } from "@/composables/provinces";
import { useMockupData } from "@/composables/mockupService";
import { selectedProvince } from "@/composables/eventBus"; // Import the event bus

const mapContainer = ref<HTMLElement | null>(null);
const { groupedData } = useMockupData();

let map: maplibregl.Map;

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
      maxZoom: 9, // กำหนดการซูมสูงสุด
    });

    map.on("load", async () => {
      const response = await fetch("/data/province.geojson");
      const geojsonData = await response.json();

      map.addSource("provinces", {
        type: "geojson",
        data: geojsonData,
      });

      const fillColorExpression: any[] = ["case"];
      console.log(groupedData.value)
      for (const provinceName in groupedData.value) {
        const province = groupedData.value[provinceName as keyof typeof groupedData.value];
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

      // Watch for changes in selectedProvince
      watch(selectedProvince, (newProvince) => {
        if (newProvince) {
          // ลบไฮไลท์ที่มีอยู่ก่อนหน้านี้
          if (map.getLayer("highlighted-province")) {
            map.removeLayer("highlighted-province");
          }
          if (map.getSource("highlighted-province")) {
            map.removeSource("highlighted-province");
          }

          // ค้นหา feature ที่ตรงกับจังหวัดที่เลือก
          const features = map.querySourceFeatures("provinces", {
            sourceLayer: "province-layer",
            filter: ["==", ["get", "ADM1_TH"], newProvince],
          });

          if (features.length > 0) {
            // เพิ่มไฮไลท์ใหม่
            map.addSource("highlighted-province", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: features,
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

      map.on("click", "province-layer", (e) => {
        if (e.features && e.features.length > 0) {
          const provinceName = e.features[0].properties.ADM1_TH;
          selectedProvince.value = provinceName; // Set the selected province
          console.log(`คุณคลิกที่ ${provinceName}`);
          console.log(provinceName)
        }
      });
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
  top: 100px;
  left: 10px;
  display: flex;
  flex-direction: column;
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
}

.map-controls button:hover {
  background-color: #f0f0f0;
}
</style>
