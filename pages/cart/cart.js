//获取应用实例
const app = getApp()

//cart.js
Page({
  data: {
    tolMoney: 0,
    cartList: [],
    deleteList: [],
    tableNum: 0,
    foodNumber: 0,
    isOrdered: false,
    details: ''
  },

  addToCart: function (e) {
    var index = e.detail.index;
    //console.log(index);
    var cartList = this.data.cartList;
    var item = cartList[index];
    cartList[index].number = item.number + 1;
    cartList[index].sum = item.sum + item.price;
    var tolMoney = this.data.tolMoney + item.price;
    var foodNumber = this.data.foodNumber + 1;

    this.setData({
      cartList: cartList,
      tolMoney: tolMoney,
      foodNumber: foodNumber,
      //加菜
      isOrdered: false
    })
  },

  checkRepeatOrder: function (cartList, isOrdered) {
    if(cartList.length == 0) return false;
    //如果当前订单没有更新，则不能重复下单
    var isRepeated = true;
    for (let i = 0; i < cartList.length; i++) {
      if (cartList[i].orderedNumber == 0 || cartList[i].orderedNumber < cartList[i].number) {
        isRepeated = false;
        break;
      }
    }
    console.log(isRepeated);
    return isRepeated;
  },

  minusFromCart: function (e) {
    var index = e.detail.index;
    //console.log(index);
    var cartList = this.data.cartList;
    var deleteList = this.data.deleteList;
    var item = cartList[index];

    //选中的菜品的数量不能小于已经下单的该菜品的数量
    if (item.orderedNumber != 0 && item.orderedNumber == item.number) return;

    cartList[index].number = item.number - 1;
    cartList[index].sum = item.sum - item.price;
    var tolMoney = this.data.tolMoney - item.price;
    var foodNumber = this.data.foodNumber - 1;

    if (cartList[index].number == 0) {
      deleteList.push(cartList[index]);
      cartList.splice(index, 1);
    }

    //检查当前订单是否更新过
    var isRepeated = this.checkRepeatOrder(cartList, this.data.isOrdered);

    this.setData({
      cartList: cartList,
      tolMoney: tolMoney,
      foodNumber: foodNumber,
      deleteList: deleteList,
      isOrdered: isRepeated
    })
  },

  bindTextAreaBlur: function(e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({
      details: e.detail.value
    });
  },
  
  purchaseOrder: function() {
    if (this.data.tolMoney == 0 || this.data.isOrdered == true) return;
    var that = this;

    wx.showModal({
        title: "提交订单",
        content: "确认提交？",
        success: function (res) {
          // console.log(res)
          if (res.confirm) {
            wx.showToast({
              title: "提交成功",
              duration: 1000
            })
            var orderedList = that.data.cartList;
            for (var i = 0; i < orderedList.length; i++) {
              orderedList[i].orderedNumber = orderedList[i].number;
            }
            that.setData({
              isOrdered: true,
              details: '',
              cartList: orderedList
            })
          }
        },
    })
    
  },

  payOrder: function () {
    if (this.data.tolMoney == 0) return;
    var that = this;
    
    //如果没有提交订单需要先提交订单
    if (that.data.isOrdered == false) {
      wx.showModal({
        title: "提交订单",
        content: "确认提交？",
        success: function (res) {
          // console.log(res)
          if (res.confirm) {
            wx.showToast({
              title: "提交成功",
              duration: 1000
            })
            var orderedList = that.data.cartList;
            for (var i = 0; i < orderedList.length; i++) {
              orderedList[i].orderedNumber = orderedList[i].number;
            }
            that.setData({
              isOrdered: true,
              details: '',
              cartList: orderedList
            })
            //提交订单成功后提示支付
            wx.showModal({
              title: "支付订单",
              content: "确认支付？",
              success: function (res) {
                if (res.confirm) {
                  wx.showActionSheet({
                    itemList: ['使用微信支付', '使用现金支付'],
                    success: function (res) {
                      //console.log(res)
                      //选择微信支付
                      if (res.tapIndex == 0) {
                        wx.showToast({
                          title: "支付成功",
                          duration: 1000
                        })
                        that.setData({
                          cartList: [],
                          deleteList: [],
                          tolMoney: 0,
                          isOrdered: false,
                          foodNumber: 0
                        })
                        //选择现金支付
                      } else if (res.tapIndex == 1) {
                        wx.showToast({
                          title: "请到前台结账",
                          duration: 1000
                        })
                        that.setData({
                          cartList: [],
                          deleteList: [],
                          tolMoney: 0,
                          isOrdered: false,
                          foodNumber: 0
                        })
                      }
                    }
                  })
                }
              },
            })
          }
        },
      })
    } else {
    //如果已经下单，则可以直接支付
      //提交订单成功后提示支付
      wx.showModal({
        title: "支付订单",
        content: "确认支付？",
        success: function (res) {
          if (res.confirm) {
            wx.showActionSheet({
              itemList: ['使用微信支付', '使用现金支付'],
              success: function (res) {
                console.log(res)
                //选择微信支付
                if (res.tapIndex == 0) {
                  wx.showToast({
                    title: "支付成功",
                    duration: 1000
                  })
                  that.setData({
                    cartList: [],
                    deleteList: [],
                    tolMoney: 0,
                    isOrdered: false,
                    foodNumber: 0
                  })
                  //选择现金支付
                } else if (res.tapIndex == 1) {
                  wx.showToast({
                    title: "请到前台结账",
                    duration: 1000
                  })
                  that.setData({
                    cartList: [],
                    deleteList: [],
                    tolMoney: 0,
                    isOrdered: false,
                    foodNumber: 0
                  })
                }
              }
            })
          }
        }
      });
    }
  },

  onLoad: function (options) {
    var that = this;
    //获取餐桌号
    wx.getStorage({
      key: 'tableNum',
      success: function (res) {
        console.log(res.data)
        that.setData({
          tableNum: res.data
        })
      }
    });
  },

  onShow: function (options) {
    var that = this;
    //获取购物车
    wx.getStorage({
      key: 'cartList',
      success: function (res) {
        // console.log(res.data)
        var isRepeated = that.checkRepeatOrder(res.data, that.data.isOrdered);
        that.setData({
          cartList: res.data,
          deleteList: [],
          isOrdered: isRepeated
        })
      }
    })
    //获取总金额
    wx.getStorage({
      key: 'tolMoney',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          tolMoney: res.data
        })
      },
    });
    //获取菜品总数
    wx.getStorage({
      key: 'foodNumber',
      success: function (res) {
        console.log(res.data)
        that.setData({
          foodNumber: res.data
        })
      },
    });

  },
  
  onHide: function () {
      var that = this;
      var mergedList = that.data.cartList.concat(that.data.deleteList);
      //console.log(mergedList);
      wx.setStorageSync('cartList', mergedList);
      wx.setStorageSync('tolMoney', this.data.tolMoney);
      wx.setStorageSync('foodNumber', this.data.foodNumber);
  }
})
