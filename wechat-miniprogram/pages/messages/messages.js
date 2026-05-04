const { callApi } = require('../../utils/api')

Page({
  data: {
    content: '',
    picUrl: '',
    messages: [],
    loading: true,
    isLoggedIn: false,
    username: ''
  },

  onLoad() {
    this.checkLogin()
  },

  checkLogin() {
    const app = getApp()
    const token = app.globalData.sb_token
    const user = app.globalData.sb_user
    
    if (!token || !user) {
      wx.showToast({ title: '请先登录！', icon: 'none' })
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/login/login' })
      }, 800)
      return
    }
    
    const username = app.globalData.sb_username || '用户'
    this.setData({
      isLoggedIn: true,
      username: username
    })
    this.loadMessages()
  },

  async loadMessages() {
    this.setData({ loading: true })
    try {
      const data = await callApi('getMessages')
      const messages = (data || []).map(function(msg) {
        return {
          ...msg,
          time: msg.created_at ? new Date(msg.created_at).toLocaleString() : ''
        }
      })
      this.setData({ messages: messages, loading: false })
    } catch (err) {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  onPicUrlInput(e) {
    this.setData({ picUrl: e.detail.value })
  },

  async postMessage() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录！', icon: 'none' })
      return
    }

    const { content, picUrl } = this.data
    if (!content.trim()) {
      wx.showToast({ title: '留言内容不能为空', icon: 'none' })
      return
    }

    const app = getApp()
    const token = app.globalData.sb_token
    const user = app.globalData.sb_user
    const username = app.globalData.sb_username

    wx.showLoading({ title: '发布中...' })
    try {
      await callApi('postMessage', {
        username: username,
        content: content.trim(),
        pic_url: picUrl.trim() || null,
        user_id: user ? user.id : null
      }, token)

      wx.hideLoading()
      wx.showToast({ title: '发布成功！', icon: 'success' })
      this.setData({ content: '', picUrl: '' })
      this.loadMessages()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: '发布失败', icon: 'none' })
    }
  },

  doLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('sb_token')
          wx.removeStorageSync('sb_user')
          wx.removeStorageSync('sb_username')
          const app = getApp()
          app.globalData.sb_token = ''
          app.globalData.sb_user = null
          app.globalData.sb_username = ''
          wx.showToast({ title: '已退出登录', icon: 'none' })
          setTimeout(function() {
            wx.redirectTo({ url: '/pages/login/login' })
          }, 800)
        }
      }
    })
  },

  onImageError() {
    // 图片加载失败静默处理
  }
})