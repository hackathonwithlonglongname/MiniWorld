//jwnet.js
//获取应用实例
var app = getApp();
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
  onLoad: function() {
    const _this = this;
    wx.vrequest({
      method: 'GET',
      url: 'http://cer.nju.edu.cn/amserver/UI/Login',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        //'Cookie': _this.data.cookie
      },
      success: res => {
        _this.setData({
          cookie: res.header['set-cookie'].join(',').replace(/ path=\//g, ' ').replace(/Domain=.nju.edu.cn;Path=\/,/g, ' ').replace(/Path=\/,/g, ' ')
        })
        _this.requet()
      }
    })
  },

  onReady: function() {
    const _this = this;
    setTimeout(function() {
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
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
    });
  },

  requet: function() {
    const _this = this;
    wx.request({
      method: 'GET',
      url: 'https://cer.nju.edu.cn/amserver/verify/image.jsp',
      responseType: 'arraybuffer',
      encoding: null,
      header: {
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh',
        'Content-Type': 'image/jpg',
        'Cookie': _this.data.cookie,
      },
      success: function(res) {
        //let buffer = wx.base64ToArrayBuffer(res.data)
        let base64 = wx.arrayBufferToBase64(res.data)
        _this.setData({
            //cookie: _this.data.cookie + res.header['set-cookie'].join(',').replace(/ path=\//g, '').replace(/Domain=.nju.edu.cn;Path=\/,/g, ' ').replace(/Path=\/,/g, ' ').replace(/;Path=\//g, '')
          cookie: _this.data.cookie + res.header['Set-cookie'].replace(/ path=\//g, '').replace(/Domain=.nju.edu.cn;Path=\/,/g, ' ').replace(/Path=\/,/g, ' ').replace(/Path=\//g, '')
          }),
          console.log(res.data)
        console.log(base64)
        console.log(_this.data.cookie)
        //console.log(buffer)
        _this.setData({
          img: 'data:image/jpg;base64,' + base64
        })

      }
    });
  },

  bind: function() {
    const _this = this;
    if (app.g_status == '未授权') {
      app.showErrorModal(app.g_status, '登录失败');
      return;
    }
    if (!_this.data.userid || !_this.data.passwd || !_this.data.authcd) {
      app.showErrorModal('账号、密码及验证码不能为空', '提醒');
      return false;
    }
    /*
    if(!app._user.openid){
      app.showErrorModal('未能成功登录', '错误');
      return false;
    }
    */
    app.showLoadToast('登录中');
    wx.vrequest({
      method: 'POST',
      //url: 'http://elite.nju.edu.cn/jiaowu/login.do',
      //url: 'http://cer.nju.edu.cn/amserver/UI/Login',
      url: 'http://imp.nju.edu.cn/imp/authLogin.do',
      data: {
        /*'userName': _this.data.userid,
        'password': _this.data.passwd,
        'returnUrl': "null",
        'ValidateCode': _this.data.authcd*/
        'encoded': 'false',
        'goto': 'aHR0cDovL3hzZ2wubmp1LmVkdS5jbi9pbmRleC5wb3J0YWw=',
        'gotoOnFail': 'aHR0cDovL3hzZ2wubmp1LmVkdS5jbi9pZGVudGl0eS9sb2dpbmVyci5qc3A=',
        'IDToken0': '',
        'IDButton': 'Submit',
        'IDToken1': _this.data.userid,
        'IDToken2': _this.data.passwd,
        'inputCode': _this.data.authcd,
        'gx_charset': 'UTF-8'
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': _this.data.cookie
      },
      success: function(res) {
        if (res.statusCode == 302) {
          app.showLoadToast('请稍候');
          wx.setStorageSync('isAu', true);
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          });
          wx.switchTab({
            url: '/pages/component/found/found'
          })
        } else {
          wx.hideToast();
          // app.showErrorModal(res.data.message, '登录失败');
          app.showErrorModal('您输入的账号或密码错误，请重新输入', '登录失败');
        }
      },
      fail: function(res) {
        wx.hideToast();
        app.showErrorModal(res.errMsg, '登录失败');
      }
    });
  },
  useridInput: function(e) {
    this.setData({
      userid: e.detail.value
    });
  },
  passwdInput: function(e) {
    this.setData({
      passwd: e.detail.value
    });
  },
  authcdInput: function(e) {
    this.setData({
      authcd: e.detail.value
    });
    if (e.detail.value.length >= 4) {
      wx.hideKeyboard();
    }
  },
  inputFocus: function(e) {
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
  inputBlur: function(e) {
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
  tapHelp: function(e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function(e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function(e) {
    this.setData({
      'help_status': false
    });
  }
});