// pages/component/post/post.js
const cloud = wx.cloud
cloud.init()
const db = cloud.database()

const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]

/*exports.main = async (event, context) => {
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
}*/

Page({
  
  data: {
    pickerHidden: true,
    chosen: '',
    imageList: [],
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],

    //openid: '',
    docID: '',
    //imageID: '',
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

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTextAreaBlur(e) {
    console.log(e.detail.value)
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

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    /*
    wx.cloud.callFunction({
      name: 'get_id',
      complete: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          openid: res.result.openid
        })
      }
    })
    */
    db.collection('itemInfo').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        postTime: db.serverDate(),
        type: e.detail.value["infoType"],
        time: e.detail.value["date"],
        address: e.detail.value["place"],
        briefInfo: e.detail.value["title"],
        detail: e.detail.value["description"],
        contactMethod: e.detail.value["contact"],
        imgs: []
        }
      }).then(res => {
        this.setData({
          docID: res._id
        })
        console.log(res)
      }).catch(console.error)

    for (let id = 0; id < this.data.imageList.length; id++) {
      const img = this.data.imageList[id]
      console.log(img)
      const filePath = img // 文件路径
      let timestamp = Date.parse(new Date())
      const cloudPath = "itemImages/" + timestamp + "_" + id + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath
      }).then(res => {
        // get resource ID
        console.log(res)
        db.collection("itemInfo").doc(this.data.docID).update({
          data: {
            imgs: db.command.push([res.fileID])
          }
        })/*
        this.setData({
          imageID: res.fileID
        })*/
      }).catch(error => {
        // handle error
      })
    }
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },

})