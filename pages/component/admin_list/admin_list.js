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
    founditems: [],
    currentIndex: 0,
    count: 0,
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
    db.collection('itemInfo').where({
      state: "uncheck"
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
        state: "uncheck"
      }).skip(this.data.currentIndex).limit(20).orderBy("postTime", "desc").get().then(res => {
        this.setData({
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
    console.log("chudile")
    var l = this.data.count - this.data.currentIndex
    if (l <= 0) return
    if (l > 5) l = 5

    var l = this.data.count - this.data.currentIndex
    if (l <= 0) return
    if (l > 20) l = 20

    db.collection("itemInfo")
      .where({
        type: "found"
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
  onShareAppMessage: function () {

  },

  // 事件处理函数
  itemTap: function (e) {
    var x = e.currentTarget.dataset.index
    // console.log(e.currentTarget.dataset.index);

    wx.navigateTo({
      url: '../admin_detail/admin_detail?item=' + JSON.stringify(this.data.founditems[x])
    }) /**/
  },
})