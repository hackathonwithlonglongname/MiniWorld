// pages/component/post/post.js
const cloud = wx.cloud
cloud.init()
const db = cloud.database()

const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]

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
    nowDate: '2049-9-1',

    info: '',
    check: false,
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
    var date = new Date()
    this.setData({
      nowDate: date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString()
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

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
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
    if (e.detail.value['infoType'] == '') {
      wx.showToast({
        title: '请填写信息类型！',
        icon: 'none',
        duration: 1500,
      })
    }

    else if (e.detail.value['date'] == null) {
      wx.showToast({
        title: '请填写时间（如果时间不明可填写大致时间，并在[详细描述]中说明）',
        icon: 'none',
        duration: 3000,
      })
    }
    
    else if (e.detail.value['place'] == '') {
      wx.showToast({
        title: '请填写地点（如果地点不明可填写大致地点，并在[详细描述]中说明）',
        icon: 'none',
        duration: 3000,
      })
    }

    else if (e.detail.value['title'] == '') {
      wx.showToast({
        title: '请简要描述信息',
        icon: 'none',
        duration: 1500,
      })
    }

    else if (e.detail.value['infoType'] == 'lost' && e.detail.value['contact'] == '') {
      wx.showToast({
        title: '请留下你的联系方式',
        icon: 'none',
        duration: 1500,
      })
    }

    else if (e.detail.value['infoType'] == 'found' && this.data.imageList.lenth == 0) {
      wx.showToast({
        title: '请上传捡到物品的图片',
        icon: 'none',
        duration: 1500,
      })
    }

    else{
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

      wx.showToast({
        title: '信息发布成功！',
        icon: 'success',
        duration: 1500,
      })

      var that = this
      setTimeout(function () {
        wx.switchTab({
          url: '../' + e.detail.value['infoType'] + '/' + e.detail.value['infoType'],
        })

        that.setData({
          info: '',
          date: '',
          check: false,
          imageList: [],
        })
        if (getCurrentPages().length != 0) {
          //刷新当前页面的数据
          getCurrentPages()[getCurrentPages().length - 1].onLoad()
        }
      }, 1500)
    }
  },

})