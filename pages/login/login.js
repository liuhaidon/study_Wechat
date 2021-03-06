var qcloud = require('../../vendor/wafer2-client-sdk/index');
var util = require('../../utils/util.js');
const app = getApp();
const back = wx.getBackgroundAudioManager();
Page({

  /* 页面的初始数据 */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.backmusic();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  formSubmit: function (e) {
    console.log("mmm")
    wx.request({
      url: app.appData.baseUrl + 'login',
      method: "get",
      data: {
        username: e.detail.value.phone,
        password: e.detail.value.pwd
      },
      header: {
        'content-type': 'application/json' // 默认值
        // "Content-Type": "multipart/form-data",
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
          //访问正常
          if (res.data.error == true) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000,
            })
          } else {
            //缓存
            wx.setStorage({
              key: "student",
              data: res.data.student
            });
            wx.showToast({
              title: "登陆成功",
              icon: 'success',
              duration: 1000,
              success: function () {
                setTimeout(function () {
                  wx.switchTab({
                    url: '../index/index',
                  })
                  // wx.redirectTo({
                  //   url: '../index/index',
                  // })
                }, 1000)
              }
            })
          }
        }
      }
    })
  },

  backmusic: function () {
    player();
    function player() {
      back.title = "此时此刻";
      back.src = "http://sc1.111ttt.cn/2017/1/11/11/304112002347.mp3";
      back.onEnded(() => {
        player();
      })
    }
  },

  register: function(){
    console.log("注册")
    wx.redirectTo({
      url: '../login/register',
    })
  }
})