//index.js
const wxUtils = require('../../wxUtils/wxUtils.js');
const app = getApp()

Page({
  data: {
    buttonType: '',
    inputContent : '今天谁下楼拿外卖',
    joinNum : 0,
    chooseNum : 0
  },

  onLoad: function() {
    //获得openId
    wxUtils.getOpenId((openId)=>{
      console.log(openId);
      //判断此用户有没有在数据库留下记录
      wxUtils.hasUserInfo(()=>{
        this.setData({
          buttonType: 'getUserInfo'
        });
      }
      );
    },
    (err)=>{
      console.log(err);
    })
  },

  getUserInfo(res) {
    console.log(res);
    if (res.detail.userInfo) {
      let userInfo = res.detail.userInfo;
      
      wxUtils.request('userLogin', userInfo,(res)=>{
        if(res.result){
          this.setData({
            buttonType : ''
          });
          wx.setStorageSync('userInfo', {hasLog : true});
        }
      })
    }
  },

  submit(){
    if (!this.data.buttonType){
      console.log('222222222222');
    }
  },

  inputNum(e){
    let Type = e.currentTarget.dataset.id;
    let value = e.detail.value;
    let res = parseInt(value);
    let modify = (Type == 'join' ? 'joinNum' : 'chooseNum');
    this.setData({
      [modify] : res
    })
  },

  minusNum(e){
    let minusType = e.currentTarget.dataset.id;
    let modify = (minusType == 'join' ? 'joinNum' : 'chooseNum');
    let num = parseInt(this.data[modify]);
    if (num == 0) return;
    this.setData({
      [modify]: num - 1
    });
  },

  addNum(e){
    let addType = e.currentTarget.dataset.id;
    let modify = (addType == 'join' ? 'joinNum' : 'chooseNum');
    let num = parseInt(this.data[modify]);
    this.setData({
      [modify]: num + 1
    });
  },

})
