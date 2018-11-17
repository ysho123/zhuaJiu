/**
 *  获取我个人的抽签记录
 *  不需要入参
 *  
 *  出参:我发起的   我参加的
 *      active表     log表
 *       openId     openId 并且creater_openid 不等于 openid
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();
const command = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let { openId } = event.userInfo;

  let {listType} = event;

  try{
    let list = [];

    if (listType=='mineCreate'){
      list = await getMyCreateList(db, command, openId);
    } else if (listType == 'mineJoin'){
      list = await getMyJoinList(db, command, openId);
    }

    return {
      code: 1,
      list
    }
  }catch(err){
    return {
      cede : 0,
      err
    }
  }
}

async function getMyCreateList(db,command,openId){
    let createList = await db.collection('activity_list').where({
      creater_openId : openId
    }).get();

  return createList.data;
}

async function getMyJoinList(db, command,openId) {
  let createList = await db.collection('joinLog').where({
    userOpenId : openId,
    creater_openId: command.neq(openId)
  }).get();

  return createList.data;
}
