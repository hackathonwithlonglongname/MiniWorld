// pages/component/found/found.js
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
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    //初始化的时候渲染searchdata
    search.init(that, 43, ['校园卡', '雨伞', '钥匙', '数码设备', '文件']);
    search.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);/*
    wx.request({
      url: 'https://api.idealclover.cn/hackathon/data.json',
      method:'POST',
      data:{
        item:"hhhh"
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        console.log("succeed");
      }
    })
    wx.request({
      url: 'https://api.idealclover.cn/hackathon/data.json',
      success: function (res) {
        console.log("success");
        wx.setStorageSync("items", res.data.data.items);
      }
    });*/
    db.collection("itemInfo").get({
      success(res){
        console.log(res)
        this.setData({
          items:res.data
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
    var items=wx.getStorageSync("items");
    this.setData({
      items:items
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //事件处理函数，此时抽取字典中的键值对到本地缓存中的键值对
  itemTap: function (e) {
    var index=0;
    console.log(index);
    wx.navigateTo({
      url: '../item_found/item_found?item='+JSON.stringify(this.data.items[index])
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