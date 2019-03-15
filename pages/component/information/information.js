// pages/component/information/information.js

Page({
  data:{
    information:{
      name:'',
      phone:'',
      stuID:'',
      region:['江苏省', '南京市', '栖霞区'],
      customItem:'全部'
    }
  },
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.region.value)
    this.setData({
      region: e.region.value
    })
  },
  onLoad(){
    var self = this;
    wx.getStorage({
      key: 'information',
      success: function(res){
        self.setData({
          information: res.data
        })
      }
    })
  },
  formSubmit(e){
    const value = e.detail.value;
    if (value.name && value.phone && value.stuID && value.region){
      wx.setStorage({
        key: 'information',
        data: value,
        success(){
          wx.navigateBack();
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
  }
})