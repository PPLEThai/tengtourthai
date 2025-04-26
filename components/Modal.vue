<template>
  <div class="modal-overlay z-10" @click.self="close">
    <div class="modal-content">
      <header class="modal-header">
        <slot name="header">
          <h3>Modal Header</h3>
        </slot>
        <button class="close-button" @click="close">x</button>
      </header>
      <section class="modal-body">
        <slot name="body">
          <p>Modal Body</p>
        </slot>
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="btn" @click="close">Close</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style> 