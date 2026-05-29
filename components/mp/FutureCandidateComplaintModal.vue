<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      @click.self="closeModal"
    >
      <div
        class="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        @click.stop
      >
        <div class="sticky top-0 bg-[#1a0f62] text-white px-5 py-4 rounded-t-2xl sm:rounded-t-2xl flex items-start justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold">แจ้งปัญหาเกี่ยวกับผู้สมัคร</h2>
            <p class="text-white/70 text-sm mt-0.5">
              ส่งเรื่องถึงพรรคประชาชนเพื่อให้ตรวจสอบข้อมูล
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="ปิด"
            @click="closeModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div v-if="submitted" class="px-5 py-10 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ff6900]/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#ff6900]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-[#1a0f62] mb-2">ส่งเรื่องแจ้งแล้ว</h3>
          <p class="text-[#1a0f62]/70 text-sm mb-6">
            พรรคประชาชนได้รับข้อมูลแล้ว จะตรวจสอบเรื่องที่เกี่ยวกับผู้สมัครต่อไป
          </p>
          <button
            type="button"
            class="w-full bg-[#1a0f62] hover:bg-[#2a1b84] text-white font-semibold py-3 rounded-xl transition-colors"
            @click="closeModal"
          >
            ปิด
          </button>
        </div>

        <form v-else class="px-5 py-5 space-y-4" @submit.prevent="handleSubmit">
          <div class="rounded-xl bg-[#1a0f62]/5 border border-[#1a0f62]/10 px-4 py-3">
            <p class="text-xs text-[#1a0f62]/50 mb-1">ผู้สมัครที่แจ้ง</p>
            <p class="font-semibold text-[#1a0f62]">{{ candidateName }}</p>
            <p v-if="candidateArea" class="text-sm text-[#1a0f62]/70 mt-0.5">{{ candidateArea }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#1a0f62] mb-1.5">
              หัวข้อที่แจ้ง <span class="text-[#ff6900]">*</span>
            </label>
            <input
              v-model="form.subject"
              type="text"
              placeholder="สรุปปัญหาที่พบเกี่ยวกับผู้สมัคร"
              class="w-full border border-[#1a0f62]/20 rounded-xl px-4 py-2.5 text-sm text-[#1a0f62] placeholder-[#1a0f62]/40 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition"
              :class="{ 'border-red-400': errors.subject }"
            />
            <p v-if="errors.subject" class="text-red-500 text-xs mt-1">{{ errors.subject }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#1a0f62] mb-1.5">
              รายละเอียด <span class="text-[#ff6900]">*</span>
            </label>
            <textarea
              v-model="form.detail"
              rows="4"
              placeholder="อธิบายปัญหา ข้อเท็จจริง และข้อมูลที่เกี่ยวข้องกับผู้สมัคร"
              class="w-full border border-[#1a0f62]/20 rounded-xl px-4 py-2.5 text-sm text-[#1a0f62] placeholder-[#1a0f62]/40 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition resize-none"
              :class="{ 'border-red-400': errors.detail }"
            />
            <p v-if="errors.detail" class="text-red-500 text-xs mt-1">{{ errors.detail }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#1a0f62] mb-1.5">
              แนบหลักฐาน
            </label>
            <label
              class="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#1a0f62]/20 rounded-xl px-4 py-6 cursor-pointer hover:border-[#ff6900]/50 hover:bg-[#ff6900]/5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#1a0f62]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span class="text-sm text-[#1a0f62]/70">คลิกเพื่อแนบไฟล์</span>
              <span class="text-xs text-[#1a0f62]/40">รูปภาพ, PDF, Word (ไม่เกิน 10 MB/ไฟล์)</span>
              <input
                ref="fileInputRef"
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                class="hidden"
                @change="handleFileChange"
              />
            </label>
            <ul v-if="attachments.length" class="mt-2 space-y-1.5">
              <li
                v-for="(file, index) in attachments"
                :key="`${file.name}-${index}`"
                class="flex items-center justify-between gap-2 rounded-lg bg-[#1a0f62]/5 px-3 py-2"
              >
                <span class="text-xs text-[#1a0f62] truncate">{{ file.name }}</span>
                <button
                  type="button"
                  class="shrink-0 text-xs text-red-500 hover:text-red-600"
                  @click="removeFile(index)"
                >
                  ลบ
                </button>
              </li>
            </ul>
            <p v-if="fileError" class="text-red-500 text-xs mt-1">{{ fileError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#1a0f62] mb-1.5">
              ชื่อผู้แจ้ง
            </label>
            <input
              v-model="form.reporterName"
              type="text"
              placeholder="ไม่บังคับ หากต้องการระบุตัวตน"
              class="w-full border border-[#1a0f62]/20 rounded-xl px-4 py-2.5 text-sm text-[#1a0f62] placeholder-[#1a0f62]/40 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#1a0f62] mb-1.5">
              เบอร์โทรศัพท์ หรือ อีเมล
            </label>
            <input
              v-model="form.contact"
              type="text"
              placeholder="สำหรับให้พรรคติดต่อกลับ (ไม่บังคับ)"
              class="w-full border border-[#1a0f62]/20 rounded-xl px-4 py-2.5 text-sm text-[#1a0f62] placeholder-[#1a0f62]/40 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition"
            />
          </div>

          <p class="text-xs text-[#1a0f62]/50">
            ข้อมูลจะถูกส่งถึงพรรคประชาชนเพื่อตรวจสอบผู้สมัคร {{ candidateName }} ตามมาตรฐานของพรรค
          </p>

          <div class="flex gap-3 pt-1">
            <button
              type="button"
              class="flex-1 border border-[#1a0f62]/20 text-[#1a0f62] font-semibold py-3 rounded-xl hover:bg-[#1a0f62]/5 transition-colors"
              @click="closeModal"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 bg-[#ff6900] hover:bg-[#ff7c21] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {{ submitting ? 'กำลังส่ง...' : 'ส่งเรื่องแจ้งพรรค' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface ComplaintFormPayload {
  subject: string;
  detail: string;
  attachments: File[];
  reporterName: string;
  contact: string;
  candidateId: string;
  candidateName: string;
  candidateArea: string;
}

interface Props {
  show: boolean;
  candidateId: string;
  candidateName: string;
  candidateArea: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [payload: ComplaintFormPayload];
}>();

const form = reactive({
  subject: '',
  detail: '',
  reporterName: '',
  contact: '',
});

const errors = reactive({
  subject: '',
  detail: '',
});

const attachments = ref<File[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
const fileError = ref('');
const submitting = ref(false);
const submitted = ref(false);

const resetForm = () => {
  form.subject = '';
  form.detail = '';
  form.reporterName = '';
  form.contact = '';
  errors.subject = '';
  errors.detail = '';
  attachments.value = [];
  fileError.value = '';
  if (fileInputRef.value) fileInputRef.value.value = '';
  submitting.value = false;
  submitted.value = false;
};

const closeModal = () => {
  emit('close');
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  fileError.value = '';
  const newFiles: File[] = [];

  for (const file of Array.from(input.files)) {
    if (file.size > MAX_FILE_SIZE) {
      fileError.value = `ไฟล์ ${file.name} มีขนาดเกิน 10 MB`;
      continue;
    }
    newFiles.push(file);
  }

  attachments.value = [...attachments.value, ...newFiles];
  input.value = '';
};

const removeFile = (index: number) => {
  attachments.value = attachments.value.filter((_, i) => i !== index);
  fileError.value = '';
};

const validate = () => {
  errors.subject = form.subject.trim() ? '' : 'กรุณากรอกหัวข้อที่แจ้ง';
  errors.detail = form.detail.trim() ? '' : 'กรุณากรอกรายละเอียด';

  return !errors.subject && !errors.detail && !fileError.value;
};

const handleSubmit = async () => {
  if (!validate()) return;

  submitting.value = true;

  const payload: ComplaintFormPayload = {
    subject: form.subject.trim(),
    detail: form.detail.trim(),
    attachments: [...attachments.value],
    reporterName: form.reporterName.trim(),
    contact: form.contact.trim(),
    candidateId: props.candidateId,
    candidateName: props.candidateName,
    candidateArea: props.candidateArea,
  };

  emit('submit', payload);

  // mock submit — รอ backend มาเชื่อมต่อทีหลัง
  await new Promise((resolve) => setTimeout(resolve, 800));

  submitting.value = false;
  submitted.value = true;
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) closeModal();
};

watch(() => props.show, (visible) => {
  if (!visible) resetForm();
});

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>
