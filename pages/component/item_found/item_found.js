// pages/component/item/item.js
Page({

  /**
   * 页面的初始数据
   */
  data: {//调用storage中的键值对，注意picture_url为数组格式
    item_time: '',
    item_location: '',
    item_contact: '',
    item_description: '',
    item_picture_url: null//此处为网址
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    wx.getStorage({
      key: 'item_time',
      success: function (res) {
        console.log(res.data)
        that.setData({
          item_time: res.data
        })
      }
    }),
      wx.getStorage({
        key: 'item_location',
        success: function (res) {
          console.log(res.data)
          that.setData({
            item_location: res.data
          })
        }
      }),
      wx.getStorage({
        key: 'item_contact',
        success: function (res) {
          console.log(res.data)
          that.setData({
            item_contact: res.data
          })
        }
      }),
      wx.getStorage({
        key: 'item_description',
        success: function (res) {
          console.log(res.data)
          that.setData({
            item_description: res.data
          })
        }
      }),
      wx.getStorage({
        key: 'item_picture_url',
        success: function (res) {
          console.log(res.data)
          that.setData({
            item_picture_url: res.data
          })
        }
      })
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
/*
 * 清除数据，我的设想是点击详细信息时使用此函数，
 * 清除先前的键值对。
 * 并加载从字典中刷新键值对（就是要查看的那个字典中的的键值对）
 */
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
  //此函数为预览，调用了当前图片的地址和图片所在的列表
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.item_picture_url
    })
  }
})