// pages/mypage/mypage.js
let wxUtils = require('../../wxUtils/wxUtils.js');

var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    clickid: 1,            //默认世界排行
    tabar: [
      {
        id: 1,
        text: '我发起的'
      }, {
        id: 2,
        text: '我参与的'
      }
    ],
    scrollTop:0,
    resultList:[], //结果集
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getResultList(1)
  },

  //导航切换
  tabarClick: function (e) {
    let clickedId = e.currentTarget.dataset.id;

    if (this.data.clickid != clickedId){
      this.setData({
        resultList: [],//先把当前的制空
        clickid: clickedId
      })
      this.getResultList(clickedId);
    }
  },

  getResultList(clickId){
    let reqType = (clickId == 1 ? 'mineCreate' : 'mineJoin');

    wxUtils.request('getMineRecord', { listType: reqType },(res)=>{
      console.log('minePage',res);
      this.setData({
        resultList : res.result.list
      });
    })
  },

  // 跳转活动结果页
  goResult:function(e){
    let ac_id = e.currentTarget.dataset.id ;
    console.log(this.data.clickid)
    wx.redirectTo({
      url: `../result/result?ac_id=${ac_id}`,
    })
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
    // wx.stopPullDownRefresh()
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
  
  }
})
