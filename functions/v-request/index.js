/**
 * v-request::cloud code
 * 无限制的小程序HTTP请求云函数
 * 你可以使用此功能，在小程序上请求访问如下类型的HTTP数据：
 * 1. 未进行备案的
 * 2. 未上HTTPS证书的
 * 3. 没绑定域名，直接IP地址访问的
 * ==========================
 * 更新时间：2019/04/12
 */

const request = require('request');
exports.main = (evt, ctx) => {
  return new Promise((RES, REJ) => {
    request(options, (err, res, body) => {
      if (err) return REJ(err);
      RES(res, base64);
    });
  });
}