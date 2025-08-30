<template>
  <q-page class="landing-page q-pa-xl">
    <div class="page-container">
      <!-- Hero -->
      <section class="hero q-mt-xl q-mb-xl">
        <div class="bg-blobs" aria-hidden="true"></div>
        <div class="column items-center text-center hero-content">
          <q-icon name="request_quote" size="72px" color="primary" class="q-mb-md fade-in" />
          <div class="text-h4 text-weight-bold q-mb-sm fade-up">
            <span class="brand">FiyatTeklifi</span>
          </div>
          <div class="text-subtitle1 text-grey-7 q-mb-md fade-up-2">
            Tekliflerinizi hızla oluşturun, paylaşın ve yönetin.
          </div>
          <div class="q-gutter-sm fade-up-3">
            <q-btn color="primary" label="Giriş Yap" to="/login" unelevated class="btn" />
            <q-btn color="primary" label="Kayıt Ol" to="/register" outline class="btn" />
          </div>
        </div>
      </section>

      <!-- Features -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-card class="glass feature-card card-hover" bordered>
            <q-card-section class="row items-center">
              <q-icon name="flash_on" color="orange" size="md" class="q-mr-sm" />
              <div class="text-subtitle1 text-weight-medium">Hızlı Teklif Oluşturma</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-grey-7">
              Hazır şablonlarla dakikalar içinde profesyonel teklifler hazırlayın.
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card class="glass feature-card card-hover" bordered>
            <q-card-section class="row items-center">
              <q-icon name="group" color="green" size="md" class="q-mr-sm" />
              <div class="text-subtitle1 text-weight-medium">Müşteri Yönetimi</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-grey-7">
              Müşterilerinizi, iletişim bilgilerini ve teklif geçmişini tek yerde yönetin.
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card class="glass feature-card card-hover" bordered>
            <q-card-section class="row items-center">
              <q-icon name="category" color="primary" size="md" class="q-mr-sm" />
              <div class="text-subtitle1 text-weight-medium">Hizmet ve Kategori</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-grey-7">
              Hizmetlerinizi kategorize edin, fiyatlandırmayı düzenli ve erişilebilir tutun.
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// sadece görsel iyileştirme; ek mantık yok
</script>

<style scoped>
/* sayfa zemini */
.landing-page {
  min-height: 100%;
  background:
    radial-gradient(1200px 800px at 90% -10%, rgba(255, 214, 10, 0.18), transparent 60%),
    radial-gradient(900px 600px at -10% 25%, rgba(66, 165, 245, 0.16), transparent 65%),
    linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
}

/* merkez genişlik */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* hero alanı */
.hero {
  position: relative;
  overflow: hidden;
}
.hero-content { position: relative; z-index: 1; }

/* dekoratif bloblar */
.bg-blobs::before,
.bg-blobs::after {
  content: "";
  position: absolute;
  width: 900px; height: 900px;
  filter: blur(60px);
  z-index: 0;
  opacity: .32;
}
.bg-blobs::before {
  top: -30%; right: -10%;
  background: radial-gradient(closest-side, rgba(255, 214, 10, .55), transparent);
}
.bg-blobs::after {
  bottom: -35%; left: -15%;
  background: radial-gradient(closest-side, rgba(66, 165, 245, .45), transparent);
}

/* marka başlık gradienti */
.brand {
  background: linear-gradient(90deg, #ffca28 0%, #ff8f00 35%, #42a5f5 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: .2px;
}

/* cam efekt + hover */
.glass {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 193, 7, 0.28);
  border-radius: 16px;
}
.card-hover {
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(0,0,0,0.06);
  border-color: rgba(255, 193, 7, 0.5);
}
.feature-card { height: 100%; }

/* buton köşeleri */
.btn { border-radius: 12px; }

/* mini giriş animasyonları */
.fade-in { animation: fade-in .45s ease both; }
.fade-up { animation: fade-up .5s ease both; }
.fade-up-2 { animation: fade-up .6s ease both .05s; }
.fade-up-3 { animation: fade-up .7s ease both .1s; }

@keyframes fade-in { from {opacity:0} to {opacity:1} }
@keyframes fade-up { from {opacity:0; transform: translateY(6px)} to {opacity:1; transform: translateY(0)} }

/* responsive iyileştirmeler */
@media (max-width: 599px) {
  .landing-page { padding-left: 16px; padding-right: 16px; }
}
</style>
