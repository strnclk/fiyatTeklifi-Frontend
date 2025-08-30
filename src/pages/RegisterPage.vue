<template>
  <q-page class="login-page flex flex-center">
    <q-card class="login-panel" flat bordered>
      <!-- Başlık -->
      <div class="text-center q-mb-xl q-mt-lg q-mb-sm">
        <div class="text-h5 text-weight-bold">KAYIT OL</div>
      </div>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.name"
            label="Ad Soyad"
            standout
            rounded
            dense
            :bg-color="'white'"
            :error="!!errors.name"
            :error-message="errors.name?.[0]"
            input-class="text-body1"
            required
          />

          <q-input
            v-model="form.email"
            type="email"
            label="E-posta"
            standout
            rounded
            dense
            :bg-color="'white'"
            :error="!!errors.email"
            :error-message="errors.email?.[0]"
            input-class="text-body1"
            required
          />

          <q-input
            v-model="form.password"
            type="password"
            label="Şifre"
            standout
            rounded
            dense
            :bg-color="'white'"
            :error="!!errors.password"
            :error-message="errors.password?.[0]"
            input-class="text-body1"
            required
          />

          <q-input
            v-model="form.password_confirmation"
            type="password"
            label="Şifre Tekrar"
            standout
            rounded
            dense
            :bg-color="'white'"
            :error="!!errors.password_confirmation"
            :error-message="errors.password_confirmation?.[0]"
            input-class="text-body1"
            required
          />

          <q-btn
            :loading="loading"
            class="q-mt-sm login-btn"
            color="amber-8"
            text-color="black"
            unelevated
            rounded
            padding="12px"
            type="submit"
            :disable="loading"
          >
            <div class="row items-center no-wrap full-width justify-center">
              <span class="q-pr-sm text-subtitle1 text-weight-bold">Kayıt Ol</span>
            </div>
          </q-btn>

          <!-- Alt linkler -->
          <div class="column items-center q-mt-md">
            <div class="text-caption text-grey-7 q-mt-xs">
              Zaten hesabınız var mı?
              <q-btn flat size="md" color="primary" label="Giriş Yapın" to="/login" :disable="loading" />
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
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { api } from 'boot/axios'

const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const errors = ref({})
const loading = ref(false)
const isAuthenticated = ref(authStore.isAuthenticated)
const customers = ref([])
const loadingCustomers = ref(false)
const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Ad Soyad', field: 'name', sortable: true },
  { name: 'email', label: 'E-posta', field: 'email' },
  { name: 'phone', label: 'Telefon', field: 'phone' }
]

async function onSubmit() {
  loading.value = true
  errors.value = {}
  
  try {
    const result = await authStore.register(form.value)
    
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Kayıt başarılı!'
      })
      
      isAuthenticated.value = true
      await fetchCustomers()
    } else {
      if (result.error?.response?.data?.errors) {
        errors.value = result.error.response.data.errors
      } else {
        $q.notify({
          type: 'negative',
          message: result.error || 'Kayıt sırasında bir hata oluştu.'
        })
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    $q.notify({
      type: 'negative',
      message: 'Bir hata oluştu. Lütfen tekrar deneyin.'
    })
  } finally {
    loading.value = false
  }
}

async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending
  
  await fetchCustomers()
}

async function fetchCustomers() {
  if (!isAuthenticated.value) return
  
  loadingCustomers.value = true
  
  try {
    const { data } = await api.get('/api/customers', {
      params: {
        page: pagination.value.page,
        per_page: pagination.value.rowsPerPage,
        sort_by: pagination.value.sortBy,
        sort_order: pagination.value.descending ? 'desc' : 'asc'
      }
    })
    
    customers.value = data.data || []
    pagination.value.rowsNumber = data.meta?.total || 0
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    $q.notify({
      type: 'negative',
      message: 'Müşteri listesi yüklenirken bir hata oluştu.'
    })
  } finally {
    loadingCustomers.value = false
  }
}

onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchCustomers()
  }
})
</script>

<style scoped>
/* Arka plan – Login sayfası ile aynı */
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

/* Büyük yuvarlak kayıt butonu */
.login-btn {
  width: 100%;
  border-radius: 18px;
  background: #ffd54f;             /* amber-8’e yakın */
  box-shadow: 0 8px 18px rgba(255, 193, 7, 0.25);
}
.login-btn:hover { filter: brightness(0.98); }

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
/* Alt link butonu içerik boyutu */
.login-panel .q-btn[flat][size="md"] .q-btn__content {
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
