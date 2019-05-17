var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    currentTab: 0,
    idCardUrlFront:"",
    idCardUrlBack:"",
    idCardUrlpeople:"",
  },

  onResize(res) {
    console.log("显示一下")
    res.size.windowWidth // 新的显示区域宽度
    res.size.windowHeight // 新的显示区域高度
  },

  onLoad: function(opt) {
    console.log("============================")
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  // onShow() {
  //   console.log("data===>>", this.data)
  //   this.data.hotList = [];
  // },

  // 上传身份证正反面图片
  uploadImg: function (event){
      var type = event.currentTarget.dataset.type
      var that = this;
      wx.chooseImage({
          count:1,
          sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有  
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
          success: function(res) {
              console.log("res===>",res);
              var path = res.tempFilePaths;
              wx.uploadFile({
                  url: app.appData.baseUrl + 'upload',
                  filePath: res.tempFilePaths[0],
                  name: 'file',
                  header: {
                      "Content-Type": "multipart/form-data",
                  }, 
                  formData: {
                      //和服务器约定的token, 一般也可以放在header中
                      'session_token': wx.getStorageSync('session_token'),
                  },
                  success:function(res){
                      console.log("hahaha===>",res.data);
                      if (type == "front") {
                        console.log("--------------------------------")
                        that.setData({ idCardUrlFront: res.tempFilePaths[0] });
                      } else if (type == "back") {
                        that.setData({ idCardUrlBack: res.tempFilePaths[0] });
                      } else {
                        that.setData({ idCardUrlpeople: res.tempFilePaths[0] });
                      }
                  }
              })
          },
      })
      console.log("mmmmmmmmmmmmmmmmmmmmmm")
  },

  check: function(){
    console.log("检测一下");
    wx.request({
      url: "https://ocridcard.market.alicloudapi.com/idimages",
      method: 'POST',
      data: {
        image:"http://127.0.0.1:8080/static/img/mm.jpg",
        idCardSide:"back"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': "APPCODE " + "f6fcd377d414405f8308bf04ec000078"
      },
      success: (res) => {
        var result = res.data;
        console.log(result)
        for (var v in result) {
          var item = result[v];
          console.log("items==>", item);
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      },
    })
  },

  submit_answer: function () {
    wx.redirectTo({
      url: '../index/next?taskid=' + this.data.openId,
    });
  },

  getStudyRecommend: function() {
    const that = this
    qcloud.request({
      login: false,
      url: app.appData.baseUrl + 'getStudyCategory',
      data: {
        openId: this.data.openId
      },
      success: (res) => {
        console.log("res===>",res,res.data)
        this.setData({
          friendsData: res.data.data
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      },
    });
  },
  // switchNav(e) {
  //   var that = this;
  //   that.setData({
  //     currentTab: e.target.dataset.current,
  //   })
  // },
})