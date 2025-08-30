<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    :rows-per-page-options="[5,10,20]"
    :pagination="{ rowsPerPage: 5 }"
    flat
  >
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-badge :color="statusColor(props.row.status)" text-color="white">
          {{ statusText(props.row.status) }}
        </q-badge>
      </q-td>
    </template>

    <template #body-cell-total="props">
      <q-td :props="props">{{ fmtCurrency(props.row.total) }}</q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" class="q-gutter-x-sm">
        <q-btn flat round color="primary" icon="visibility" size="sm" @click="$emit('view', props.row.id)" />
        <q-btn flat round color="primary" icon="picture_as_pdf" size="sm" @click="$emit('pdf', props.row.id)" />
      </q-td>
    </template>

    <template #loading>
      <div class="row items-center q-gutter-sm q-pa-md">
        <q-spinner-hourglass size="24px" />
        <span class="text-grey-7">Teklifler yükleniyor...</span>
      </div>
    </template>

    <template #no-data>
      <div class="column items-center q-pa-lg">
        <q-icon name="inbox" size="42px" class="q-mb-sm text-grey-5" />
        <div class="text-subtitle2 text-grey-7 q-mb-sm">Henüz teklif yok</div>
        <q-btn color="amber-8" text-color="black" unelevated icon="add" label="İlk Teklifi Oluştur" to="/quotes/create" />
      </div>
    </template>
  </q-table>
</template>

<script setup>
const props = defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})
defineEmits(['view', 'pdf'])

const columns = [
  { name: 'id', label: 'Teklif No', field: 'id', align: 'left', sortable: true },
  { name: 'customer_name', label: 'Müşteri', field: 'customer_name', align: 'left', sortable: true },
  { name: 'created_at', label: 'Tarih', field: 'created_at', align: 'left', sortable: true,
    format: v => v ? new Date(v).toLocaleDateString('tr-TR') : '' },
  { name: 'total', label: 'Toplam', field: 'total', align: 'right', sortable: true },
  { name: 'status', label: 'Durum', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'İşlemler', field: '', align: 'center', sortable: false }
]

const currency = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 })
const fmtCurrency = (n) => currency.format(Number(n || 0))

const statusText = (s) => ({
  pending: 'Beklemede',
  accepted: 'Kabul Edildi',
  rejected: 'Reddedildi',
  draft: 'Taslak',
  sent: 'Gönderildi',
  expired: 'Süresi Doldu'
}[s] || s)

const statusColor = (s) => ({
  pending: 'orange',
  accepted: 'green',
  rejected: 'red',
  draft: 'grey',
  sent: 'primary',
  expired: 'grey-7'
}[s] || 'grey')
</script>
