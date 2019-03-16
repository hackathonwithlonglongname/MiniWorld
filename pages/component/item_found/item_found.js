// pages/component/item/item.js
const cloud = wx.cloud
const db = cloud.database()

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
    img_width_1: wx.getSystemInfoSync().windowWidth / 1.3,
    item_id: '', //记录(Document)ID
    item_openid: '', //发布者ID
    openid: '', //访问者ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("接收到的参数是item=" + options.item); //此处打印出来的是字符串，解析如下    	
    var item = JSON.parse(options.item); //解析得到集合
    this.setData({
      item_time: item.time,
      item_location: item.address,
      item_contact: item.contactMethod,
      item_description: item.detail,
      item_picture_url: item.imgs, //此处为网址
      item_id: item._id,
      item_openid: item._openid,
    })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 清除数据，我的设想是点击详细信息时使用此函数，
   * 清除先前的键值对。
   * 并加载从字典中刷新键值对（就是要查看的那个字典中的的键值对）
   */
  listenerStorageClear: function () {
    var that = this;
    wx.clearStorage({
      success: function (res) {
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
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.item_picture_url
    })
  },

  //按钮响应函数，功能为删除本条信息（当发布者ID与访问者ID一致时）
  deleteItem: function (e) {
    var that = this
    
    //显示确定/取消对话框
    wx.showModal({
      title: '删除招领信息',
      content: '确认删除这条信息？删除后不可恢复',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          
          //再次验证发布者ID与访问者ID是否一致
          if (that.data.item_openid == that.data.openid) {
            //从数据库中删除本条记录(Document)
            db.collection('itemInfo').doc(that.data.item_id).remove()
              .then(console.log)
              .catch(console.error)

            //从存储管理中删除图片
            wx.cloud.deleteFile({
              fileList: that.data.item_picture_url
            }).then(res => {
              // handle success
              console.log(res.fileList)
            }).catch(error => {
              // handle error
            })

            //显示删除成功对话框
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500,
            })

            //返回列表页
            wx.navigateBack({
              delta: 1,
            })
          }
          else { //非正常功能，当删除按钮误显示在界面时报错
            wx.showToast({
              title: '错误：非本人发布信息。请联系开发者解决问题。',
              icon: 'none',
              duration: 1500,
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})