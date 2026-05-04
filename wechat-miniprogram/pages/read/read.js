Page({
  data: {
    book: 1,
    page: 1,
    imgSrc: '/images/loading.png',
    pageInputValue: '1'
  },

  onLoad() {
    console.log('阅读页加载完成')
    this.updateImg()
  },

  changeBook(e) {
    var book = parseInt(e.currentTarget.dataset.book)
    this.setData({
      book: book,
      page: 1,
      pageInputValue: '1',
      imgSrc: '/images/loading.png'
    })
    this.updateImg()
  },

  updateImg() {
    var that = this
    var book = that.data.book
    var page = that.data.page
    var networkSrc = 'https://mose.cc.cd/images/' + book + '-' + page + '.jpg?t=' + new Date().getTime()

    // 先短暂显示 loading.png，然后切换为网络图片
    that.setData({ imgSrc: '/images/loading.png' })

    // 用定时器给一个微小延迟，确保 loading 闪现后开始加载网络图
    setTimeout(function() {
      that.setData({ imgSrc: networkSrc })
    }, 50)
  },

  goPrev() {
    var that = this
    var page = that.data.page
    if (page <= 1) {
      wx.showToast({ title: '已经是第一页了！', icon: 'none' })
      return
    }
    var newPage = page - 1
    that.setData({
      page: newPage,
      pageInputValue: String(newPage),
      imgSrc: '/images/loading.png'
    })
    that.updateImg()
  },

  goNext() {
    var that = this
    var page = that.data.page
    var newPage = page + 1
    that.setData({
      page: newPage,
      pageInputValue: String(newPage),
      imgSrc: '/images/loading.png'
    })
    that.updateImg()
  },

  goPage(e) {
    var that = this
    var page = parseInt(e.currentTarget.dataset.page)
    that.setData({
      page: page,
      pageInputValue: String(page),
      imgSrc: '/images/loading.png'
    })
    that.updateImg()
  },

  onPageInput(e) {
    this.setData({ pageInputValue: e.detail.value })
  },

  jumpToPage() {
    var that = this
    var p = parseInt(that.data.pageInputValue)
    if (isNaN(p) || p < 1) {
      wx.showToast({ title: '请输入有效的页码！', icon: 'none' })
      that.setData({ pageInputValue: String(that.data.page) })
      return
    }
    that.setData({
      page: p,
      pageInputValue: String(p),
      imgSrc: '/images/loading.png'
    })
    that.updateImg()
  },

  onImageError() {
    var that = this
    var book = that.data.book
    var page = that.data.page
    wx.showToast({
      title: '第' + book + '卷第' + page + '页的图片尚未上传',
      icon: 'none',
      duration: 2000
    })
  }
})