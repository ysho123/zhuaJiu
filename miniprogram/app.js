const ald = require('./AldUtils/ald-stat.js')

//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'rea-a6b48a',
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})
