// pages/recommendation/recommendation.js
Page({
  data: {
    recommendation_list: [],
  },

  onLoad: function () {
    var that = this
    wx.request({
      url: "http://111.230.31.38:8080/api/restaurant/recommendation",
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          recommendation_list: res.data,
        })
      }
    })
  },

  onReady: function () {
  },


  onShow: function () {
  },

  onHide: function () {
  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})