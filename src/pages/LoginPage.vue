<template>
  <q-page class="login-page flex flex-center">
    <!-- Fullscreen Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <q-spinner-gears size="64px" color="amber-7" />
    </div>

    <q-card class="login-panel" flat bordered>



      <!-- Başlık -->
      <div class="text-center q-mb-xl q-mt-lg q-mb-sm">
        <div class="text-h5 text-weight-bold">GİRİŞ YAP</div>
      </div>

      <q-card-section class="q-pt-none">
        <q-form ref="formRef" class="q-gutter-md" @submit.prevent="onSubmit">
          <!-- Kullanıcı (E-posta) -->
          <q-input
            ref="emailRef"
            v-model="email"
            type="email"
            label="Kullanıcı"
            dense
            standout
            rounded
            :bg-color="'yellow-2'"
            :rules="[rules.required, rules.email]"
            input-class="text-body1"
            lazy-rules
          >
            <template #prepend>
              <q-icon name="apartment" />
            </template>
          </q-input>

          <!-- Şifre -->
          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Şifre"
            dense
            standout
            rounded
            :bg-color="'white'"
            :rules="[rules.required]"
            input-class="text-body1"
            @keyup="onPasswordKeyup"
            lazy-rules
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
            <template #hint>
              <span v-if="capsLockOn" class="text-negative">Caps Lock açık görünüyor</span>
            </template>
          </q-input>

          <!-- Buton -->
          <q-btn
            :loading="loading"
            class="q-mt-sm login-btn"
            color="amber-8"
            text-color="black"
            unelevated
            rounded
            padding="12px"
            type="submit"
          >
            <div class="row items-center no-wrap full-width justify-center">
              <span class="q-pr-sm text-subtitle1 text-weight-bold">Giriş Yap</span>
            </div>
          </q-btn>

          <!-- Alt linkler -->
          <div class="column items-center q-mt-md">
            <q-btn flat size="md" color="black" label="Şifrenizi mi unuttunuz ?" to="/forgot-password" />
            <div class="text-caption text-grey-7 q-mt-xs">
              Hesabınız yoksa <q-btn flat dense color="primary" label="KAYIT OLUN !" to="/register" />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(true)
const loading = ref(false)
const capsLockOn = ref(false)

const formRef = ref(null)
const emailRef = ref(null)

const router = useRouter()
const authStore = useAuthStore()

const rules = {
  required: v => !!(v && String(v).trim()) || 'Bu alan zorunludur',
  email: v => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'Geçerli bir e-posta girin'
}

onMounted(() => {
  const saved = localStorage.getItem('lastEmail')
  if (saved) email.value = saved
})

function onPasswordKeyup (e) {
  capsLockOn.value = !!e?.getModifierState && e.getModifierState('CapsLock')
}

async function onSubmit () {
  const ok = await formRef.value.validate()
  if (!ok) {
    Notify.create({ type: 'warning', message: 'Lütfen alanları kontrol edin.' })
    emailRef.value?.focus()
    return
  }

  loading.value = true
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
      remember: rememberMe.value
    })

    if (rememberMe.value) localStorage.setItem('lastEmail', email.value)
    else localStorage.removeItem('lastEmail')

    Notify.create({ type: 'positive', message: 'Giriş başarılı' })
    await router.push(authStore.returnUrl || '/profile')
  } catch (e) {
    const status = e?.response?.status
    const msg =
      e?.response?.data?.message ||
      (status === 401 ? 'Yetkisiz: E-posta/şifre hatalı.' :
       status === 422 ? 'Geçersiz veri: Alanları kontrol edin.' :
       status === 429 ? 'Çok fazla deneme: Lütfen biraz sonra tekrar deneyin.' :
       'Giriş başarısız. Bilgilerinizi kontrol edin.')
    Notify.create({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Tam ekran loading overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000; /* header/drawer üstünde */
  backdrop-filter: saturate(110%) blur(2px);
}

/* Arka plan – yumuşak sarı tonlar */
.login-page {
  min-height: 100%;
  padding: 16px;
  background:
    radial-gradient(1200px 800px at 85% -10%, rgba(255, 214, 10, 0.18), transparent 60%),
    radial-gradient(900px 600px at -10% 25%, rgba(255, 193, 7, 0.18), transparent 65%),
    linear-gradient(180deg, #fff7d6 0%, #ffffff 55%);
}

/* Ortadaki oval panel */
.login-panel {
  width: 100%;
  max-width: 440px;
  border-radius: 28px;
  padding: 22px 20px 28px;
  background: linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02));
  box-shadow: 0 10px 24px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.06);
}

/* Logo kutusu */
.logo-box {
  width: 100%;
  margin-top: 6px;
  margin-bottom: 8px;
}
.logo-avatar {
  background: white;
  border-radius: 16px;
  border: 1px dashed rgba(0,0,0,0.12);
}

/* Inputların “oval beyaz” görünümü */
.q-field--standout.q-field--rounded .q-field__control {
  border-radius: 999px !important;
  background: #ffffff !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.q-field--standout.q-field--rounded .q-field__native,
.q-field--standout.q-field--rounded .q-field__label {
  padding-left: 2px;
}

/* Büyük yuvarlak giriş butonu */
.login-btn {
  width: 100%;
  border-radius: 18px;
  background: #ffd54f;             /* amber-8’e yakın */
  box-shadow: 0 8px 18px rgba(255, 193, 7, 0.25);
}
.login-btn:hover { filter: brightness(0.98); }

.btn-icon {
  background: #fff7d6;
  color: #000;
  border: 1px solid rgba(0,0,0,0.06);
}

/* Tipografi – yazıları biraz büyüt */
.login-panel .text-h5 {
  font-size: 1.8rem;           /* Başlık */
}
.login-panel .text-subtitle1 {
  font-size: 1.15rem;          /* Buton içi yazı */
}
.login-panel .text-caption {
  font-size: 0.98rem;          /* Alt açıklama yazısı */
}
/* Quasar input yerel alanları ve etiketleri */
.login-panel .q-field__label {
  font-size: 1rem;
}
.login-panel .q-field__native {
  font-size: 1.1rem;           /* Input metni */
}
/* Toggle etiket boyutu */
.login-panel .q-toggle__label {
  font-size: 1rem;
}
/* Alt link butonları biraz büyüsün */
.login-panel .q-btn[flat][size="sm"] .q-btn__content {
  font-size: 0.98rem;
}

/* Input metin rengi: tıklanınca/focus siyah olsun */
.login-panel .q-field--standout .q-field__native {
  color: #000 !important;
  caret-color: #000;
}
.login-panel .q-field--standout.q-field--focused .q-field__native,
.login-panel .q-field--standout.q-field--highlighted .q-field__native {
  color: #000 !important;
}
.login-panel .q-field--standout .q-field__native::placeholder {
  color: rgba(0, 0, 0, 0.6);
}
</style>
