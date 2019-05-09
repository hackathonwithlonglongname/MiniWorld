// pages/component/post/post.js
const cloud = wx.cloud
cloud.init()
const db = cloud.database()
var app = getApp()

const sourceType = [
  ['camera'],
  ['album'],
  ['camera', 'album']
]
const sizeType = [
  ['compressed'],
  ['original'],
  ['compressed', 'original']
]

Page({
  data: {
    multiIndex: [0, 0, 0],
    time: '12:01', //onShow时修改为当前时间
    date: '2018-12-25', //onShow时修改为当前日期
    place: '',
    modalName: null,
    textareaAValue: '',
    textareaBValue: '',

    //picker组件相关：
    pickerHidden: true,
    chosen: '',

    //image组件相关：
    imageList: [],
    index: null,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],

    //ID相关：
    openid: '',
    docID: '',
    //imageID: '',

    isAdmin: false,

    //提交后清空表单用：
    info: '',
    check: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    var nowDate = new Date()

    //将time修改为当前时间
    this.setData({
      time: nowDate.getHours() + ':' + nowDate.getMinutes(),
    })

    //将date修改为当前日期
    this.setData({
      date: nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate(),
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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

  TimeChange(e) {
    const _this = this
    _this.setData({
      time: e.detail.value
    })
  },

  DateChange(e) {
    const _this = this
    _this.setData({
      date: e.detail.value
    })
  },

  selectLocation() {
    const _this = this
    wx.chooseLocation({
      success: function(res) {
        console.log("Location:" + res.name)
        _this.setData({
          place: res.name,
        })
      },
      fail: function() {
        wx.getSetting({
          success: function(res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取地理位置，请确认授权，否则无法使用地图功能',
                success: function(tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function(data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: function(res) {
                              _this.setData({
                                place: res.name
                              })
                            },
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function(res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        })
      },
      complete: function() {
        // complete
      }
    })
  },

  ChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera', 'album'], //从相册选择
      success: (res) => {
        if (this.data.imageList.length != 0) {
          this.setData({
            imageList: this.data.imageList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imageList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imageList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imageList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imageList: this.data.imageList
          })
        }
      }
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
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

  //form组件相关：
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    this.setData({
      openid: app.globalData.openid,
      isAdmin: app.globalData.isAdmin,
    })
    console.log('openid: ', this.data.openid, 'isAdmin: ', this.data.isAdmin)

    /* 获取openid
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
    } else if (e.detail.value['time'] == null) {
      wx.showToast({
        title: '请填写时间（如果时间不明可填写大致时间，并在[详细描述]中说明）',
        icon: 'none',
        duration: 3000,
      })
    } else if (e.detail.value['date'] == null) {
      wx.showToast({
        title: '请填写日期（如果日期不明可填写大致日期，并在[详细描述]中说明）',
        icon: 'none',
        duration: 3000,
      })
    } else if (e.detail.value['place'] == '') {
      wx.showToast({
        title: '请填写地点（如果地点不明可填写大致地点，并在[详细描述]中说明）',
        icon: 'none',
        duration: 3000,
      })
    } else if (e.detail.value['title'] == '') {
      wx.showToast({
        title: '请简要描述信息',
        icon: 'none',
        duration: 1500,
      })
    } else if (e.detail.value['infoType'] == 'lost' && e.detail.value['contact'] == '') {
      wx.showToast({
        title: '请留下你的联系方式',
        icon: 'none',
        duration: 1500,
      })
    } else if (e.detail.value['infoType'] == 'found' && this.data.imageList.length == 0) {
      wx.showToast({
        title: '请上传捡到物品的图片',
        icon: 'none',
        duration: 1500,
      })
    } else {
      //获取当前时间戳
      var timestamp = Date.parse(new Date())
      var nowDate = new Date(timestamp)
      timestamp = timestamp / 1000

      //获取当前时间
      //年
      var Y = nowDate.getFullYear()
      //月
      var M = (nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1)
      //日
      var D = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()
      //时
      var h = (nowDate.getHours() < 10 ? '0' + nowDate.getHours() : nowDate.getHours())
      //分
      var m = (nowDate.getMinutes() < 10 ? '0' + nowDate.getMinutes() : nowDate.getMinutes())
      //秒
      var s = (nowDate.getSeconds() < 10 ? '0' + nowDate.getSeconds() : nowDate.getSeconds())
      var postTime = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
      console.log(postTime);

      var state = this.data.isAdmin ? 'pass' : 'uncheck'
      //将物品信息写入数据库
      db.collection('itemInfo').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          postTime,
          type: e.detail.value["infoType"],
          time: e.detail.value['time'],
          date: e.detail.value["date"],
          address: e.detail.value["place"],
          briefInfo: e.detail.value["title"],
          detail: e.detail.value["description"],
          contactMethod: e.detail.value["contact"],
          state,
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
          filePath,
          cloudPath
        }).then(res => {
          //将图片文件ID写入数据库
          console.log(res)
          db.collection("itemInfo").doc(this.data.docID).update({
            data: {
              imgs: db.command.push([res.fileID])
            }
          })
          /* 获取图片文件ID，暂不需要
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
      setTimeout(function() {
        //跳转至found或lost页
        wx.switchTab({
          url: '../' + e.detail.value['infoType'] + '/' + e.detail.value['infoType'],
        })

        //重置并刷新post页
        that.setData({
          time: '',
          info: '',
          date: '',
          check: false,
          place: '',
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