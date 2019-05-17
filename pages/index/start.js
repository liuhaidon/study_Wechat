var qcloud = require('../../vendor/wafer2-client-sdk/index');
var util = require('../../utils/util.js');
const app = getApp();
// client/pages/index/start.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    error: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("option==>", options.error)
    if (options.error) {
      this.setData(
        {
          error: options.error,
        }
      );
    }
    var that = this;
    var source = options.source || "normal";
    app.pageGetUserInfo(this, (openid) => {
      // PK_match(this, app, options.sortId, that.data.userInfo);
      this.createcode(source);
    })
    console.log("+++++++++++++++++");
    console.log(that.data.userInfo);
    console.log("+++++++++++++++++");
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
    console.log("this.data==>", this.data)
    if (this.data.error == 1) {
      setTimeout(function () {
        wx.redirectTo({
          url: '../index/index'
        })
      }, 3000)
    }

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
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene)

  },

  createcode: function (source) {
    var atime = util.formatTime(new Date());

    /*TODO:1.verify the data */
    // var userinfo = that.data.userInfo;
    var codeinfo = {
      atime,
      source,
    };
    for (let item in codeinfo) {
      console.log(item, codeinfo[item]);
      if (codeinfo[item] == null || codeinfo[item].length < 1) {
        var mm = {};
        mm[item] = "字段为空";
        return util.showModel('字段内容不能为空', mm);
      }
    }
    qcloud.request({
      login: true,
      data: {
        openid: this.data.userInfo.openId,
        atime,
        source,
      },
      url: app.appData.baseUrl + 'newsaoma',
      success: (res) => {
        console.log("newsaoma successful!!!=>", res);
        setTimeout(function () {
          wx.redirectTo({
            url: '../index/index'
          })
        }, 3000)

        // wx.navigateTo({
        //   url: '../index/index?id=' + res.data.data.id,
        // })
      },
      fail(error) {
        // util.showModel('请求主题关卡失败', error);
        console.log('newquiztask fail', error);
      },
    })
  },
})
