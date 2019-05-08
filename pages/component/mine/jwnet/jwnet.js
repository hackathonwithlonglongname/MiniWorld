//jwnet.js

const cloud = wx.cloud
cloud.init()
const db = cloud.database()
//获取应用实例
var app = getApp()
Page({
  data: {
    remind: '加载中',
    help_status: false,
    userid_focus: false,
    passwd_focus: false,
    authcd_focus: false,
    userid: '',
    passwd: '',
    authcd: '',
    angle: 0,
    cookie: 'cookie',
    img: 'img'
  },
  onLoad: function () {
    const _this = this;
    wx.vrequest({
      method: 'GET',
      url: 'http://cer.nju.edu.cn/amserver/UI/Login',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': _this.data.cookie
      },
      success: res => {
        _this.setData({
          cookie: res.header['set-cookie'].join(',').replace(/ path=\//g, ' ').replace(/Domain=.nju.edu.cn;Path=\/,/g, ' ').replace(/Path=\/,/g, ' ')
        })
        _this.authcdRequest()
      }
    })
  },

  onReady: function () {
    const _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1000)
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    })
  },

  authcdRequest: function () {
    const _this = this;
    wx.request({
      method: 'GET',
      url: 'https://cer.nju.edu.cn/amserver/verify/image.jsp',
      responseType: 'arraybuffer',
      encoding: null,
      header: {
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh',
        'Content-Type': 'image/jpg',
        'Cookie': _this.data.cookie,
      },
      success: function (res) {
        let base64 = wx.arrayBufferToBase64(res.data)
        let tmpCookie = ''
        if (res.header['Set-Cookie']) tmpCookie = res.header['Set-Cookie']
        if (res.header['Set-cookie']) tmpCookie = res.header['Set-cookie']
        _this.setData({
          cookie: _this.data.cookie + tmpCookie.replace(/ path=\//g, '').replace(/Domain=.nju.edu.cn;Path=\/,/g, ' ').replace(/Path=\/,/g, ' ').replace(/Path=\//g, '')
        }),
          console.log(res.data)
        console.log(base64)
        console.log(_this.data.cookie)
        _this.setData({
          img: 'data:image/jpg;base64,' + base64
        })

      }
    });
  },

  bind: function () {
    const _this = this;
    if (app.g_status == '未授权') {
      app.showErrorModal(app.g_status, '登录失败');
      return;
    }
    if (!_this.data.userid || !_this.data.passwd || !_this.data.authcd) {
      app.showErrorModal('账号、密码及验证码不能为空', '提醒');
      return false;
    }
    app.showLoadToast('登录中');
    wx.vrequest({
      method: 'POST',
      url: 'http://cer.nju.edu.cn/amserver/UI/Login',
      data: {
        'encoded': 'false',
        'goto': '',
        'gotoOnFail': '',
        'IDToken0': '',
        'IDButton': 'Submit',
        'IDToken1': _this.data.userid,
        'IDToken2': _this.data.passwd,
        'inputCode': _this.data.authcd,
        'gx_charset': 'UTF-8'
      },
      header: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': _this.data.cookie,
        'Referer': 'http://cer.nju.edu.cn/amserver/UI/Login',
        'Origin': 'http://cer.nju.edu.cn',
      },
      success: function (res) {
        if (res.statusCode == 302) {
          app.showLoadToast('请稍候');
          wx.setStorageSync('isAuthened', true);
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          });
          wx.switchTab({
            url: '/pages/component/found/found'
          })
          // 绑定openid与学号 -> 将验证成功的学号写入学号集合
          db.collection('userInfo').where({
            description: db.RegExp({
              "_openid": app.globalData.openid
            })
          }).get({
            success: res => {
              console.log('[数据库] [查询记录] 成功: ', res)
            },
            fail: err => {
              console.error('[数据库] [查询记录] 失败：', err)
              _this.addUserInfo
            }
          })
        } else {
          wx.hideToast();
          app.showErrorModal('您输入的账号或密码错误，请重新输入', '登录失败');
        }
      },
      fail: function (res) {
        wx.hideToast();
        app.showErrorModal(res.errMsg, '登录失败');
      }
    })
  },
  addUserInfo: function () {
    db.collection('userInfo').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        stuid: _this.data.userid
      }
    }).then(res => {
      console.log(res)
    }).catch(console.error)
  },
  useridInput: function (e) {
    this.setData({
      userid: e.detail.value
    });
  },
  passwdInput: function (e) {
    this.setData({
      passwd: e.detail.value
    });
  },
  authcdInput: function (e) {
    this.setData({
      authcd: e.detail.value
    });
    if (e.detail.value.length >= 4) {
      wx.hideKeyboard();
    }
  },
  inputFocus: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    } else if (e.target.id == 'authcd') {
      this.setData({
        'authcd_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    } else if (e.target.id == 'authcd') {
      this.setData({
        'authcd_focus': false
      });
    }
  },
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  }
});