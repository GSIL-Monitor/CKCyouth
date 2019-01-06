var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Btn_opacity: 1,
    account: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.situation === '1') {
      wx.showToast({
        title: '不在活动时间！',
        icon: 'none'
      })
    }
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

  },

  phoneInput: function(e) {
    // console.log(e.data.value)
    this.setData({
      account: e.detail.value
    })
  },

  // 登录
  login: function(e) {

    console.log(e);
    let that = this;

    wx.getStorage({
      key: 'temp',
      success: function() {
        console.log('entered')
        wx.showToast({
          title: '已经参加过啦~不要贪心哦',
          icon: 'none'
        })
      },
      fail: function() {


        if (e.detail.errMsg === "getUserInfo:fail auth deny") {
          wx.showToast({
            title: '请先授权',
            icon: 'none'
          })
        } else if (that.data.account.length < 10) {
          wx.showToast({
            title: '请输入正确的学号',
            icon: 'none'
          })
        } else if (that.data.account[2] != '8') {
          wx.showToast({
            title: '学号不符合活动要求',
            icon: 'none'
          })
        } else {
          var userinfo = {
            account: that.data.account,
            password: '123456',
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

                        wx.request({
                          url: app.globalData.url + '/prizeDraw/addParticipant',
                          method: 'POST',
                          header: {
                            'content-type': 'application/x-www-form-urlencoded',
                          },
                          data: {
                            account: that.data.account
                            // account: "3170106086"
                          },
                          success: function(res) {
                            console.log(res);
                            if (res.data.status) {
                              wx.showToast({
                                title: '参加成功！goodluck~',
                                icon: 'none'
                              })
                              wx.setStorage({
                                key: 'temp',
                                data: '1',
                              })
                            } else {
                              wx.showToast({
                                title: '已经参加过啦~不要贪心哦',
                                icon: 'none'
                              })
                            }
                          },
                          fail: function(res) {
                            console.log(res)
                          }
                        })
                      }
                    })
                  } else {
                    console.log('login_fali')

                    console.log(userinfo)
                    wx.showToast({
                      title: '学号不正确',
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

      }
    })
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
  onShareAppMessage: function() {

  }
})