// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'rea-a6b48a'
})

const db = cloud.database({
  env: 'rea-a6b48a'
});


const backMsg = [
  { code: 0, msg: "没有找到对应活动" }, //返回首页
  { code: 1, msg: "抽奖成功" },
  { code: 2, msg: "抽奖过程中出问题啦" },//返回首页
  { code: 3, msg: "活动已经结束了" },
  { code: 4, msg: "已经参与过本次活动了" },
]

// 云函数入口函数
exports.main = async (event, context) => {
  let {ac_id} = event;
  let {openId} = event.userInfo ;

  let ac_Info;

  //没有对应id 没有找到要参加的活动
  try{
    ac_Info = await db.collection('activity_list').doc(ac_id).get();
  }catch(err){
    return backMsg[0];
  }
  
  let data = ac_Info.data || null ;
  
   //活动已经结束了
  if (data.finished) return backMsg[3];
  //如果自己参与过这个活动了
  let myLogRes = await db.collection('joinLog').where({
    ac_id : ac_id,
    userOpenId : openId
  }).get();
  let myLog = myLogRes.data[0] || null ;
  if (myLog) return backMsg[4];

  //校验都过了，开始参加活动
  let luckManArr = data.luckManArr;

  let hasJoindRes = await db.collection('joinLog').where({
    ac_id: ac_id,
  }).get();
  //开始组织写入的数据

  //所有参加过的人的数组
  let hasJoind = hasJoindRes.data;
  //我的序号
  let myIndex = hasJoind.length + 1;
  //是否幸运者
  let isLuckyMan = false;
  if (luckManArr.includes(myIndex)){
    isLuckyMan = true;
  }
  //时间
  let date = new Date();
  let recordTime = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()+8}:${date.getMinutes()}`;
  //昵称
  let {nickName,userAvatar} = await getUserNameAndAvatar(db,openId);

  //写入的数据
  let writeData =  {
    ac_id,
    chooseNum: data.chooseNum,
    joinNum: data.joinNum,
    userOpenId : openId,
    userName: nickName,
    userAvatar: userAvatar,
    activeName: data.activeName,
    creater_nickName: data.creater_nickName,
    creater_openId: data.creater_openId,
    creater_avatar: data.creater_avatar,
    isLuckyMan,
    joinIndex: myIndex,
    recordTime: recordTime,
  }

  try{
    await db.collection('joinLog').add({
      data: writeData
    })
    if (Number(data.joinNum) == myIndex) {
      await db.collection('activity_list').doc(ac_id).update({
        data: {
          finished: true
        }
      })
    }
    return backMsg[1];
  }catch(err){
    return backMsg[2];
  }
}

async function getUserNameAndAvatar(db,openId){
  let userRes = await db.collection('user').where({
    openId: openId
  }).get();

  let userInfo = userRes.data[0] || null;
  let nickName = 'undifined';
  let userAvatar = 'https://game-1256868251.cos.ap-guangzhou.myqcloud.com/zhuajiu/result/user-unlogin.png'
  if (userInfo) {
    nickName = userInfo['nickName'];
    userAvatar = userInfo['avatarUrl'];
  }
  return { nickName, userAvatar};
}

