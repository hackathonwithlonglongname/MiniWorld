// pages/component/found/found.js
// 获取应用实例
var search = require('../search/search.js')
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
    founditems: [],
    currentIndex: 0,
    count: 0,
    searchTarget:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('onLoad')
    var that = this

    // 初始化的时候渲染searchdata
    search.init(that, 43, ['校园卡', '雨伞', '钥匙', '数码设备', '文件']);
    search.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
    console.log("currentIndex:" + this.data.currentIndex)
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
    db.collection('itemInfo').where({
      type: "found",
      state: "pass"
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
        type: "found",
        state: "pass"
      }).skip(this.data.currentIndex).limit(20).orderBy("postTime","desc").get().then(res => {
        this.setData({
          founditems: res.data,
          currentIndex:20

        })
        console.log(res.data)
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
    console.log("chudile")
    var l = this.data.count - this.data.currentIndex
    if (l <= 0) return
    if (l > 5) l = 5

    var l=this.data.count-this.data.currentIndex
    if(l<=0)return
    if(l>20)l=20

    db.collection("itemInfo")
      .where({
        type: "found",
        state:"pass"
      }).skip(this.data.currentIndex).limit(l).orderBy("postTime", "desc").get().then(res => {
        var tmp = this.data.founditems.concat(res.data)
        console.log(res.data)
        this.setData({
          founditems: tmp,
          currentIndex: this.data.currentIndex + l
        })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 事件处理函数
  itemTap: function(e) {
    var x = e.currentTarget.dataset.index
    // console.log(e.currentTarget.dataset.index);

    wx.navigateTo({
      url: '../item_found/item_found?item=' + JSON.stringify(this.data.founditems[x])
    }) /**/
  },
  printSearchResult2:function(){
    db.collection("itemInfo")
      .where(db.command.or([{
        type:"found",
        briefInfo:db.RegExp({
          regexp:this.data.searchTarget,
          options:'i'
        })
      },
      {
        type:"found",
        detail:db.RegExp({
          regexp:this.data.searchTarget,
          options:'i'
        })
      },
        {
          type: "found",
          address: db.RegExp({
            regexp: this.data.searchTarget,
            options: 'i'
          })
        }
      ])).limit(100).orderBy("postTime", "desc").get().then(res => {
        //var tmp = this.data.founditems.concat(res.data)
        //console.log(res.data)
        this.setData({
          founditems: res.data,
          //currentIndex: 100
        })
      })
  },
  printSearchResult:function() {
    var tmpItems=this.data.founditems
    for (var i = 0, len = tmpItems.length; i < len;) {
      let b = tmpItems[i].briefInfo
      let a = tmpItems[i].address
      let d = tmpItems[i].detail
      if (b.indexOf(this.data.searchTarget) != -1 || a.indexOf(this.data.searchTarget) != -1 || d.indexOf(this.data.searchTarget) != -1) {
        i++;
        //console.log("nothing")
        continue
      }
      tmpItems.splice(i, 1);
      len--
    }
    this.setData({
      founditems:tmpItems
    })
  },

  searchFn: function(e) {
    console.log("searchFn")
    var that = this
    search.searchAddHisKey(that);
    this.printSearchResult2()
  },

  searchInput: function(e) {
    console.log("searchInput")
    var that = this
    search.searchInput(e, that,function (res) {
      if(typeof(res)!="undefined"){
        that.setData({
          searchTarget: res
        })
      }
    
    });
    this.setData({
      currentIndex: 0
    })
    db.collection("itemInfo")
      .where({
        type: "found",
        state: "pass"
      }).skip(this.data.currentIndex).limit(20).orderBy("postTime", "desc").get().then(res => {
        this.setData({
          founditems: res.data,
          currentIndex: 20
        })
      })
    console.log("target",this.data.searchTarget)
  },

  serchFocus: function(e) {
    console.log("searchFocus")
    var that = this
    search.searchFocus(e, that);
  },

  searchBlur: function(e) {
    console.log("searchBlur")
    var that = this
    search.searchBlur(e, that);
    
  },

  searchKeyTap: function(e) {
    console.log("searchKeyTap")
    var that = this
    search.searchKeyTap(e, that, function(res){
      that.setData({
        searchTarget:res
      })
    });
    console.log("target"+this.data.searchTarget)
  },

  searchDeleteKey: function(e) {
    console.log("searchDeleteKey")
    var that = this
    search.searchDeleteKey(e, that);
  },

  searchDeleteAll: function(e) {
    console.log("searchDeleteAll")
    var that = this;
    search.searchDeleteAll(that);
  },

  searchTap: function(e) {
    console.log("searchTap")
    var that = this
    search.searchHiddenPancel(that);
    
  }
})