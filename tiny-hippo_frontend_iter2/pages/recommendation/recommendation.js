// pages/recommendation/recommendation.js
Page({
  data: {
    recommendation_list: [],
    loading: false
  },

  onLoad: function (options) {
    var that = this
    wx.request({
      url: "https://easy-mock.com/mock/5afbe65c3e9a2302b68981e5/recommendation",
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)
        wx.hideLoading()
        that.setData({
          recommendation_list: res.data.data,
          loading: true
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