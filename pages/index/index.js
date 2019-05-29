var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    currentTab: 0,
    idCardUrlFront: "",
    idCardUrlBack: "",
    idCardUrlpeople: "",
  },

  onLoad: function (opt) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onShow() {
    console.log("data===>>", this.data)
  },

  // 上传身份证正反面图片
  getPhoto: function (event) {
    var type = event.currentTarget.dataset.type
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'],     // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // console.log("res===>",res);
        var path = res.tempFilePaths;
        if (type == "front") {
          that.setData({ idCardUrlFront: res.tempFilePaths[0] });
        } else if (type == "back") {
          that.setData({ idCardUrlBack: res.tempFilePaths[0] });
        } else {
          that.setData({ idCardUrlpeople: res.tempFilePaths[0] });
        }
        that.uploadImg(that, res.tempFilePaths[0]);
      },
    })
  },

  uploadImg(that, filePath) {
    wx.uploadFile({
      url: app.appData.baseUrl + 'upload',
      filePath: filePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
      },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'session_token': wx.getStorageSync('session_token'),
      },
      success: function (res) {
          console.log("hahaha===>", res.data);
          var data = JSON.parse(res.data) //do something 
          //根据你自己的项目要求，做处理
          that.setData({
            idCardUrlFront: filePath
          })
      },
      fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
      },
    })
  },

  submit_answer: function () {
    wx.request({
      url: app.appData.baseUrl + 'checkUser',
      method: 'get',
      data: {
        idCardUrlFront: this.data.idCardUrlFront,
        idCardUrlBack: this.data.idCardUrlBack
      },
      headers: {
        'content-type': 'application/xml',
        // 'X-CSRF-Token': $("meta[name=csrf-token]").attr("content"),
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
    wx.redirectTo({
      url: '../index/next?taskid=' + this.data.openId,
    });
  },

  check: function () {
    wx.request({
      url: "https://ocridcard.market.alicloudapi.com/idimages",
      method: 'POST',
      data: {
        image: "http://127.0.0.1:8080/static/img/mm.jpg",
        idCardSide: "back"
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

  // switchNav(e) {
  //   var that = this;
  //   that.setData({
  //     currentTab: e.target.dataset.current,
  //   })
  // },
})