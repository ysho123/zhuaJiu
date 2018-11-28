// miniprogram/pages/result/result.js
const wxUtils = require('../../wxUtils/wxUtils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mySelfInfo : {},
    userListInfo : [],
    ac_id: '',//当前活动id
    ac_Name: '今天谁去拿外卖',
    showSharedPic : false,//是否展示分享图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { ac_id } = options;
    let ac_Name = options.ac_Name || '来抓阄呀'
    this.setData({
      ac_id: ac_id,
      ac_Name: ac_Name
    });
    wx.setNavigationBarTitle({ title: ac_Name });

    if(ac_id){
      wxUtils.request('getUserList', {ac_id} ,(res)=>{
        // console.log('结果页',res);
        let result = res.result;
        if (result && result.code == 1){
            this.setData({
              mySelfInfo: result.mySelfInfo ,
              userListInfo: result.userListInfo
            })
        }
      });
    }
  },

  refresh(){
    wxUtils.request('getUserList', { ac_id : this.data.ac_id }, (res) => {
      // console.log(res);
      let result = res.result;
      if (result && result.code == 1) {
        this.setData({
          mySelfInfo: result.mySelfInfo,
          userListInfo: result.userListInfo
        })
      }
    });
  },

  getShareImage(e) {
    // console.log('getImage');
    this.setData({
      showSharedPic: true
    })
  },

  closeComponent(e) {
    // console.log('close Component');
    this.setData({
      showSharedPic: false
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let self = this;
    // if (e.from == 'button') {
      return {
        title: `谁会是那个幸运娃 : ${self.data.ac_Name}`,
        path: `pages/goPage/goPage?ac_id=${self.data.ac_id}&ac_Name=${self.data.ac_Name}`
      }
    // }
  },

  backIndex(e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})