/**
 * v-request::client code
 * 无限制的小程序HTTP请求云函数
 * 你可以使用此功能，在小程序上请求访问如下类型的HTTP数据：
 * 1. 未进行备案的
 * 2. 未上HTTPS证书的
 * 3. 没绑定域名，直接IP地址访问的
 * 注： 不可访问内网IP或腾讯云服务器无法连接的地址
 * ==========================
 * 更新时间：2019/04/12
 */

/**
 * 使用方法
 * =======
 * 与官方的wx.request大致相同
 * 目前测试正常的get、post请求都OK，当然还可能会有其他小细节问题，不能应对全部的情况
 * -------
 */
var util = require('util.js')

wx.vrequest = function (options) {
  // 默认配置
  const OPT = Object.assign({
    method: 'GET',
    //dataType: 'json',
    responseType: 'text'
  }, options);

  // 默认header
  OPT['header'] = Object.assign({
    'Content-Type': 'application/x-www-form-urlencoded',
    'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    'Connection': 'keep-alive',
  }, options.header);

  // 发送的数据
  // 如果data是string,对应request模块的body（buffer、string）
  // 如果是object，则为json，对应request模块的json
  let POST_DATA = {
    body: options.data
  };
  //if (typeof options.data === 'object') POST_DATA['body'] = JSON.stringify(POST_DATA['body']);
  if (typeof options.data === 'object') POST_DATA['body'] = util.json2Form(POST_DATA['body']);
  console.log(POST_DATA['body'])

  // 开始请求
  return new Promise((RES, REJ) => {
    wx.cloud.callFunction({
      name: 'v-request',
      data: {
        options: Object.assign({
          url: options.url,
          method: OPT['method'],
          headers: OPT['header'],
          responseType: OPT['responseType'],
          encoding: null
        }, POST_DATA)
      },

      success: res => {
        const { result } = res;
        // 如果datatype='json'，则解析后
        let data = null;
        if (OPT.dataType === 'json') {
          try {
            data = JSON.parse(result.body);
          } catch (err) {
            console.error('[!] v-request： 解析返回数据json失败', err);
          }
        } else {
          // 否则为text数据
          data = result.body;
        }

        const RETURN_DATA = {
          data,
          errMsg: 'request:ok',
          statusCode: result.statusCode,
          header: result.headers
        }
        console.log(result)
        options.success && options.success(RETURN_DATA);
        RES(RETURN_DATA);
      },
      fail: err => {
        // 错误回调
        options.fail && options.fail({
          errMsg: 'request:fail',
          err
        });
        REJ(err);
      },
      complete: options.complete
    })
  })
}