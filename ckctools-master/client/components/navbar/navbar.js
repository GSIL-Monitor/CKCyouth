// components/navbar.js

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    open: {            // 属性名
      type: Number,
      value: false
    },
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
    load: function(e){
      wx.navigateTo({
        url: '../inquire/inquire',
      })
    },
    // 切换显示/不显示
    showview: function (e) {
      if (this.data.open) {
        this.setData({
          open: false
        });
      } else {
        this.setData({
          open: true
        });
      }
    }
  }
})
