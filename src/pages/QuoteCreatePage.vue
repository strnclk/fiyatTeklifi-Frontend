<template>
  <q-page class="q-pa-md quote-create-page">
    <div class="text-h5 text-weight-bold q-mb-md">Teklif Oluştur</div>

    <q-card flat bordered>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="48px" />
      </q-inner-loading>

      <q-form class="q-gutter-md" @submit.prevent="onSubmit">
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Müşteri Seçimi</div>
          <div class="row items-center q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-select v-model="customer" :options="customerOptions" option-label="label" option-value="value" label="Müşteri" outlined dense emit-value map-options />
            </div>
            <div class="col-12 col-md-auto">
              <q-btn outline label="+ Yeni" color="primary" @click="openNewCustomer" />
            </div>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Teklif Bilgileri</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="title" label="Başlık" outlined dense :rules="[rules.required]" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="validUntil" type="date" label="Geçerlilik" outlined dense :rules="[rules.required]" />
            </div>
            <div class="col-12">
              <q-input v-model="description" type="textarea" label="Açıklama" outlined autogrow />
            </div>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Hizmet Kalemleri</div>
          <q-table :rows="items" :columns="itemColumns" row-key="id" flat>
            <template #top>
              <q-btn dense color="primary" label="+ Kalem Ekle" @click="addItem" />
            </template>

            <template #body-cell-service="props">
              <q-td :props="props">
                <q-input v-model="props.row.service" dense outlined placeholder="Hizmet adı" />
              </q-td>
            </template>

            <template #body-cell-qty="props">
              <q-td :props="props">
                <q-input v-model.number="props.row.qty" type="number" min="0" dense outlined style="max-width: 120px" />
              </q-td>
            </template>

            <template #body-cell-unit="props">
              <q-td :props="props">
                <q-input v-model="props.row.unit" dense outlined style="max-width: 140px" />
              </q-td>
            </template>

            <template #body-cell-unitPrice="props">
              <q-td :props="props">
                <q-input v-model.number="props.row.unitPrice" type="number" min="0" dense outlined style="max-width: 140px" />
              </q-td>
            </template>

            <template #body-cell-total="props">
              <q-td :props="props">₺{{ (Number(props.row.qty||0) * Number(props.row.unitPrice||0)).toFixed(2) }}</q-td>
            </template>
          </q-table>

          <div class="row justify-between items-center q-mt-md">
            <div class="text-subtitle1">Toplam: ₺{{ total.toFixed(2) }}</div>
            <div>
              <q-btn flat label="Taslak Kaydet" color="primary" class="q-mr-sm" @click="saveDraft" />
              <q-btn label="Teklif Gönder" color="amber-8" text-color="black" type="submit" :loading="submitting" />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>

    <!-- Yeni Müşteri Modalı -->
    <q-dialog v-model="newCustomerOpen" persistent>
      <q-card style="min-width: 460px; max-width: 95vw;">
        <q-card-section class="row items-center q-gutter-sm">
          <q-icon name="person_add" />
          <div class="text-h6">Yeni Müşteri</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form ref="newCustomerFormRef" class="q-gutter-md" @submit.prevent="saveNewCustomer">
            <q-input v-model="newCustomer.name" label="Ad Soyad / Ünvan" :rules="[rules.required]" dense outlined rounded />
            <q-input v-model="newCustomer.email" type="email" label="E-posta" :rules="[rules.email]" dense outlined rounded />
            <q-input v-model="newCustomer.phone" label="Telefon" dense outlined rounded />
            <q-input v-model="newCustomer.company" label="Şirket" dense outlined rounded />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Vazgeç" color="grey-8" v-close-popup />
          <q-btn color="amber-8" text-color="black" label="Kaydet" :loading="savingCustomer" @click="saveNewCustomer" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const submitting = ref(false)

const customer = ref(null)
const customerOptions = ref([])

const title = ref('')
const description = ref('')
const validUntil = ref('')

const items = ref([])
const itemColumns = [
  { name: 'service', label: 'Hizmet', field: 'service', align: 'left' },
  { name: 'qty', label: 'Miktar', field: 'qty', align: 'right' },
  { name: 'unit', label: 'Birim', field: 'unit', align: 'left' },
  { name: 'unitPrice', label: 'Birim Fiyat', field: 'unitPrice', align: 'right' },
  { name: 'total', label: 'Toplam', field: row => Number(row.qty||0)*Number(row.unitPrice||0), align: 'right' }
]

const total = computed(() => items.value.reduce((sum, r) => sum + (Number(r.qty||0) * Number(r.unitPrice||0)), 0))

onMounted(async () => {
  await initialize()
})

async function initialize () {
  loading.value = true
  try {
    if (!authStore.initialized) {
      await authStore.initialize()
    }
    // TODO: Müşteri listesi API'den çekilecekse burada çağırın.
    // Örn: const { data } = await api.get('/api/customers'); customerOptions.value = data.map(c => ({ label: c.name, value: c.id }))
  } catch (e) {
    console.error(e)
    Notify.create({ type: 'negative', message: 'Sayfa hazırlanırken bir hata oluştu' })
  } finally {
    loading.value = false
  }
}

function addItem () {
  items.value.push({ id: Date.now() + Math.random(), service: '', qty: 1, unit: 'adet', unitPrice: 0 })
}

async function onSubmit () {
  if (!customer.value) {
    Notify.create({ type: 'warning', message: 'Lütfen müşteri seçin' })
    return
  }
  if (!title.value) {
    Notify.create({ type: 'warning', message: 'Başlık zorunludur' })
    return
  }
  if (!items.value.length) {
    Notify.create({ type: 'warning', message: 'En az bir hizmet kalemi ekleyin' })
    return
  }
  submitting.value = true
  try {
    // TODO: Teklif oluşturma API çağrısı yapılacak yer.
    // await api.post('/api/quotes', { customer_id: customer.value, title: title.value, description: description.value, valid_until: validUntil.value, items: items.value })
    Notify.create({ type: 'positive', message: 'Teklif oluşturuldu' })
    // Formu sıfırla
    title.value = ''
    description.value = ''
    validUntil.value = ''
    items.value = []
    // Dashboard'a dön ve Son Teklifler listesinin yenilenmesini sağla
    await router.push('/')
  } catch (e) {
    console.error(e)
    Notify.create({ type: 'negative', message: 'Teklif oluşturulamadı' })
  } finally {
    submitting.value = false
  }
}

function saveDraft () {
  Notify.create({ type: 'info', message: 'Taslak olarak kaydedildi (yerel)' })
}

// Yeni müşteri modalı
const newCustomerOpen = ref(false)
const newCustomerFormRef = ref(null)
const savingCustomer = ref(false)
const newCustomer = reactive({ name: '', email: '', phone: '', company: '' })

function openNewCustomer () {
  newCustomer.name = ''
  newCustomer.email = ''
  newCustomer.phone = ''
  newCustomer.company = ''
  newCustomerOpen.value = true
}

async function saveNewCustomer () {
  const ok = await newCustomerFormRef.value?.validate?.()
  if (ok === false) return
  savingCustomer.value = true
  try {
    // TODO: Backend'e müşteri oluşturma isteği atın ve dönen id'yi kullanın
    // const { data } = await api.post('/api/customers', newCustomer)
    const id = Date.now()
    const option = { label: newCustomer.name, value: id }
    customerOptions.value = [option, ...customerOptions.value]
    customer.value = id
    Notify.create({ type: 'positive', message: 'Müşteri eklendi' })
    newCustomerOpen.value = false
  } catch (e) {
    console.error(e)
    Notify.create({ type: 'negative', message: 'Müşteri eklenemedi' })
  } finally {
    savingCustomer.value = false
  }
}

const rules = {
  required: v => !!(v && String(v).trim()) || 'Bu alan zorunludur',
  email: v => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'Geçerli bir e-posta girin'
}
</script>

<style scoped>
.quote-create-page :deep(.q-field__native) { font-size: 1.02rem; }
.quote-create-page :deep(.q-field__label) { font-size: 0.96rem; }
</style>
