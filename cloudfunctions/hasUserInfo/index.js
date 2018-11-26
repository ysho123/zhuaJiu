// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({})

const db = cloud.database({});


// 云函数入口函数
exports.main = async (event, context) => {
  let { openId } = event.userInfo ;

  let res = await db.collection('user').where({
    openId : openId
  }).get();

  let userDocument = res.data[0] || null;

  if (userDocument){
    return {hasLog : true}
  }else{
    return {hasLog : false}
  }
}