var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    activitydata: '未参与活动',
    info_list: [{
      status: 0,
      status_text: '读取中',
      text: '竺院团委纳新宣讲会抽奖',
      request_url: '/prizeDraw/addParticipant',
      url: '../activity/activity',
      img_src: '../picture/img01.png',
      color: "#2e9200",
      opacity: 1,
      onUse: false
    }, ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e)
    let that = this;
    this.setData({
      userinfo: JSON.parse(e.userinfo),
      situation: parseInt(e.situation)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;

    for (let i = 0; i < this.data.info_list.length; i++) {
      console.log(i);
      let tmp = 'info_list[' + i + ']';

      if (!that.data.info_list[i].onUse) {
        that.setData({
          [tmp + '.status']: -1,
          [tmp + '.status_text']: '已过期',
        })
        wx.setStorage({
          key: 'activity' + i,
          data: JSON.stringify({
            id: i,
            status: -1
          }),
        })
      }

      wx.getStorage({
        key: 'activity' + i,
        success: function(res) {
          console.log(res);
          let activity_info = JSON.parse(res.data);
          let status_text = '';
          let color = '#353535';
          switch (activity_info.status) {
            case -1:
              {
                status_text = '已过期'
                break;
              };
            case 0:
              {
                status_text = '未参加';
                color = '#2e9200';
                break;
              };
            case 1:
              {
                status_text = '已参加'
                break;
              };
          }
          that.setData({
            [tmp + '.status']: activity_info.status,
            [tmp + '.status_text']: status_text,
            [tmp + '.color']: color,
          })
        },
        fail: function(res) {
          that.setData({
            [tmp + '.status']: 0,
            [tmp + '.status_text']: '未参加',
          })
          wx.setStorage({
            key: 'activity' + i,
            data: JSON.stringify({
              id: i,
              status: 0
            }),
          })
        }
      })
    }
  },

  get_activity: function(e) {
    let that = this;

    let id = parseInt(e.currentTarget.id)

    console.log('活动' + id);
    let tmp = 'info_list[' + id + ']';

    //已过期
    if (that.data.info_list[id].status == -1) {
      this.change_activity_status({
        id: id,
        status: -1
      })
    }

    //已参加
    else if (that.data.info_list[id].status == 1) {
      this.change_activity_status({
        id: id,
        status: 1
      })
    }

    //未参加
    else if (that.data.info_list[id].status == 0) {

      wx.request({
        url: app.globalData.url + that.data.info_list[id].request_url,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {
          account: that.data.userinfo.account
          // account: "3170106086"
        },
        success: function(res) {
          console.log(res);
          if (res.data.status) {
            that.change_activity_status({
              id: id,
              status: 200
            })
          } else {
            that.change_activity_status({
              id: id,
              status: 1
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }
  },

  list_touched: function(e) {
    let id = parseInt(e.currentTarget.id);
    let tmp = 'info_list[' + id + '].opacity';
    this.setData({
      [tmp]: 0.6
    })
  },

  list_touchend: function(e) {
    let id = parseInt(e.currentTarget.id);
    let tmp = 'info_list[' + id + '].opacity';
    this.setData({
      [tmp]: 1
    })
  },


  change_activity_status: function(e) {
    let that = this;
    let tmp = 'info_list[' + e.id + ']';
    switch (e.status) {
      case -1:
        {
          console.log('已过期')

          that.setData({
            [tmp + 'status_text']: '已过期',
            [tmp + 'color']: "#353535",
          })
          let activity_info = {
            id: e.id,
            status: -1,
          }
          wx.setStorage({
            key: 'activity' + e.id,
            data: JSON.stringify(activity_info),
          })
          wx.showToast({
            title: '成功参加！good lock~',
            icon: 'none'
          })
          wx.showToast({
            title: '不是活动时间呢~',
            icon: 'none'
          })
          break;
        }
      case 1:
        {
          console.log('已参加')

          that.setData({
            [tmp + 'status_text']: '已参加',
            [tmp + 'color']: "#353535",
          })
          let activity_info = {
            id: e.id,
            status: 1,
          }
          wx.setStorage({
            key: 'activity' + e.id,
            data: JSON.stringify(activity_info),
          })
          wx.showToast({
            title: '成功参加！good lock~',
            icon: 'none'
          })
          wx.showToast({
            title: '已经参加过啦~',
            icon: 'none'
          })
          break;
        }
      case 200:
        {
          that.setData({
            [tmp + 'status_text']: '已参加',
            [tmp + 'color']: "#353535",
          });
          let activity_info = {
            id: e.id,
            status: 1,
          }
          wx.setStorage({
            key: 'activity' + e.id,
            data: JSON.stringify(activity_info),
          })
          wx.showToast({
            title: '成功参加！good lock~',
            icon: 'none'
          });
          break;
        }
      default:
        {
          break;
        }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    return {
      title: '用竺青年，快速查综素！',
      path: '/pages/index/index'
    }
  }
})