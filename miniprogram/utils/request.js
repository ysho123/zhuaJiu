/**
 * 拉起请求 对应API说明
 * saveUser  保存用户信息
 * 
 * 
 */
function pullRequest( funcName , data){
  return wx.cloud.callFunction({
    name : funcName,
    data : data ,
  });
}

module.exports = {
  pullRequest
}