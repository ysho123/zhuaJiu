//index.js
const wxUtils = require('../../wxUtils/wxUtils.js');
const app = getApp()

Page({
  data: {
    buttonType: '',
    inputContent : '今天谁下楼拿外卖',
    joinNum : 0,
    chooseNum : 0 ,
    hasSubmit : false
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
    }else{
      wx.showToast({
        title: '授权才能使用哦',
        icon : 'loading'
      })
    }
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


  submit() {
    let self = this;

    if (this.data.hasSubmit){
      return ;
    }

    //避免一下点两次出问题
    this.setData({
      hasSubmit: true
    });
    
    if (!this.data.buttonType) {
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

      },
      ()=>{
        this.setData({
          hasSubmit: false
        });
      });
    }
  },

})
