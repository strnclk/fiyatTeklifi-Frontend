<template>
  <q-layout class="sun-layout" view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated class="sun-header glass">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer"  color="amber-8"/>

        <q-toolbar-title class="brand">
          Fiyat<span> Teklifi</span> Sistemi
        </q-toolbar-title>

        <div v-if="isAuthenticated" class="q-mr-sm">
          <q-btn flat round dense>
            <q-avatar size="32px" class="avatar-ring">
              <q-icon name="account_circle" size="32px" />
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 170px">
                <q-item clickable v-close-popup to="/profile">
                  <q-item-section avatar><q-icon name="person" /></q-item-section>
                  <q-item-section>Profil</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="handleLogout">
                  <q-item-section avatar><q-icon name="logout" /></q-item-section>
                  <q-item-section>Çıkış Yap</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="sun-drawer glass-panel">
      <q-list padding>
        <q-item-label header class="menu-header">Ana Menü</q-item-label>

        <q-item clickable v-ripple to="/" :active="isActive('/')" active-class="active-link">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Ana Sayfa</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/quote-request" :active="isActive('/quote-request')" active-class="active-link">
          <q-item-section avatar><q-icon name="assignment" /></q-item-section>
          <q-item-section>Teklif Talep Et</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/contact" :active="isActive('/contact')" active-class="active-link">
          <q-item-section avatar><q-icon name="call" /></q-item-section>
          <q-item-section>İletişim</q-item-section>
        </q-item>

        <template v-if="!isAuthenticated">
          <q-item clickable v-ripple to="/login" :active="isActive('/login')" active-class="active-link">
            <q-item-section avatar><q-icon name="login" /></q-item-section>
            <q-item-section>Giriş Yap</q-item-section>
          </q-item>
        </template>

        <template v-else>
          <q-separator spaced />
          <q-item-label header class="menu-header">Business Menü</q-item-label>

          <q-item clickable v-ripple to="/dashboard" :active="isActive('/dashboard')" active-class="active-link">
            <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/quotes" :active="isActive('/quotes')" active-class="active-link">
            <q-item-section avatar><q-icon name="description" /></q-item-section>
            <q-item-section>Teklif Yönetimi</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/customers" :active="isActive('/customers')" active-class="active-link">
            <q-item-section avatar><q-icon name="groups" /></q-item-section>
            <q-item-section>Müşteri Yönetimi</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/services" :active="isActive('/services')" active-class="active-link">
            <q-item-section avatar><q-icon name="home_repair_service" /></q-item-section>
            <q-item-section>Hizmet Yönetimi</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/service-categories" :active="isActive('/service-categories')" active-class="active-link">
            <q-item-section avatar><q-icon name="folder" /></q-item-section>
            <q-item-section>Kategori Yönetimi</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/profile" :active="isActive('/profile')" active-class="active-link">
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>Profil</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <!-- PAGES -->
    <q-page-container class="page-bg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()

const leftDrawerOpen = ref(false)
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
function isActive (base) {
  return route.path === base || route.path.startsWith(base + '/')
}

async function handleLogout () {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    router.push('/login')
    $q.notify({ type: 'positive', message: 'Başarıyla çıkış yapıldı' })
  }
}
</script>

<style scoped>
/* ------ Arka plan: sarı-beyaz yumuşak gradient + ışık lekeleri ------ */
.sun-layout {
  background:
    radial-gradient(900px 600px at 110% -10%, rgba(255, 214, 10, 0.18), transparent 60%),
    radial-gradient(800px 520px at -10% 20%, rgba(255, 193, 7, 0.16), transparent 65%),
    linear-gradient(180deg, #fffdf5 0%, #ffffff 55%);
}

/* ------ Cam efekt şablonları ------ */
.glass {
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 193, 7, 0.35);
}
.glass-panel {
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 193, 7, 0.28);
}

/* ------ Header ------ */
.sun-header .q-toolbar {
  min-height: 60px;
}
.brand {
  font-weight: 800;
  letter-spacing: .2px;
  background: linear-gradient(90deg, #ffca28 0%, #ffb300 40%, #6c6c6c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.brand span {
  background: linear-gradient(90deg, #ffc107, #ff8f00);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.avatar-ring {
  box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.35) inset;
  border-radius: 50%;
}

/* ------ Drawer & Menü ------ */
.sun-drawer {
  width: 270px;
}

.menu-header {
  color: #7a5b00;
  background: rgba(255, 193, 7, 0.12);
  border: 1px dashed rgba(255, 193, 7, 0.35);
  padding: 6px 10px;
  border-radius: 10px;
  margin: 8px 12px;
}

.q-item {
  border-radius: 10px;
  margin: 2px 8px;
  transition: background .18s ease, transform .12s ease;
}
.q-item:hover {
  background: rgba(255, 193, 7, 0.12);
}
.active-link {
  background: rgba(255, 193, 7, 0.22) !important;
  box-shadow: inset 3px 0 0 0 #ffc107;
  color: #4a3300;
}

/* İç sayfa yüzeyi */
.page-bg {
  padding: 8px;
}
</style>
