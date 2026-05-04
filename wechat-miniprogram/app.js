App({
  onLaunch() {
    console.log('水二杂记｜MOSE 小程序启动')
    this.syncLoginState()
  },
  onShow() {
    // 每次小程序切回前台，自动同步登录状态，兜底globalData
    this.syncLoginState()
  },
  // 封装统一的登录状态同步方法，全局复用
  syncLoginState() {
    this.globalData.sb_token = wx.getStorageSync('sb_token') || ''
    this.globalData.sb_user = wx.getStorageSync('sb_user') || null
    this.globalData.sb_username = wx.getStorageSync('sb_username') || ''
  },
  globalData: {
    supabaseUrl: 'https://urecpftjcruwfcdwrcyj.supabase.co',
    supabaseKey: 'sb_publishable_yLWqUQuZbmcsUwE5hwTv2A_wGe1mU0_',
    sb_token: '',
    sb_user: null,
    sb_username: ''
  }
})