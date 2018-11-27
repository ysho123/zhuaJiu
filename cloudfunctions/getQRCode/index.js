// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
const uuidv1 = require('uuid/v1');
const fs = require('fs')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let accessResult = await getAccessToken(rp, db); 
  if (accessResult.code != 1) return accessResult;

  let accessToken = accessResult.accessToken;
  
  let qrCodeRes = await getQrCode(rp,accessToken);

  let cloudStorageRes = await getCloudStorageId(qrCodeRes);

  return cloudStorageRes;
}

async function getAccessToken(rp, db, appId = 'wx4c126aae66c61a25', appSecret = '258fdf2dc0b0711148c35d2d70f16b9e'){
  //去库里查accessToken，如果有并且没有超过两小时 就可以发回来  否则 重新获取 并且覆盖库
  //1、查库
  let dbresult = await ifDbContains(db);      /**返回的数据结构
                                                * { 
                                                    access : boolean,
                                                    accessItem : {
                                                      _id: 'W_N30ZSXoyWmWICv',
                                                      accessToken: ,
                                                      time: 1542711377145
                                                    }
                                                  }  
                                                */

  if (dbresult.access){
    //1.1有数据并且没失效
    return {
      code : 1,
      accessToken: dbresult.accessItem.accessToken
    }
  }else{
    //2.2没数据或已失效
    try {
      let accessResult = await rp(
        {
          method: 'get',
          uri: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
          headers: {},//请求头
          json: true  //是否json数据
        }
      ).then((body) => {
        return (body);
      }).catch(err => {
        return err;
      })

      console.log('请求拿回来的token数据',accessResult);

      //覆盖库
      await coverTheDb(db, accessResult, dbresult);

      return {
        code: 1,
        accessToken: accessResult.access_token,
        msg: '发请求获取token成功'
      }
    } catch (err) {
      console.log('发请求获取accessResult出错', err);
      return {
        code: 0,
        msg: `发请求获取accessResult出错,${err}`
      }
    }
  }
}

//判断数据库是否有token并且没有失效
async function ifDbContains(db) {
  let dbRes = await db.collection('accessToken').get();//拿到数据表全部
  console.log('asdasdasfsdfg',dbRes);
  let accessItem = dbRes.data[0] || null;//拿到那一条数据

  let curTime = parseInt(new Date(new Date().getTime() + 28800 * 1000).getTime() / 1000);

  let access = accessItem != null &&  Number(accessItem.time) + 7200 >= Number(curTime); 

  if (access){
    console.log('token数据存在并且没过期，直接从库里拿');
    return {
      access: access,
      accessItem: accessItem
    }
  }else{
    let ifExpires = false;
    let _id = '';
    if (accessItem){ 
      ifExpires = Number(accessItem.time) + 7200 < Number(curTime);
      _id = accessItem._id ;
    }
    console.log(`token数据存在吗？${accessItem != null}token数据过期了吗?${ifExpires}`);
    return {
      access: access,
      ifExit: accessItem != null ,
      _id : _id ,
      ifExpires: ifExpires
    }
  }
}

/**
 * dbResult数据结构
 * {
      access: Boolean,
      ifExit: Boolean, //是否存在
      _id : _id,  //存在的记录id
      ifExpires: Boolean //是否失效  这里没用上
    }
 * 
 */
async function coverTheDb(db, accessResult, dbResult){
  console.log('converTheDb', accessResult, dbResult)
  let token = accessResult.access_token ;
  let curTime = parseInt(new Date(new Date().getTime() + 28800 * 1000).getTime() / 1000);
  
  if (dbResult.ifExit){
    //有数据 替换掉
    let _id = dbResult._id ;
    try {
      await db.collection('accessToken').doc(_id).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          accessToken: token,
          time: curTime
        }
      })
      console.log('数据库token过期替换数据', accessResult);
    } catch (e) {
      console.error(e)
    }
  }else{
    //没有数据  添加
    try {
      await db.collection('accessToken').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          accessToken: token,
          time: curTime
        }
      })
      console.log('数据库token不存在添加数据', accessResult,)
    } catch (e) {
      console.error(e)
    }
  }
}

async function getQrCode(rp,accessToken){
  //获取带参数的二维码  
  console.log('QRInPara', accessToken);

  let jsonStr = {
    "path":"pages/index/index",
    "auto_color" : true,
    // "is_hyaline" : true,
    "width" : 300
  };

  console.log(jsonStr);

  let rpQrCodeRes = await rp(
    {
      method: 'post',
      uri: `https://api.weixin.qq.com/wxa/getwxacode?access_token=${accessToken}`,
      body: jsonStr,
      headers: {
        "content-type":"application/json",
      },//请求头
      encoding: null,//不加这个，返回的二维码是乱码，不知道什么鬼
      json: true  //是否json数据'
    }
  ).then((body) => {
    return (body);
  }).catch(err => {
    return err;
  })

  //如果请求成功 直接返回二进制数据   如果失败 返回json格式
  return rpQrCodeRes;
}

//获取云存储的id
async function getCloudStorageId(qrCodeRes){
  if (qrCodeRes.errcode){
    return {code:0 ,errCode: errcode,msg : '获取二维码错误'}
  }else{
    try{
      let fileRes = await cloud.uploadFile({
        cloudPath: 'qrCode/' + uuidv1() + '.jpg',
        fileContent: qrCodeRes
      })
      return {
        code : 1 , 
        fileRes: fileRes
      }
    }catch(err){
      console.log('上传文件失败:err:', err);
      return {
        code : 0,
        err : err
      }
    }
  }
}