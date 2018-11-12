// miniprogram/pages/goPage/goPage.js
let wxUtils = require('../../wxUtils/wxUtils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ac_id : '',//当前活动id
    ac_Name : '今天谁去拿外卖'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let { ac_Name,ac_id} = options;
    this.setData({
      ac_id : ac_id,
      ac_Name: ac_Name
    });
  },

  joinGame(){
    let self = this ;

    wxUtils.request('joinGame',{ac_id : this.data.ac_id},(res)=>{
      let result = res.result;
      if (result && result.code == 1){
        //抽签成功
        console.log('抽签成功', result);
        wx.navigateTo({
          url: `/pages/result/result?ac_id=${self.data.ac_id}`,
        })
      } else{
        console.log('抽签成功，但是活动已参加', result);
        wx.showModal({
          title: result.msg,
          content: `回首页重新发起抽签吧`,
          showCancel : false,
          confirmText : '回首页去',
          confirmColor: '	#3cc51f',
          success:(data)=>{
            if (data.confirm){
              wx.redirectTo({
                url: '/pages/index/index',
              })
            }
          }
        })
      }},(err)=>{
        console.log('抽签请求错误',err) 
      });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})