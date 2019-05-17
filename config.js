/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
// var host="https://www.brainking.xyz"
// var host = "https://yearbook.nslib.cn";
var host = "http://127.0.0.1:8080";
// var appId ='wxc5ba9fc4bfc7faea'
var appId = 'wx95a07011c23e4b00';
var baseUrl = `${host}/certification/`;
var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        appId,
        host,
        baseUrl,

        // 登录地址，用于建立会话
        loginUrl: `${baseUrl}login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${baseUrl}user`,

        // 测试的信道服务地址
     //    tunnelUrl: `${host}/weapp/tunnel`,
        tunnelUrl: `${baseUrl}tunnel`,

        // 上传图片接口
        uploadUrl: `${baseUrl}upload`
    }
};

module.exports = config;