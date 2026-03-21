<template>
  <MPFieldReports
    :field-reports="fieldReports"
    :loading="loading"
    :error="error"
    @open-image-modal="(url, title) => emit('openImageModal', url, title)"
  />
</template>

<script setup lang="ts">
defineProps<{
  fieldReports: Array<{
    created_at?: string;
    date?: string;
    location_name?: string;
    description?: string;
    images?: string[];
    tags?: string[];
    latitude?: number | string;
    longitude?: number | string;
  }>;
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  openImageModal: [imageUrl: string, title: string];
}>();
</script>
