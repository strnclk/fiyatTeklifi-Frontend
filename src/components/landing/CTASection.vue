<template>
  <section class="cta q-my-xl">
    <q-card class="cta-card glass" bordered>
      <q-card-section class="row items-center q-col-gutter-md">
        <div class="col-12 col-md">
          <div class="text-h6">Dakikalar içinde ilk teklifini oluştur</div>
          <div class="text-body2 text-grey-7">
            Hazır şablonlar, kategori & fiyat yönetimi ve paylaşım linkleriyle işini hızlandır.
          </div>
        </div>
        <div class="col-12 col-md-auto">
          <q-btn color="amber-8" text-color="black" unelevated icon="play_arrow" label="Hemen Başla" to="/register" class="btn" />
        </div>
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup>
</script>

<style scoped>
.glass {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,193,7,0.28);
  border-radius: 16px;
}
.cta-card { padding: 4px; }
.btn { border-radius: 12px; }
</style>
