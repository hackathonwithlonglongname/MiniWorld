// pages/component/post/post.js
const cloud = wx.cloud
cloud.init()
const db = cloud.database()

Page({
  
  data: {
    pickerHidden: true,
    chosen: '',
    imageList: [],
    
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },

  pickerConfirm(e) {
    this.setData({
      pickerHidden: true
    })
    this.setData({
      chosen: e.detail.value
    })
  },

  pickerCancel() {
    this.setData({
      pickerHidden: true
    })
  },

  pickerShow() {
    this.setData({
      pickerHidden: false
    })
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    db.collection('itemInfo').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        postTime: db.serverDate,
        type: e.detail.value["infoType"],
        time: e.detail.value["date"],
        address: e.detail.value["place"],
        briefInfo: e.detail.value["title"],
        detail: e.detail.value["description"],
        contactMethod: e.detail.value["contact"],
        imgs:[]
        }
      })
    .then(res => {
      console.log(res)
    })
    .catch(console.error)
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },
  
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  chooseImage() {
    const that = this
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success(res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },

  previewImage(e) {
    const current = e.target.dataset.src

    wx.previewImage({
      current,
      urls: this.data.imageList
    })
  },

})
