<template>
  <div class="bg-white rounded-2xl p-4 md:p-6 h-[500px] md:h-[500px] col-span-1 flex flex-col">
    <h3 class="text-[#FF6A13] font-bold text-lg md:text-2xl mb-2 flex items-center gap-2">
      <component :is="iconComponent" class="w-6 h-6" :class="iconColor" />
      {{ platformName }}
    </h3>
    
    <div class="flex-1 flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <a :href="url" target="_blank" rel="noopener noreferrer"
          :class="`text-sm hover:underline font-medium ${linkColor}`">
          {{ displayName }}
        </a>
        <a :href="url" target="_blank" rel="noopener noreferrer"
          :class="`text-xs hover:underline ${linkColor}`">
          {{ actionText }} →
        </a>
      </div>
      
      <!-- Loading state สำหรับ Facebook -->
      <div v-if="platform === 'facebook' && facebookLoading" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1877F2] mx-auto mb-2"></div>
          <p class="text-xs text-gray-600">กำลังโหลดหน้า Facebook...</p>
        </div>
      </div>
      
      <!-- Error state สำหรับ Facebook -->
      <div v-else-if="platform === 'facebook' && facebookError" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <p class="text-xs text-red-500 mb-2">{{ facebookError }}</p>
          <a :href="url" target="_blank" rel="noopener noreferrer"
            class="text-[#1877F2] text-xs hover:underline">
            เปิดหน้า Facebook ในแท็บใหม่
          </a>
        </div>
      </div>
      
      <!-- Facebook Page Plugin Container -->
      <div v-else-if="platform === 'facebook' && facebookPageUrl" class="flex-1">
        <div 
          class="fb-page h-full" 
          :data-href="facebookPageUrl"
          data-tabs="timeline"
          data-width="300"
          data-height="300"
          data-small-header="true"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="false">
        </div>
      </div>
      
      <!-- Default content สำหรับ platform อื่นๆ -->
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="text-gray-400 mb-4">
            <component :is="iconComponent" class="w-16 h-16 mx-auto" />
          </div>
          <p class="text-[#0A2940] text-sm mb-2">{{ description }}</p>
          <p class="text-xs text-gray-600">ติดตาม {{ mpName }} บน {{ platformName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  platform: 'facebook' | 'instagram' | 'x' | 'tiktok';
  url: string;
  mpName: string;
  facebookLoading?: boolean;
  facebookError?: string | null;
  facebookPageUrl?: string;
}

const props = defineProps<Props>();

// Icons components
const FacebookIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  `
};

const InstagramIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  `
};

const XIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  `
};

const TikTokIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  `
};

const platformConfig = computed(() => {
  const configs = {
    facebook: {
      name: 'Facebook',
      icon: FacebookIcon,
      color: 'text-[#1877F2]',
      actionText: 'ดูหน้าเพจ',
      description: 'ติดตามข่าวสารและกิจกรรมล่าสุด'
    },
    instagram: {
      name: 'Instagram',
      icon: InstagramIcon,
      color: 'text-[#E4405F]',
      actionText: 'ดูโปรไฟล์',
      description: 'ดูภาพและสตอรี่ล่าสุด'
    },
    x: {
      name: 'X (Twitter)',
      icon: XIcon,
      color: 'text-[#000000]',
      actionText: 'ดูทวิตเตอร์',
      description: 'ติดตามความคิดเห็นและข่าวสารล่าสุด'
    },
    tiktok: {
      name: 'TikTok',
      icon: TikTokIcon,
      color: 'text-[#000000]',
      actionText: 'ดูวิดีโอ',
      description: 'ดูวิดีโอและเนื้อหาสั้นๆ'
    }
  };
  return configs[props.platform];
});

const platformName = computed(() => platformConfig.value.name);
const iconComponent = computed(() => platformConfig.value.icon);
const iconColor = computed(() => platformConfig.value.color);
const linkColor = computed(() => platformConfig.value.color);
const actionText = computed(() => platformConfig.value.actionText);
const description = computed(() => platformConfig.value.description);

const displayName = computed(() => {
  if (!props.url) return '';

  try {
    const urlObj = new URL(props.url);
    const pathname = urlObj.pathname;

    // สำหรับ Facebook
    if (props.url.includes('facebook.com')) {
      if (pathname.includes('/people/')) {
        const match = pathname.match(/\/people\/([^\/]+)/);
        return match ? decodeURIComponent(match[1].replace(/-/g, ' ')) : 'Facebook Page';
      } else {
        const username = pathname.split('/').filter(Boolean)[0];
        return username ? `@${username}` : 'Facebook Page';
      }
    }

    // สำหรับ Instagram
    if (props.url.includes('instagram.com')) {
      const username = pathname.split('/').filter(Boolean)[0];
      return username ? `@${username}` : 'Instagram Profile';
    }

    // สำหรับ X (Twitter)
    if (props.url.includes('x.com') || props.url.includes('twitter.com')) {
      const username = pathname.split('/').filter(Boolean)[0];
      return username ? `@${username}` : 'X Profile';
    }

    // สำหรับ TikTok
    if (props.url.includes('tiktok.com')) {
      const username = pathname.split('/').filter(Boolean)[0];
      return username ? `@${username}` : 'TikTok Profile';
    }

    return 'Social Media Profile';
  } catch (error) {
    return 'Social Media Profile';
  }
});
</script>

<style scoped>
/* CSS สำหรับ Facebook Page Plugin */
.fb-page {
  margin: 0 auto;
  max-width: 100%;
}

.fb-page iframe {
  border: none;
  overflow: hidden;
  width: 100% !important;
  height: 200px !important;
}

/* Responsive design สำหรับ Facebook Page Plugin */
@media (max-width: 768px) {
  .fb-page iframe {
    height: 150px !important;
  }
}

/* Loading animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style> 