// pages/recommendation-details/recommendation-details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendation: {},
    recommendation_id: {},
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var width = wx.getSystemInfoSync().windowWidth
    this.setData({
      window_width: width
    })
    
    var that = this
    wx.request({
      url: "https://easy-mock.com/mock/5afbe65c3e9a2302b68981e5/recommendation?recommendation_id=" + options.recommendationId,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          recommendation_id: options.recommendationId,
          recommendation: res.data.data
        })
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