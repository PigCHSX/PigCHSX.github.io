Page({
  data: {
    motto: '水二杂记｜MOSE',
    fadeOut: false  // 控制淡出动画的开关
  },

  onLoad() {
    console.log('闪屏页加载完成，将在2.2秒后开始淡出跳转')

    // 2.2秒后，开始淡出动画
    const fadeOutTimer = setTimeout(() => {
      this.setData({ fadeOut: true })
    }, 2200)

    // 2.8秒后（给淡出动画预留0.6秒时间），执行跳转
    const redirectTimer = setTimeout(() => {
      wx.redirectTo({
        url: '/pages/main/main'
      })
    }, 2800)

    // 如果页面被意外关闭，清理定时器
    this.onUnload = () => {
      if (fadeOutTimer) clearTimeout(fadeOutTimer)
      if (redirectTimer) clearTimeout(redirectTimer)
    }
  }
})