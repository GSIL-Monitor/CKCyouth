var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inquire_type: 0,
    article: {},
    userinfo: {},
    inquire_data: {},
    select: false,
    year: '请选择'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    var markdown = ``;
    var userinfo;
    wx.showLoading({
      title: '加载中',
    })
    try {
      userinfo = JSON.parse(options.userinfo);
      markdown =
        `# 竺院团委查询平台\n##### 学号：${userinfo.account}\n\n> 正在加载中，请稍等\n`;
    } catch (err) {
      console.log(err)
      wx.hideLoading();
      wx.showToast({
        title: '发生错误，请退出重试',
      })
      return;
    }

    //MD字符串

    let data = app.towxml.toJson(markdown, 'markdown');

    //设置文档显示主题，默认'light'
    data.theme = 'darkblue';

    //设置数据
    this.setData({
      article: data,
      inquire_type: parseInt(options.type),
      userinfo: userinfo
    })
    console.log(options)

    wx.request({
      url: app.globalData.url + '/CKCScoreDetail',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        studentNumber: that.data.userinfo.account
      },
      success: function(res) {
        console.log(res)
        that.setData({
          inquire_data: res.data
        })
        switch (that.data.inquire_type) {
          case 0:
            {
              break;
            };

            //综素
          case 1:
            {
              let comQuality = res.data.comQuality;
              console.log(comQuality);
              if (typeof(comQuality) == "undefined") {
                console.log('网络错误')
                wx.hideLoading();
                wx.showToast({
                  title: '查询出现问题，请联系开发团队',
                  icon: 'none',
                })
                break;
              }

              if (comQuality.type === 'new') {
                var tempMD = ``;
                for (let i = 0; i < comQuality.passedItem.count; i++) {
                  tempMD = tempMD +
                    `\n| ${comQuality.passedItem.project[i].name} | ${comQuality.passedItem.project[i].type} | ${comQuality.passedItem.project[i].score} |`
                }

                markdown =
                  `# 竺院团委查询平台：综素查询\n##### 学号：${userinfo.account}\n\n> 加载完毕，共搜索到 ${comQuality.passedItem.count} 条记录\n
| 类别        | 分数     | 
| ---         | :---:   |
| 总分        | ${comQuality.Score.comprehensiveScore}   |
| 研究创新分数 | ${comQuality.Score.innovationScore}      |
| 公益服务分数 | ${comQuality.Score.publicServiceScore}   | 
| 对外交流分数 | ${comQuality.Score.communicationScore}   |
| 文体活动分数 | ${comQuality.Score.activityScore}        | 
| 社会工作分数 | ${comQuality.Score.socialworkScore}      |
| 参与度纪实分数 | ${comQuality.Score.participationRecordScore}   | 
\n> 详细列表\n
| 活动名      | 类别    | 分数     |
| ---         | :---    | :---:   |` + tempMD;
              } else {
                if (comQuality.data === '') {
                  comQuality.data = '没有任何综素记录~加油呀'
                } else if (typeof(comQuality.type) == 'undefined') {
                  comQuality.data = '没有任何综素记录~再接再厉呀'
                }
                markdown =
                  `# 竺院团委查询平台：综素查询\n##### 学号：${userinfo.account}\n\n> 加载完毕
\n\n<blockquote> ${comQuality.data} </blockquote>\n`
              }

              let new_data = app.towxml.toJson(markdown, 'markdown');

              //设置文档显示主题，默认'light'
              new_data.theme = 'darkblue';
              that.setData({
                article: new_data
              })
              break;
            }

            //形策
          case 2:
            {
              let policyLecture = res.data.policyLecture;
              console.log(policyLecture);

              if (typeof(policyLecture) == "undefined") {
                console.log('网络错误')
                wx.showToast({
                  title: '查询出现问题，请联系开发团队',
                  icon: 'none',
                })
                break;
              }
              var tempMD = ``;
              for (let i = 0; i < policyLecture.count; i++) {
                tempMD = tempMD +
                  `\n| ${policyLecture.date[i]} |`
              }

              markdown =
              `# 竺院团委查询平台：形策讲座查询\n##### 学号：${userinfo.account}\n\n> 加载完毕，共搜索到 ${policyLecture.count} 条记录\n
| 时间      |
| ---      |` + tempMD;
              let new_data = app.towxml.toJson(markdown, 'markdown');

              //设置文档显示主题，默认'light'
              new_data.theme = 'darkblue';
              that.setData({
                article: new_data
              });
              break;
            }

            //实践
          case 3:
            {
              let socialPractice = res.data.socialPractice;
              console.log(socialPractice);
              if (typeof(socialPractice) == "undefined") {
                console.log('网络错误')
                wx.showToast({
                  title: '查询出现问题，请联系开发团队',
                  icon: 'none',
                })
                break;
              } else if (socialPractice.count == 0) {
                socialPractice.team = '未完成过任何社会实践~加油！'
              }
              markdown =
              `# 竺院团委查询平台：社会实践查询\n##### 学号：${userinfo.account}\n\n> 加载完毕，共搜索到 ${socialPractice.count} 条记录\n\n##### 完成情况：${socialPractice.team}`;
              let new_data = app.towxml.toJson(markdown, 'markdown');

              //设置文档显示主题，默认'light'
              new_data.theme = 'darkblue';
              that.setData({
                article: new_data
              });
              break;
            }
        }
        wx.hideLoading();
        wx.showToast({
          title: '加载完毕',
        })
      },
      fail: function(res) {
        console.log(res)
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
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
    switch (this.data.inquire_type) {
      case 0:
        {
          break;
        }
      case 1:
        {

        }
    }

    return {
      title: '用竺青年，快速查综素！',
      path: '/pages/index/index'
    }
  },

  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      year: name,
      select: false
    })
  }
})