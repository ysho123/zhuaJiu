// miniprogram/pages/test/test.js
let wxUtils = require('../../wxUtils/wxUtils.js');

Page({
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    this.ctx = wx.createCanvasContext('xxx');
  },

  /**
   * 页面的初始数据
   */
  data: {
    picSrc: '',
  },

  getQrFileId(event) {
    wxUtils.request('getQRCode',{ac_id :'123',  ac_Name:'asdasd'},(res)=>{
      console.log(res);
      let fileId = res.result.fileRes.fileID;
      this.downloadPic(fileId);
    });
  },

  downloadPic(fileId){
    wxUtils.downloadFile(fileId, (fileRes) => {
      console.log(fileRes);
      //画出所有的东西到canvas上
      this.drawAllTheInfo(fileRes);
      //把canvas输出成图片
      this.ctx.draw(false, (drawInfo) => {
        wx.canvasToTempFilePath({
          canvasId: 'xxx',
          quality: 1.0,
          success: (picSrcRes) => {
            console.log(picSrcRes);
            this.setData({
              picSrc: picSrcRes.tempFilePath
            });
          }
        });
      });
    });
  },

  drawAllTheInfo(fileRes){
    this.ctx.drawImage('../../images/qrCode/backgroud.png', 0, 0, 375, 500)
    this.ctx.drawImage(fileRes.tempFilePath,375/2-75, 500/2-75, 150, 150)
  },

  showPic(e){
    let self = this;
    wx.previewImage({
      urls : [self.data.picSrc],

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