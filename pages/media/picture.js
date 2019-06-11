import util from './../../utils/util.js';
Page({
  data: {
    showtab: 0,  //顶部选项卡索引
    tabnav: {
      tabnum: 5,
      tabitem: [
        {
          "id": 0,
          "text": "商品分类1"
        },

        {
          "id": 1,
          "text": "商品分类2"
        },

        {
          "id": 2,
          "text": "商品分类3"
        },

        {
          "id": 3,
          "text": "商品分类4"
        },

        {
          "id": 4,
          "text": "商品分类5"
        },

        {
          "id": 5,
          "text": "商品分类6"
        },

        {
          "id": 6,
          "text": "商品分类7"
        }
      ]
    },
    productList: [],

    pics: [],
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    isShow: true
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log("picture===>", options)
    isShow: (options.isShow == "true" ? true : false)
  },

  setTab: function (e) {
    const edata = e.currentTarget.dataset;
    this.setData({
      showtab: edata.tabindex,
    })
  },
      
  // getPhoto(e) {
  getPhoto: function (e) {
    var that = this;　　//坑1
    var pics = this.data.pics;
    wx.chooseImage({
      count: 1,        //最多可以选择的上传图片的张数，默认9 
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],      // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var filepaths = res.tempFilePaths;
        pics = pics.concat(filepaths);
        // 控制触发添加图片的最多时隐藏
        if (pics.length >= 9) {
          that.setData({ isShow: (!that.data.isShow) })
        } else {
          that.setData({ isShow: (that.data.isShow) })
        }
        that.setData({
          pics: pics
        })
        // 上传图片到服务器接口
        wx.uploadFile({
          url: app.globalData.myhost + 'customer-header?access_token=' + app.globalData.itoken,
          filePath: filepaths[0],   
          name: 'file',         // name的值可以自己定，为了在后端接收。也可以定为'uploadFile'
          header: {
            "Content-Type": "multipart/form-data",    //头部设置
          },
          formData: {
            //这里放你自己额外要带的参数,和服务器约定的token, 一般也可以放在header中
            'userId': "test",
            'session_token': wx.getStorageSync('session_token'),
          },
          success: function (res) {
            var data = JSON.parse(res.data)　　//坑2：与wx.request不同，wx.uploadFile返回的是[字符串]，需要自己转为JSON格式
            console.log('上传成功')
            that.setData({　　　　             //坑1：因wx.uploadFile本身有一个this，所以要通过外部var that = this 把this带进来
              headerImageUrl: data.headerImageUrl,
              imgUrl: filePath[0]
            })
            if (res.statusCode == 200) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 1500
              })
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 1500
              })
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function () { },
      complete: function () { },
    })
  },
  // 图片预览
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.pics
    })
  }
})