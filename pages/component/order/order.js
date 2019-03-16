// pages/component/order/order.js
const cloud = wx.cloud
const db = cloud.database()
var app = getApp()
var that = this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    founditems: [],
    lostitems: [],
    openid: "OPENID",
    currentTab: 0,
<<<<<<< HEAD

    tabCont: [{ "title": "未结束", "type": "lost", "index": "0" }, { "title": "已完成", "type": "found", "index": "1" }],
=======
    tabCont: [{ "title": "招领", "type": "found", "index": "0" }, { "title": "寻物", "type": "lost", "index": "1" }],
    count: 0,
>>>>>>> parent of 151902a... bsverb

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid();
  },

  getOpenid() {
    var that = this
    wx.cloud.callFunction({
      name: 'get_id',
      complete: res => {
        console.log('callFunction test result: ', res)
        let x = res.result.openid
        wx.setStorageSync('openid', x)
        //that.setData({
          //openid: res.result.openid
        //})
      }
    })
    console.log("outer: ", wx.getStorageSync('openid'))
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
    console.log(wx.getStorageSync('openid'))
    db.collection('itemInfo').where({
<<<<<<< HEAD

      _openid: wx.getStorageInfoSync('openid'),

=======
      _openid: wx.getStorageSync('openid'),
>>>>>>> parent of 151902a... bsverb
    }).count().then(res => {
      this.setData({
        count_lost: res.total
      })
    })

    console.log(this.data.count)
    this.setData({
      currentIndex: 0
    })
    db.collection("itemInfo")
      .where({
        type: "lost",
        _openid: wx.getStorageSync('openid'),
      }).skip(that.data.currentIndex).limit(20).orderBy("postTime", "desc").get().then(res => {
        that.setData({
          lostitems: res.data,
          currentIndex: 20
        })
        console.log(res.data)
      })
    db.collection("itemInfo")
      .where({
        type: "found",
        _openid: wx.getStorageSync('openid'),
      }).skip(that.data.currentIndex).limit(20).orderBy("postTime", "desc").get().then(res => {
        that.setData({
          founditems: res.data,
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
    var lf = this.data.count_found - this.data.currentIndex
    if (lf <= 0) return
    if (lf > 5) lf = 5

    var ll = this.data.count_lost - this.data.currentIndex
    if (ll <= 0) return
    if (ll > 20) ll = 20

    db.collection("itemInfo")
      .where({
<<<<<<< HEAD

        type: this.data.type,
        _openid: wx.getStorageInfoSync('openid'),
=======
        type: this.data.tabCont[this.data.currentTab]['type'],
        _openid: wx.getStorageSync('openid'),
>>>>>>> parent of 151902a... bsverb
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