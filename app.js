/**
 * @fileOverview 微信小程序的入口文件
 */
var qcloud = require('./vendor/wafer2-client-sdk/index');
var Session = require('./vendor/wafer2-client-sdk/lib/session');
var config = require('./config');
var util = require('./utils/util.js')
App({
  // 小程序初始化时执行，我们初始化客户端的登录地址，以支持所有的会话操作
  appData: {
    appId: config.service.appId,
    baseUrl: config.service.baseUrl,
    audioCtxt:wx.createInnerAudioContext(),
    currentClickId:0,
    user:null,
  },

  onLaunch(opt) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.appData.opt = opt;
    console.log("opt===>",opt)
    // this.tunnel_create();//共用一个tunnel

    qcloud.setLoginUrl(config.service.loginUrl);  //设置登录地址
    // this.doLogin();
  },

  doLogin() { //登录
      let that = this;
      util.showBusy('正在登录');
      qcloud.login({
          success(result) {//此处的result竟然不包含openid,所以res取缓存中的数据
              /*save user data in memory */
              that.appData.user = result;

              util.showSuccess('登录成功');                        
              that.getServiceGates(result.openId);

              if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(result)
              }
          },
          fail(error) {
              util.showModel('登录失败', error);
          }
      });
  },

  pageGetUserInfo(page, openIdReadyCallback) { //在page中获取用户信息
    const sess = Session.get();  
    // console.log(["userinfo:",userInfo]);
    if (sess) {
      const userInfo = sess.userinfo;
      page.setData({
        userInfo,
        openId: userInfo.openId
      });
      if (openIdReadyCallback) {
        openIdReadyCallback(userInfo.openId)
      }
    }
    else {           //获取用户信息后的回调函数
      this.userInfoReadyCallback = (userInfo) => {
        page.setData({  //每个page都会自动存储userInfo和openId
          userInfo,
          openId: userInfo.openId
        })
        //如果设置了openid的回调函数，则调用回调
        if (openIdReadyCallback) {
          openIdReadyCallback(userInfo.openId)
        }
      }
    }
  },



      /******************用户关系点击表操作******************/
      //注意1：所有从分享中启动的页面onLoad都添加：  
      /*
      app.appData.fromClickId = opt.currentClickId
      app.updateUserNetwork = require('../../utils/updateUserNetwork.js').updateUserNetwork
      wx.showShareMenu({
            withShareTicket: true
      })
      */
      //注意2：所有分享页面路径都添加：?currentClickId=' + app.appData.currentClickId,
      //注意3：所有分享页面的分享成功回调都添加： require('../../utils/updateShareInfo.js').updateShareInfo(app,that,res)


  appPlayVoice: function (page,fileurl) {
        var user = this.getUserData();
        const switchon = parseInt(user.voice||1);
        if (switchon<1)
              return;

        const iac = this.appData.audioCtxt;
        iac.autostart = false;
        iac.src=fileurl;
        iac.play();
        console.log(fileurl);
  },

  initiateUserGates(user){
        if(undefined == user)
              return -1;
        
        var services = user.services||{};
        if(Object.keys(services).length<1)
              return -1;

        // if("gates" in user && Object.keys(user.gates).length>0)
        //       return 1;
        
        var gates, gate;
        var degrees, degree;
        var xdegrees, xdegree;
        gates = user.gates={};
        for(var v in services){
              let service = services[v];
              gate = gates[v] = {};

              gate.id = service.id;
              gate.subject = service.subject;
              gate.first = service.first;
              gate.unlock = service.unlock;
              gate.score = service.score;

              xdegrees = service.degrees;

              degrees = gate["degrees"] = {};
              for (var u in xdegrees){
                    degree = degrees[u] = {};
                    xdegree = xdegrees[u];
                    degree.id = u;
                    degree.win = xdegree.win;
                    degree.status = xdegree.status;
              }
        }
        
        return 0;
  },      

  getUserData() {
        var user = this.appData.user;
        if (null === user) {
              user = wx.getStorageSync("UserData");
              if (user === null || user === undefined) {
                    return null;
              }
              return user;
        }
        return user;
  },
   
  getServiceGates(openId) {
    qcloud.request({
      login: false,
      data:{
            openId,
      },
      url: this.appData.baseUrl + 'getservicedata',
      success: (res) => {
            // util.showSuccess('请求成功完成');
            console.log("getservicedata=>",res);
            let data0 = res.data.data;
            this.saveServiceGates(data0);
            // var degrees = this.getlocalFightGates();
            // page.setData({
            //       degrees,
            // });
      },
      fail(error) {
            util.showModel('请求数据失败', error);
            console.log('request fail', error);
      },
    });
  },

  saveServiceGates(services) {
    var user = this.getUserData();
    console.log("getUserData=>", user);
    if (!user)
          return null;
    user.services = services;
    this.initiateUserGates(user);
    wx.setStorage({
          key: "UserData",
          data: user,
    });
    return 0;
  },   

  globalData: {
    userInfo: null
  }   
});