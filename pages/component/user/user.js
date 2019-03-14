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
    /**
     * 获取用户信息
     */
    /*wx.getUserInfo({
      success: function(res){
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    }),*/

    /**
     * 发起请求获取订单列表信息
     */
    /*wx.request({
      url: 'https://cas.ap-chengdu.myqcloud.com/1257466302/vaults/user',
      success(res){
        self.setData({
          orders: res.data
        })
      }
    })*/

    db.collection('userInfo[items]').get({
      success(res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        self.setData({
          orders: res.data
        })
      }
    })
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
          information: res.data
        })
      }
    })
  }
})