// pages/authorize/authorize.js

//获取app实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url:'https://avatars3.githubusercontent.com/u/37534598?s=400&u=dd9334e3e1125e22e46c7daf45b6b493dc2aa9ee&v=4',
    navigator: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取餐桌号
    var scene = options.tableNum;
    //存储餐桌号
    app.globalData.tableNum = scene;
    console.log('tableNum ' + app.globalData.tableNum)
  },

  bindGetUserInfo: function (e) {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo;
              console.log(app.globalData.userInfo);

              //创建个人session
              wx.request({
                url: 'http://111.230.31.38:8080/restaurant/customer/record',
                data: {
                  'table': app.globalData.tableNum,
                  'CustomerID': app.globalData.openid,
                  'name': app.globalData.userInfo.nickName,
                  'image': app.globalData.userInfo.avatarUrl
                },
                method: "POST",
                header: {
                  'content-type': 'application/json',
                },
                complete: function (res) {
                  if (res.statusCode != 200) {
                    console.log('error ' + res.errMsg)
                    return;
                  }
                  console.log(res.data)
                  app.globalData.cookie = res.header['Set-Cookie'];
                  //console.log('cookie ' + app.globalData.cookie);
                }
              })
              wx.switchTab({
                url: "../index/index"
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '不授权无法点餐哦~',
          })
        }
      }
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