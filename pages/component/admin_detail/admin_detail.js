const cloud = wx.cloud
cloud.init()
const db = cloud.database()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: { //调用storage中的键值对，注意picture_url为数组格式
    item_time: '',
    item_location: '',
    item_contact: '',
    item_description: '',
    item_picture_url: null, //此处为网址
    img_width_2: wx.getSystemInfoSync().windowWidth / 2.6,
    img_width_3: wx.getSystemInfoSync().windowWidth / 4,
    img_width_1: wx.getSystemInfoSync().windowWidth / 1.25,
    item_id: '', //记录(Document)ID
    item_openid: '', //发布者ID
    openid: app.globalData.openid, //访问者ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("接收到的参数是item=" + options.item); //此处打印出来的是字符串，解析如下    	
    var item = JSON.parse(options.item); //解析得到集合
    this.setData({
      item_time: item.time,
      item_location: item.address,
      item_contact: item.contactMethod,
      item_description: item.briefInfo + "\n" + item.detail,
      item_picture_url: item.imgs, //此处为网址
      item_id: item._id,
      item_openid: item._openid,
    })
    /*
    wx.cloud.callFunction({
      name: 'get_id',
      complete: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          openid: res.result.openid
        })
      }
    })
    */
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 清除数据，我的设想是点击详细信息时使用此函数，
   * 清除先前的键值对。
   * 并加载从字典中刷新键值对（就是要查看的那个字典中的的键值对）
   */
  listenerStorageClear: function() {
    var that = this;
    wx.clearStorage({
      success: function(res) {
        that.setData({
          item_time: '',
          item_location: '',
          item_contact: '',
          item_description: '',
          item_picture_url: null,
        })
      }
    })
  },
  //此函数为预览，调用了当前图片的地址和图片所在的列表
  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.item_picture_url
    })
  },

  //按钮响应函数
  pass: function(e) {
    var that = this

    //显示对话框
    wx.showModal({
      title: '确认',
      content: '通过该条？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'check',
            data: {
              _id: that.data.item_id,
              property: 'pass'
            },
            success: res => {
              console.log('更新数据成功')
            }
          })

          //显示删除成功对话框
          wx.showToast({
            title: '审核完成',
            icon: 'success',
            duration: 1500,
          })

          //返回列表页
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    })
  },
  illegal: function (e) {
    var that = this

    //显示对话框
    wx.showModal({
      title: '确认',
      content: '信息违规？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'check',
            data: {
              _id: that.data.item_id,
              property: 'illegal'
            },
            success: res => {
              console.log('更新数据成功')
            }
          })

          //显示删除成功对话框
          wx.showToast({
            title: '审核完成',
            icon: 'success',
            duration: 1500,
          })

          //返回列表页
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    })
  }
})