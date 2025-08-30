<template>
  <q-page class="q-pa-md profile-page">
    <div class="text-h5 text-weight-bold q-mb-md">Profil</div>

    <q-card class="profile-card" flat bordered>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="48px" />
      </q-inner-loading>

      <q-card-section class="row items-center q-col-gutter-md">
        <div class="col-auto">
          <q-avatar size="72px" class="avatar-ring">
            <q-icon name="account_circle" size="72px" />
          </q-avatar>
        </div>
        <div class="col">
          <div class="text-h6">{{ user?.name || 'Kullanıcı' }}</div>
          <div class="text-subtitle2 text-grey-7">{{ user?.email || '—' }}</div>
        </div>
        <div class="col-auto">
          <q-badge v-if="isAuthenticated" color="green" text-color="white" rounded>Aktif</q-badge>
          <q-badge v-else color="grey" text-color="white" rounded>Misafir</q-badge>
        </div>
      </q-card-section>

      <q-separator inset />

      <q-card-section class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-item dense>
              <q-item-section avatar><q-icon name="person" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Ad Soyad</q-item-label>
                <q-item-label>{{ user?.name || '—' }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-12 col-md-6">
            <q-item dense>
              <q-item-section avatar><q-icon name="mail" /></q-item-section>
              <q-item-section>
                <q-item-label caption>E-posta</q-item-label>
                <q-item-label>{{ user?.email || '—' }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-12 col-md-6" v-if="user?.phone">
            <q-item dense>
              <q-item-section avatar><q-icon name="call" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Telefon</q-item-label>
                <q-item-label>{{ user.phone }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-12 col-md-6" v-if="user?.company">
            <q-item dense>
              <q-item-section avatar><q-icon name="business" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Şirket</q-item-label>
                <q-item-label>{{ user.company }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <div class="q-mt-md">
          <q-btn color="amber-8" text-color="black" icon="refresh" label="Yenile" :loading="loading" @click="refresh" class="q-mr-sm"/>
          <q-btn color="primary" outline icon="edit" label="Düzenle" @click="openEdit"/>
        </div>
      </q-card-section>
    </q-card>

    <!-- Düzenleme Modalı -->
    <q-dialog v-model="editOpen" persistent>
      <q-card style="min-width: 460px; max-width: 95vw;">
        <q-card-section class="row items-center q-gutter-sm">
          <q-icon name="edit" />
          <div class="text-h6">Profili Düzenle</div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-form ref="editFormRef" class="q-gutter-md" @submit.prevent="saveEdit">
            <q-input v-model="form.name" label="Ad Soyad" :rules="[rules.required]" dense outlined rounded />
            <q-input v-model="form.email" type="email" label="E-posta" :rules="[rules.required, rules.email]" dense outlined rounded />
            <q-input v-model="form.phone" label="Telefon" dense outlined rounded />
            <q-input v-model="form.company" label="Şirket" dense outlined rounded />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Vazgeç" color="grey-8" v-close-popup />
          <q-btn color="amber-8" text-color="black" label="Kaydet" :loading="saving" @click="saveEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const editOpen = ref(false)
const editFormRef = ref(null)

const form = reactive({ name: '', email: '', phone: '', company: '' })

const user = computed(() => authStore.currentUser)
const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  await refresh()
})

async function refresh () {
  loading.value = true
  try {
    if (!authStore.initialized) {
      await authStore.initialize()
    }
    if (!authStore.currentUser && authStore.isAuthenticated) {
      await authStore.fetchUser()
    }
  } catch (e) {
    console.error(e)
    Notify.create({ type: 'negative', message: 'Profil bilgileri alınamadı' })
  } finally {
    loading.value = false
  }
}

function openEdit () {
  // mevcut kullanıcı bilgileri ile formu doldur
  form.name = user.value?.name || ''
  form.email = user.value?.email || ''
  form.phone = user.value?.phone || ''
  form.company = user.value?.company || ''
  editOpen.value = true
}

async function saveEdit () {
  const ok = await editFormRef.value?.validate?.()
  if (ok === false) return
  saving.value = true
  try {
    // TODO: Backend profil güncelleme endpoint’i eklendiğinde burada API çağrısı yapın.
    // ör: await api.put('/api/auth/profile', { ...form })

    // Geçici: store’daki user bilgisini güncelle
    authStore.user = {
      ...(authStore.user || {}),
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company
    }
    Notify.create({ type: 'positive', message: 'Profil güncellendi' })
    editOpen.value = false
  } catch (e) {
    console.error(e)
    Notify.create({ type: 'negative', message: 'Profil güncellenemedi' })
  } finally {
    saving.value = false
  }
}

const rules = {
  required: v => !!(v && String(v).trim()) || 'Bu alan zorunludur',
  email: v => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'Geçerli bir e-posta girin'
}
</script>

<style scoped>
.profile-card {
  border-radius: 16px;
}
.avatar-ring {
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.35) inset;
  border-radius: 50%;
}
.profile-page :deep(.q-item__label) {
  font-size: 1.02rem;
}
.profile-page :deep(.q-item__label--caption) {
  font-size: .9rem;
}

/* Modal form alanları tipografi */
.q-dialog :deep(.q-field__native) { font-size: 1.02rem; }
.q-dialog :deep(.q-field__label) { font-size: 0.96rem; }
</style>
