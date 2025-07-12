<template>
  <span class="price-display">
    <span class="price-display__value">{{ formattedPrice }}</span>
    <span v-if="showSymbol" class="price-display__currency">{{ currencySymbol }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  price: {
    type: [Number, String],
    required: true
  },
  currency: {
    type: String,
    default: 'rub' // 目前只支持卢布，可扩展
  },
  showSymbol: {
    type: Boolean,
    default: true
  }
})

const { t } = useI18n()

// 数字格式化：每三位加空格
function formatPriceWithSpace(val) {
  if (val === null || val === undefined) return ''
  const str = String(val).replace(/\D/g, '')
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const formattedPrice = computed(() => formatPriceWithSpace(props.price))
const currencySymbol = computed(() => t(`currency.${props.currency}`))
</script>

<style lang="scss" scoped>
.price-display {
  display: inline-flex;
  align-items: baseline;
  font-size: 20px;
  font-weight: bold;
  color: #ff4d4f;
  &__value {
    margin-right: 2px;
    font-size: 20px;
    letter-spacing: 1px;
  }
  &__currency {
    font-size: 18px;
    margin-left: 2px;
    color: #ff4d4f;
  }
}
</style>
