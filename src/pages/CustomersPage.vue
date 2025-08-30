<template>
  <q-page class="customers-page q-pa-md">
    <div class="container">
      <!-- Üst başlık / toolbar -->
      <div class="toolbar glass q-pa-md q-mb-md">
        <div class="row items-center q-col-gutter-sm">
          <div class="col">
            <div class="text-h6 text-amber-10">Müşteri Yönetimi</div>
            <div class="text-caption text-grey-7">Müşterileri görüntüle, ara, düzenle.</div>
          </div>

          <div class="col-12 col-sm-5">
            <q-input
              v-model="filter"
              dense
              outlined
              clearable
              debounce="200"
              placeholder="Ara: şirket, iletişim, e-posta..."
              :bg-color="inputBg"
              class="rounded-field"
            >
              <template #prepend><q-icon name="search" /></template>
            </q-input>
          </div>

          <div class="col-auto">
            <q-btn
              color="amber-8"
              text-color="black"
              icon="add"
              label="+ Yeni Müşteri"
              unelevated
              class="btn"
              @click="openForm()"
            />
          </div>
        </div>
      </div>

      <!-- Tablo kartı -->
      <q-card class="glass table-card">
        <div class="table-wrap">
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="id"
            flat
            separator="horizontal"
            :filter="filter"
            :loading="loading"
            :pagination="pagination"
            :rows-per-page-options="[10, 25, 50]"
            no-data-label="Kayıt bulunamadı"
            no-results-label="Aramanızla eşleşen sonuç yok"
            class="table-pretty"
          >
            <!-- E-posta linki -->
            <template #body-cell-email="props">
              <q-td :props="props">
                <a
                  :href="`mailto:${props.row.email}`"
                  class="chip-link"
                  v-if="props.row.email"
                >
                  <q-icon name="mail" class="q-mr-xs" />
                  {{ props.row.email }}
                </a>
                <span v-else>-</span>
              </q-td>
            </template>

            <!-- Telefon linki -->
            <template #body-cell-phone="props">
              <q-td :props="props">
                <a
                  :href="`tel:${props.row.phone}`"
                  class="chip-link"
                  v-if="props.row.phone"
                >
                  <q-icon name="call" class="q-mr-xs" />
                  {{ props.row.phone }}
                </a>
                <span v-else>-</span>
              </q-td>
            </template>

            <!-- Satır aksiyonları -->
            <template #body-cell-actions="props">
              <q-td :props="props" class="q-gutter-xs">
                <q-btn dense round flat icon="visibility" @click="viewRow(props.row)">
                  <q-tooltip>Görüntüle</q-tooltip>
                </q-btn>
                <q-btn dense round flat icon="edit" @click="openForm(props.row)">
                  <q-tooltip>Düzenle</q-tooltip>
                </q-btn>
                <q-btn dense round flat icon="delete" color="negative" @click="confirmDelete(props.row)">
                  <q-tooltip>Sil</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <!-- Yükleniyor durumu -->
            <template #loading>
              <div class="row items-center q-gutter-sm q-pa-md">
                <q-spinner-hourglass size="24px" />
                <span class="text-grey-7">Müşteriler yükleniyor...</span>
              </div>
            </template>

            <!-- Boş durum -->
            <template #no-data>
              <div class="column items-center q-pa-lg">
                <q-icon name="inbox" size="42px" class="q-mb-sm text-grey-5" />
                <div class="text-subtitle2 text-grey-7 q-mb-sm">Henüz müşteri eklenmemiş</div>
                <q-btn color="amber-8" text-color="black" unelevated icon="add" label="İlk Müşteriyi Ekle" @click="openForm()" />
              </div>
            </template>
          </q-table>
        </div>
      </q-card>
    </div>

    <!-- Detay Modal Component -->
    <CustomerDetailModal
      v-model="detailDialog"
      :customer="selectedCustomer"
      @close="selectedCustomer = null"
    />

    <!-- Ekle/Düzenle Dialog -->
    <q-dialog
      v-model="formDialog"
      transition-show="jump-up"
      transition-hide="jump-down"
      class="pretty-dialog"
    >
      <q-card class="modal-card">
        <q-card-section class="modal-header row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-avatar size="38px" class="modal-icon">
              <q-icon name="groups" />
            </q-avatar>
            <div>
              <div class="text-subtitle1">
                {{ form.id ? 'Müşteri Düzenle' : 'Yeni Müşteri' }}
              </div>
              <div class="text-caption text-grey-6">
                {{ form.id ? 'Bilgileri güncelleyin' : 'Yeni bir müşteri oluşturun' }}
              </div>
            </div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md modal-body">
          <q-input v-model="form.company_name" dense outlined label="Şirket Adı" :bg-color="inputBg" class="rounded-field">
            <template #prepend><q-icon name="apartment" /></template>
          </q-input>

          <q-input v-model="form.contact_person" dense outlined label="İletişim Kişisi" :bg-color="inputBg" class="rounded-field">
            <template #prepend><q-icon name="person" /></template>
          </q-input>

          <q-input v-model="form.email" dense outlined type="email" label="E-posta" :bg-color="inputBg" class="rounded-field">
            <template #prepend><q-icon name="mail" /></template>
          </q-input>

          <q-input v-model="form.phone" dense outlined label="Telefon" :bg-color="inputBg" class="rounded-field">
            <template #prepend><q-icon name="call" /></template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="modal-actions">
          <q-btn flat label="İptal" v-close-popup />
          <q-btn
            :loading="saving"
            color="amber-8"
            text-color="black"
            unelevated
            icon="save"
            label="Kaydet"
            @click="saveForm"
            class="btn-strong"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>



<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar, Dialog, Notify } from 'quasar'
import { api } from 'boot/axios'
import CustomerDetailModal from 'components/CustomerDetailModal.vue'

const $q = useQuasar()

const inputBg = 'white' // açık temada form alanlarını “temiz” göstermek için

const columns = [
  { name: 'company_name', label: 'Şirket Adı', field: 'company_name', align: 'left', sortable: true },
  { name: 'contact_person', label: 'İletişim', field: 'contact_person', align: 'left', sortable: true },
  { name: 'email', label: 'E-posta', field: 'email', align: 'left' },
  { name: 'phone', label: 'Telefon', field: 'phone', align: 'left' },
  { name: 'actions', label: 'İşlemler', field: 'actions', align: 'right' }
]

const rows = ref([])
const loading = ref(false)
const filter = ref('')
const pagination = ref({ page: 1, rowsPerPage: 10, sortBy: 'company_name', descending: false })

// Form dialog state
const formDialog = ref(false)
const saving = ref(false)
const form = reactive({
  id: null,
  company_name: '',
  contact_person: '',
  email: '',
  phone: ''
})

// Detail modal state
const detailDialog = ref(false)
const selectedCustomer = ref(null)

onMounted(() => {
  fetchRows()
})

async function fetchRows () {
  loading.value = true
  try {
    const { data } = await api.get('/api/customers')
    const list = data?.data || data || []
    rows.value = list.map(c => ({
      id: c.id,
      company_name: c.company_name,
      contact_person: c.contact_person,
      email: c.email,
      phone: c.phone
    }))
  } catch (e) {
    console.error('Müşteri listesi alınamadı', e)
    $q.notify({ type: 'negative', message: 'Müşteri listesi alınamadı.' })
  } finally {
    loading.value = false
  }
}

function openForm (row) {
  if (row) {
    Object.assign(form, row)
  } else {
    resetForm()
  }
  formDialog.value = true
}

// üstte kalsın:
function notify(type, message) {
  // Prefer $q.notify if available; fallback to Notify.create; else console
  if ($q && typeof $q.notify === 'function') {
    $q.notify({ type, message, position: 'top-right', timeout: 2500 })
  } else if (Notify && typeof Notify.create === 'function') {
    Notify.create({ type, message, position: 'top-right', timeout: 2500 })
  } else {
    console[type === 'negative' ? 'error' : 'log'](message)
  }
}
function findRowIndexById(id) {
  return rows.value.findIndex(r => r.id === id)
}

function resetForm () {
  Object.assign(form, { id: null, company_name: '', contact_person: '', email: '', phone: '' })
}

async function saveForm () {
  saving.value = true
  try {
    let res
    if (form.id) {
      // GÜNCELLE
      res = await api.put(`/api/customers/${form.id}`, form)
      const updated = res?.data?.data || res?.data || form
      // Tabloyu anında güncelle
      const i = findRowIndexById(updated.id || form.id)
      if (i !== -1) {
        rows.value[i] = {
          id: updated.id ?? form.id,
          company_name: updated.company_name ?? form.company_name,
          contact_person: updated.contact_person ?? form.contact_person,
          email: updated.email ?? form.email,
          phone: updated.phone ?? form.phone
        }
      }
      notify('positive', 'Müşteri güncellendi.')
    } else {
      // EKLE
      res = await api.post('/api/customers', form)
      const created = res?.data?.data || res?.data || form
      // Yeni kaydı tabloya ekle (en üste)
      rows.value.unshift({
        id: created.id,
        company_name: created.company_name ?? form.company_name,
        contact_person: created.contact_person ?? form.contact_person,
        email: created.email ?? form.email,
        phone: created.phone ?? form.phone
      })
      notify('positive', 'Müşteri eklendi.')
    }

    // Başarılıysa modalı kapat
    formDialog.value = false
    resetForm()
    // Sunucu ile senkron kalmak için tabloyu tazele
    await fetchRows()
  } catch (e) {
    console.error('Kayıt hatası', e)
    const msg =
      e?.response?.data?.message ||
      (e?.response?.data?.errors && Object.values(e.response.data.errors).flat().join('\n')) ||
      e?.message ||
      'Kayıt sırasında bir hata oluştu.'
    notify('negative', msg)
  } finally {
    saving.value = false
  }
}
function confirmDelete (row) {
  const payload = {
    title: 'Silme Onayı',
    message: `<b>${row.company_name}</b> kaydını silmek istiyor musunuz?`,
    cancel: true,
    persistent: true,
    html: true,
    ok: { label: 'Sil', color: 'negative' },
    cancelLabel: 'İptal'
  }

  const dlg = ($q && typeof $q.dialog === 'function')
    ? $q.dialog(payload)
    : (Dialog && typeof Dialog.create === 'function')
      ? Dialog.create(payload)
      : null

  if (dlg && typeof dlg.onOk === 'function') {
    dlg.onOk(async () => {
      try {
        await api.delete(`/api/customers/${row.id}`)
        // Satırı listeden çıkar
        const i = findRowIndexById(row.id)
        if (i !== -1) rows.value.splice(i, 1)
        notify('positive', 'Müşteri silindi.')
        // Sunucu durumuyla eşitle
        await fetchRows()
      } catch (e) {
        console.error('Silme hatası', e)
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Silme işlemi başarısız.'
        notify('negative', msg)
      }
    })
  } else {
    // Fallback: native confirm
    if (window.confirm(`${row.company_name} kaydını silmek istiyor musunuz?`)) {
      (async () => {
        try {
          await api.delete(`/api/customers/${row.id}`)
          const i = findRowIndexById(row.id)
          if (i !== -1) rows.value.splice(i, 1)
          notify('positive', 'Müşteri silindi.')
          await fetchRows()
        } catch (e) {
          console.error('Silme hatası', e)
          const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Silme işlemi başarısız.'
          notify('negative', msg)
        }
      })()
    }
  }
}


function viewRow (row) {
  selectedCustomer.value = { ...row }
  detailDialog.value = true
}


</script>

<style scoped>
/* ——— Arka plan: sarıdan beyaza yumuşak geçiş ——— */
./* ——— Arka plan: sarıdan beyaza yumuşak geçiş ——— */
.customers-page {
  min-height: 100%;
  background:
    radial-gradient(1200px 800px at 85% -10%, rgba(255, 214, 10, 0.22), transparent 60%),
    radial-gradient(900px 600px at -10% 25%, rgba(255, 193, 7, 0.22), transparent 65%),
    linear-gradient(180deg, #fff7d6 0%, #ffffff 55%);
}
.container { max-width: 1200px; margin: 0 auto; }

/* ——— Cam efektli yüzey ——— */
.glass {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 193, 7, 0.35);
  border-radius: 16px;
  transition: border-color .25s ease, box-shadow .25s ease, transform .2s ease;
}
.glass:hover {
  border-color: rgba(255, 193, 7, 0.55);
  box-shadow: 0 10px 26px rgba(0,0,0,0.06);
}
.toolbar { position: sticky; top: 8px; z-index: 1; }
.table-card { overflow: hidden; }

/* Kapsül arama alanı */
.rounded-field :deep(.q-field__control) { border-radius: 9999px; }
.rounded-field :deep(.q-field__control:focus-within) {
  box-shadow: 0 0 0 4px rgba(255,193,7,.18);
}

/* Buton */
.btn { border-radius: 12px; }

/* Tablo “kart” hissi */
.table-wrap {
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 16px 44px rgba(0,0,0,.08);
  border: 1px solid rgba(0,0,0,.06);
}
.table-pretty :deep(thead tr) {
  background: linear-gradient(180deg, #fff7da, #fff);
}
.table-pretty :deep(th) {
  font-weight: 700;
  color: #3f3f3f;
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.table-pretty :deep(tbody tr:hover) { background: #fffdf2; }
.table-pretty :deep(td) { border-bottom: 1px dashed rgba(0,0,0,.06); }

/* mail/tel chip-link */
.chip-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 9999px;
  background: #ffec99;
  color: #000;
  text-decoration: none;
  font-weight: 700;
  border: 1px solid rgba(0,0,0,.06);
}

/* ——— Dialog (cam/blur + premium görünüm) ——— */
.pretty-dialog :deep(.q-dialog__backdrop) { backdrop-filter: blur(4px); }

.modal-card {
  min-width: 520px;
  max-width: 92vw;
  border-radius: 22px;
  border: 1px solid rgba(0,0,0,.06);
  background: radial-gradient(120% 120% at 0% 0%, #ffffff 0%, #fffdf7 60%, #fff7d6 120%);
  box-shadow: 0 22px 60px rgba(0,0,0,.16);
}
@media (max-width: 640px) { .modal-card { min-width: 0; width: 100%; } }

.modal-header {
  padding: 14px 18px;
  background: linear-gradient(180deg, rgba(255, 248, 209, .6), rgba(255, 255, 255, .6));
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
}
.modal-icon {
  background: #fff7e0;
  color: #6b5b00;
  border: 1px solid rgba(0,0,0,.05);
}

.modal-body { padding-top: 8px; }
.modal-actions { padding: 12px 18px 18px; }

/* Form alanları: kapsül */
.modal-card .rounded-field :deep(.q-field__control) { border-radius: 9999px; }
.modal-card .rounded-field :deep(.q-field__control:focus-within) {
  box-shadow: 0 0 0 4px rgba(255,193,7,.18);
}

/* Güçlü birincil buton */
.btn-strong {
  border-radius: 12px;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(251,191,36,.28);
}

</style>
