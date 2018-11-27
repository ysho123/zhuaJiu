//index.js
const wxUtils = require('../../wxUtils/wxUtils.js');
const app = getApp()

Page({
  data: {
    needLog: false,
    inputContent : '今天谁下楼拿外卖',
    joinNum : 0,
    chooseNum : 0 ,
    hintShow : false,
  },

  onLoad: function() {
    //获得openId
    wxUtils.getOpenId((openId)=>{
      console.log(openId);
      //判断此用户有没有在数据库留下记录
      wxUtils.hasUserInfo(()=>{
        this.setData({
          needLog: true
        });
      }
      );
    },
    (err)=>{
      console.log(err);
    },
    )
  },

  getUserInfo(res) {
    console.log(res);
    if (res.detail.userInfo) {
      let userInfo = res.detail.userInfo;
      wxUtils.request('userLogin', userInfo,(res)=>{
        if(res.result){
          this.setData({
            needLog: false
          });
          // wx.setStorageSync('userInfo', {hasLog : true});
          this.submit();
        }
      })
    }else{
      wx.showToast({
        title: '授权才能使用哦',
        icon : 'loading'
      })
    }
  },

  showHint(e){
    this.setData({
      hintShow : true,
    })
  },

  closeHint(e){
    this.setData({
      hintShow: false,
    })
  },

  inputWord(e){
    this.setData({
      inputContent: e.detail.value
    });
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

  submit(e) {
    let self = this;

    if (this.data.joinNum == 0 || this.data.chooseNum == 0 ){
      wxUtils.showPopMessage('不能有数据为空',false,1500);
      return;
    }

    if (this.data.joinNum > 1000){
      wxUtils.showPopMessage('不能大于1000人', false, 1000);
      return;
    }

    if (this.data.joinNum < this.data.chooseNum){
      wxUtils.showPopMessage('选中人数太多啦', false, 1500);
      return;
    }
    //可以提交信息了
    let data = {
      content: this.data.inputContent,
      joinNum: this.data.joinNum,
      chooseNum: this.data.chooseNum
    }

    wxUtils.request('createRoom', data,(res)=>{
      let ac_id = res.result.ac_id ;
      wx.navigateTo({
        url: `/pages/goPage/goPage?ac_id=${ac_id}&ac_Name=${self.data.inputContent}`,
      })
    },
    (err)=>{

    });
  },

})
