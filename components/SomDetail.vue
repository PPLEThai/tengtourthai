<template>
    <div class="card bg-base-100 md:h-full w-full shadow-xl rounded-none px-4 py-6 overflow-y-auto">
        <div class="flex flex-row gap-2">
            <div class="flex flex-col gap-2">
                <img src="@/assets/images/som-logo.png" alt="logo" class="w-6">
            </div>
            <div class="flex flex-col">
                <h1 class="text-xl md:text-2xl font-bold">กิจกรรมส้มทั่วไทย พรรคประชาชน</h1>
                <h4 class="text-gray-500 text-sm">กระจายตัวทำงานทั่วประเทศ เพื่อเจ้านายที่เป็นประชาชน</h4>
            </div>
        </div>

        <!-- Tabs -->
        <div class="flex flex-row gap-2 mt-6">
            <button 
                class="w-1/2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-300"
                :class="[
                    currentTab === 'activities' 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                @click="currentTab = 'activities'"
            >
                <div class="flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    กิจกรรม
                </div>
            </button>
            <button 
                class="w-1/2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-300"
                :class="[
                    currentTab === 'leaderboard' 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                @click="currentTab = 'leaderboard'"
            >
                <div class="flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    Leader Board
                </div>
            </button>
        </div>

        <!-- Activities Tab -->
        <div v-if="currentTab === 'activities'" class="mt-4">
            <div class="divider text-primary">ข้อมูลกิจกรรมที่ผ่านมา</div>
            <div class="">
                <div v-for="(item, index) in displayedItems" :key="index"
                    class="card bg-white shadow-md rounded-md p-4 mb-4 flex flex-row">
                    <div v-if="item.images && item.images.length > 0" class="w-1/4">
                        <img :src="'https://img.pplethai.org/unsafe/rs:fit:1000:1000:1/plain/' + encodeURIComponent(item.images[0])"
                            alt="activity image" class="w-full h-auto rounded-md">
                    </div>
                    <div class="w-3/4 pl-4">
                        <h3 class="text-lg font-bold">{{ truncateText(item.location_name, 100) }}</h3>
                        <p class="text-sm font-light">ผู้นำเข้าข้อมูล: {{ item.full_name }}</p>
                        <p class="text-sm font-light">วันที่: {{ formatThaiDate(item.date) }}</p>
                        <p v-if="item.description" class="text-sm font-light">คำอธิบาย: {{ truncateText(item.description,
                            300) }}</p>
                    </div>
                </div>

                <div v-if="hasMoreItems" class="flex justify-center mt-4 mb-4">
                    <button @click="loadMore" class="btn btn-primary text-white w-full">ดูเพิ่มเติม</button>
                </div>
            </div>
        </div>

        <!-- Leader Board Tab -->
        <div v-if="currentTab === 'leaderboard'" class="mt-4">
            <div class="divider text-primary">สถิติการเข้าพื้นที่</div>
            <div class="overflow-x-auto">
                <table class="table w-full">
                    <thead>
                        <tr>
                            <th>อันดับ</th>
                            <th>ชื่อ-นามสกุล</th>
                            <th>จำนวนครั้ง</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(leader, index) in leaderboard" :key="index" 
                            :class="{ 'bg-primary text-white': index < 3 }">
                            <td>
                                <div v-if="index === 0" class="text-2xl">🥇</div>
                                <div v-else-if="index === 1" class="text-2xl">🥈</div>
                                <div v-else-if="index === 2" class="text-2xl">🥉</div>
                                <div v-else>{{ index + 1 }}</div>
                            </td>
                            <td>{{ leader.name }}</td>
                            <td>{{ leader.count }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { KaitomItem } from "@/composables/useKaitomData";
import { ref, computed } from 'vue';

const props = defineProps({
    kaitomData: {
        type: Array as PropType<KaitomItem[]>,
        required: true
    }
});

const currentTab = ref('activities');
const itemsPerPage = 20;
const currentPage = ref(1);

// คำนวณรายการที่จะแสดงตามจำนวนหน้าปัจจุบัน
const displayedItems = computed(() => {
    const reversedData = [...props.kaitomData].reverse();
    return reversedData.slice(0, currentPage.value * itemsPerPage);
});

// ตรวจสอบว่ายังมีรายการเพิ่มเติมหรือไม่
const hasMoreItems = computed(() => {
    return displayedItems.value.length < props.kaitomData.length;
});

// คำนวณ Leader Board
const leaderboard = computed<Array<{ name: string; count: number }>>(() => {
    const visitCounts = new Map<string, number>();
    
    props.kaitomData.forEach(item => {
        const name = item.full_name || 'ไม่ระบุชื่อ';
        const count = visitCounts.get(name) || 0;
        visitCounts.set(name, count + 1);
    });
    
    return Array.from(visitCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
});

// โหลดข้อมูลเพิ่มเติม
const loadMore = () => {
    currentPage.value += 1;
};

const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const formatThaiDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
};
</script>

<style scoped>
.tab {
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
    color: #6B7280;
}

.tab:hover {
    background-color: rgba(255, 106, 19, 0.1);
    color: #FF6A13;
}

.tab-active {
    background-color: white;
    color: #FF6A13;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table th, .table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

.table th {
    background-color: #f3f4f6;
    font-weight: 600;
}
</style>