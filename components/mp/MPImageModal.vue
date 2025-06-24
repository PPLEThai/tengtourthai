<template>
  <div v-if="show" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click="closeModal">
    <div class="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden" @click.stop>
      <div class="absolute top-4 right-4 z-10">
        <button @click="closeModal"
          class="bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div class="p-4 bg-white border-b">
        <h3 class="text-lg font-semibold text-[#0A2940]">{{ title }}</h3>
      </div>
      <div class="flex items-center justify-center bg-gray-100">
        <img :src="imageUrl" :alt="title" class="max-w-full max-h-[70vh] object-contain"
          @error="handleImageError" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  imageUrl: string;
  title: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const closeModal = () => {
  emit('close');
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  // target.src = '/images/news-placeholder.jpg';
};
</script> 