<template>
  <q-card class="feature-card glass" bordered>
    <q-card-section class="row items-center">
      <q-icon :name="icon" :color="color" size="md" class="q-mr-sm" />
      <div class="text-subtitle1 text-weight-medium">{{ title }}</div>
    </q-card-section>
    <q-separator />
    <q-card-section class="text-grey-7">
      <slot />
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'star' },
  color: { type: String, default: 'primary' },
  title: { type: String, default: '' }
})
</script>

<style scoped>
.glass {
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 193, 7, 0.28);
  border-radius: 16px;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(0,0,0,0.06);
  border-color: rgba(255, 193, 7, 0.5);
}
</style>
