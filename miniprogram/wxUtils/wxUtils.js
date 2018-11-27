const noop = function(){};

let wxUtils = {
  showLoading() {
    wx.showLoading({
      title: '请求中',
      mask: true,
    })
  },

  hideLoading() {
    wx.hideLoading();
  },

  /**
   * url 说明：
   * getOpenId : 获取openId
   * userLogin : 用户授权，如果有用户信息，更新信息，如果没有用户信息，add信息
   * hasUserInfo : 判断数据库里是否有这个人的信息
   * joinGame : 抽奖
   */
  request(url,data,success = noop,fail = noop,complete = noop){
    this.showLoading();
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
        this.hideLoading();
        complete();
      }
    })
  },

  getOpenId(success = noop, fail = noop, complete = noop){
    this.showLoading();
    let openId = wx.getStorageSync('openId');

    if (openId){
      // console.log('本地有缓存')
      success && success(openId);
      this.hideLoading();
    }else{
      this.request('getOpenId',{},
        (res)=>{
          // console.log('通过请求拿到了openid')
          wx.setStorageSync('openId', res.result);
          success(res.result);
        },
        (err)=>{
          fail(err);
        },
        ()=>{
          this.hideLoading();
        }
      )
    }
  },

  hasUserInfo(callBack){
    let hasLog = wx.getStorageSync('userInfo');

    // if(hasLog){
    //   console.log('缓存有用户信息')      
    // }else{
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
    // }
  },

  showPopMessage(title,success=false,sec=1000){
    wx.showToast({
      title: title ,
      icon: success ? 'success' : 'loading',
      duration : sec ,
      mask : true ,
    });
  },

  showPopModel(successFuc=noop){
    wx.showModal({
      title: '提示',
      content: '分享之后才能抽签哟',
      showCancel: false,
      cancelText:'取消',
      cancelColor:'#000000',
      confirmText: '好的',
      confirmColor: '	#FF8C00',
      success : (res)=>{
        if (res.confirm) {
          console.log('用户点击确定')
          successFuc(res);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },

  downloadFile(fileId, successCallBack = noop, failCallBack = noop){
    wx.cloud.downloadFile({
      fileID: fileId, // 文件 ID
      success: res => {
        // 返回临时文件路径
        successCallBack(res);
      },
      fail: err => {
        failCallBack(err)
      }
    })
  },

}

module.exports = wxUtils;