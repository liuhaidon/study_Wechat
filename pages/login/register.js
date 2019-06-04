// pages/register/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mailCode: "发送验证码",
    boolean: true,
    isChecked: false,
    phone: '',
    phoneTip: '',
    keyCode: '',
    keyCodeTip: '',
    userName: '',
    userNameTip: '',
    userPassword: '',
    userPasswordTip: '',
    next: '',
    code: '',
    info: ''
  },
  //手机号
  phoneInput: function (e) {
    let mobile = e.detail.value;
    let myreg = /^13[\d]{9}$|^14[5,7]{1}\d{8}$|^15[^4]{1}\d{8}$|^17[0,3,6,7,8]{1}\d{8}$|^18[\d]{9}$/;
    if (mobile.length == 0) {
      this.setData({
        phoneTip: '手机号不能为空'
      })
    } else if (!myreg.test(mobile)) {
      this.setData({
        phoneTip: '请检查您的手机号是否有误'
      })
    } else {
      this.setData({
        phoneTip: '',
        phone: mobile,
        boolean: false
      })
    }
  },
  //验证码
  keyCodeInput: function (e) {
    let keyCode = e.detail.value;
    if (keyCode.length == 0) {
      this.setData({
        keyCodeTip: '验证码不能为空'
      })
    } else {
      this.setData({
        keyCodeTip: '',
        keyCode: keyCode,
      })
    }
  },
  //用户名
  userNameInput: function (e) {
    let userName = e.detail.value;
    if (userName.length == 0) {
      this.setData({
        userNameTip: '昵称不能为空'
      })
    } else {
      this.setData({
        userNameTip: '',
        userName: userName,
      })
    }
  },
  //用户密码
  userPasswordInput: function (e) {
    let password = e.detail.value;
    if (password.length < 6 || password.length > 16) {
      this.setData({
        userPasswordTip: '密码长度为6-16位'
      })
    } else {
      this.setData({
        userPasswordTip: '',
        userPassword: password
      })
    }
  },
  //下一步
  next: function (options) {
    let prefix = this.data;
    if (prefix.keyCodeTip == '' && prefix.phoneTip == '' && prefix.phone != '' && prefix.keyCode != '') {
      this.setData({
        next: true
      })
    }
  },
  //返回
  back: function (options) {
    this.setData({
      next: false,

    })
  },
  //登录
  oLogin: function () {
    let that = this;
    var pre = that.data;
    let avatarUrl = wx.getStorageSync('avatarUrl');
    wx.request({
      url: 'https://www.muwai.com/index.php/Xcx/Login/wx_login',
      data: { code: pre.code, username: pre.userName, phone: pre.phone, password: pre.userPassword, phone_code: pre.keyCode, head_photo: avatarUrl },
      success: res => {
        //成功的话直接跳转到首页
        let oStatus = res.data.status;
        if (oStatus == 100) {
          let session_id = res.data.session_id;
          wx.setStorageSync('session_id', session_id);
          wx.switchTab({
            url: '../index/index?session_id=' + session_id
          })
        } else {
          that.setData({
            info: res.data.info
          })
        }

      }
    })
  },

  //发送验证码
  codeBtn: function () {
    console.log(6)
    var pre = this.data;
    wx.request({
      url: 'https://www.muwai.com/index.php/Xcx/User/send_code',
      data: { phone: pre.phone, type: "1", btype: "1" },
      success: res => {
        //成功的话直接跳转到首页
        let oStatus = res.data.status;
        let phoneTip = res.data.info;
        if (oStatus == 100) {
          //倒计时
          let time = null;
          let that = this;
          let pre = this.data;
          let num = 60;
          time = setInterval(function () {
            if (num > 1) {
              num--;
              that.setData({
                mailCode: num + 's',
                isChecked: true,
                boolean: true
              })
            } else {
              that.setData({
                mailCode: '重新发送',
                isChecked: false,
                boolean: false
              });
              clearInterval(time);
            }
          }, 1000)
        } else {
          this.setData({
            phoneTip: phoneTip
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      //把读取出来的数据存储到页面的数据data中
      code: options.code
    })
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

  }
})