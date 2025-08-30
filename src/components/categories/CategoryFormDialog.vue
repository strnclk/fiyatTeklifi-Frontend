<template>
  <q-dialog v-model="model" persistent>
    <q-card class="glass form-card" style="min-width:520px;max-width:92vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-subtitle1">
          {{ form.id ? 'Kategori Düzenle' : 'Yeni Kategori' }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="form.name"
          label="Ad"
          dense
          outlined
          :bg-color="inputBg"
          :rules="[rules.required]"
          lazy-rules
        >
          <template #prepend><q-icon name="category" /></template>
        </q-input>

        <q-input
          v-model="form.description"
          label="Açıklama"
          type="textarea"
          autogrow
          outlined
          :bg-color="inputBg"
        >
          <template #prepend><q-icon name="notes" /></template>
        </q-input>

        <div class="row items-center">
          <q-toggle v-model="form.is_active" label="Aktif" color="primary" />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="İptal" v-close-popup />
        <q-btn
          :loading="saving"
          color="amber-8"
          text-color="black"
          unelevated
          icon="save"
          label="Kaydet"
          @click="save"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import { api } from 'boot/axios'
import { Notify } from 'quasar'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  record: { type: Object, default: () => null }
})
const emit = defineEmits(['update:modelValue', 'saved'])

const model = ref(props.modelValue)
watch(() => props.modelValue, v => (model.value = v))
watch(model, v => emit('update:modelValue', v))

const inputBg = 'white'
const saving = ref(false)
const form = reactive({ id: null, name: '', description: '', is_active: true })

watch(() => props.record, (r) => {
  Object.assign(form, {
    id: r?.id ?? null,
    name: r?.name ?? '',
    description: r?.description ?? '',
    is_active: r?.is_active ?? true
  })
}, { immediate: true })

const rules = {
  required: v => !!(v && String(v).trim()) || 'Bu alan zorunludur'
}

async function save () {
  if (!form.name?.trim()) {
    Notify.create({ type: 'warning', message: 'Lütfen ad girin.' })
    return
  }
  saving.value = true
  try {
    let res
    if (form.id) {
      res = await api.put(`/api/service-categories/${form.id}`, form)
      Notify.create({ type: 'positive', message: 'Kategori güncellendi.' })
    } else {
      res = await api.post('/api/service-categories', form)
      Notify.create({ type: 'positive', message: 'Kategori eklendi.' })
    }
    const payload = res?.data?.data || res?.data || form
    emit('saved', payload)
    model.value = false
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || 'Kayıt sırasında bir hata oluştu.'
    Notify.create({ type: 'negative', message: msg })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 193, 7, 0.32);
  border-radius: 16px;
}
.form-card { overflow: hidden; }
</style>
