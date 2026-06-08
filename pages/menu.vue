<template>
  <div class="min-h-full w-full px-4 py-10 md:py-16">
    <div class="max-w-4xl mx-auto">
      <!-- หัวข้อ -->
      <div class="text-center">
        <h1 class="text-3xl md:text-4xl font-heading font-medium text-secondary">สารบัญ</h1>
        <p class="mt-2 mb-6 text-base md:text-lg text-muted-foreground">เลือกหัวข้อที่ต้องการเข้าชม</p>
      </div>

      <!-- การ์ดเมนู -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
        <NuxtLink v-for="item in menuItems" :key="item.to" :to="item.to"
          class="menu-card group flex items-center gap-4 rounded-2xl bg-white hover:bg-white border border-black/5 hover:border-primary p-5 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <!-- ไอคอน -->
          <div
            class="menu-icon shrink-0 grid place-items-center h-14 w-14 rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-primary-button group-hover:text-primary-foreground transition-colors duration-200"
            v-html="item.icon" />

          <!-- ข้อความ -->
          <div class="flex-1 min-w-0">
            <div class="text-base md:text-lg font-heading font-medium text-secondary leading-snug">{{ item.label }}</div>
            <div class="text-sm text-muted-foreground mt-0.5 leading-snug">{{ item.description }}</div>
          </div>

          <!-- ลูกศร -->
          <svg class="shrink-0 h-5 w-5 text-black/30 group-hover:text-primary transition-colors duration-200" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'สารบัญ | ส้มทั่วไทย พรรคประชาชน',
  meta: [
    { name: 'description', content: 'สารบัญรวมเมนูหลักของเว็บไซต์ส้มทั่วไทย พรรคประชาชน' }
  ]
});

const menuItems = [
  {
    label: 'ส้มทั่วไทย',
    description: 'การเดินทางขององคาพยพ',
    to: '/',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  },
  {
    label: 'บริจาค',
    description: 'ข้อมูลการสนับสนุนพรรค',
    to: '/pple-donation',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  },
  {
    label: 'อาสาส้ม',
    description: 'เครือข่ายอาสาสมัครพื้นที่',
    to: '/volunteers',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
  {
    label: 'สถิติการบ่มเพาะว่าที่ผู้สมัคร',
    description: 'เส้นทางบ่มเพาะว่าที่ผู้สมัคร',
    to: '/candidate-funnel',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
  }
];
</script>

<style scoped>
.menu-icon :deep(svg) {
  width: 1.75rem;
  height: 1.75rem;
}
</style>
