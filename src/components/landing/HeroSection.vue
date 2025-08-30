<template>
  <section class="hero q-py-xl">
    <!-- dekoratif arka plan -->
    <div class="bg-blobs" aria-hidden="true"></div>

    <div class="content column items-center text-center">
      <q-icon name="request_quote" size="72px" color="primary" class="q-mb-md fade-in" />
      <h1 class="title fade-up">
        <span class="brand">FiyatTeklifi</span>
      </h1>
      <p class="subtitle text-grey-7 q-mt-sm q-mb-md fade-up-2">
        Tekliflerinizi hızla oluşturun, paylaşın ve yönetin.
      </p>
      <div class="q-gutter-sm fade-up-3">
        <q-btn color="primary" label="Giriş Yap" to="/login" unelevated class="btn" />
        <q-btn color="primary" label="Kayıt Ol" to="/register" outline class="btn" />
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
}
.content { position: relative; z-index: 1; }

.title {
  font-size: clamp(28px, 5vw, 40px);
  margin: 0;
  line-height: 1.15;
}
.brand {
  background: linear-gradient(90deg, #ffca28 0%, #ff8f00 35%, #42a5f5 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
  letter-spacing: .2px;
}

.bg-blobs::before,
.bg-blobs::after {
  content: "";
  position: absolute;
  width: 900px; height: 900px;
  filter: blur(60px);
  z-index: 0;
  opacity: .35;
}
.bg-blobs::before {
  top: -30%; right: -10%;
  background: radial-gradient(closest-side, rgba(255, 214, 10,.55), transparent);
}
.bg-blobs::after {
  bottom: -35%; left: -15%;
  background: radial-gradient(closest-side, rgba(66,165,245,.45), transparent);
}

.btn { border-radius: 12px; }

/* mini animasyonlar */
.fade-in { animation: fade-in .5s ease both; }
.fade-up { animation: fade-up .55s ease both; }
.fade-up-2 { animation: fade-up .65s ease both .05s; }
.fade-up-3 { animation: fade-up .75s ease both .1s; }
@keyframes fade-in { from {opacity:0} to {opacity:1} }
@keyframes fade-up { from {opacity:0; transform: translateY(6px)} to {opacity:1; transform: translateY(0)} }
</style>
