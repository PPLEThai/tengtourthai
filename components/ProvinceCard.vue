<template>
  <div class="flex flex-col w-full bg-secondary text-secondary-foreground rounded-lg shadow-lg p-4">
    <h3 class="text-xl font-heading font-medium">{{ province.name }}</h3>
    <p>เข้าพื้นที่ทั้งหมด {{ province.visits }} ครั้ง</p>
    <p class="text-sm text-white/60">ล่าสุด {{ province.lastVisit }}</p>
    <div class="mt-4 flex flex-wrap gap-2">
      <PButton size="sm" variant="default">รับฟังปัญหา</PButton>
      <PButton size="sm" variant="secondary">หาเสียง</PButton>
      <PButton size="sm" variant="outline">ติดตามงาน</PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Province } from "@/types/province";

defineProps<{ province: Province }>();
</script>
