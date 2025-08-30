<template>
  <SectionCard title="Hızlı İşlemler" icon="bolt">
    <div class="q-gutter-y-sm">
      <q-btn color="primary" icon="person_add" label="Yeni Müşteri Ekle" class="full-width" to="/customers/new" />
      <q-btn color="secondary" icon="description" label="Yeni Teklif Oluştur" class="full-width" to="/quotes/create" />
      <q-btn color="accent" icon="home_repair_service" label="Hizmet Ekle" class="full-width" to="/services/new" />
      <q-btn color="grey-7" icon="receipt_long" label="Rapor Al" class="full-width" to="/reports" />
    </div>
  </SectionCard>
</template>

<script setup>
import SectionCard from './SectionCard.vue'
</script>
