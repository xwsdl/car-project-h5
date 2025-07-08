/**
 * 微信分享工具函数
 * 处理微信环境下的分享功能
 */

/**
 * 检查是否在微信环境中
 * @returns {boolean} - 是否在微信中
 */
export const isWechatBrowser = () => {
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes('micromessenger')
}

/**
 * 检查是否在微信小程序中
 * @returns {boolean} - 是否在微信小程序中
 */
export const isWechatMiniProgram = () => {
    return window.__wxjs_environment === 'miniprogram'
}

/**
 * 初始化微信 JS-SDK
 * @param {Object} config - 微信配置
 * @returns {Promise} - 初始化结果
 */
export const initWechatSDK = (config) => {
    return new Promise((resolve, reject) => {
        if (!window.wx) {
            reject(new Error('微信 JS-SDK 未加载'))
            return
        }

        window.wx.config({
            debug: false,
            appId: config.appId,
            timestamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: [
                'updateAppMessageShareData',
                'updateTimelineShareData',
                'onMenuShareAppMessage',
                'onMenuShareTimeline'
            ]
        })

        window.wx.ready(() => {
            resolve()
        })

        window.wx.error((error) => {
            reject(error)
        })
    })
}

/**
 * 分享到微信好友
 * @param {Object} shareData - 分享数据
 * @returns {Promise} - 分享结果
 */
export const shareToWechat = (shareData) => {
    return new Promise((resolve, reject) => {
        if (!window.wx) {
            reject(new Error('微信 JS-SDK 未加载'))
            return
        }

        // 使用新版分享接口
        if (window.wx.updateAppMessageShareData) {
            window.wx.updateAppMessageShareData({
                title: shareData.title,
                desc: shareData.desc,
                link: shareData.link,
                imgUrl: shareData.image,
                success: resolve,
                fail: reject
            })
        } else {
            // 降级到旧版接口
            window.wx.onMenuShareAppMessage({
                title: shareData.title,
                desc: shareData.desc,
                link: shareData.link,
                imgUrl: shareData.image,
                success: resolve,
                fail: reject
            })
        }
    })
}

/**
 * 分享到朋友圈
 * @param {Object} shareData - 分享数据
 * @returns {Promise} - 分享结果
 */
export const shareToMoments = (shareData) => {
    return new Promise((resolve, reject) => {
        if (!window.wx) {
            reject(new Error('微信 JS-SDK 未加载'))
            return
        }

        // 使用新版分享接口
        if (window.wx.updateTimelineShareData) {
            window.wx.updateTimelineShareData({
                title: shareData.title,
                link: shareData.link,
                imgUrl: shareData.image,
                success: resolve,
                fail: reject
            })
        } else {
            // 降级到旧版接口
            window.wx.onMenuShareTimeline({
                title: shareData.title,
                link: shareData.link,
                imgUrl: shareData.image,
                success: resolve,
                fail: reject
            })
        }
    })
}

/**
 * 获取微信分享配置
 * @param {string} url - 当前页面 URL
 * @returns {Promise<Object>} - 微信配置
 */
export const getWechatConfig = async (url) => {
    try {
        // 这里需要调用后端接口获取微信 JS-SDK 配置
        // 实际项目中需要根据你的后端 API 进行调整
        const response = await fetch('/api/wechat/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        })

        if (!response.ok) {
            throw new Error('获取微信配置失败')
        }

        return await response.json()
    } catch (error) {
        console.error('获取微信配置失败:', error)
        throw error
    }
}

/**
 * 自动初始化微信分享
 * @param {Object} defaultShareData - 默认分享数据
 */
export const autoInitWechatShare = async (defaultShareData = {}) => {
    if (!isWechatBrowser()) {
        return
    }

    try {
        const config = await getWechatConfig(window.location.href.split('#')[0])
        await initWechatSDK(config)

        // 设置默认分享数据
        if (defaultShareData.title) {
            await shareToWechat(defaultShareData)
            await shareToMoments(defaultShareData)
        }
    } catch (error) {
        console.error('初始化微信分享失败:', error)
    }
} 