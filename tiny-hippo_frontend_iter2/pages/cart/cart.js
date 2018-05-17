const app = getApp()

//index.js
//获取应用实例
Page({
  data: {
    totalMoney: 0,
    cartList: [],
    tableNum: 0,
    test : app.globalData.test
  },

  addToCart: function (e) {
    var index = e.currentTarget.dataset.index;
    // console.log(index);
    var cartList = this.data.cartList;
    var item = cartList[index];
    cartList[index].number = item.number + 1;
    cartList[index].sum = item.sum + item.price;
    var tolMoney = this.data.totalMoney + item.price;
    this.setData({
      cartList: cartList,
      totalMoney: tolMoney
    })
  },

  minusFromCart: function (e) {
    var index = e.currentTarget.dataset.index;
    // console.log(index);
    var cartList = this.data.cartList;
    var item = cartList[index];
    cartList[index].number = item.number - 1;
    var tolMoney = this.data.totalMoney - item.price;
    if (cartList[index].number == 0) {
      cartList.splice(index, 1);
    }
    this.setData({
      cartList: cartList,
      totalMoney: tolMoney
    })
  },

  payOrder: function () {
    if (this.data.totalMoney == 0) return;
    var that = this;
    wx.showModal({
      title: "支付订单",
      content: "确认支付？",
      success: function (res) {
        // console.log(res)
        if (res.confirm) {
          wx.showToast({
            title: "支付成功",
            duration: 1000
          })
          that.setData({
            cartList: [],
            totalMoney: 0
          })
        }
      },
    })
  },

  onLoad: function (options) {
    var that = this

    var scene = options.tableNum
    // console.log(scene);
    // that.setData({
    //   tableNum: scene,
    // })
    /*wx.getStorage({
      key: 'tableNum',
      success: function (res) {
        console.log(res.data)
        that.setData({
          tableNum: res.data
        })
      }
    })*/
  },
  onShow: function (options) {
    var that = this
    wx.getStorage({
      key: 'cartList',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          cartList: res.data
        })
      }
    })

    wx.getStorage({
      key: 'tolMoney',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          totalMoney: res.data
        })
      },
      
    })
  },
  onHide: function () {
    if (this.data.sumMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList);
      wx.setStorageSync('tolMoney', this.data.totalMoney);
      wx.setStorageSync('foodNumber', this.data.foodNumber)
    }
  }
})
