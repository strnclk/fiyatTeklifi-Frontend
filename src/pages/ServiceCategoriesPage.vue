<template>
  <q-page class="categories-page q-pa-md">
    <div class="page-container">
      <!-- Üst toolbar -->
      <div class="toolbar glass q-pa-md q-mb-md">
        <div class="row items-center q-col-gutter-sm">
          <div class="col">
            <div class="section-title">
              <q-icon name="inventory_2" class="q-mr-sm" />
              Kategori Yönetimi
              <q-badge v-if="rows.length" class="q-ml-sm" outline color="amber-8" text-color="black">
                {{ rows.length }} kayıt
              </q-badge>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="filter"
              dense
              outlined
              debounce="250"
              placeholder="Ara: ad, açıklama..."
              :bg-color="inputBg"
              class="rounded-field"
            >
              <template #prepend><q-icon name="search" /></template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              emit-value
              map-options
              dense
              outlined
              clearable
              placeholder="Durum"
              :bg-color="inputBg"
              class="rounded-field"
            >
              <template #prepend><q-icon name="filter_list" /></template>
            </q-select>
          </div>

          <div class="col-auto">
            <q-btn
              color="amber-8"
              text-color="black"
              icon="add"
              label="Yeni Kategori"
              unelevated
              class="btn"
              @click="openForm()"
            />
          </div>
        </div>
      </div>

      <q-card class="glass table-card">
        <div class="table-wrap">
          <q-table
            :rows="tableRows"
            :columns="columns"
            row-key="id"
            flat
            separator="horizontal"
            :loading="loading"
            v-model:pagination="pagination"
            :rows-per-page-options="[10,25,50]"
            :filter="filter"
            :filter-method="filterMethod"
            class="table-pretty"
          >
            <!-- Açıklama: uzun metin için tooltip -->
            <template #body-cell-description="props">
              <q-td :props="props">
                <div class="ellipsis" style="max-width:420px">
                  {{ props.row.description || '-' }}
                </div>
                <q-tooltip v-if="props.row.description">
                  {{ props.row.description }}
                </q-tooltip>
              </q-td>
            </template>

            <!-- Durum: chip + toggle -->
            <template #body-cell-is_active="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.is_active ? 'positive' : 'grey-6'"
                  text-color="white"
                  size="sm"
                  class="q-mr-sm status-chip"
                >
                  {{ props.row.is_active ? 'Aktif' : 'Pasif' }}
                </q-chip>
                <q-toggle
                  size="sm"
                  color="primary"
                  :model-value="props.row.is_active"
                  @update:model-value="val => toggleActive(props.row, val)"
                />
              </q-td>
            </template>

            <!-- İşlemler -->
            <template #body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <q-btn size="sm" flat round icon="edit" @click="openForm(props.row)">
                  <q-tooltip>Düzenle</q-tooltip>
                </q-btn>
                <q-btn size="sm" flat round icon="delete" color="negative" @click="confirmDelete(props.row)">
                  <q-tooltip>Sil</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <!-- Yükleniyor -->
            <template #loading>
              <div class="row items-center q-gutter-sm q-pa-md">
                <q-spinner-hourglass size="24px" />
                <span class="text-grey-7">Kategoriler yükleniyor...</span>
              </div>
            </template>

            <!-- Boş durum -->
            <template #no-data>
              <div class="column items-center q-pa-lg">
                <q-icon name="inbox" size="42px" class="q-mb-sm text-grey-5" />
                <div class="text-subtitle2 text-grey-7 q-mb-sm">Henüz kategori eklenmemiş</div>
                <q-btn color="amber-8" text-color="black" unelevated icon="add" label="İlk Kategoriyi Ekle" @click="openForm()" />
              </div>
            </template>
          </q-table>
        </div>
      </q-card>
    </div>

    <!-- Form Dialog (child component) -->
    <CategoryFormDialog
      v-model="formDialog"
      :record="current"
      @saved="upsertRow"
    />
  </q-page>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { Notify, Dialog } from 'quasar'
import CategoryFormDialog from 'components/categories/CategoryFormDialog.vue'

const inputBg = 'white'
const rows = ref([])
const loading = ref(false)
const filter = ref('')
const statusFilter = ref(null) // true/false/null
const statusOptions = [
  { label: 'Aktif', value: true },
  { label: 'Pasif', value: false }
]

const columns = [
  { name: 'name', label: 'Ad', field: 'name', align: 'left', sortable: true },
  { name: 'description', label: 'Açıklama', field: 'description', align: 'left' },
  { name: 'is_active', label: 'Durum', field: 'is_active', align: 'left' },
  { name: 'actions', label: 'İşlemler', field: 'actions', align: 'right' }
]

const pagination = ref({ page: 1, rowsPerPage: 10, sortBy: 'name', descending: false })

const formDialog = ref(false)
const current = ref(null)

onMounted(fetchRows)

async function fetchRows () {
  loading.value = true
  try {
    const { data } = await api.get('/api/service-categories')
    const list = data?.data || data || []
    rows.value = list.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      is_active: !!c.is_active
    }))
  } catch (e) {
    console.error('Kategori listesi alınamadı', e)
    Notify.create({ type: 'negative', message: 'Kategori listesi alınamadı.' })
  } finally {
    loading.value = false
  }
}

function openForm (row) {
  current.value = row ? { ...row } : null
  formDialog.value = true
}

function upsertRow (payload) {
  // Esnek: API bazı durumlarda data.data dönebilir, burada parent’tan normalize edildi varsaydık
  const id = payload?.id
  // Eğer backend 201/200 döndürse de body boş ise id gelmeyebilir; bu durumda listeyi tazeleyelim
  if (!id) {
    fetchRows()
    return
  }
  const i = rows.value.findIndex(r => r.id === id)
  const normalized = {
    id,
    name: payload.name,
    description: payload.description,
    is_active: !!payload.is_active
  }
  if (i === -1) rows.value.unshift(normalized)
  else rows.value[i] = normalized
}

function confirmDelete (row) {
  Dialog.create({
    title: 'Silme Onayı',
    message: `<b>${row.name}</b> kategorisini silmek istiyor musunuz?`,
    cancel: true,
    persistent: true,
    html: true,
    ok: { label: 'Sil', color: 'negative' },
    cancelLabel: 'İptal'
  }).onOk(async () => {
    try {
      await api.delete(`/api/service-categories/${row.id}`)
      const i = rows.value.findIndex(r => r.id === row.id)
      if (i !== -1) rows.value.splice(i, 1)
      else await fetchRows() // eşleşme bulunamazsa güvenli tarafta kalıp listeyi tazele
      Notify.create({ type: 'positive', message: 'Kategori silindi.' })
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Silme işlemi başarısız.'
      Notify.create({ type: 'negative', message: msg })
    }
  })
}

async function toggleActive (row, val) {
  // optimistik güncelle
  const prev = row.is_active
  row.is_active = val
  try {
    // PATCH tercih; backend PUT istiyorsa gerekirse tüm kayıt gönderilebilir
    await api.patch?.(`/api/service-categories/${row.id}`, { is_active: val })
      .catch(async () => {
        // bazı axios instance'larında patch yoksa:
        await api.put(`/api/service-categories/${row.id}`, { ...row, is_active: val })
      })
    Notify.create({ type: 'positive', message: `Durum ${val ? 'Aktif' : 'Pasif'} yapıldı.` })
  } catch (e) {
    row.is_active = prev // geri al
    const msg = e?.response?.data?.message || e?.message || 'Durum güncellenemedi.'
    Notify.create({ type: 'negative', message: msg })
  }
}

const tableRows = computed(() => {
  if (statusFilter.value == null) return rows.value
  return rows.value.filter(r => r.is_active === statusFilter.value)
})

// QTable filter + status birlikte çalışsın
function filterMethod (rowsArr, terms, cols, getCellValue) {
  const text = (terms || '').toString().toLowerCase()
  const filtered = rowsArr.filter(r => {
    // statusFilter zaten tableRows’da uygulandı; burada sadece text arama
    if (!text) return true
    const haystack = [
      r.name,
      r.description,
      r.is_active ? 'aktif' : 'pasif'
    ].join(' ').toLowerCase()
    return haystack.includes(text)
  })
  return filtered
}
</script>

<style scoped>
.categories-page {
  min-height: 100%;
  background:
    radial-gradient(1200px 800px at 85% -10%, rgba(255, 214, 10, 0.18), transparent 60%),
    radial-gradient(900px 600px at -10% 25%, rgba(255, 193, 7, 0.18), transparent 65%),
    linear-gradient(180deg, #fff7d6 0%, #ffffff 55%);
}
.page-container { max-width: 1200px; margin: 0 auto; }

/* Cam/blur yüzey + toolbar */
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 193, 7, 0.32);
  border-radius: 16px;
  transition: border-color .25s ease, box-shadow .25s ease;
}
.glass:hover { border-color: rgba(255, 193, 7, 0.55); box-shadow: 0 14px 30px rgba(0,0,0,0.07); }
.table-card { overflow: hidden; }
.toolbar { position: sticky; top: 8px; z-index: 1; }

/* Bölüm başlığı */
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

/* Kapsül arama & select */
.rounded-field :deep(.q-field__control) { border-radius: 9999px; }
.rounded-field :deep(.q-field__control:focus-within) {
  box-shadow: 0 0 0 4px rgba(255,193,7,.18);
}

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

/* Durum chip’i (pill) */
.status-chip {
  border-radius: 9999px;
  font-weight: 700;
  padding: 2px 10px;
}

/* metin ellipsis */
.ellipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* CTA buton */
.btn { border-radius: 12px; }

</style>
