<template>
  <q-page class="dashboard-page q-pa-md">
    <div class="page-container">
      <PageHeader :title="`Hoş Geldiniz, ${user?.name || 'Kullanıcı'}`" subtitle="Genel bakış ve hızlı işlemler" />

      <!-- Stat Cards -->
      <div class="row q-col-gutter-md q-mb-lg cards-equal items-stretch">
        <div class="col-12 col-sm-6 col-md-3 card-col">
          <StatCard
            title="Toplam Teklif"
            :value="stats.totalQuotes"
            icon="summarize"
            avatar-color="primary"
            :trend="[3,5,6,8,7,9,10,12]"
            to="/quotes"
            button-label="Detay"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 card-col">
          <StatCard
            title="Bekleyen"
            :value="stats.pendingQuotes"
            icon="hourglass_empty"
            avatar-color="orange"
            :trend="[2,2,3,4,3,5,4,6]"
            to="/quotes?status=pending"
            button-label="Görüntüle"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 card-col">
          <StatCard
            title="Kabul Edilen"
            :value="stats.acceptedQuotes"
            icon="task_alt"
            avatar-color="positive"
            :trend="[1,3,4,6,6,7,8,9]"
            to="/quotes?status=accepted"
            button-label="Görüntüle"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 card-col">
          <StatCard
            title="Aylık Ciro"
            :value="stats.monthlyRevenue"
            :currency="true"
            icon="paid"
            avatar-color="indigo"
            :trend="[20,24,22,28,31,30,34,38]"
            to="/reports"
            button-label="Rapor"
          />
        </div>
      </div>

      <!-- Recent & Chart + Quick Actions -->
      <div class="row q-col-gutter-md cards-equal items-stretch">
        <div class="col-12">
          <SectionCard title="Son Teklifler" icon="history">
            <template #actions>
              <q-btn color="amber-8" text-color="black" icon="add" label="Yeni Teklif" to="/quotes/create" unelevated />
            </template>

            <RecentQuotesTable
              class="bigger-table"
              :rows="recentQuotes"
              :loading="loading"
              @view="viewQuote"
              @pdf="downloadPdf"
            />
          </SectionCard>
        </div>

        <div class="col-12 col-md-8 card-col">
          <SectionCard title="Aylık Performans" icon="stacked_line_chart">
            <div class="q-pt-md">
              <MiniTrend :data="performance" :height="80" :stroke-width="3" />
              <div class="text-caption text-grey-7 q-mt-sm">
                * Basit trend görünümü. İstersen ApexCharts / ECharts ekleyebiliriz.
              </div>
            </div>
          </SectionCard>
        </div>

        <div class="col-12 col-md-4 card-col">
          <QuickActions />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
import PageHeader from 'components/PageHeader.vue'

import StatCard from 'components/dashboard/StatCard.vue'
import SectionCard from 'components/dashboard/SectionCard.vue'
import RecentQuotesTable from 'components/dashboard/RecentQuotesTable.vue'
import QuickActions from 'components/dashboard/QuickActions.vue'
import MiniTrend from 'components/dashboard/MiniTrend.vue'

const router = useRouter()

// user (auth store’dan besleyebilirsin)
const user = ref({ name: 'Admin' })

const stats = ref({
  totalQuotes: 0,
  pendingQuotes: 0,
  acceptedQuotes: 0,
  monthlyRevenue: 0
})

const recentQuotes = ref([])
const performance = ref([12,15,14,18,20,22,21,26,24,28,30,33])
const loading = ref(true)

// actions
const viewQuote = (id) => router.push(`/quotes/${id}`)
const downloadPdf = async (_id) => {
  try {
    // Son Teklifler listesinden yazdırılabilir HTML oluştur
    const rows = recentQuotes.value || []
    const fmtCurrency = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(Number(n || 0))
    const statusText = (s) => ({ pending:'Beklemede', accepted:'Kabul Edildi', rejected:'Reddedildi', draft:'Taslak', sent:'Gönderildi', expired:'Süresi Doldu' }[s] || s)

    const tableRows = rows.map((r, i) => `
      <tr>
        <td>${r.id ?? ''}</td>
        <td>${r.customer_name ?? ''}</td>
        <td>${r.created_at ? new Date(r.created_at).toLocaleDateString('tr-TR') : ''}</td>
        <td style="text-align:right;">${fmtCurrency(r.total)}</td>
        <td>${statusText(r.status)}</td>
      </tr>`).join('')

    const html = `<!doctype html>
      <html lang="tr">
      <head>
        <meta charset="utf-8" />
        <title>Son Teklifler</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; color:#222; }
          h1 { font-size: 18px; margin-bottom: 8px; }
          .muted { color:#666; font-size: 12px; margin-bottom: 12px; }
          table { width:100%; border-collapse: collapse; font-size: 12px; }
          th, td { border:1px solid #ddd; padding:8px; }
          th { background:#f5f5f5; text-align:left; }
        </style>
      </head>
      <body>
        <h1>Son Teklifler</h1>
        <div class="muted">Tarih: ${new Date().toLocaleString('tr-TR')}</div>
        <table>
          <thead>
            <tr>
              <th style="width:12%">Teklif No</th>
              <th>Müşteri</th>
              <th style="width:16%">Tarih</th>
              <th style="width:16%">Toplam</th>
              <th style="width:16%">Durum</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
      </html>`

    const w = window.open('', '_blank')
    if (!w) { Notify.create({ type:'warning', message:'Açılır pencere engellendi' }); return }
    w.document.open()
    w.document.write(html)
    w.document.close()
    w.focus()
    // Yazdır ve kapat
    w.print()
    // Bazı tarayıcılarda kullanıcı etkileşimi gerekebilir, otomatik kapatmayı geciktiriyoruz
    setTimeout(() => { try { w.close() } catch(_) {} }, 1000)
  } catch (e) {
    console.error(e)
    Notify.create({ type:'negative', message:'PDF hazırlama sırasında hata oluştu' })
  }
}

onMounted(fetchDashboardData)
onActivated(fetchDashboardData)

async function fetchDashboardData () {
  loading.value = true
  try {
    // Teklifleri çek
    const { data } = await api.get('/api/quotes', { params: { per_page: 50 } })
    const quotes = Array.isArray(data) ? data : (data?.data || [])

    // İstatistikleri hesapla
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let total = 0
    let pending = 0
    let accepted = 0
    let monthlyRevenue = 0

    for (const q of quotes) {
      total++
      const status = (q.status || q.state || '').toString().toLowerCase()
      if (status === 'pending') pending++
      if (status === 'accepted' || status === 'approved') accepted++

      // Aylık ciro: bu ay oluşturulan ve kabul edilenlerin toplamı
      const created = new Date(q.created_at || q.date || q.createdAt || Date.now())
      if (created.getMonth() === currentMonth && created.getFullYear() === currentYear && (status === 'accepted' || status === 'approved')) {
        const amount = Number(q.total ?? q.grand_total ?? q.amount ?? 0)
        if (!Number.isNaN(amount)) monthlyRevenue += amount
      }
    }

    stats.value = {
      totalQuotes: total,
      pendingQuotes: pending,
      acceptedQuotes: accepted,
      monthlyRevenue: monthlyRevenue
    }

    // Son teklifler: tarihe göre sırala ve ilk 5'i al
    recentQuotes.value = quotes
      .slice()
      .sort((a, b) => new Date(b.created_at || b.date || b.createdAt || 0) - new Date(a.created_at || a.date || a.createdAt || 0))
      .slice(0, 5)
  } catch (e) {
    console.error(e)
    Notify.create({ type:'negative', message:'Veriler yüklenirken bir hata oluştu' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100%;
  background:
    radial-gradient(1200px 800px at 85% -10%, rgba(255, 214, 10, 0.18), transparent 60%),
    radial-gradient(900px 600px at -10% 25%, rgba(255, 193, 7, 0.18), transparent 65%),
    linear-gradient(180deg, #fff7d6 0%, #ffffff 55%);
}
.page-container { max-width: 1200px; margin: 0 auto; }

/* ---- Kart yükseklik hizalama ---- */
.cards-equal { align-items: stretch; }
.card-col { display: flex; }
.card-col > * { width: 100%; }
.card-col :deep(.q-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card-col :deep(.q-card__section:last-child) {
  margin-top: auto; /* içeriğin son bölümü alta itilsin */
}

/* ---- Dashboard tipografi büyütme ---- */
.dashboard-page :deep(.q-card__section .text-h6) {
  font-size: 1.15rem; /* bölüm başlıkları */
}
.dashboard-page :deep(.q-card__section .text-subtitle1) {
  font-size: 1.05rem;
}
.dashboard-page :deep(.q-table) {
  font-size: 1rem;
}

/* ---- Dashboard buton boyutu artırma ---- */
.dashboard-page :deep(.q-btn) {
  font-size: 1.02rem;
  padding: 10px 16px;
  border-radius: 12px;
}
.dashboard-page :deep(.q-btn .q-btn__content) {
  font-weight: 600;
}

/* ---- Sadece Son Teklifler tablosu için daha büyük yazı ---- */
.bigger-table :deep(.q-table) {
  font-size: 1.08rem; /* hücre metinleri */
}
.bigger-table :deep(.q-table thead th) {
  font-size: 1.02rem; /* başlıklar biraz büyüsün */
}
.bigger-table :deep(.q-table tbody td) {
  padding-top: 12px;
  padding-bottom: 12px;
}
.bigger-table :deep(.q-badge) {
  font-size: 0.95rem;
  padding: 6px 10px;
}
.bigger-table :deep(td .q-btn) {
  font-size: 1rem;         /* tablo içi aksiyon butonları */
  width: 34px; height: 34px; /* round butonlar biraz büyüsün */
}
</style>
