// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({})

const db = cloud.database({});


// 云函数入口函数
exports.main = async (event, context) => {
  let { ac_id } = event;
  let { openId } = event.userInfo;

  let userListInfo = await getuserListInfo(db, ac_id, openId);

  let mySelfInfo = await getMySelfInfo(userListInfo, ac_id, openId);

  return {
    code : 1,
    mySelfInfo,
    userListInfo, 
  }
}

async function getuserListInfo(db, ac_id, openId) {
  let res = await db.collection('joinLog').where({
    ac_id : ac_id
  }).get();

  let userList = res.data;

  return userList;
}

async function getMySelfInfo(userListInfo, ac_id, openId){
  if (userListInfo.length > 0){
    let { joinNum, chooseNum } = userListInfo[0];//总共多少人，要抽多少人

    let hasEntered = userListInfo.length;//已经进入多少人

    let luckysNum = userListInfo.filter((item, key) => {
      return item.isLuckyMan == true;
    }).length; //已经出了多少个幸运的

    let myRecord = userListInfo.find((item) => {
      return item.userOpenId == openId
    });

    let isLuckyMan = myRecord['isLuckyMan'] || false;//我自己是不是luckyMan (如果我进来人已经满了，也返回false)

    return {
      isLuckyMan,
      joinNum,
      hasEntered,
      luckysNum,
      openId,
      chooseNum
    }
  }
}
