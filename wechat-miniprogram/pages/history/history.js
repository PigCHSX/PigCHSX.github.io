var { callApi } = require('../../utils/api')

Page({
  data: {
    submissions: [],
    loading: true,
    isLoggedIn: false,
    username: ''
  },

  onLoad: function() {
    this.checkLogin()
  },

  checkLogin: function() {
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
    this.setData({ isLoggedIn: true, username: username })
    this.loadSubmissions()
  },

  loadSubmissions: function() {
    var that = this
    var app = getApp()
    var token = app.globalData.sb_token
    var user = app.globalData.sb_user
    
    that.setData({ loading: true })
    
    callApi('getSubmissions', { userId: user.id }, token)
      .then(function(data) {
        var submissions = []
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            var item = data[i]
            var displayTime = ''
            if (item.created_at) {
              var d = new Date(item.created_at)
              var y = d.getFullYear()
              var m = ('0' + (d.getMonth() + 1)).slice(-2)
              var day = ('0' + d.getDate()).slice(-2)
              var h = ('0' + d.getHours()).slice(-2)
              var min = ('0' + d.getMinutes()).slice(-2)
              displayTime = y + '-' + m + '-' + day + ' ' + h + ':' + min
            }
            var preview = ''
            if (item.content) {
              preview = item.content.slice(0, 60)
            }
            submissions.push({
              id: item.id,
              title: item.title,
              content: item.content,
              preview: preview,
              displayTime: displayTime,
              status: item.status || '未读'
            })
          }
        }
        that.setData({ submissions: submissions, loading: false })
      })
      .catch(function(err) {
        that.setData({ loading: false })
        console.log('加载投稿记录失败', err)
      })
  },

  doLogout: function() {
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