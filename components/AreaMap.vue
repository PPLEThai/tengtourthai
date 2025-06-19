<template>
  <div class="w-full h-full relative">
    <div ref="mapContainer" class="w-full h-full"></div>
    <div class="absolute bottom-10 right-4 bg-white p-4 rounded-lg shadow-lg">
      <div class="flex items-center mb-2">
        <div class="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
        <span>การเข้าพื้นที่</span>
      </div>
      <div class="flex items-center">
        <div class="w-6 h-6 bg-red-500 rounded-full mr-2"></div>
        <span>ปัญหา/ข้อเสนอนโยบาย</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { AreaData, FieldworkData } from '@/services/areaService';

export default defineComponent({
  name: 'AreaMap',
  props: {
    areaData: {
      type: Array as () => AreaData[],
      required: true
    },
    fieldworkData: {
      type: Array as () => FieldworkData[],
      required: true
    }
  },
  setup(props) {
    const mapContainer = ref<HTMLElement | null>(null);
    let map: maplibregl.Map | null = null;

    const createMarkers = () => {
      if (!map) return;

      const markers = document.querySelectorAll('.maplibregl-marker');
      markers.forEach(marker => marker.remove());

      const bounds = new maplibregl.LngLatBounds();

      props.areaData.forEach(item => {
        const [lng, lat] = item.geom.replace('POINT(', '').replace(')', '').split(' ').map(Number);
        bounds.extend([lng, lat]);
        
        const el = document.createElement('div');
        el.className = 'marker policy';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundImage = 'url(/images/pin-red.png)';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';
        new maplibregl.Marker({element: el})
          .setLngLat([lng, lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">${item.name}</h3>
                  <p class="text-sm">${item.detail}</p>
                  ${item.images.length > 0 ? `<img src="https://img.pplethai.org/unsafe/rs:fit:1000:1000:1/plain/${encodeURIComponent(item.images[0])}" class="w-full mt-2" />` : ''}
                </div>
              `)
          )
          .addTo(map as maplibregl.Map);
      });

      props.fieldworkData.forEach(item => {
        const lng = item.longitude;
        const lat = item.latitude;
        bounds.extend([lng, lat]);
        
        const el = document.createElement('div');
        el.className = 'marker fieldwork';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundImage = 'url(/images/pin-blue.png)';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';

        new maplibregl.Marker({element: el})
          .setLngLat([lng, lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">${item.location_name}</h3>
                  <p class="text-sm">${item.full_name} (${item.role})</p>
                  <p class="text-sm">${item.district}, ${item.subdistrict}, ${item.province}</p>
                  ${item.description ? `<p class="text-sm mt-2">${item.description}</p>` : ''}
                  ${item.images.length > 0 ? `<img src="https://img.pplethai.org/unsafe/rs:fit:1000:1000:1/plain/${encodeURIComponent(item.images[0])}" class="w-full mt-2" />` : ''}
                </div>
              `)
          )
          .addTo(map as maplibregl.Map);
      });

      if (props.areaData.length > 0 || props.fieldworkData.length > 0) {
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
    };

    onMounted(() => {
      if (!mapContainer.value) return;

      map = new maplibregl.Map({
        container: mapContainer.value,
        style: 'https://api.maptiler.com/maps/basic/style.json?key=SPy8tbXAIMMPKadG7FvD',
        center: [100.523186, 13.736717],
        zoom: 6
      });

      map.on('load', () => {
        createMarkers();
      });
    });

    watch(() => [props.areaData, props.fieldworkData], () => {
      createMarkers();
    }, { deep: true });

    onUnmounted(() => {
      if (map) {
        map.remove();
        map = null;
      }
    });

    return {
      mapContainer
    };
  }
});
</script>

<style scoped>
.marker {
  background-image: url('/marker.png');
  background-size: cover;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style> 