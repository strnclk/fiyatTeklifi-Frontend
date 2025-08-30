<template>
  <section class="q-mt-xl">
    <div class="row q-col-gutter-md">
      <FeatureCard icon="flash_on" color="orange" title="Hızlı Teklif Oluşturma">
        Hazır şablonlarla dakikalar içinde profesyonel teklifler hazırlayın.
      </FeatureCard>

      <FeatureCard icon="group" color="green" title="Müşteri Yönetimi">
        Müşterilerinizi, iletişim bilgilerini ve teklif geçmişini tek yerde yönetin.
      </FeatureCard>

      <FeatureCard icon="category" color="primary" title="Hizmet & Kategori">
        Hizmetlerinizi kategorize edin, fiyatlandırmayı düzenli ve erişilebilir tutun.
      </FeatureCard>
    </div>
  </section>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'
</script>

<style scoped>
/* sütunları kartlara dağıtmak için col sınıflarını burada verelim */
:deep(.feature-card) {
  width: 100%;
}
:deep(.feature-card.q-card) {
  /* q-col-gutter ile uyumlu */
}
@media (min-width: 1024px) {
  :deep(.feature-card) { }
}
</style>
