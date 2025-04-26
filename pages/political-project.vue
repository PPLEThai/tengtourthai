<template>
  <div class="flex flex-col md:flex-row h-full">
    <!-- แผนที่ประเทศไทย -->
    <div class="w-full md:w-1/2 h-[50%] md:h-full md:p-4">
      <div class="md:p-4 h-full">
        <div class="relative w-full h-full">
            <MapProject 
              ref="mapProjectRef"
              :provinces="provinces" 
              :projects="projects" 
              @province-click="handleProvinceClick"
            />
        </div>
      </div>
    </div>

    <!-- รายการโครงการ -->
    <div class="w-full md:w-1/2 h-[50%] md:h-full overflow-y-auto p-2 md:p-4">
      <div class="container mx-auto p-2 md:p-4">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-white text-xl md:text-2xl font-bold">วาระจังหวัด</h1>
          <button 
            v-if="selectedProvince" 
            @click="clearFilter"
            class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
          >
            แสดงทั้งหมด
          </button>
        </div>
        <div class="grid grid-cols-1 gap-2 md:gap-4">
          <div v-if="filteredProjects.length === 0 && selectedProvince" class="bg-white rounded-lg shadow-md p-4 text-center">
            <p class="text-gray-600 text-lg">--ไม่มีข้อมูล--</p>
          </div>
          <div 
            v-for="project in filteredProjects" 
            :key="project.Id" 
            class="bg-white rounded-lg shadow-md p-2 md:p-4 mb-2 md:mb-4"
            :class="{ 'ring-2 ring-blue-500': selectedProvince === project.จังหวัด.จังหวัด }"
          >
            <h2 class="text-lg md:text-xl font-semibold mb-1 md:mb-2">{{ project.วาระ }}</h2>
            <p class="text-gray-600 text-sm md:text-base mb-1 md:mb-2">จังหวัด: {{ project.จังหวัด.จังหวัด }}</p>
            <p class="text-gray-600 text-sm md:text-base mb-1 md:mb-2">สถานะ: {{ project.สถานะ }}</p>
            <p class="text-gray-600 text-sm md:text-base mb-1 md:mb-2">ระยะเวลา: {{ formatDate(project.วันที่เริ่ม) }} - {{ formatDate(project.วันที่สิ้นสุด) }}</p>
            <button 
              @click="showDetail(project)"
              class="mt-1 md:mt-2 bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-blue-600 text-sm md:text-base"
            >
              ดูรายละเอียด
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal สำหรับแสดงรายละเอียด -->
    <div 
      v-if="selectedProject" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-10"
      @click="closeModal"
    >
      <div 
        class="bg-white rounded-lg p-4 md:p-6 w-full md:max-w-2xl max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <h2 class="text-xl md:text-2xl font-bold mb-2 md:mb-4">{{ selectedProject.วาระ }}</h2>
        <div class="space-y-2 md:space-y-4">
          <div>
            <h3 class="font-semibold text-sm md:text-base">รายละเอียดวาระ:</h3>
            <div class="text-gray-700 text-sm md:text-base" v-html="renderMarkdown(selectedProject.รายละเอียดวาระ)"></div>
          </div>
          <div>
            <h3 class="font-semibold text-sm md:text-base">วิธีการขับเคลื่อน:</h3>
            <div class="text-gray-700 text-sm md:text-base" v-html="renderMarkdown(selectedProject.วิธีการขับเคลื่อน)"></div>
          </div>
          <div>
            <h3 class="font-semibold text-sm md:text-base">เป้าหมายระยะสั้น:</h3>
            <div class="text-gray-700 text-sm md:text-base" v-html="renderMarkdown(selectedProject.เป้าหมายระยะสั้น)"></div>
          </div>
          <div>
            <h3 class="font-semibold text-sm md:text-base">เป้าหมายระยะยาว:</h3>
            <div class="text-gray-700 text-sm md:text-base" v-html="renderMarkdown(selectedProject.เป้าหมายระยะยาว)"></div>
          </div>
        </div>
        <button 
          @click="selectedProject = null"
          class="mt-2 md:mt-4 bg-gray-500 text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-gray-600 text-sm md:text-base"
        >
          ปิด
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProvinces } from "@/composables/useProvince";
import { marked } from 'marked';

const { provinces } = useProvinces();

interface Project {
  Id: number;
  วาระ: string;
  วันที่เริ่ม: string;
  วันที่สิ้นสุด: string;
  รายละเอียดวาระ: string;
  วิธีการขับเคลื่อน: string;
  เป้าหมายระยะสั้น: string;
  เป้าหมายระยะยาว: string;
  สถานะ: string;
  แนบไฟล์: string | null;
  จังหวัด: {
    Id: number;
    จังหวัด: string;
  };
}

const projects = ref<Project[]>([]);
const selectedProject = ref<Project | null>(null);
const selectedProvince = ref<string | null>(null);

const mapProjectRef = ref();

// คำนวณรายการที่กรองแล้ว
const filteredProjects = computed(() => {
  if (!selectedProvince.value) return projects.value;
  return projects.value.filter(project => project.จังหวัด.จังหวัด === selectedProvince.value);
});

const handleProvinceClick = (provinceName: string) => {
  selectedProvince.value = provinceName;
  // เลื่อนไปยังรายการแรกของจังหวัดที่เลือก
  const firstProject = projects.value.find(p => p.จังหวัด.จังหวัด === provinceName);
  if (firstProject) {
    const element = document.querySelector(`[data-province="${provinceName}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

const clearFilter = () => {
  selectedProvince.value = null;
  // เรียกฟังก์ชัน clearHighlight จาก MapProject component
  mapProjectRef.value?.clearHighlight();
};

const fetchProjects = async () => {
  try {
    const response = await fetch('https://hackcity.pplethai.org/api/political-project?limit=1000');
    const data = await response.json();
    projects.value = data.list;
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const showDetail = (project: Project) => {
  selectedProject.value = project;
};

const renderMarkdown = (markdown: string) => {
  return marked(markdown);
};

const closeModal = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    selectedProject.value = null;
  }
};

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
}
</style>
