<template>
  <q-card class="stat-card glass" bordered>
    <q-card-section class="row items-center no-wrap">
      <q-avatar :color="avatarColor" text-color="white" size="44px" class="q-mr-md">
        <q-icon :name="icon"/>
      </q-avatar>

      <div class="col">
        <div class="text-caption text-grey-7">{{ title }}</div>
        <div class="text-h5 text-weight-bold">{{ displayValue }}</div>
      </div>

      <q-btn
        v-if="to"
        color="amber-8"
        text-color="black"
        size="sm"
        unelevated
        :label="buttonLabel"
        :to="to"
      />
    </q-card-section>

    <q-separator />
    <q-card-section>
      <MiniTrend :data="trend" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import MiniTrend from './MiniTrend.vue'

const props = defineProps({
  title: String,
  value: [String, Number],
  currency: { type: Boolean, default: false },
  icon: { type: String, default: 'insights' },
  avatarColor: { type: String, default: 'primary' },
  trend: { type: Array, default: () => [3,4,3,6,5,7,6,9] },
  to: String,
  buttonLabel: { type: String, default: 'Detay' }
})

const currencyFmt = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 })
const displayValue = computed(() => {
  if (props.currency) return currencyFmt.format(Number(props.value || 0))
  return props.value ?? 0
})
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 193, 7, 0.32);
  border-radius: 16px;
  transition: border-color .25s ease, box-shadow .25s ease, transform .18s ease;
}
.glass:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(0,0,0,0.07); }
.stat-card { height: 100%; }
</style>
