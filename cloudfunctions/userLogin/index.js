// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let { avatarUrl, city, country, gender, nickName, province} = event ;
  let { appid, openId } = event.userInfo ;

  let hasLog = await db.collection('user').where({
    openId: openId
  }).get() ;

  let userDocument = hasLog.data[0] || null ;

  if (userDocument){
    //替换记录
    let _id = userDocument['_id'] ;
    console.log('qqqqqqqqqqqqqqqqqqq替换记录')
    return await db.collection('user').doc(_id).update({
      data : {
        avatarUrl,
        city,
        country,
        gender,
        nickName,
        province,
        openId
      }
    });
  }else{
    //新增记录
    console.log('rrrrrrrrrrrrrrrrrrrr新增记录')
    return await db.collection('user').add({
      data : {
        avatarUrl,
        city,
        country,
        gender,
        nickName,
        province,
        openId
      }
    })
  }
}