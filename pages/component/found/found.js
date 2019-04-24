// pages/component/found/found.js
// 获取应用实例
var app = getApp()
const cloud = wx.cloud
cloud.init()
const db = cloud.database()
const cmd = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    count: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('onLoad found.js')
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
    const _this = this
    db.collection('itemInfo').where({
      type: "found",
      state: "pass"
    }).count().then(res => {
      _this.setData({
        count: res.total
      })
    })
    console.log(_this.data.count)
    _this.setData({
      currentIndex: 0,
    })
    db.collection("itemInfo")
      .where({
        type: "found",
        state: "pass"
      }).skip(_this.data.currentIndex).limit(20).orderBy("postTime", "desc").get().then(res => {
        _this.setData({
          founditems: res.data,
          currentIndex: 20
        })
        console.log(res.data)
        _this.initItems()
      })
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
    const _this = this
    console.log("chudile")
    var l = _this.data.count - _this.data.currentIndex
    if (l <= 0) return
    if (l > 5) l = 5

    var l = _this.data.count - _this.data.currentIndex
    if (l <= 0) return
    if (l > 20) l = 20

    db.collection("itemInfo")
      .where({
        type: "found",
        state: "pass"
      }).skip(_this.data.currentIndex).limit(l).orderBy("postTime", "desc").get().then(res => {
        var tmp = _this.data.founditems.concat(res.data)
        console.log(res.data)
        this.setData({
          founditems: tmp,
          currentIndex: _this.data.currentIndex + l
        })
        _this.initItems()
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  initItems: function() {
    for (let i = 0; i < this.data.founditems.length; i++) {
      var flag = "founditems[" + i + "].isShow"
      this.setData({
        [flag]: true
      })
    }
  },

  searchIcon(e) {
    let key = e.detail.value.toLowerCase();
    let list = this.data.founditems;
    for (let i = 0; i < list.length; i++) {
      let a = key;
      let b = list[i].briefInfo.toLowerCase();
      if (b.indexOf(a) > -1) {
        list[i].isShow = true
      } else {
        list[i].isShow = false
      }
    }
    this.setData({
      founditems: list
    })
  },

  // 事件处理函数
  itemTap: function(e) {
    var x = e.currentTarget.dataset.index
    // console.log(e.currentTarget.dataset.index);

    wx.navigateTo({
      url: '../item_found/item_found?item=' + JSON.stringify(this.data.founditems[x])
    }) /**/
  }
})