// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: 'debug - 95532c'
})
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //获取当前时间戳
  var timestamp = Date.parse(new Date())
  var nowDate = new Date(timestamp)
  timestamp = timestamp / 1000

  //获取当前时间
  //年
  var Y = nowDate.getFullYear()
  //月
  var M = (nowDate.getMonth() < 10 ? '0' + (nowDate.getMonth()) : nowDate.getMonth())//一个月以前
  //日
  var D = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()
  //时
  var h = (nowDate.getHours() < 10 ? '0' + nowDate.getHours() : nowDate.getHours())
  //分
  var m = (nowDate.getMinutes() < 10 ? '0' + nowDate.getMinutes() : nowDate.getMinutes())
  //秒
  var s = (nowDate.getSeconds() < 10 ? '0' + nowDate.getSeconds() : nowDate.getSeconds())
  var nowTime = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
  //console.log(nowTime)

//无法将state改为out，我也不知咋回事。。官方文档和社区都翻过了
//只好等待下一次的更新了。。
  try{
    return await db.collection("itemInfo").where({
      state: "pass",
      postTime: _.lt(nowTime)
    })
    .update({
      data: {
        state: "out"
      },
    })
  }catch (e) {
    console.error(e)
  }
}
