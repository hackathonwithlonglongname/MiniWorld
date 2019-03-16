// pages/component/lost/lost.js
//获取应用实例
var search = require('../search/search.js')
var app = getApp()
const cloud = wx.cloud
cloud.init()
const db = cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lostitems:[],
    currentIndex:0,
    count:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    //初始化的时候渲染searchdata
    search.init(that, 43, ['校园卡', '雨伞', '钥匙', '数码设备', '文件']);
    search.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
    
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
    db.collection('itemInfo').where({
      type: "lost"
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
        type: "lost"
      }).skip(this.data.currentIndex).limit(5).get().then(res => {
        this.setData({
          lostitems: res.data,
          currentIndex: 5
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
    console.log("chudile")
    var l = this.data.count - this.data.currentIndex
    if (l <= 0) return
    if (l > 5) l = 5
    db.collection("itemInfo")
      .where({
        type: "found"
      }).skip(this.data.currentIndex).limit(l).get().then(res => {
        var tmp = this.data.lostitems.concat(res.data)
        console.log(res.data)
        this.setData({
          lostitems: tmp,
          currentIndex: this.data.currentIndex + l
        })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  itemTap: function (e) {
    var x = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../item_lost/item_lost?item=' + JSON.stringify(this.data.lostitems[x])
    })
  },
  searchFn: function (e) {
    var that = this
    search.searchAddHisKey(that);

  },

  searchInput: function (e) {
    var that = this
    search.searchInput(e, that);
  },

  searchFocus: function (e) {
    var that = this
    search.searchFocus(e, that);
  },

  searchBlur: function (e) {
    var that = this
    search.searchBlur(e, that);
  },

  searchKeyTap: function (e) {
    var that = this
    search.searchKeyTap(e, that);
  },

  searchDeleteKey: function (e) {
    var that = this
    search.searchDeleteKey(e, that);
  },

  searchDeleteAll: function (e) {
    var that = this;
    search.searchDeleteAll(that);
  },

  searchTap: function (e) {
    var that = this
    search.searchHiddenPancel(that);
  }
})