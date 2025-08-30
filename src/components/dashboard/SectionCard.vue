<template>
  <q-card class="glass section-card" bordered>
    <q-card-section class="row items-center">
      <div class="row items-center no-wrap">
        <q-icon v-if="icon" :name="icon" size="22px" class="q-mr-sm"/>
        <div class="text-h6">{{ title }}</div>
      </div>
      <q-space />
      <div><slot name="actions"/></div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  icon: { type: String, default: '' }
})
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 193, 7, 0.32);
  border-radius: 16px;
  transition: border-color .25s ease, box-shadow .25s ease;
}
.glass:hover { border-color: rgba(255, 193, 7, 0.55); box-shadow: 0 14px 30px rgba(0,0,0,0.07); }
.section-card { overflow: hidden; }
</style>
