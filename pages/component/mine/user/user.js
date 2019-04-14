// pages/component/mine/user/user.js
// 获取数据库引用
const cloud = wx.cloud
cloud.init()
const db = cloud.database()

Page({
  data: {
    thumb: '',
    nickname: '',
    orders: [],
    hasinformation: false,
    information: {},
    is_admin_list: ['oMJfy5C6sNcexW04x_8qMdk7dsdc', 'oMJfy5CqZKQWSVslILzVOZVYbLGg', 'oMJfy5F1JvBNLLZaXoPS2tTKVU5o','oMJfy5BWgD0U61BqFS6WEYGk3Pao']
  },
  onLoad() {
    wx.cloud.callFunction({
      name: 'get_id',
      complete: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          openid: res.result.openid
        })
      }
    })
  },
  onShow() {
    var self = this;
    /**
     * 获取本地缓存 个人信息
     */
    wx.getStorage({
      key: 'information',
      success: function(res) {
        self.setData({
          hasInformation: true,
          information: res.data,
        })
      }
    })
  }
})