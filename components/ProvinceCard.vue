<template>
  <div class="card w-full bg-gray-800 shadow-lg p-4">
    <h3 class="text-xl font-bold">{{ province.name }}</h3>
    <p>เข้าพื้นที่ทั้งหมด {{ province.visits }} ครั้ง</p>
    <p class="text-sm text-gray-400">ล่าสุด {{ province.lastVisit }}</p>
    <div class="mt-4">
      <button class="btn btn-success btn-sm">รับฟังปัญหา</button>
      <button class="btn btn-warning btn-sm">หาเสียง</button>
      <button class="btn btn-info btn-sm">ติดตามงาน</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Province } from "@/types/province";

defineProps<{ province: Province }>();
</script>
