//app.js
App({
  globalData: {
    userInfo: null,
    openid: 'hello',
    cookie:'',
    tableNum: '',
    details: ''
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.clearStorage();
    // 登录
    wx.login({
      success: res => {
        // ------ 获取凭证 ------
        var code = res.code;
        var that = this;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          // ------ 发送凭证 ------
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxd1baa9ab3bc029ff&secret=a5fb94cc08bfc7e6618a8f3ce10b0f36&js_code=' + code +'&grant_type=authorization_code',
            data: {},
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            
            success: function (res) {
              if (res.statusCode == 200) {
                //console.log(res)
                that.globalData.openid = res.data.openid
                console.log('openid '+that.globalData.openid)
                //wx.setStorageSync('openid', res.data.openid)
              } else {
                console.log(res.errMsg)
              }
            },
          })
        } else {
          console.log('获取用户登录失败：' + res.errMsg);
        }
      }
    })
  }
})