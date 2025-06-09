import { ref, onMounted } from 'vue'

export function useScrollToBottom(containerRef, threshold = 50) {
  const isAtBottom = ref(false)

  const checkIfAtBottom = () => {
    if (!containerRef.value) return

    const container = containerRef.value
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    // 判断是否到达底部
    isAtBottom.value = scrollTop + clientHeight >= scrollHeight - threshold
  }

  // 滚动到底部
  const scrollToBottom = () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  }

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', checkIfAtBottom)
    }
  })

  return {
    isAtBottom,
    scrollToBottom,
    checkIfAtBottom,
  }
}
