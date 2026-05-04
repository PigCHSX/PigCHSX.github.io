const { callApi } = require('../../utils/api')

Page({
  data: {
    username: '',
    email: '',
    password: ''
  },

  inputUsername(e) {
    this.setData({ username: e.detail.value })
  },
  inputEmail(e) {
    this.setData({ email: e.detail.value })
  },
  inputPassword(e) {
    this.setData({ password: e.detail.value })
  },

  async doRegister() {
    const { username, email, password } = this.data
    if (!username || !email || !password) {
      wx.showToast({ title: '请填写完整信息！', icon: 'none' })
      return
    }

    wx.showLoading({ title: '注册中...' })

    try {
      const result = await callApi('register', { username, email, password })

      if (result.error) {
        throw new Error(result.msg || result.error)
      }

      wx.hideLoading()
      wx.showModal({
        title: '注册成功',
        content: '验证邮件已发送，请前往邮箱查收（有可能在垃圾箱里）并点击链接激活账号后再登录。',
        showCancel: false,
        success: () => {
          wx.navigateBack()
        }
      })
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: '注册失败：' + (err.message || err.error), icon: 'none' })
    }
  },

  goLogin() {
    wx.navigateBack()
  }
})