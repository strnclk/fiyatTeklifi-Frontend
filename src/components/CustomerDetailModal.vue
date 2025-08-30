<template>
  <q-dialog v-model="model" transition-show="jump-down" transition-hide="jump-up">
    <q-card class="glass detail-card" style="min-width: 460px; max-width: 92vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="row items-center">
          <q-avatar color="amber-8" text-color="black" size="42px" class="q-mr-md">
            {{ initials }}
          </q-avatar>
          <div>
            <div class="text-subtitle1">{{ customer?.company_name || 'Müşteri' }}</div>
            <div class="text-caption text-grey-7">Müşteri Detayı</div>
          </div>
        </div>
        <q-space />
        <q-btn icon="close" round flat dense @click="close" />
      </q-card-section>

      <q-separator inset class="q-mt-sm" />

      <q-card-section>
        <div class="q-gutter-sm">
          <div class="row items-center">
            <q-icon name="person" class="text-amber-8 q-mr-sm" />
            <div>
              <div class="text-caption text-grey-7">İletişim</div>
              <div class="text-body2">{{ customer?.contact_person || '-' }}</div>
            </div>
          </div>
          <div class="row items-center">
            <q-icon name="mail" class="text-amber-8 q-mr-sm" />
            <div>
              <div class="text-caption text-grey-7">E-posta</div>
              <div class="text-body2">
                <a v-if="customer?.email" :href="`mailto:${customer.email}`" class="link">{{ customer.email }}</a>
                <span v-else>-</span>
              </div>
            </div>
          </div>
          <div class="row items-center">
            <q-icon name="call" class="text-amber-8 q-mr-sm" />
            <div>
              <div class="text-caption text-grey-7">Telefon</div>
              <div class="text-body2">
                <a v-if="customer?.phone" :href="`tel:${customer.phone}`" class="link">{{ customer.phone }}</a>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Kapat" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, toRef } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  customer:   { type: Object,  default: null }
})

const emit = defineEmits(['update:modelValue', 'close'])

const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const customer = toRef(props, 'customer')

const initials = computed(() => {
  const name = customer.value?.company_name || ''
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase()).join('') || 'C'
})

function close () {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
.detail-card {
  border: 1px solid rgba(255, 193, 7, 0.35);
}
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
.link {
  color: #333;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>
