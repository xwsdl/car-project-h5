/**
* 图片压缩工具
* 使用 Canvas 进行图片压缩，支持质量调节和尺寸限制
*/

/**
 * 压缩图片
 * @param {File} file - 原始图片文件
 * @param {Object} options - 压缩选项
 * @param {number} options.maxWidth - 最大宽度
 * @param {number} options.maxHeight - 最大高度
 * @param {number} options.quality - 压缩质量 (0-1)
 * @param {number} options.maxSize - 最大文件大小 (bytes)
 * @returns {Promise<File>} 压缩后的文件
 */
export function compressImage(file, options = {}) {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8,
    maxSize = 3 * 1024 * 1024 // 3MB
  } = options

  return new Promise((resolve, reject) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      reject(new Error('不是有效的图片文件'))
      return
    }

    // 如果文件已经小于最大大小，直接返回
    if (file.size <= maxSize) {
      resolve(file)
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // 计算压缩后的尺寸
      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      // 设置 canvas 尺寸
      canvas.width = width
      canvas.height = height

      // 绘制图片到 canvas
      ctx.drawImage(img, 0, 0, width, height)

      // 转换为 Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('图片压缩失败'))
            return
          }

          // 创建新的 File 对象
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })

          console.log('图片压缩完成:', {
            originalSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            compressedSize: `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
            compressionRatio: `${Math.round((1 - compressedFile.size / file.size) * 100)}%`,
            dimensions: `${width}x${height}`,
            quality: quality
          })

          resolve(compressedFile)
        },
        file.type,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }

    // 读取文件
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target.result
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 压缩头像图片
 * @param {File} file - 原始头像文件
 * @returns {Promise<File>} 压缩后的头像文件
 */
export function compressAvatar(file) {
  console.log('开始压缩头像文件:', {
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    type: file.type
  })

  return compressImage(file, {
    maxWidth: 400,  // 头像最大宽度
    maxHeight: 400, // 头像最大高度
    quality: 0.8,   // 压缩质量
    maxSize: 3 * 1024 * 1024 // 3MB
  })
}

/**
 * 获取图片信息
 * @param {File} file - 图片文件
 * @returns {Promise<Object>} 图片信息
 */
export function getImageInfo(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const info = {
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
        sizeInMB: (file.size / 1024 / 1024).toFixed(2)
      }

      console.log('图片详细信息:', info)
      resolve(info)
    }

    img.onerror = () => {
      reject(new Error('图片信息获取失败'))
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target.result
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsDataURL(file)
  })
}
