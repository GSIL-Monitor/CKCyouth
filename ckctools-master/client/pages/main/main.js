//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    info_list: [{
        header: '当前活动',
        text: '最近活动：暂无',
        url: '../activity/activity',
        img_src: '../picture/img01.png',
        opacity: 1,
        onUse: true
      }, {
        header: '综素查询',
        text: '综素查询目前仅限16、17级同学',
        url: '',
        img_src: '../picture/img02.png',
        opacity: 1,
        onUse: false
      },
      {
        header: '形策查询',
        text: '形策报告查询目前仅限14、15、16级同学',
        url: '',
        img_src: '../picture/img03.png',
        opacity: 1,
        onUse: false
      },
      {
        header: '社会实践',
        text: '一切数据以院网为准',
        url: '',
        img_src: '../picture/img04.png',
        opacity: 1,
        onUse: false
      },
    ],
    userinfo: {
      account: "",
      passWord: "",
      nickName: "",
      avatarUrl: "",
      code: ""
    }
  },

  onLoad: function(e) {
    console.log(e)
    let that = this;
    if (e.login != '1') {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.getStorage({
        key: 'login_info',
        success: function(res) {
          that.setData({
            userinfo: JSON.parse(res.data)
          })
          console.log(that.data.userinfo)
        },
        fail: function(res) {
          console.log('user not found')
        }
      })
    }
  },

  onShow: function(e) {

  },

  logout: function(e) {
    let that = this;

    wx.showActionSheet({
      itemList: ['切换账号'],
      success: function(res) {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            {
              wx.showModal({
                title: '提示',
                content: '退出登录后，需要重新输入学号与密码。',
                showCancel: true,
                confirmText: '继续退出',
                success: function(rres) {
                  if (rres.confirm) {
                    wx.clearStorage();
                    wx.redirectTo({
                      url: '../index/index',
                    })
                  }
                }
              });
              break;
            }
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },

  to_activity: function(e) {
    let that = this;
    console.log(e);
    let id = parseInt(e.currentTarget.id)
    switch (id) {
      case 0:
        {
          wx.navigateTo({
            url: '../activity/activity?userinfo=' + JSON.stringify(that.data.userinfo) + '&situation=0',
          });
          break;
        };
      case 1:
      case 2:
      case 3:
        {
          wx.navigateTo({
            url: '../inquire/inquire?type=' + id + '&userinfo=' + JSON.stringify(that.data.userinfo),
          });
          break;
        }
      default:
        {
          wx.showToast({
            title: '暂未开放',
            icon: 'none'
          })
        }
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

  onShareAppMessage: function(e) {
    return {
      title: '用竺青年，快速查综素！',
      path: '/pages/index/index'
    }
  }
})