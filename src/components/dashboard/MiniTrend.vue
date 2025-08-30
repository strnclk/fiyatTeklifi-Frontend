<template>
  <div class="mini-trend">
    <svg :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none">
      <polyline
        :points="points"
        fill="none"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [3,4,3,6,5,7,6,9] },
  width: { type: Number, default: 100 },
  height: { type: Number, default: 36 },
  strokeWidth: { type: Number, default: 2 }
})

const points = computed(() => {
  const vals = props.data.length ? props.data : [0]
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  const span = max - min || 1
  const stepX = props.width / (vals.length - 1 || 1)
  return vals
    .map((v, i) => {
      const x = i * stepX
      const y = props.height - ((v - min) / span) * props.height
      return `${x},${y}`
    })
    .join(' ')
})
</script>

<style scoped>
.mini-trend {
  width: 100%;
  height: 36px;
  color: rgba(0,0,0,0.6);
}
svg { width: 100%; height: 100%; display: block; }
</style>
