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
    isAdmin: false,
  },
  onLoad() {
    console.log('isAdmin:', this.data.isAdmin)
    this.setData({
      isAdmin: app.globalData.isAdmin,
    })
  },
  onShow() {

  }
})