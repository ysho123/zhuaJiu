const noop = function(){};

let wxUtils = {
  /**
   * url 说明：
   * getOpenId : 获取openId
   * userLogin : 用户授权，如果有用户信息，更新信息，如果没有用户信息，add信息
   * hasUserInfo : 判断数据库里是否有这个人的信息
   */
  request(url,data,success = noop,fail = noop,complete = noop){
    wx.cloud.callFunction({
      name: url,
      data: data,
      success : (res)=>{
        success(res);
      },
      fail : (err)=>{
        fail(err);
      },
      complete : ()=>{
        complete();
      }
    })
  },

  getOpenId(success,fail){
    let openId = wx.getStorageSync('openId');

    if (openId){
      // console.log('本地有缓存')
      success && success(openId);
    }else{
      this.request('getOpenId',{},
        (res)=>{
          // console.log('通过请求拿到了openid')
          wx.setStorageSync('openId', res.result);
          success(res.result);
        },
        (err)=>{
          fail(err);
        }
      )
    }
  },

  hasUserInfo(callBack){
    let hasLog = wx.getStorageSync('userInfo');

    if(hasLog){
      console.log('缓存有用户信息')      
    }else{
      this.request('hasUserInfo',{},
        (res)=>{
          if(res.result.hasLog){
            console.log('请求信息发现有用户信息');
          }else{
            console.log('请求发现没有用户信息哦');
            callBack();
          }
        }
      )
    }
  },


}

module.exports = wxUtils;