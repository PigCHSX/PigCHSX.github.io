const { callApi } = require('../../utils/api')

Page({
  data: {
    title: '',
    content: '',
    picUrl: '',
    isLoggedIn: false,
    username: '',
    showTipsModal: false
  },

  onLoad() {
    this.checkLogin()
  },

  checkLogin() {
    var app = getApp()
    var token = app.globalData.sb_token
    var user = app.globalData.sb_user
    
    if (!token || !user) {
      wx.showToast({ title: '请先登录！', icon: 'none' })
      setTimeout(function() {
        wx.redirectTo({ url: '/pages/login/login' })
      }, 800)
      return
    }
    
    var username = app.globalData.sb_username || '用户'
    this.setData({
      isLoggedIn: true,
      username: username
    })
  },

  showTips() {
    this.setData({ showTipsModal: true })
  },
  hideTips() {
    this.setData({ showTipsModal: false })
  },

  onTitleInput(e) { this.setData({ title: e.detail.value }) },
  onContentInput(e) { this.setData({ content: e.detail.value }) },
  onPicUrlInput(e) { this.setData({ picUrl: e.detail.value }) },

  async send() {
    var title = this.data.title
    var content = this.data.content
    var picUrl = this.data.picUrl
    if (!title.trim() || !content.trim()) {
      wx.showToast({ title: '标题和内容不能为空！', icon: 'none' })
      return
    }

    var app = getApp()
    var token = app.globalData.sb_token
    var user = app.globalData.sb_user
    if (!user) {
      wx.showToast({ title: '请先登录！', icon: 'none' })
      return
    }

    wx.showLoading({ title: '投稿中...' })

    try {
      await callApi('postSubmission', {
        user_id: user.id,
        username: this.data.username,
        title: title.trim(),
        content: content.trim(),
        pic_url: picUrl.trim() || null,
        status: '未读'
      }, token)

      wx.hideLoading()
      wx.showToast({ title: '✅ 投稿成功！', icon: 'success' })
      this.setData({ title: '', content: '', picUrl: '' })
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: '❌ 投稿失败', icon: 'none' })
    }
  },

  doLogout() {
    var that = this
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('sb_token')
          wx.removeStorageSync('sb_user')
          wx.removeStorageSync('sb_username')
          var app = getApp()
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
  }
})