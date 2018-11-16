// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database()

const backMsg = [
  {code: 0,msg:"没有对应活动"},
  {code: 3,msg:"活动已经结束了"},
  {code: 4,msg:"已经参与过本次活动了"},
  {code: 1,msg:"抽奖成功"},
  {code: 2,msg:"抽奖读写过程中出现问题"}
]

// 云函数入口函数
exports.main = async (event, context) => {
  let {ac_id} = event;
  let {openId} = event.userInfo ;

  let ac_Info = await db.collection('activity_list').doc(ac_id).get();

  let data = ac_Info.data || null ;
  
   //没有找到要参加的活动
  if (!data) return backMsg[0];
   //活动已经结束了
  if (data.finished) return backMsg[1];
  //如果自己参与过这个活动了
  let myLogRes = await db.collection('joinLog').where({
    ac_id : ac_id,
    openId : openId
  }).get();
  let myLog = myLogRes.data[0] || null ;
  if (myLog) return backMsg[2];

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
    openId,
    chooseNum: data.chooseNum,
    joinNum: data.joinNum,
    userName: nickName,
    userAvatar: userAvatar,
    ac_name: data.activeName,
    isLuckyMan,
    joinIndex: myIndex,
    joinTime: recordTime,
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
    return backMsg[3];
  }catch(err){
    return backMsg[4];
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

