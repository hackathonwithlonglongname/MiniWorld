//app.js
const cloud = wx.cloud
cloud.init()
const db = cloud.database()

App({
  isAu: false,
  version: 'v0.0.4', //版本号
  /**
   * 
   */
  onLaunch: function () {
    var timestamp = Date.parse(new Date())
    var nowDate = new Date(timestamp)
    timestamp = timestamp / 1000

    //获取当前时间
    //年
    var Y = nowDate.getFullYear()
    //月
    var M = (nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1)
    //日
    var D = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()
    this.globalData.time.year = Y
    this.globalData.time.month = M
    this.globalData.time.day = D
    
    wx.cloud.callFunction({
      name: 'get_id',
      complete: res => {
        console.log('callFunction test result: ', res)
        this.globalData.openid = res.result.openid
        console.log('openid: ', this.globalData.openid)
        for (var i in this.globalData.adminList) {
          //console.log('adminID: ', this.globalData.adminList[i])
          if (this.globalData.openid == this.globalData.adminList[i]) {
            this.globalData.isAdmin = true
            break
          }
        }
        console.log('isAdmin: ', this.globalData.isAdmin)
      }
    })
  },
  globalData: {
    openid: '',
    adminList: ['oMJfy5C6sNcexW04x_8qMdk7dsdc', 'oMJfy5CqZKQWSVslILzVOZVYbLGg', 'oMJfy5F1JvBNLLZaXoPS2tTKVU5o', 'oMJfy5BWgD0U61BqFS6WEYGk3Pao'],
    isAdmin: false,
    time:{
      year:'',
      month:'',
      day:''
    }
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