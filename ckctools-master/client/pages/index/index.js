var app = getApp();
var start_clientX;
var end_clientX;
const page_number = 1;
Page({
  data: {
    account: '',
    password: '',
    Btn_opacity: 1,
    hide_psword: true,
    password_disabled: false,
    windowWidth: wx.getSystemInfoSync().windowWidth
  },

  onLoad: function() {
    wx.getStorage({
      key: 'login_info',
      success: function(res) {
        var userinfo = JSON.parse(res.data);
        console.log(userinfo);
        if (userinfo.account.length = 10 && userinfo.password != '') {
          console.log('try login');
          wx.login({
            success: function(rres) {
              console.log(rres)
              userinfo.code = rres.code;

              wx.request({
                url: app.globalData.url + '/CKCLogin',
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                data: userinfo,
                success: function(rrres) {
                  console.log(rrres)
                  if (rrres.data.status == true)
                   {
                    console.log('login_success');

                    wx.showToast({
                      title: '登录成功',
                    })
                    wx.redirectTo({
                      url: '../main/main?login=1'
                    })

                  } else {
                    console.log('login_fail')
                  }
                },
                fail: function(rres) {
                  console.log(rres)

                  wx.showToast({
                    title: '网络异常',
                    icon: 'none'
                  })
                }
              })
            }
          })
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  // 获取输入账号
  phoneInput: function(e) {
    // console.log(e.data.value)
    this.setData({
      account: e.detail.value
    })
    if (e.detail.value.length <= 2) {
      this.setData({
        password_disabled: false,
        password: ''
      })
    } else if (e.detail.value === '316' || e.detail.value === '318' || e.detail.value === '315' || e.detail.value === '314') {
      this.setData({
        password_disabled: true,
        password: '123456'
      })
    }
  },

  // 获取输入密码
  passwordInput: function(e) {
    console.log(e)

    this.setData({
      password: e.detail.value
    })

  },

  // 登录
  login: function(e) {
    console.log(e);
    let that = this;
    if (e.detail.errMsg === "getUserInfo:fail auth deny") {
      wx.showToast({
        title: '请先授权',
        icon: 'none'
      })
    } else if (this.data.account.length < 10) {
      wx.showToast({
        title: '请输入正确的学号',
        icon: 'none'
      })
    } else if (this.password == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
    } else {
      var userinfo = {
        account: that.data.account,
        password: that.data.password,
        nickname: JSON.parse(e.detail.rawData).nickName,
        avatarUrl: JSON.parse(e.detail.rawData).avatarUrl,
        code: ''
      };

      wx.login({
        success: function(res) {
          userinfo.code = res.code;

          wx.request({
            url: app.globalData.url + '/CKCLogin',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data: userinfo,
            success: function(rres) {
              console.log(rres)
              if (rres.data.status == true) {
                console.log('login_success');
                console.log(that.data.userinfo)

                wx.setStorage({
                  key: 'login_info',
                  data: JSON.stringify(userinfo),
                  success: function(res) {


                    wx.showToast({
                      title: '登录成功',
                    })

                    wx.redirectTo({
                      url: '../main/main?login=1'
                    })

                  }
                })
              } else {
                console.log('login_fali')

                console.log(userinfo)
                wx.showToast({
                  title: '学号或密码不正确',
                  icon: 'none'
                })
              }
            },
            fail: function(rres) {
              console.log(rres)

              wx.showToast({
                title: '网络异常',
                icon: 'none'
              })
            }
          })
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }
  },

  psword_statu: function(e) {
    console.log(e)
    this.setData({
      hide_psword: e.currentTarget.id == '0' ? false : true
    })
  },

  Btn_touched: function() {
    this.setData({
      Btn_opacity: 0.6,
    })
  },

  Btn_touchend: function() {
    this.setData({
      Btn_opacity: 1,
    })
  },

  biyan: function() {
    var that = this;
    that.setData({
      showView: true
    })
  },

  zhengyan: function() {
    var that = this;
    that.setData({
      showView: false
    })
  },

  onShareAppMessage: function(e) {
    return {
      title: '用竺青年，快速查综素！',
      path: '/pages/index/index'
    }
  },
  
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  
  // 滑动开始
  touchstart: function (e) {
    start_clientX = e.changedTouches[0].clientX
  },
  // 滑动结束
  touchend: function (e) {
    end_clientX = e.changedTouches[0].clientX;
    if (end_clientX - start_clientX > 120) {
      this.setData({
        display: "block",
        translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
      })
    } else if (start_clientX - end_clientX > 0) {
      this.setData({
        display: "none",
        translate: ''
      })
    }
  }
})