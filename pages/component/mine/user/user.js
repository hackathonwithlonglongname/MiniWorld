// pages/component/mine/user/user.js
// 获取数据库引用
const cloud = wx.cloud
cloud.init()
const db = cloud.database()
var app = getApp()

Page({
  data: {
    thumb: '',
    nickname: '',
    orders: [],
    hasinformation: false,
    information: {},
    isAdmin: false,
  },
  onLoad() {
    console.log('isAdmin:', this.data.isAdmin)
    this.setData({
      isAdmin: app.globalData.isAdmin,
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