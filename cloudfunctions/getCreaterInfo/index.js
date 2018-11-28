// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let {ac_id} = event ;

  let sqlRes = await db.collection('activity_list').doc(ac_id).get();//得到当前活动记录

  let data = sqlRes.data;

  return {
    creater_nickName: data.creater_nickName || '不知道是谁',
    creater_avatar: data.creater_avatar || 'https://game-1256868251.cos.ap-guangzhou.myqcloud.com/zhuajiu/result/user-unlogin.png' 
  }
}