//app.js
require('./utils/v-request.js')

App({
  isAu: false,
  version: 'v0.0.4', //版本号
  /**
   * 
   */
  onLaunch: function () {

  },
  globalData: {

  },
  showErrorModal: function (content, title) {
    wx.showModal({
      title: title || '加载失败',
      content: content || '未知错误',
      showCancel: false
    });
  },
  showLoadToast: function (title, duration) {
    wx.showToast({
      title: title || '加载中',
      icon: 'loading',
      mask: true,
      duration: duration || 10000
    });
  },
  util: require('./utils/util'),
  key: function (data) { return this.util.key(data) },
});