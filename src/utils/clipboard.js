/**
 * 剪贴板工具函数
 * 提供跨浏览器的复制功能
 */

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} - 是否复制成功
 */
export const copyToClipboard = async (text) => {
    try {
        // 优先使用现代 Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return true
        }

        // 降级方案：使用 document.execCommand
        return fallbackCopyToClipboard(text)
    } catch (error) {
        console.error('复制失败:', error)
        // 如果现代 API 失败，尝试降级方案
        return fallbackCopyToClipboard(text)
    }
}

/**
 * 降级复制方案
 * @param {string} text - 要复制的文本
 * @returns {boolean} - 是否复制成功
 */
const fallbackCopyToClipboard = (text) => {
    try {
        // 创建临时文本区域
        const textArea = document.createElement('textarea')
        textArea.value = text

        // 设置样式，使其不可见
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        textArea.style.opacity = '0'
        textArea.style.pointerEvents = 'none'

        // 添加到 DOM
        document.body.appendChild(textArea)

        // 选择文本并复制
        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')

        // 清理 DOM
        document.body.removeChild(textArea)

        return successful
    } catch (error) {
        console.error('降级复制方案失败:', error)
        return false
    }
}

/**
 * 从剪贴板读取文本
 * @returns {Promise<string>} - 剪贴板中的文本
 */
export const readFromClipboard = async () => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            return await navigator.clipboard.readText()
        }

        throw new Error('不支持读取剪贴板')
    } catch (error) {
        console.error('读取剪贴板失败:', error)
        throw error
    }
}

/**
 * 检查是否支持剪贴板 API
 * @returns {boolean} - 是否支持
 */
export const isClipboardSupported = () => {
    return !!(navigator.clipboard && window.isSecureContext)
}

/**
 * 检查是否支持复制功能
 * @returns {boolean} - 是否支持
 */
export const isCopySupported = () => {
    return isClipboardSupported() || document.queryCommandSupported('copy')
} 