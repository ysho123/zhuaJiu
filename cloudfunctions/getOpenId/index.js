// 云函数入口文件
const cloud = require('wx-server-sdk')

// 云函数入口函数
exports.main = async (event, context) => {
  let { appid, openId } = event.userInfo;
  return openId ;
}