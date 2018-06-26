//index.js
//获取应用实例

// const app = getApp()

Page({
  data: {
    storeInfo: {
      name: '广州麦当劳中二横路餐厅',
      location: '广东省广州市番禺区麦当劳中二横路分店'
    }
  },
  onLoad: function() {
    var that = this

    wx.getStorage({
      key: 'cartList',
      success: function (res) {
        console.log(res.data)
        that.setData({
          carList: res.data
        })
      }
    })

    wx.getStorage({
      key: 'tolMoney',
      success: function (res) {
        console.log(res.data)
        that.setData({
          tolMoney: res.data
        })
      }
    })
  },
  onShow: function () {
    var totalPrice = 0
    for (var idx in this.data.dishes) {
      var item = this.data.dishes[idx]
      totalPrice = totalPrice + item.price * item.num
    }
    this.setData({
      totalPrice: totalPrice
    })
  }
})