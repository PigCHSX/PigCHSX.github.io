// utils/api.js
const WORKER_URL = 'https://mose-api.mose.cc.cd'

function callApi(action, params, token) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: WORKER_URL,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { action: action, params: params, token: token },
      success: function(res) {
        // 数据返回了，我们先看看里面有没有 error
        if (res.data && res.data.error) {
          reject(res.data)
        } else {
          // 没有 error 字段，就认为是成功的
          resolve(res.data)
        }
      },
      fail: function(err) {
        reject({ error: err.errMsg })
      }
    })
  })
}

module.exports = { callApi: callApi }