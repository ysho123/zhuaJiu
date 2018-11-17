// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let { content , joinNum , chooseNum } = event;
  let { openId } = event.userInfo;

  let date = new Date();

  let recordTime = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()+8}:${date.getMinutes()}`;

  let luckManArr = getLucyManArr(joinNum, chooseNum);

  let creater_userInfo = await db.collection('user').where({
    openId : openId
  }).get();
  let userDocument = creater_userInfo.data[0] || null;
  let creater_nickName = 'undifined';
  let creater_avatar = 'https://game-1256868251.cos.ap-guangzhou.myqcloud.com/zhuajiu/result/user-unlogin.png';
  if (userDocument){
    creater_nickName = userDocument['nickName'];
    creater_avatar = userDocument['avatarUrl'];
  }else{
    return {code : 0,msg : '用户未授权'}
  }

  let data = {
    activeName : content ,
    creater_openId : openId ,
    joinNum : joinNum ,
    chooseNum : chooseNum ,
    luckManArr: luckManArr , 
    recordTime: recordTime,
    finished : false ,
    creater_nickName : creater_nickName,
    creater_avatar: creater_avatar,
  }

  try{
    let res = await db.collection('activity_list').add({
      data: data
    })
    console.log('sdfadsffsd',res);
    return {
      code: 1,
      msg: '创建房间成功',
      ac_id: res._id
    }
  }catch(err){
    return {
      code : 0 ,
      msg : '添加房间失败',
      err : err
    }
  }
}

function getLucyManArr(joinNum,chooseNum){
  let luckManArr = [] ;
  while (luckManArr.length < chooseNum){
    let randomNum = parseInt(Math.random() * joinNum) + 1 ;
    if (!luckManArr.includes(randomNum)){
      luckManArr.push(randomNum);
    }
  }
  return luckManArr;
}