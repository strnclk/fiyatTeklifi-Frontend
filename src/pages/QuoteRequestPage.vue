<template>
  <q-page class="quote-request-page q-pa-md">
    <div class="page-container">
      <PageHeader
        title="Teklif Talep Formu"
        subtitle="İhtiyaçlarınızı iletin, en kısa sürede dönüş yapalım"
      />

      <q-card class="glass form-card">
        <!-- İnce yükleniyor çizgisi -->
        <q-linear-progress
          v-if="loading"
          indeterminate
          class="progressbar"
        />

        <q-card-section>
          <q-form ref="formRef"  @submit.prevent="onSubmit">
            <!-- Şirket Bilgileri -->
            <div class="section-title q-mb-lg">
              <q-icon name="business" class="q-mr-sm " />
              Şirket Bilgileri
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.company_name"
                  label="Şirket Adı"
                  dense
                  outlined
                  :bg-color="inputBg"
                  :rules="[rules.required]"
                  lazy-rules
                >
                  <template #prepend><q-icon name="apartment" /></template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.contact_person"
                  label="İletişim Kişisi"
                  dense
                  outlined
                  :bg-color="inputBg"
                >
                  <template #prepend><q-icon name="person" /></template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.email"
                  type="email"
                  label="E-posta"
                  dense
                  outlined
                  :bg-color="inputBg"
                  :rules="[rules.email]"
                  lazy-rules
                >
                  <template #prepend><q-icon name="mail" /></template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.phone"
                  label="Telefon"
                  dense
                  outlined
                  :bg-color="inputBg"
                  mask="+90 (###) ### ## ##"
                  fill-mask
                  :rules="[rules.minPhone]"
                  lazy-rules
                >
                  <template #prepend><q-icon name="call" /></template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  v-model="form.address"
                  label="Adres"
                  type="textarea"
                  autogrow
                  outlined
                  :bg-color="inputBg"
                >
                  <template #prepend><q-icon name="place" /></template>
                </q-input>
              </div>
            </div>

            <q-separator spaced />

            <!-- Hizmet Seçimi -->
            <div class="section-title q-mb-lg">
              <q-icon name="build" class="q-mr-sm" />
              Hizmet Seçimi
            </div>

            <!-- Estetik hizmet kartları -->
            <div class="row q-col-gutter-md">
              <div
                v-for="opt in serviceOptions"
                :key="opt.value"
                class="col-12 col-sm-6 col-md-4"
              >
                <q-card
                  class="service-card cursor-pointer"
                  :class="{ selected: selectedServices.includes(opt.value) }"
                  flat
                  bordered
                  @click="toggleService(opt.value)"
                >
                  <q-card-section class="q-pb-none row items-center no-wrap">
                    <q-avatar size="36px" class="q-mr-sm">
                      <q-icon :name="opt.icon" />
                    </q-avatar>
                    <div class="text-subtitle2">{{ opt.label }}</div>
                    <q-space />
                    <q-checkbox
                      :model-value="selectedServices.includes(opt.value)"
                      @update:model-value="toggleService(opt.value)"
                      class="q-ml-sm"
                    />
                  </q-card-section>
                  <q-card-section class="q-pt-sm text-grey-7 text-body2">
                    {{ opt.desc }}
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Seçimler chip olarak -->
            <div v-if="selectedServices.length" class="q-mt-xs">
              <q-chip
                v-for="val in selectedServices"
                :key="val"
                removable
                @remove="toggleService(val)"
                class="q-mr-sm q-mb-sm"
              >
                {{ labelOf(val) }}
              </q-chip>
            </div>

            <q-separator spaced />

            <!-- Proje Detayları -->
            <div class="section-title q-mb-lg">
              <q-icon name="description" class="q-mr-sm" />
              Proje Detayları
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.title"
                  label="Proje Başlığı"
                  dense
                  outlined
                  :bg-color="inputBg"
                >
                  <template #prepend><q-icon name="flag" /></template>
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <!-- Geçerlilik Tarihi (popup date) -->
                <q-input
                  v-model="form.valid_until"
                  label="Teklif Geçerlilik Tarihi"
                  dense
                  outlined
                  :bg-color="inputBg"
                  readonly
                >
                  <template #prepend><q-icon name="event" /></template>
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="form.valid_until"
                          mask="YYYY-MM-DD"
                          minimal
                        >
                          <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                            <q-btn flat label="Kapat" v-close-popup />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  v-model="form.description"
                  type="textarea"
                  autogrow
                  label="Proje açıklaması"
                  outlined
                  :bg-color="inputBg"
                >
                  <template #prepend><q-icon name="notes" /></template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  v-model="form.notes"
                  type="textarea"
                  autogrow
                  label="Notlar"
                  outlined
                  :bg-color="inputBg"
                >
                  <template #prepend><q-icon name="sticky_note_2" /></template>
                </q-input>
              </div>
            </div>

            <!-- KVKK onayı (opsiyonel) -->
            <q-toggle
              v-model="kvkkOk"
              label="İletişim için tarafıma dönüş yapılmasını onaylıyorum."
              color="amber-8"
            />

            <div class="row q-gutter-sm q-mt-sm">
              <q-btn
                :loading="loading"
                icon="send"
                label="Teklif Talep Et"
                color="amber-8"
                text-color="black"
                unelevated
                type="submit"
                :disable="disableSubmit"
                class="btn-primary"
              />
              <q-btn flat label="Temizle" color="grey-7" @click="reset" />
            </div>
          </q-form>
        </q-card-section>

        <!-- Loading overlay (ekstra) -->
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="40px" />
        </q-inner-loading>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { Notify, Dialog } from 'quasar' // Notify/Dialog plugin’lerini config’e eklemeyi unutma
import PageHeader from 'components/PageHeader.vue'

const inputBg = 'white'

const form = reactive({
  company_name: '',
  contact_person: '',
  email: '',
  phone: '',
  address: '',
  description: '',
  title: '',
  valid_until: '',
  notes: ''
})

const kvkkOk = ref(true)

const serviceOptions = [
  { label: 'Web Sitesi Tasarımı', value: 'web', icon: 'language', desc: 'Kurumsal, blog, landing sayfa' },
  { label: 'E-Ticaret Sitesi', value: 'ecom', icon: 'shopping_cart', desc: 'Sepet, ödeme, kampanyalar' },
  { label: 'Mobil Uygulama', value: 'mobile', icon: 'smartphone', desc: 'iOS / Android hibrit' }
]
const selectedServices = ref([])

const loading = ref(false)
const router = useRouter()
const formRef = ref(null)

const rules = {
  required: v => (v && String(v).trim().length) || 'Bu alan zorunludur',
  email: v => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'Geçerli bir e-posta girin',
  minPhone: v => (!v || v.replace(/\D/g, '').length >= 12) || 'Telefonu eksiksiz girin'
}

const disableSubmit = computed(() => {
  return loading.value || !kvkkOk.value || !form.company_name
})

function toggleService (val) {
  const i = selectedServices.value.indexOf(val)
  i === -1 ? selectedServices.value.push(val) : selectedServices.value.splice(i, 1)
}
function labelOf (val) {
  return serviceOptions.find(o => o.value === val)?.label ?? val
}

async function onSubmit () {
  const ok = await formRef.value.validate()
  if (!ok) return
  loading.value = true
  try {
    const payload = {
      ...form,
      services: selectedServices.value
    }
    await api.post('/api/quote-requests', payload)
    Notify.create({ type: 'positive', message: 'Teklif talebiniz alındı.' })
    reset()

    // İsteğe bağlı: anasayfaya dönüş
    // await router.push('/')
  } catch (e) {
    console.error('Teklif talebi başarısız', e)
    const msg =
      e?.response?.data?.message ||
      e?.message ||
      'İşlem başarısız. Lütfen tekrar deneyin.'
    Notify.create({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}

function reset () {
  Object.keys(form).forEach(k => (form[k] = ''))
  selectedServices.value = []
  kvkkOk.value = true
}
</script>

<style scoped>
/* ——— Arka plan: sarıdan beyaza yumuşak geçiş + yumuşak ışıklar ——— */
.quote-request-page {
  min-height: 100%;
  background:
    radial-gradient(1200px 800px at 85% -10%, rgba(255, 214, 10, 0.18), transparent 60%),
    radial-gradient(900px 600px at -10% 25%, rgba(255, 193, 7, 0.18), transparent 65%),
    linear-gradient(180deg, #fff7d6 0%, #ffffff 55%);
}
.page-container {
  max-width: 900px;
  margin: 0 auto;
}

/* ——— Cam efektli yüzey ——— */
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 193, 7, 0.32);
  border-radius: 16px;
  transition: border-color .25s ease, box-shadow .25s ease, transform .2s ease;
}
.glass:hover {
  border-color: rgba(255, 193, 7, 0.55);
  box-shadow: 0 14px 30px rgba(0,0,0,0.07);
}
.form-card {
  overflow: hidden;
  position: relative;
}
.progressbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

/* Bölüm başlıkları */
.section-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(255, 193, 7, 0.12);
  border: 1px dashed rgba(255, 193, 7, 0.35);
  color: #7a5b00;
  font-weight: 600;
}

/* Hizmet kartları */
.service-card {
  border-radius: 14px;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
  background: rgba(255,255,255,0.9);
}
.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0,0,0,0.06);
}
.service-card.selected {
  border-color: rgba(255, 193, 7, 0.7) !important;
  background: linear-gradient(180deg, rgba(255, 243, 205, 0.75) 0%, rgba(255,255,255,0.9) 100%);
}

/* Buton */
.btn-primary {
  border-radius: 12px;
}

/* ——— Kart içi boşluklar ve tipografi büyütme ——— */
/* Kart içerik padding’i: inputlar ile kenarlar arasında daha fazla boşluk */
.form-card .q-card__section {
  padding: 20px 24px;
}
@media (max-width: 599px) {
  .form-card .q-card__section { padding: 16px 18px; }
}

/* Input ve label yazı boyutları */
.form-card .q-field__label {
  font-size: 1rem;
}
.form-card .q-field__native {
  font-size: 1.1rem;
}

/* Bölüm başlıkları biraz daha belirgin */
.section-title {
  font-size: 1.05rem;
}

/* Birincil buton yazısını biraz büyüt */
.btn-primary .q-btn__content {
  font-size: 1.02rem;
  font-weight: 600;
}
</style>
