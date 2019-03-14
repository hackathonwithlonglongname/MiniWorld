// pages/component/post/post.js
const cloud = wx.cloud
cloud.init()
const db = cloud.database()

const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]

exports.main = async (event, context) => {
  const {
    OPENID,
    APPID,
    UNIONID,
  } = cloud.getWXContext()

  return {
    OPENID,
    APPID,
    UNIONID,
  }
}

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
    
    var fileId = []
    for (let img in Page.data.imageList){
      wx.cloud.uploadFile({
        cloudPath: '/userImages/' + OPENID + db.serverDate() + img,
        filePath: img, // 文件路径
      }).then(res => {
        // get resource ID
        console.log(res.fileID)
        fileId.push(res.fileID)
      }).catch(error => {
        // handle error
      })
    }
    
    db.collection('itemInfo').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        postTime: db.serverDate(),
        userId: OPENID,
        type: e.detail.value["infoType"],
        time: e.detail.value["date"],
        address: e.detail.value["place"],
        briefInfo: e.detail.value["title"],
        detail: e.detail.value["description"],
        contactMethod: e.detail.value["contact"],
        imgs: fileId
        }
      }).then(res => {
        console.log(res)
      }).catch(console.error)
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
