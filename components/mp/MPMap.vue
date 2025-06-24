<template>
  <div class="bg-white rounded-2xl p-4 md:p-6 h-[450px] md:h-[500px] col-span-1 md:col-span-2 flex flex-col">
    <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2">แผนที่การลงพื้นที่</h3>
    <div class="flex-1 w-full rounded-lg overflow-hidden">
      <div ref="mapContainer" class="w-full h-full bg-gray-100">
        <div v-if="!map" class="flex items-center justify-center h-full">
          <p class="text-[#0A2940] text-sm">กำลังโหลดแผนที่...</p>
        </div>
        <div v-else-if="loading" class="flex items-center justify-center h-full">
          <p class="text-[#0A2940] text-sm">กำลังโหลดข้อมูลการลงพื้นที่...</p>
        </div>
        <div v-else-if="!fieldReports || fieldReports.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <p class="text-[#0A2940] text-sm">ยังไม่มีข้อมูลการลงพื้นที่</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface FieldReport {
  created_at?: string;
  date?: string;
  location_name?: string;
  description?: string;
  images?: string[];
  tags?: string[];
  latitude?: number | string;
  longitude?: number | string;
}

interface Props {
  fieldReports: FieldReport[];
  loading: boolean;
}

const props = defineProps<Props>();

const mapContainer = ref<HTMLElement | null>(null);
let map: maplibregl.Map | null = null;

const initMap = () => {
  if (!mapContainer.value) {
    console.log('Map container not found');
    return;
  }

  try {
    // สร้าง map instance
    map = new maplibregl.Map({
      container: mapContainer.value,
      style: 'https://api.maptiler.com/maps/basic/style.json?key=SPy8tbXAIMMPKadG7FvD',
      center: [100.5018, 13.7563], // พิกัดกรุงเทพฯ
      zoom: 5,
      attributionControl: false
    });

    // เพิ่ม attribution control
    map.addControl(new maplibregl.AttributionControl({
      compact: true
    }));

    // รอให้ map โหลดเสร็จแล้วเพิ่ม markers
    map.on('load', () => {
      addMarkersToMap();
    });

  } catch (error) {
    console.error('Error initializing map:', error);
  }
};

// ฟังก์ชันสำหรับเพิ่ม markers บนแผนที่
const addMarkersToMap = () => {
  if (!map || !props.fieldReports) {
    return;
  }

  // ลบ markers เก่าทั้งหมด
  const existingMarkers = document.querySelectorAll('.maplibregl-marker');
  existingMarkers.forEach(marker => marker.remove());

  // เพิ่ม markers ใหม่
  props.fieldReports.forEach((report, index) => {
    if (report.latitude && report.longitude) {
      const lat = parseFloat(String(report.latitude));
      const lng = parseFloat(String(report.longitude));
      
      if (!isNaN(lat) && !isNaN(lng)) {
        // สร้าง marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'maplibregl-marker';
        markerEl.style.backgroundImage = 'url(/images/pin-red.png)';
        markerEl.style.backgroundSize = 'contain';
        markerEl.style.backgroundRepeat = 'no-repeat';
        markerEl.style.width = '30px';
        markerEl.style.height = '30px';
        markerEl.style.cursor = 'pointer';

        // สร้าง popup content
        const popupContent = `
          <div class="p-3">
            <h3 class="font-semibold text-sm mb-1">${report.location_name || 'ไม่ระบุสถานที่'}</h3>
            <p class="text-xs text-gray-600 mb-1">${report.date ? new Date(report.date).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่'}</p>
            <p class="text-xs">${report.description || 'ไม่มีคำอธิบาย'}</p>
          </div>
        `;

        // สร้าง popup
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(popupContent);

        // สร้าง marker
        const marker = new maplibregl.Marker(markerEl)
          .setLngLat([lng, lat] as [number, number])
          .setPopup(popup)
          .addTo(map!);

        // เพิ่ม event listener สำหรับคลิก marker
        markerEl.addEventListener('click', () => {
          popup.addTo(map!);
        });
      }
    }
  });

  // ปรับ zoom และ center ถ้ามี markers
  const validReports = props.fieldReports.filter(report => 
    report.latitude && report.longitude && 
    !isNaN(parseFloat(String(report.latitude))) && 
    !isNaN(parseFloat(String(report.longitude)))
  );

  if (validReports.length > 0 && map) {
    const bounds = new maplibregl.LngLatBounds();
    validReports.forEach(report => {
      const lat = parseFloat(String(report.latitude));
      const lng = parseFloat(String(report.longitude));
      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.extend([lng, lat] as [number, number]);
      }
    });
    map.fitBounds(bounds, { padding: 50 });
  }
};

onMounted(() => {
  // เริ่มต้นแผนที่เมื่อมี field_reports
  if (props.fieldReports && props.fieldReports.length > 0) {
    nextTick(() => {
      initMap();
    });
  }
});

// เพิ่ม watcher สำหรับ fieldReports เพื่อเริ่มต้นแผนที่เมื่อมีข้อมูล
watch(() => props.fieldReports, (newValue) => {
  if (newValue && newValue.length > 0 && !map) {
    nextTick(() => {
      initMap();
    });
  }
  // อัปเดตแผนที่เมื่อข้อมูลเปลี่ยน
  else if (map) {
    addMarkersToMap();
  }
});

// ทำความสะอาด map เมื่อ component unmount
onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
.maplibregl-map {
  width: 100%;
  height: 100%;
}

.maplibregl-popup-content {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.maplibregl-popup-close-button {
  padding: 4px 8px;
  font-size: 16px;
  color: #666;
}

.maplibregl-popup-close-button:hover {
  background-color: #f0f0f0;
  color: #333;
}
</style> 