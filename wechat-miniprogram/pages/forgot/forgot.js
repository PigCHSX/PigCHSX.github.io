const { callApi } = require('../../utils/api')

Page({
  data: {
    email: ''
  },

  inputEmail(e) {
    this.setData({ email: e.detail.value })
  },

  async doReset() {
    const { email } = this.data
    if (!email) {
      wx.showToast({ title: '请输入邮箱', icon: 'none' })
      return
    }

    wx.showLoading({ title: '发送中...' })

    try {
      const result = await callApi('resetPassword', { email })

      if (result.error) throw new Error(result.error)

      wx.hideLoading()
      wx.showModal({
        title: '发送成功',
        content: '密码重置邮件已发送，请前往邮箱查收。',
        showCancel: false
      })
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: '发送失败：' + err.message, icon: 'none' })
    }
  }
})