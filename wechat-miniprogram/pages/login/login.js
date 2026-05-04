const { callApi } = require('../../utils/api')

Page({
  data: {
    email: '',
    password: ''
  },

  onLoad() {
    console.log('登录页加载')
  },

  inputEmail(e) {
    this.setData({ email: e.detail.value })
  },

  inputPassword(e) {
    this.setData({ password: e.detail.value })
  },

  async doLogin() {
    const { email, password } = this.data
    if (!email || !password) {
      wx.showToast({ title: '请输入邮箱和密码', icon: 'none' })
      return
    }

    wx.showLoading({ title: '登录中...' })

    try {
      const result = await callApi('login', { email, password })

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      // 保存登录凭证（全部使用传统语法，避免 ?. 和 ??）
      if (result.access_token) {
        wx.setStorageSync('sb_token', result.access_token)
      }
      if (result.user) {
        wx.setStorageSync('sb_user', result.user)
      }

      // 提取用户名
      let username = ''
      if (result.user && result.user.user_metadata && result.user.user_metadata.username) {
        username = result.user.user_metadata.username
      } else if (result.user && result.user.email) {
        username = result.user.email.split('@')[0]
      }
      wx.setStorageSync('sb_username', username)

      // 同步到 globalData
      const app = getApp()
      app.globalData.sb_token = result.access_token || ''
      app.globalData.sb_user = result.user || null
      app.globalData.sb_username = username

      wx.hideLoading()
      wx.showToast({ title: '登录成功！', icon: 'success' })
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/submit/submit' })
      }, 800)

    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: '登录失败：' + (err.message || err.error_description || err.error), icon: 'none' })
    }
  },

  goRegister() {
    wx.navigateTo({ url: '/pages/register/register' })
  }
})