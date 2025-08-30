<template>
  <q-page class="q-pa-md services-page">
    <div class="page-container">
      <PageHeader title="Hizmet Yönetimi" subtitle="Hizmetlerinizi oluşturun, düzenleyin ve yönetin" />

      <SectionCard title="Hizmetler" icon="home_repair_service">
        <template #actions>
          <div class="row items-center q-gutter-sm">
            <q-input
              v-model="search"
              dense
              outlined
              debounce="300"
              placeholder="Ara..."
              class="search-input rounded-field"
            >
              <template #append><q-icon name="search" /></template>
            </q-input>
            <q-btn color="amber-8" text-color="black" icon="add" label="Yeni Hizmet" @click="openCreate" unelevated />
          </div>
        </template>

        <q-inner-loading :showing="loading">
          <q-spinner-gears size="48px" />
        </q-inner-loading>

        <div class="table-wrap">
          <q-table
            :rows="filteredRows"
            :columns="columns"
            row-key="id"
            flat
            :loading="loading"
            class="table-pretty"
            :separator="'horizontal'"
          >
            <!-- Kategori chip -->
            <template #body-cell-category="props">
              <q-td :props="props">
                <q-chip dense square class="chip-soft" color="amber-5" text-color="black">
                  {{ props.row.category || '-' }}
                </q-chip>
              </q-td>
            </template>

            <!-- İşlemler -->
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn dense round flat icon="edit" color="primary" @click="openEdit(props.row)" />
                <q-btn dense round flat icon="delete" color="negative" @click="confirmDelete(props.row)" />
              </q-td>
            </template>

            <!-- Boş durum -->
            <template #no-data>
              <div class="col column items-center q-pa-lg text-grey-7">
                <q-icon name="inbox" size="40px" class="q-mb-sm" />
                <div class="text-subtitle2">Henüz bir hizmet yok</div>
                <div class="text-caption">“Yeni Hizmet” ile hemen ekleyin.</div>
              </div>
            </template>
          </q-table>
        </div>
      </SectionCard>
    </div>

    <!-- Ekle/Düzenle Modalı -->
    <q-dialog
      v-model="editOpen"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
      class="pretty-dialog"
    >
      <q-card class="modal-card">
        <q-card-section class="modal-header row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-avatar size="38px" class="modal-icon">
              <q-icon name="home_repair_service" />
            </q-avatar>
            <div>
              <div class="text-h6">{{ editId ? 'Hizmeti Düzenle' : 'Yeni Hizmet' }}</div>
              <div class="text-caption text-grey-6">
                {{ editId ? 'Bilgileri güncelleyin' : 'Yeni hizmet ekleyin' }}
              </div>
            </div>
          </div>
          <q-btn round dense flat icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="modal-body">
          <q-form ref="editFormRef" class="q-gutter-md" @submit.prevent="saveService">
            <q-input v-model="form.name" label="Ad" :rules="[rules.required]" dense outlined class="rounded-field" />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="form.unit_price"
                  type="number"
                  min="0"
                  step="0.01"
                  label="Birim Fiyat (₺)"
                  :rules="[rules.required]"
                  dense
                  outlined
                  class="rounded-field"
                >
                  <template #prepend><q-icon name="payments" /></template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.category_name" label="Kategori" dense outlined class="rounded-field">
                  <template #prepend><q-icon name="category" /></template>
                </q-input>
              </div>
            </div>

            <q-input
              v-model="form.description"
              type="textarea"
              label="Açıklama"
              outlined
              autogrow
              class="soft-field"
            >
              <template #prepend><q-icon name="notes" /></template>
            </q-input>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="modal-actions">
          <q-btn flat label="Vazgeç" color="grey-8" v-close-popup />
          <q-btn color="amber-8" text-color="black" label="Kaydet" :loading="saving" @click="saveService" class="btn-strong" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Silme Onayı -->
    <q-dialog v-model="deleteOpen" transition-show="scale" transition-hide="scale" class="pretty-dialog">
      <q-card class="modal-card danger">
        <q-card-section class="modal-header danger row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-avatar size="36px" class="modal-icon danger">
              <q-icon name="warning" />
            </q-avatar>
            <div class="text-h6">Silinsin mi?</div>
          </div>
          <q-btn round dense flat icon="close" v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-banner dense class="danger-banner q-mb-sm">Bu işlem geri alınamaz.</q-banner>
          <div>
            <span class="tag">{{ deletingRow?.name }}</span> hizmeti kalıcı olarak silinecek.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="modal-actions">
          <q-btn flat label="İptal" v-close-popup />
          <q-btn color="negative" label="Sil" :loading="deleting" @click="doDelete" class="btn-strong" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>



<script setup>
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import { Notify } from 'quasar'
import { api } from 'boot/axios'
import PageHeader from 'components/PageHeader.vue'
import SectionCard from 'components/dashboard/SectionCard.vue'

const loading = ref(true)
const rows = ref([])
const search = ref('')

const columns = [
  { name: 'name', label: 'Ad', field: 'name', align: 'left', sortable: true },
  { name: 'category', label: 'Kategori', field: 'category', align: 'left' },
  { name: 'unit_price', label: 'Birim Fiyat', field: 'unit_price', align: 'right', format: v => `₺${Number(v||0).toFixed(2)}` },
  { name: 'actions', label: 'İşlemler', field: 'actions', align: 'right' }
]

const filteredRows = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return rows.value
  return rows.value.filter(r =>
    String(r.name||'').toLowerCase().includes(term) ||
    String(r.category||'').toLowerCase().includes(term)
  )
})

onMounted(fetchServices)
onActivated(fetchServices)

async function fetchServices () {
  loading.value = true
  try {
    const { data } = await api.get('/api/services')
    rows.value = (data?.data || data || []).map(s => ({
      id: s.id,
      name: s.name,
      category: s.category?.name || '-',
      unit_price: s.unit_price,
      description: s.description || ''
    }))
  } catch (e) {
    console.error('Hizmet listesi alınamadı', e)
    Notify.create({ type: 'negative', message: 'Hizmet listesi alınamadı' })
  } finally {
    loading.value = false
  }
}

// Ekle / Düzenle
const editOpen = ref(false)
const editId = ref(null)
const editFormRef = ref(null)
const saving = ref(false)
const form = reactive({ name: '', unit_price: 0, category_name: '', description: '' })

function openCreate () {
  editId.value = null
  form.name = ''
  form.unit_price = 0
  form.category_name = ''
  form.description = ''
  editOpen.value = true
}

function openEdit (row) {
  editId.value = row.id
  form.name = row.name
  form.unit_price = row.unit_price
  form.category_name = row.category === '-' ? '' : row.category
  form.description = row.description || ''
  editOpen.value = true
}

async function saveService () {
  const ok = await editFormRef.value?.validate?.()
  if (ok === false) return
  saving.value = true
  try {
    if (editId.value) {
      // TODO: id ile güncelleme
      // await api.put(`/api/services/${editId.value}`, { name: form.name, unit_price: form.unit_price, category_name: form.category_name, description: form.description })
      const idx = rows.value.findIndex(r => r.id === editId.value)
      if (idx > -1) {
        rows.value[idx] = { ...rows.value[idx], name: form.name, unit_price: form.unit_price, category: form.category_name || '-' , description: form.description }
      }
      Notify.create({ type: 'positive', message: 'Hizmet güncellendi' })
    } else {
      // TODO: oluşturma isteği
      // const { data } = await api.post('/api/services', { name: form.name, unit_price: form.unit_price, category_name: form.category_name, description: form.description })
      const tempId = Date.now()
      rows.value = [{ id: tempId, name: form.name, category: form.category_name || '-', unit_price: form.unit_price, description: form.description }, ...rows.value]
      Notify.create({ type: 'positive', message: 'Hizmet eklendi' })
    }
    editOpen.value = false
  } catch (e) {
    console.error(e)
    Notify.create({ type: 'negative', message: 'İşlem başarısız' })
  } finally {
    saving.value = false
  }
}

// Silme
const deleteOpen = ref(false)
const deleting = ref(false)
const deletingRow = ref(null)

function confirmDelete (row) {
  deletingRow.value = row
  deleteOpen.value = true
}

async function doDelete () {
  deleting.value = true
  try {
    // TODO: await api.delete(`/api/services/${deletingRow.value.id}`)
    rows.value = rows.value.filter(r => r.id !== deletingRow.value.id)
    Notify.create({ type: 'positive', message: 'Hizmet silindi' })
    deleteOpen.value = false
  } catch (e) {
    console.error(e)
    Notify.create({ type: 'negative', message: 'Hizmet silinemedi' })
  } finally {
    deleting.value = false
  }
}

const rules = {
  required: v => !!(v && String(v).trim()) || 'Bu alan zorunludur'
}
</script>

<style scoped>
.page-container { max-width: 1100px; margin: 0 auto; }
.search-input { min-width: 220px; }

/* Tipografi uyumu */
.services-page :deep(.q-table) { font-size: 1rem; }
.services-page :deep(.q-btn) { font-size: 1.02rem; border-radius: 12px; }
.services-page :deep(.q-btn .q-btn__content) { font-weight: 600; }

.page-container { max-width: 1100px; margin: 0 auto; }
.search-input { min-width: 220px; }

/* Tipografi uyumu */
.services-page :deep(.q-table) { font-size: 1rem; }
.services-page :deep(.q-btn) { font-size: 1.02rem; border-radius: 12px; }
.services-page :deep(.q-btn .q-btn__content) { font-weight: 600; }

/* Kapsül arama alanı */
.rounded-field :deep(.q-field__control) { border-radius: 9999px; }
.rounded-field :deep(.q-field__control:focus-within) {
  box-shadow: 0 0 0 4px rgba(255,193,7,.18);
}

/* Tablonun dış sarmalayıcısı */
.table-wrap {
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 16px 44px rgba(0,0,0,.08);
  border: 1px solid rgba(0,0,0,.06);
}

/* QTable güzelleştirme */
.table-pretty :deep(thead tr) {
  background: linear-gradient(180deg, #fff7da, #fff);
}
.table-pretty :deep(th) {
  font-weight: 700;
  color: #3f3f3f;
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.table-pretty :deep(tbody tr:hover) {
  background: #fffdf2;
}
.table-pretty :deep(td) {
  border-bottom: 1px dashed rgba(0,0,0,.06);
}

/* Kategori chip */
.chip-soft {
  border-radius: 10px;
  font-weight: 700;
  background: #ffec99 !important;
}

/* --------- Modal (önceki sayfadakiyle aynı tarz) --------- */
.pretty-dialog :deep(.q-dialog__backdrop) { backdrop-filter: blur(4px); }

.modal-card {
  min-width: 520px;
  max-width: 95vw;
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
.modal-icon.danger { background:#fee2e2; color:#991b1b; }
.modal-body { padding-top: 8px; }

.soft-field :deep(.q-field__control) { border-radius: 16px; }
.soft-field :deep(.q-field__control:focus-within) {
  box-shadow: 0 0 0 4px rgba(255,193,7,.16);
}

.modal-actions { padding: 12px 18px 18px; }
.btn-strong {
  border-radius: 12px;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(251,191,36,.28);
}

/* Danger varyantı */
.modal-card.danger { background: linear-gradient(180deg, #fff, #fff9f9); }
.modal-header.danger {
  background: linear-gradient(180deg, rgba(254,242,242,.8), rgba(255,255,255,.7));
}
.danger-banner {
  background:#fff1f2; color:#7f1d1d;
  border:1px solid #fecaca; border-radius:12px;
}
.tag {
  display:inline-block; background:#ffeb99; color:#000;
  padding:2px 8px; border-radius:10px; font-weight:700;
}

</style>
