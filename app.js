//app.js

const cloud = wx.cloud
cloud.init()
const db = cloud.database()
require('./utils/v-request.js')

App({
  /**
   * 
   */
  onLaunch: function () {
    _this = this
    wx.cloud.callFunction({
      name: 'get_id',
      complete: res => {
        console.log('callFunction test result: ', res)
        this.globalData.openid = res.result.openid
        console.log('openid: ', this.globalData.openid)

        //设置管理员身份
        db.collection('adminInfo').where({
          openid: _this.globalData.openid
        }).get().then(res => {
          console.log('res:', res.data)
          _this.globalData.isAdmin = (res.data.length>0)
          console.log('isAdmin: ', this.globalData.isAdmin)
        }).catch(err => {
          console.log('err:', err)
        })
        //console.log('isAdmin: ', this.globalData.isAdmin)


        /*本地验证管理员身份方式
        for (var i in this.globalData.adminList) {
          //console.log('adminID: ', this.globalData.adminList[i])
          if (this.globalData.openid == this.globalData.adminList[i]) {
            this.globalData.isAdmin = true
            break
          }
        }*/
        
      }
    })
    
    
  },
  globalData: {
    isAuthened: false,
    version: 'v1.0.0', //版本号
    openid: '',
    adminList: ['oMJfy5C6sNcexW04x_8qMdk7dsdc', 'oMJfy5CqZKQWSVslILzVOZVYbLGg', 'oMJfy5F1JvBNLLZaXoPS2tTKVU5o', 'oMJfy5BWgD0U61BqFS6WEYGk3Pao', 'oMJfy5MbVMQ4a3GZoM3YPpyDwk58', 'oMJfy5CntvZOHj0NBDPiz010wL7U', 'oMJfy5EO6OYLUrRkcy-SEC_jwkzE', 'oMJfy5BRwhNjx_Pitku919zFLUeY', 'oMJfy5Ap4TWAvuwDT4y-irWREKjw', 'oMJfy5Cav30nqPusqDNAOdO7WC8o', 'oMJfy5Ax0ONY21XATCcW_NI5hYt0', 'oMJfy5HTNDj09uph95DHushBnVbY','oMJfy5NRYeksX8iY4sIh0BNyUR8s'],
    isAdmin: false,
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
  enCodeBase64: function (data) { return this.util.base64.encode(data) },
});