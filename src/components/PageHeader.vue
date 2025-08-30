<template>
  <div class="page-header q-mb-lg">
    <div class="row items-center no-wrap">
      <div class="col">
        <div class="text-h5 text-weight-bold">{{ title }}</div>
        <div v-if="subtitle" class="text-subtitle2 text-grey-7 q-mt-xs">
          {{ subtitle }}
        </div>
      </div>
      <div class="col-auto">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' }
})
</script>

<style scoped>
.page-header {
  padding: 12px 2px;
}
</style>
