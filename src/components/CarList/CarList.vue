<template>
  <van-list
    v-model:loading="loading"
    :finished="props.isLoadAll"
    :finished-text="finishedTextComputed"
    :loading-text="loadingTextComputed"
    @load="onLoad"
    class="car-list"
  >
    <div class="list-header">
      <h1 class="page-title">{{ props.title }}</h1>
      <p class="page-subtitle" v-if="props.subtitle">{{ props.subtitle }}</p>
    </div>

    <div class="list-content">
      <CarCard v-for="car in props.cars" :key="car.id" :car="car" />
    </div>
  </van-list>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import CarCard from './components/CarCard.vue'

export default {
  components: {
    CarCard,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    cars: {
      type: Array,
      required: true,
      default: () => [],
    },
    showLoadMore: {
      type: Boolean,
      default: true,
    },
    isLoadAll: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
    },
    noMoreText: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const { t: $t } = useI18n()

    const loading = ref(false)

    // 计算属性，处理 finished-text 的默认值
    const finishedTextComputed = computed(() => {
      // 如果 noMoreText prop 被提供，则使用提供的值
      // 否则，使用国际化的默认值
      return props.noMoreText !== undefined ? props.noMoreText : $t('common.noMore')
    })

    // 计算属性，处理 loadingText 的默认值
    const loadingTextComputed = computed(() => {
      // 如果 loadingText prop 被提供，则使用提供的值
      // 否则，使用国际化的默认值
      return props.loadingText !== undefined ? props.loadingText : $t('common.loading')
    })

    const onLoad = () => {
      loading.value = true
      emit('load-more')
      // 模拟加载延迟
      setTimeout(() => {
        loading.value = false
      }, 1000)
    }

    return {
      props,
      loading,
      finishedTextComputed,
      loadingTextComputed,
      onLoad,
    }
  },
}
</script>

<style lang="scss" scoped>
.car-list {
  padding: 0 16px;

  .list-header {
    text-align: center;
    margin: 20px 0 30px;

    .page-title {
      font-size: 24px;
      font-weight: bold;
      color: #1a365d;
      margin-bottom: 5px;
    }

    .page-subtitle {
      font-size: 16px;
      color: #666;
    }
  }

  .list-content {
    margin-top: 20px;
  }

  .load-more {
    text-align: center;
    margin: 30px 0;
  }
}
</style>
