// pages/component/order/order.js
const cloud = wx.cloud
const db = cloud.database()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    founditems1: [],
    founditems2: [],
    openid: "OPENID",
    currentTab: 0,
    count: 0,
    tabCont: [{ "title": "未结束", "type": "lost", "index": "0" }, { "title": "已完成", "type": "found", "index": "1" }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var that = this
    wx.cloud.callFunction({
      name: 'get_id',
      complete: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          openid: res.result.openid
        })
      }
    })
    /*wx.getStorage({
      key: '_openid',
      success: function(res) {
        console.log(res.data)
        that.setData({
          openid: res.data,
        })
      }
    })*/
    db.collection('itemInfo').where({
      _openid: this.data.openid,
    }).count().then(res => {
      this.setData({
        count: res.total
      })
    })
    console.log(this.data.count)
    this.setData({
      currentIndex: 0
    })
    db.collection("itemInfo")
      .where({
        type: "lost",
        _openid: this.data.openid,
      }).skip(that.data.currentIndex).limit(20).orderBy("postTime", "desc").get().then(res => {
        that.setData({
          founditems1: res.data,
          currentIndex: 20
        })
        console.log(res.data)
      })
    db.collection("itemInfo")
      .where({
        type: "found",
        _openid: that.data.openid,
      }).skip(that.data.currentIndex).limit(20).orderBy("postTime", "desc").get().then(res => {
        that.setData({
          founditems2: res.data,
          currentIndex: 20
        })
        console.log(res.data)
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
    console.log("chulilalala")
    var l = this.data.count - this.data.currentIndex
    if (l <= 0) return
    if (l > 5) l = 5

    var l = this.data.count - this.data.currentIndex
    if (l <= 0) return
    if (l > 20) l = 20

    db.collection("itemInfo")
      .where({
        type: this.data.type,
        _openid: that.data.openid,
      }).skip(this.data.currentIndex).limit(l).orderBy("postTime", "desc").get().then(res => {
        var tmp = this.data.founditems.concat(res.data)
        console.log(res.data)
        this.setData({
          founditems1: tmp,
          currentIndex: this.data.currentIndex + l
        })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  // swiper滑动时触发bindchange事件，获取事件对象e获取当前所在滑块的index，并将其更新至data的currentTab中，视图渲染通过判断currentTab的让对应的tab hover。
  GetCurrentTab: function (e) {
    console.log(e.detail.current);
    var that = this
    this.setData({
      currentTab: e.detail.current
    });
    // console.log("11111"+this.data.currentTab);
  },
  swithNav: function (e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current
    });
  },

  // 事件处理函数
  itemTap: function (e) {
    var x = e.currentTarget.dataset.index
    // console.log(e.currentTarget.dataset.index);

    wx.navigateTo({
      url: '../item_found/item_found?item=' + JSON.stringify(this.data.founditems[x])
    }) /**/
  },
})