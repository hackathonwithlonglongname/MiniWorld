// pages/component/information/information.js

Page({
  data: {
    name: '',
    phone: '',
    stuID: '',
    region: ['江苏省', '南京市', '栖霞区'],
  },
  // 选择省市区函数
  /*changeRegin(e) {
    this.setData({
      region: e.detail.value
    });
  },*/
  onLoad() {
    //获取本地数据
    var name = wx.getStorageSync('name');
    var phone = wx.getStorageSync('phone');
    var stuID = wx.getStorageSync('stuID');
    var region = wx.getStorageSync('region');

    console.log(name);
    console.log(phone);
    console.log(stuID);
    console.log(region);
    if (name) {
      this.setData({ name: name });
    }
    if (phone) {
      this.setData({ phone: phone });
    }
    if (stuID) {
      this.setData({ stuID: stuID });
    }
    if (region) {
      this.setData({ region: region });
    }
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const value = e.detail.value;
    if (value.name && value.phone && value.stuID && value.region) {
      // 同步方式存储表单数据
      wx.setStorageSync('name', value.name);
      wx.setStorageSync('phone', value.phone);
      wx.setStorageSync('stuID', value.stuID);
      wx.setStorageSync('region', value.region);
      wx.navigateBack();
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }
  }
})