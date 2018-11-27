// component/sharedComponent/sharedComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getQrFileId(e){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('closeComponent', myEventDetail, myEventOption)
    },
  },

  attached(){
    console.log('11111111');
  },

  detached(){
    console.log('22222');

  },
})
