// Google Analytics 4 (gtag.js) — client-only plugin
// Measurement ID มาจาก runtimeConfig.public.gaId (ตั้งค่าผ่าน GA_ID ใน .env)
export default defineNuxtPlugin((nuxtApp) => {
  const gaId = useRuntimeConfig().public.gaId as string;

  // ไม่มี ID (เช่น dev/preview) ก็ไม่ต้องโหลด
  if (!gaId) return;

  // โหลด gtag.js แบบ async
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  // @ts-expect-error - dataLayer ถูก attach บน window โดย gtag.js
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    // @ts-expect-error - gtag ใช้ arguments object ตามสเปกของ Google
    window.dataLayer.push(arguments);
  }
  // @ts-expect-error - expose gtag ให้ใช้ทั่วแอป
  window.gtag = gtag;

  gtag('js', new Date());
  // ปิด auto page_view เพื่อยิงเองตอน route เปลี่ยน (SPA)
  gtag('config', gaId, { send_page_view: false });

  // ยิง page_view ทุกครั้งที่เปลี่ยนหน้า (รวมโหลดครั้งแรก)
  const router = useRouter();
  router.afterEach((to) => {
    gtag('event', 'page_view', {
      page_path: to.fullPath,
      page_location: window.location.href,
      page_title: document.title,
    });
  });
});
