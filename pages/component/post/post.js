// pages/component/post/post.js
const cloud = wx.cloud
cloud.init()
const db = cloud.database()

var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]

Page({
  data: {
    //picker组件相关：
    pickerHidden: true,
    chosen: '',
    nowDate: '2049-09-01', //onShow时修改为当前日期

    //image组件相关：
    imageList: [],
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],

    //ID相关：
    //openid: '',
    docID: '',
    //imageID: '',

    //提交后清空表单用：
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
    //将nowDate修改为当前日期
    var date = new Date()
    this.setData({
      nowDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
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

  //picker组件相关：
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

  //textarea组件相关：
  bindTextAreaBlur(e) {
    console.log(e.detail.value)
  },

  //image组件相关：
  chooseImage() {
    const that = this
    wx.chooseImage({
      //sourceType: sourceType[this.data.sourceTypeIndex],
      //sizeType: sizeType[this.data.sizeTypeIndex],
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

  //form组件相关：
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    /* 获取openid，暂不需要
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

    //必选逻辑判断：
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

    else if (e.detail.value['infoType'] == 'found' && this.data.imageList.length == 0) {
      wx.showToast({
        title: '请上传捡到物品的图片',
        icon: 'none',
        duration: 1500,
      })
    }

    else{
      //获取当前时间戳
      var timestamp = Date.parse(new Date())
      var date = new Date(timestamp)
      timestamp = timestamp / 1000

      //获取当前时间
      //年
      var Y = date.getFullYear()
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      //时
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
      //分
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
      //秒
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      var postTime = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
      console.log(postTime);
      
      //将物品信息写入数据库
      db.collection('itemInfo').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          postTime,
          type: e.detail.value["infoType"],
          time: e.detail.value["date"],
          address: e.detail.value["place"],
          briefInfo: e.detail.value["title"],
          detail: e.detail.value["description"],
          contactMethod: e.detail.value["contact"],
          imgs: []
        }
      }).then(res => {
        //获得记录(Document)ID
        this.setData({
          docID: res._id
        })
        console.log(res)
      }).catch(console.error)

      //上传图片
      for (let id = 0; id < this.data.imageList.length; id++) {
        const img = this.data.imageList[id]
        console.log(img)
        const filePath = img // 文件路径
        const cloudPath = "itemImages/" + timestamp + "_" + id + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath
        }).then(res => {
          //将图片文件ID写入数据库
          console.log(res)
          db.collection("itemInfo").doc(this.data.docID).update({
            data: {
              imgs: db.command.push([res.fileID])
            }
          })/* 获取图片文件ID，暂不需要
          this.setData({
            imageID: res.fileID
          })*/
        }).catch(error => {
          // handle error
        })
      }

      //消息框提醒
      wx.showToast({
        title: '信息发布成功！',
        icon: 'success',
        duration: 1500,
      })

      var that = this
      //延迟处理，等待消息框结束
      setTimeout(function () {
        //跳转至found或lost页
        wx.switchTab({
          url: '../' + e.detail.value['infoType'] + '/' + e.detail.value['infoType'],
        })

        //重置并刷新post页
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