// pages/found/found.js
//获取应用实例
var search = require('../../search/search.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foundItems:[
      {
        title:"标题",
        foundtime:"2019.3.12 下午",
        address:"仙林校区方肇周体育馆",
        briefinfo:"这王钧睿小哥哥真好看，蓝色的衣服，对我很重要，求求各位了",
        reward:"一杯奶茶（可有可无）",
        detail:"超详细的关于王钧睿小哥哥的描述，总之就是帅！",
        img:"图片（做成数组会不会好点？",
        contactMethod:"644699280"
      }
    ]
    
  },
    // searchData:{
    //   view:{
    //     isShow: true
    //   }
    // }


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

  //事件处理函数
  itemTap: function () {
    wx.navigateTo({
      url: '../item_found/item_found'
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

  serchFocus: function (e) {
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