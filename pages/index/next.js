var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    nodes: '',
    showImg: false,
  },
  onLoad: function (opt) {
    var that = this;
    console.log("opt===>", opt)
    that.setData(opt);

    app.pageGetUserInfo(this);
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

  formSubmit: function (e) {
    var data = e.detail.value;
    console.log('form发生了submit事件，提交数据：', e.detail.value)
    const that = this;
    console.log(data.name, data.idcard, data.phone)
    wx.request({
      url: "http://cellphone.haoservice.com/efficient/cellphone",
      method: 'get',
      data: {
        realName: data.name,
        idCard: data.idcard,
        mobile: data.phone
      },
      header: {
        'content-type': 'application/json',
        'Authorization': "APPCODE " + "f6fcd377d414405f8308bf04ec000078"
      },
      beforeSend: function (xhr) {
        console.log('授权码');
        xhr.setRequestHeader("Authorization", "APPCODE " + "XXXXXXXXXXXXXXXXXXX");
      },
      success: (res) => {
        var result = res.data;
        console.log(result)
        for (var v in result) {
          var item = result[v];
          console.log("items==>", item);
        }
        that.setData({
          loadNumber: that.data.loadNumber + 1
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      },
    })
  },
})