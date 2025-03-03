<template>
    <div class="card bg-base-100 md:h-full w-full shadow-xl rounded-md px-4 py-6 overflow-y-auto"
        @click.self="showDropdown = false">
        <!-- header -->
        <div class="flex flex-row gap-2">
            <div class="flex flex-col gap-2">
                <img src="@/assets/images/teng-logo.png" alt="logo" class="w-10">
            </div>
            <div class="flex flex-col">
                <h1 class="text-xl md:text-2xl font-bold">ค้นหากิจกรรม เท้งทั่วไทย</h1>
                <h4 class="text-gray-500 text-sm">พร้อมเดินทางไปพบปะพี่น้องประชาชนทั่วประเทศ</h4>
            </div>
        </div>

        <!-- legend -->
        <div class="mt-4 text-sm">
            <div v-if="activeTab === 'fieldwork'" class="flex flex-row gap-2">
                <div>
                    จังหวัด |
                </div>
                <div class="flex items-center">
                    <div class="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                    <span>ไปมาแล้ว</span>
                </div>
                <div class="flex items-center">
                    <div class="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
                    <span>ยังไม่ได้ไป</span>
                </div>
            </div>
            <div v-if="activeTab === 'schedule'" class="flex flex-row gap-2">
                <div>
                    จังหวัด |
                </div>
                <div class="flex items-center">
                    <div class="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    <span>อยู่ในกำหนดการ</span>
                </div>
                <div class="flex items-center">
                    <div class="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
                    <span>ยังไม่มีกำหนดการ</span>
                </div>
            </div>
        </div>

        <!-- Autocomplete input -->
        <div class="relative mt-4">
            <input type="text" v-model="searchQuery" placeholder="ค้นหาจังหวัด..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                @focus="showDropdown = true" />
            <button v-if="searchQuery" @click="clearSearch"
                class="absolute right-2 top-2 text-gray-500 hover:text-black">
                x
            </button>

            <div v-if="showDropdown && filteredProvinces.length > 0"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div class="block px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="selectProvince('ทั้งหมด')">
                    ทั้งหมด
                </div>
                <div v-for="province in filteredProvinces" :key="province.id"
                    class="block px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="selectProvince(province.name)">
                    {{ province.name }}
                </div>
            </div>
        </div>

        <!-- btn group -->
        <div>
            <div class="join w-full mt-4 border border-gray-300 rounded-lg">
                <button class="join-item btn w-1/2"
                    :class="activeTab === 'fieldwork' ? 'bg-orange-500 text-white' : 'btn-ghost'"
                    @click="setActiveTab('fieldwork')">
                    การเข้าพื้นที่
                </button>
                <button class="join-item btn w-1/2"
                    :class="activeTab === 'schedule' ? 'bg-orange-500 text-white' : 'btn-ghost'"
                    @click="setActiveTab('schedule')">
                    กำหนดการ
                </button>
            </div>
        </div>

        <!-- card selected province detail -->
        <ProvinceDetail v-if="activeTab === 'fieldwork'" :province="selectedProvinceData" :allProvinces="groupedData" />
        <ScheduleDetail v-if="activeTab === 'schedule'" :province="selectedProvinceData" :scheduleData="scheduleData" :selectedProvince="selectedProvince" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import ProvinceDetail from "@/components/ProvinceDetail.vue";
import ScheduleDetail from "@/components/ScheduleDetail.vue";
import { provinces } from "@/composables/provinces";
import { useMockupStore } from "@/stores/mockupStore";
import { selectedProvince, activeTab } from "@/composables/eventBus"; // Import the event bus

const selectedProvinceId = ref<string | null>(null);
const searchQuery = ref("");
const showDropdown = ref(false);

const mockupStore = useMockupStore();
const groupedData = computed(() => mockupStore.groupedData);
const scheduleData = computed(() => mockupStore.scheduleData);

const filteredProvinces = computed(() => {
    if (!searchQuery.value || searchQuery.value === 'ทั้งหมด') return provinces;
    const query = searchQuery.value.toLowerCase();
    return provinces.filter((province: { name: string; }) => province.name.toLowerCase().includes(query));
});

const selectedProvinceData = computed(() => {
    if (searchQuery.value === 'ทั้งหมด') {
        return null; // Return null or handle as needed to show all data
    }
    const province = provinces.find((province: { id: string; }) => province.id === selectedProvinceId.value) || null;
    if (province) {
        const details = (groupedData.value as Record<string, any>)[province.name] || {};
        return {
            name: province.name,
            visits: details.visits || 0,
            lastVisit: details.lastVisit || '',
            actions: details.actions || [],
            posts: details.posts || []
        };
    }
    return null;
});

const selectProvince = (name: string) => {
    if (name === 'ทั้งหมด') {
        selectedProvinceId.value = null;
    } else {
        selectedProvinceId.value = provinces.find((province: { name: string; }) => province.name === name)?.id || null;
    }
    searchQuery.value = name;
    selectedProvince.value = name; 
    showDropdown.value = false;
};

const clearSearch = () => {
    searchQuery.value = '';
    selectedProvinceId.value = null;
    selectedProvince.value = 'ทั้งหมด'; // Set to 'ทั้งหมด' to show all data
    showDropdown.value = false;
};

const setActiveTab = (tab: string) => {
    activeTab.value = tab;
};

watch(selectedProvince, (newProvince) => {
    if (newProvince) {
        selectProvince(newProvince);
    }
});

onMounted(() => {
});
</script>
