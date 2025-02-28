<template>
  <!-- Show selected province detail -->
<div v-if="province" class="mt-4 border border-gray-200 rounded-lg p-4 shadow-sm overflow-y-auto">
  <div v-if="province.visits > 0" class="flex flex-col md:flex-row gap-2">
    <img src="@/assets/images/teng-detail.png" alt="" class="w-10 h-10" />
    <div class="flex flex-col">
      <h2 class="text-lg md:text-xl font-bold mb-2">{{ province.name }}</h2>
      <div class="flex flex-col md:flex-row gap-1">
        <p class="text-sm text-gray-500 font-light">
          เข้าพื้นที่ทั้งหมด {{ province.visits }} ครั้ง |
        </p>
        <p class="text-sm text-gray-500 font-light">ล่าสุด {{ province.lastVisit }}</p>
      </div>

      <div v-if="province.actions && province.actions.length" class="flex flex-wrap space-x-2 mt-2">
        <span v-for="action in province.actions" :key="action" class="badge bg-green-300 text-sm font-light">{{ action }}</span>
      </div>
    </div>
    <div class="flex flex-col ml-auto mt-2 md:mt-0">
      <button class="btn btn-sm btn-outline btn-primary flex items-center" @click="showModal = true">
        ดูรายละเอียด
        <span class="text-primary">></span>
      </button>

      <Modal v-if="showModal" @close="showModal = false">
        <template v-slot:header>
          <h3 class="text-lg font-semibold">Facebook Posts</h3>
        </template>
        <template v-slot:body>
          <div v-for="(post, index) in province.posts" :key="index" class="mb-2">
            <a :href="post" target="_blank" class="text-blue-500 underline">{{ post }}</a>
          </div>
        </template>
        <template v-slot:footer>
          <button class="btn btn-sm btn-outline btn-primary" @click="showModal = false">
            ปิด
          </button>
        </template>
      </Modal>
    </div>
  </div>

  <div v-else class="flex flex-col justify-center items-center gap-2 text-sm text-gray-500 font-light">
    <img src="@/assets/images/teng-detail.png" alt="" class="w-20" />
    <div class="text-center">
      ตอนนี้ยังอยู่ในแผนการเดินทางครับ<br />
      แต่หากมีมีเรื่องไหนที่อยากส่งถึงผมก่อน ส่งมาได้เลยที่ <br />
      เพจ
      <a href="https://www.facebook.com/natthaphong.ruengpanyawut/" target="_blank" class="text-blue-500 underline">
        ณัฐพงษ์ เรืองปัญญาวุฒิ - Natthaphong Ruengpanyawut
      </a>
    </div>
  </div>
</div>

<!-- Show all provinces -->
<div v-else class="mt-4 rounded-lg overflow-y-auto">
  <div v-for="(details, name) in allProvinces" :key="name" class="border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
    <div class="flex flex-col md:flex-row gap-2">
      <img src="@/assets/images/teng-detail.png" alt="" class="w-10 h-10" />

      <div class="flex flex-col">
        <h2 class="text-lg md:text-xl font-bold mb-2">{{ name }}</h2>
        <div v-if="details.visits > 0" class="flex flex-col md:flex-row gap-1">
          <p class="text-sm text-gray-500 font-light">
            เข้าพื้นที่ทั้งหมด {{ details.visits }} ครั้ง |
          </p>
          <p class="text-sm text-gray-500 font-light">ล่าสุด {{ details.lastVisit }}</p>
        </div>
        <div v-else class="text-sm text-gray-500 font-light">
          อยู่ในแผนการเดินทาง แต่หากมีเรื่องไหนที่อยากส่งถึงผม ส่งมาได้เลยที่
          <a href="https://www.facebook.com/natthaphong.ruengpanyawut/" class="text-blue-500 underline">
            ณัฐพงษ์ เรืองปัญญาวุฒิ - Natthaphong Ruengpanyawut
          </a>
        </div>
        <div v-if="details.actions && details.actions.length" class="flex flex-wrap space-x-2 mt-2">
          <span v-for="action in details.actions" :key="action" class="badge bg-green-300 text-sm font-light">{{ action }}</span>
        </div>
      </div>

      <div class="flex flex-col ml-auto mt-2 md:mt-0">
        <button class="btn btn-sm btn-outline btn-primary flex items-center" @click="showModalAll = name">
          ดูรายละเอียด
          <span class="text-primary">></span>
        </button>

        <Modal v-if="showModalAll === name" @close="showModalAll = ''">
          <template v-slot:header>
            <h3 class="text-lg font-semibold">Facebook Posts</h3>
          </template>
          <template v-slot:body>
            <div v-for="(post, index) in allProvinces[name].posts" :key="index" class="mb-2">
              <a :href="post" target="_blank" class="text-blue-500 underline">{{ post }}</a>
            </div>
          </template>
          <template v-slot:footer>
            <button class="btn btn-sm btn-outline btn-primary" @click="showModalAll = ''">
              ปิด
            </button>
          </template>
        </Modal>
      </div>
      
    </div>
  </div>
</div>
  
</template>

<script setup lang="ts">
import { ref } from "vue";
import Modal from "@/components/Modal.vue";
defineProps<{
  province: {
    name: string;
    visits: number;
    lastVisit: string;
    actions?: string[];
    posts?: string[];
  } | null;
  allProvinces: Record<
    string,
    { visits: number; lastVisit: string; actions?: string[]; posts?: string[] }
  >;
}>();

const showModal = ref(false);
const showModalAll = ref('');
const selectedProvince = ref('');

function setSelectedProvince(name: string) {
  selectedProvince.value = name;
}
</script>
