<template>
  <q-page class="contact-page q-pa-md">
    <!-- Dekoratif üst başlık -->
    <div class="container">
      <header class="hero">
        <div class="badge">İletişim</div>
        <h1 class="title">Sizinle Tanışalım</h1>
        <p class="subtitle">
          Sorularınız ve iş birlikleri için bize ulaşın. En kısa sürede dönüş yaparız.
        </p>
      </header>

      <!-- İçerik -->
      <div class="grid">
        <!-- Sol: İletişim Kartı -->
        <q-card class="card glass">
          <q-card-section>
            <div class="section-title">
              <q-icon name="support_agent" size="28px" class="q-mr-sm" />
              İletişim Bilgileri
            </div>

            <div class="item">
              <q-icon name="phone" size="22px" class="q-mr-sm" />
              <a href="tel:+90XXXXXXXXXX" class="link">+90 555 000 00 00</a>
            </div>

            <div class="item">
              <q-icon name="email" size="22px" class="q-mr-sm" />
              <a href="mailto:info@firma.com" class="link">info@firma.com</a>
            </div>

            <div class="item">
              <q-icon name="place" size="22px" class="q-mr-sm" />
              <span>İstanbul, Türkiye</span>
            </div>

            <q-separator spaced />

            <div class="socials">
              <q-btn round flat icon="mdi-linkedin" :href="links.linkedin" target="_blank" />
              <q-btn round flat icon="mdi-instagram" :href="links.instagram" target="_blank" />
              <q-btn round flat icon="mdi-github" :href="links.github" target="_blank" />
              <q-btn round flat icon="mdi-web" :href="links.website" target="_blank" />
            </div>
          </q-card-section>
        </q-card>

        <!-- Sağ: Mesaj Formu -->
        <q-card class="card glass">
          <q-card-section>
            <div class="section-title">
              <q-icon name="chat_bubble" size="28px" class="q-mr-sm" />
              Mesaj Gönderin
            </div>

            <div class="q-gutter-md">
              <q-input v-model="form.adSoyad" dense outlined label="Ad Soyad" />
              <q-input v-model="form.eposta" dense outlined label="E-posta" type="email" />
              <q-input v-model="form.konu" dense outlined label="Konu" />
              <q-input
                v-model="form.mesaj"
                type="textarea"
                autogrow
                outlined
                :counter="600"
                label="Mesajınız"
              />
              <div class="row justify-end">
                <q-btn
                  color="amber-8"
                  text-color="black"
                  unelevated
                  icon="send"
                  label="Gönder"
                  @click="submit"
                  class="btn"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Alt bilgi -->
      <footer class="footer">
        <div class="chip">
          <q-icon name="schedule" class="q-mr-xs" /> Hafta içi 09:00 – 18:00
        </div>
        <div class="chip">
          <q-icon name="verified_user" class="q-mr-xs" /> 24 saat içinde geri dönüş
        </div>
      </footer>
    </div>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  adSoyad: '',
  eposta: '',
  konu: '',
  mesaj: ''
})

const links = {
  linkedin: '#',
  instagram: '#',
  github: '#',
  website: '#'
}

function submit () {
  // Burada API çağrısı yapabilirsiniz
  // örn: await api.post('/contact', form)
  console.log('Form:', form)
}
</script>

<style scoped>
/* ——— Arka plan: sarıdan beyaza yumuşak geçiş ——— */
.contact-page {
  min-height: 100%;
  background:
    radial-gradient(1200px 800px at 80% 0%, rgba(255, 214, 10, 0.25), transparent 60%),
    radial-gradient(900px 600px at 0% 20%, rgba(255, 193, 7, 0.25), transparent 65%),
    linear-gradient(180deg, #fff7d6 0%, #ffffff 55%);
}

/* Düzen konteyneri */
.container {
  max-width: 1080px;
  margin: 0 auto;
}

/* ——— Hero ——— */
.hero {
  text-align: center;
  padding: 56px 16px 8px;
  position: relative;
}
.badge {
  display: inline-block;
  background: rgba(255, 223, 88, 0.4);
  border: 1px solid rgba(255, 193, 7, 0.45);
  color: #6a5200;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
  backdrop-filter: blur(6px);
}
.title {
  margin: 12px 0 6px;
  font-size: clamp(26px, 3.6vw, 42px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #4a3b00;
}
.subtitle {
  max-width: 680px;
  margin: 0 auto;
  color: #6a6a6a;
}

/* ——— Grid ——— */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  padding: 18px 16px 8px;
}
@media (min-width: 860px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 22px;
  }
}

/* ——— Kartlar ——— */
.card {
  border-radius: 18px;
  overflow: hidden;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  border: 1px solid rgba(255, 193, 7, 0.35);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(0,0,0,0.08);
  border-color: rgba(255, 193, 7, 0.55);
}
.glass {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
}

/* ——— Başlıklar ——— */
.section-title {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 18px;
  color: #5b4600;
  margin-bottom: 10px;
}

/* ——— Satırlar ——— */
.item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  color: #3f3f3f;
}
.item + .item {
  border-top: 1px dashed rgba(255, 193, 7, 0.35);
}
.link {
  color: #3f3f3f;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}

/* ——— Sosyal butonlar ——— */
.socials {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}
.socials .q-btn:hover {
  background: rgba(255, 223, 88, 0.25);
}

/* ——— Alt bilgi ——— */
.footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 18px 12px 36px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 238, 173, 0.6);
  border: 1px solid rgba(255, 193, 7, 0.35);
  color: #5b4600;
  font-weight: 600;
}

/* ——— Aksiyon butonu ——— */
.btn {
  border-radius: 12px;
  padding: 8px 16px;
  transition: transform .2s ease;
}
.btn:active {
  transform: translateY(1px);
}
</style>
