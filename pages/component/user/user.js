// pages/component/user/user.js
// 获取数据库引用
const cloud = wx.cloud
cloud.init()
const db = cloud.database()

Page({
  data:{
    thumb:'',
    nickname:'',
    orders:[],
    hasinformation:false,
    information:{}
  },
  onLoad(){
    var self = this;
  },
  onShow(){
    var self = this;
    /**
     * 获取本地缓存 个人信息
     */
    wx.getStorage({
      key: 'information',
      success: function(res){
        self.setData({
          hasInformation: true,
          information: res.data,
        })
      }
    })
  }
})