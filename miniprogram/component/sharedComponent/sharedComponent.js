// component/sharedComponent/sharedComponent.js
let wxUtils = require('../../wxUtils/wxUtils.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ac_id : {
      type : String,
      value : ''
    },
    ac_Name : {
      type:String,
      value:'来抓阄呀'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    picSrc : '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeComponent(e){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('closeComponent', myEventDetail, myEventOption)
    },

    drawSharedImage(userInfo) {
      //1、获得二维码临时文件云存储ID
      wxUtils.request('getQRCode', { ac_id: this.data.ac_id, ac_Name: this.data.ac_Name }, (res) => {
        // console.log(res);
        let fileId = res.result.fileRes.fileID; 
        //2、下载二维码到本地然后画(先获取创建者信息)
        wxUtils.request('getCreaterInfo', { ac_id: this.data.ac_id }, (userRes) => {//获取创建者信息
          // console.log('创建者信息', userRes);
          wx.showLoading({
            title: '生成中',
          })
          this.downloadUserAvatar(userRes,(createrInfo)=>{//用户头像得到临时路径
            this.downloadPic(fileId, createrInfo);//正式画图
          })
        });
      });
    },

    downloadUserAvatar(userRes,callBack){
      wx.downloadFile({
        url: userRes.result.creater_avatar,
        success: function (res) {
          let createrInfo = {
            creater_nickName: userRes.result.creater_nickName,
            creater_avatar: res.tempFilePath
          }
          callBack(createrInfo);
        }
      })
    },

    downloadPic(fileId, userInfo) {
      wxUtils.downloadFile(fileId, (fileRes) => {
        // console.log(fileRes);
        //画出所有的东西到canvas上
        this.drawAllTheInfo(fileRes, userInfo); 
        //把canvas输出成图片
        this.ctx.draw(false, (drawInfo) => {
          wx.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            quality: 1.0,
            destWidth: 360,
            destHeight: 500,
            success: (picSrcRes) => {
              // console.log(picSrcRes);
              this.setData({
                picSrc: picSrcRes.tempFilePath
              });
              wx.hideLoading({});
            }
          }, this);
        });
      });
    },

    drawAllTheInfo(fileRes, userInfo) {
      this.ctx.drawImage('../../images/qrCode/backgroud.png', 0, 0, 360, 500);//画背景图

      this.ctx.save();//保存画笔的扩大比例

      this.ctx.scale(0.83,0.83);
      this.ctx.drawImage(userInfo.creater_avatar, 183, 280, 66 , 66);//画用户头像

      this.ctx.restore();

      this.ctx.setFontSize(17);
      this.ctx.setFillStyle('#44484b');
      this.ctx.setTextAlign('center')
      this.ctx.fillText(userInfo.creater_nickName, 180, 310);//写用户名字
      this.ctx.setFontSize(17);
      this.ctx.setFillStyle('#f56871');
      this.ctx.setTextAlign('center')
      this.ctx.fillText(this.data.ac_Name, 180, 360);//写活动名字

      this.ctx.scale(0.6, 0.6);
      this.ctx.drawImage(fileRes.tempFilePath, 225, 623, 150, 150);//画二维码

      this.ctx.restore();
    },

    showPic(e) {
      let self = this;
      wx.previewImage({
        urls: [self.data.picSrc],
      });
    },
  },

  attached(){
    //初始化 第二个参数this 传的是组件的作用域
    this.ctx = wx.createCanvasContext('shareCanvas',this);

    this.drawSharedImage();
  },

  detached(){

  },
})
