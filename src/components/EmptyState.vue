<template>
  <div class="column items-center q-pa-xl text-center">
    <q-icon :name="icon" size="64px" class="q-mb-md" color="grey-6" />
    <div class="text-h6 q-mb-xs">{{ title }}</div>
    <div class="text-subtitle2 text-grey-7 q-mb-md">{{ subtitle }}</div>
    <slot name="actions" />
  </div>
</template>

<script setup>
const props = defineProps({
  icon: { type: String, default: 'inbox' },
  title: { type: String, default: 'Kayıt bulunamadı' },
  subtitle: { type: String, default: 'Yeni bir kayıt ekleyerek başlayın.' }
})
</script>
