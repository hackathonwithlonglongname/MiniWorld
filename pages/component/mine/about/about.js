var app = getApp();
Page({
  data: {
    version: '',
    showLog: false,
  },
  onLoad: function(){
    this.setData({
      version: app.globalData.version,
      year: new Date().getFullYear()
    });
  },
  toggleLog: function(){
    this.setData({
      showLog: !this.data.showLog
    });
  }
});