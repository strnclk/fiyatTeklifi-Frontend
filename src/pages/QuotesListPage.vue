<template>
  <q-page class="quotes-page q-pa-md">
    <PageHeader />

    <!-- Üst toolbar -->
    <div class="toolbar glass q-pa-md q-mb-md">
      <div class="row items-center q-col-gutter-sm">
        <div class="col">
          <div class="section-title">
            <q-icon name="list_alt" class="q-mr-sm" />
            Teklif Listesi
            <q-badge v-if="totalItems !== null" class="q-ml-sm" outline color="amber-8" text-color="black">
              {{ totalItems }} kayıt
            </q-badge>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <q-input
            v-model="search"
            dense
            outlined
            debounce="300"
            placeholder="Ara: müşteri, numara..."
            :bg-color="inputBg"
            class="rounded-field"
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="status"
            :options="statusOptions"
            dense
            outlined
            emit-value
            map-options
            :bg-color="inputBg"
            clearable
            placeholder="Durum"
            class="rounded-field"
          >
            <template #prepend><q-icon name="filter_list" /></template>
          </q-select>
        </div>

        <div class="col-auto">
          <q-btn color="amber-8" text-color="black" unelevated icon="add" label="Yeni Teklif" to="/quotes/create" />
        </div>
      </div>
    </div>

    <!-- Tablo -->
    <q-card class="glass table-card">
      <div class="table-wrap">
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="id"
          flat
          separator="horizontal"
          :loading="loading"
          v-model:pagination="pagination"
          :rows-per-page-options="[10, 25, 50]"
          @request="onServerRequest"
          class="table-pretty"
        >
          <!-- Hücre: Tutar -->
          <template #body-cell-total_amount="props">
            <q-td :props="props" class="text-right">
              {{ formatCurrency(props.row.total_amount) }}
            </q-td>
          </template>

          <!-- Hücre: Durum -->
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-chip
                size="sm"
                :color="statusColor(props.row.status)"
                text-color="white"
                class="status-chip"
              >
                {{ statusLabel(props.row.status) }}
              </q-chip>
            </q-td>
          </template>

          <!-- Hücre: İşlemler -->
          <template #body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn size="sm" flat round icon="visibility" :to="`/quotes/${props.row.id}`">
                <q-tooltip>Görüntüle</q-tooltip>
              </q-btn>
              <q-btn size="sm" flat round icon="picture_as_pdf" :to="`/quotes/${props.row.id}/pdf`" target="_blank" class="q-ml-xs">
                <q-tooltip>PDF</q-tooltip>
              </q-btn>
              <q-btn size="sm" flat round icon="edit" :to="`/quotes/${props.row.id}/edit`" class="q-ml-xs">
                <q-tooltip>Düzenle</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <!-- Yükleniyor -->
          <template #loading>
            <div class="row items-center q-gutter-sm q-pa-md">
              <q-spinner-hourglass size="24px" />
              <span class="text-grey-7">Teklifler yükleniyor...</span>
            </div>
          </template>

          <!-- Boş durum -->
          <template #no-data>
            <div class="column items-center q-pa-lg">
              <q-icon name="inbox" size="42px" class="q-mb-sm text-grey-5" />
              <div class="text-subtitle2 text-grey-7 q-mb-sm">Henüz teklif yok</div>
              <q-btn color="amber-8" text-color="black" unelevated icon="add" label="İlk Teklifi Oluştur" to="/quotes/create" />
            </div>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-page>
</template>



<script setup>
import { ref, onMounted, watch } from 'vue'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
import PageHeader from 'components/PageHeader.vue'

const inputBg = 'white'

const columns = [
  { name: 'id', label: 'No', field: 'id', align: 'left', sortable: true },
  { name: 'customer', label: 'Müşteri', field: 'customer', align: 'left', sortable: true },
  { name: 'total_amount', label: 'Tutar', field: 'total_amount', align: 'right', sortable: true },
  { name: 'status', label: 'Durum', field: 'status', align: 'left' },
  { name: 'actions', label: 'İşlemler', field: 'actions', align: 'right' }
]

const rows = ref([])
const loading = ref(false)
const totalItems = ref(null)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'id',
  descending: true
})

const search = ref('')
const status = ref(null)

const statusOptions = [
  { label: 'Taslak', value: 'draft' },
  { label: 'Gönderildi', value: 'sent' },
  { label: 'Onaylandı', value: 'approved' },
  { label: 'Reddedildi', value: 'declined' }
]

const currency = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 })
const formatCurrency = (n) => (n == null ? '-' : currency.format(Number(n)))

const statusLabel = (s) => statusOptions.find(o => o.value === s)?.label || s || '-'
const statusColor = (s) => ({
  draft: 'grey-6',
  sent: 'primary',
  approved: 'positive',
  declined: 'negative'
}[s] || 'grey-5')

// İlk yükleme
onMounted(() => {
  fetchQuotes()
})

// Arama & durum değişince tekrar getir
watch([search, status], () => {
  pagination.value.page = 1
  fetchQuotes()
})

// QTable server-side request (sort/pagination değişimleri)
function onServerRequest (props) {
  pagination.value = { ...pagination.value, ...props.pagination }
  fetchQuotes()
}

async function fetchQuotes () {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.rowsPerPage,
      sort_by: pagination.value.sortBy,
      sort_dir: pagination.value.descending ? 'desc' : 'asc',
      search: search.value || undefined,
      status: status.value || undefined
    }

    const { data } = await api.get('/api/quotes', { params })

    // Esnek parse (Laravel paginator veya düz dizi)
    const list = data?.data ?? data?.items ?? data ?? []
    rows.value = list.map(q => ({
      id: q.id,
      customer: q.customer?.company_name ?? q.customer_name ?? '-',
      total_amount: q.total_amount,
      status: q.status
    }))

    // Toplam & sayfa
    totalItems.value = data?.meta?.total ?? data?.total ?? list.length
    const lastPage =
      data?.meta?.last_page ?? data?.last_page ??
      Math.max(1, Math.ceil((totalItems.value || 0) / pagination.value.rowsPerPage))

    // QTable pagination güncelle
    pagination.value = {
      ...pagination.value,
      rowsNumber: totalItems.value,
      page: Math.min(pagination.value.page, lastPage)
    }
  } catch (e) {
    console.error('Teklif listesi alınamadı', e)
    const msg = e?.response?.data?.message || e?.message || 'Teklif listesi alınamadı.'
    Notify.create({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.quotes-page {
  min-height: 100%;
  background:
    radial-gradient(1200px 800px at 85% -10%, rgba(255, 214, 10, 0.18), transparent 60%),
    radial-gradient(900px 600px at -10% 25%, rgba(255, 193, 7, 0.18), transparent 65%),
    linear-gradient(180deg, #fff7d6 0%, #ffffff 55%);
}

/* Cam efektli yüzey + toolbar */
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 193, 7, 0.32);
  border-radius: 16px;
  transition: border-color .25s ease, box-shadow .25s ease;
}
.glass:hover {
  border-color: rgba(255, 193, 7, 0.55);
  box-shadow: 0 14px 30px rgba(0,0,0,0.07);
}
.toolbar { position: sticky; top: 8px; z-index: 1; }

.table-card { overflow: hidden; }

/* Kapsül arama/filtre alanları */
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

/* Durum chip’i: hafif kapsül ve güçlü tipografi */
.status-chip {
  border-radius: 9999px;
  font-weight: 700;
  padding: 2px 10px;
}

/* Bölüm başlığı (mevcut) ufak iyileştirme */
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

</style>
