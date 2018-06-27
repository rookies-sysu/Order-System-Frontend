//获取应用实例
const app = getApp()

//cart.js
Page({
  data: {
    tolMoney: 0,
    cartList: [],
    tableList:[],
    deleteList: [],

    foodNumber: 0,
    isOrdered: false,

    url: '',
    nickName: '',
    bill: 0,
    id: undefined,

    first: true
  },

  addToCart: function (e) {
    wx.navigateTo({
      url: "../recommendation/recommendation"
    })
    var index = e.detail.index;
    //console.log(index);
    var that = this;
    var cartList = that.data.cartList;
    var item = cartList[index];
    cartList[index].number = item.number + 1;
    cartList[index].sum = item.sum + item.price;
    var tolMoney = that.data.tolMoney + item.price;
    var foodNumber = that.data.foodNumber + 1;

    that.setData({
      cartList: cartList,
      tolMoney: tolMoney,
      foodNumber: foodNumber,
      //能否加菜,false则可以
      isOrdered: false
    })
    that.postOrder();
  },

  postOrder: function() {
    var that = this;

    if (that.data.foodNumber == 0 && that.data.tableList.length == 0) {
      console.log('empty don;t post order')
      return;
    }
    if (app.globalData.openid == '') {
      console.log('empty customerID')
      return;
    }
    //重新record
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
        'Cookie': app.globalData.cookie
      },
      complete: function (res) {
        if (res.statusCode != 200) {
          console.log('error '+ res.errMsg)
          return;
        }
      }
    })

    //发送个人订单
    wx.request({
      url: 'http://111.230.31.38:8080/restaurant/customer/edit',
      data: that.createOrderJson(),
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Cookie': app.globalData.cookie
      },
      complete: function (res) {
        if (res.statusCode != 200) {
          console.log('error ' + res.errMsg)
          return;
        }
        console.log(res.data)
        that.getTableOrder();
        //console.log(that.data.tableList)
      }
    })
  },

  minusFromCart: function (e) {
    var index = e.detail.index;
    //console.log(index);
    var that = this;
    var cartList = that.data.cartList;
    var deleteList = that.data.deleteList;
    var item = cartList[index];

    //选中的菜品的数量不能小于已经下单的该菜品的数量
    if (item.orderedNumber != 0 && item.orderedNumber == item.number) return;

    cartList[index].number = item.number - 1;
    cartList[index].sum = item.sum - item.price;
    var tolMoney = that.data.tolMoney - item.price;
    var foodNumber = that.data.foodNumber - 1;

    if (cartList[index].number == 0) {
      deleteList.push(cartList[index]);
      cartList.splice(index, 1);
    }

    that.setData({
      cartList: cartList,
      tolMoney: tolMoney,
      foodNumber: foodNumber,
      deleteList: deleteList
    })
    
    that.postOrder();
  },

  bindTextAreaBlur: function(e) {

    app.globalData.details  = e.detail.value
    console.log(app.globalData.details);

  },
  
  createOrderJson: function() {
    var that = this;
    var cartList = that.data.cartList;
    var dishList = [];

    for (var i = 0; i < cartList.length; i++) {
      var item = {
        "DishID": 0 /*cartList[i].DishID*/,
        "CategoryID": cartList[i].type/*cartList[i].CategoryID*/,
        "name": cartList[i].name,
        "price": cartList[i].price,
        "number": cartList[i].number,
        "sum": cartList[i].sum,
        "orderedNumber": cartList[i].orderedNumber
      }
      dishList.push(item);
    };

    var orderObject = {
      'items': {
        "table": parseInt(app.globalData.tableNum),
        "dish": dishList,
        "requirement": [
          {
            "description": app.globalData.details
          }
        ],
        "price": that.data.tolMoney,
        "customerId": app.globalData.openid
      }
    };
    return orderObject;
  },

  purchaseOrder: function(cb) {
    if (this.data.bill == 0 || this.data.isOrdered == true) return;
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
            that.postOrder();
            typeof cb == "function" && cb(that)
          }
        },
    })
  },

  //支付
  pay: function (that) {
    wx.showModal({
      title: "支付订单",
      content: "确认支付？",
      success: function (res) {
        if (res.confirm) {
          wx.showActionSheet({
            itemList: ['使用微信支付', '使用现金支付'],
            success: function (res) {
              //console.log(res)
              var choose = res.tapIndex;
              if (choose != 2) {
                //发送支付请求
                wx.request({
                  url: 'http://111.230.31.38:8080/restaurant/table/payment',
                  data: {
                  },
                  method: "GET",
                  header: {
                    'content-type': 'application/json',
                    'Cookie': app.globalData.cookie
                  },
                  complete: function (res) {
                    console.log(res)
                    if (res.statusCode != 200) {
                      wx.showToast({
                        icon: 'none',
                        title: "支付失败",
                        duration: 1000
                      })
                      console.log('error ' + res.errMsg)
                      return;
                    }
                    //选择微信支付
                    /*if (choose == 0) {
                      wx.showToast({
                        icon: 'success',
                        title: "支付成功",
                        duration: 1000
                      })
                      //选择现金支付
                    } else if (choose == 1) {
                      wx.showToast({
                        icon: 'success',
                        title: "请到前台结账",
                        duration: 1000
                      })
                    }*/
                    that.setData({
                      cartList: [],
                      deleteList: [],
                      tolMoney: 0,
                      bill: 0,
                      isOrdered: false,
                      foodNumber: 0,
                      first: true
                    })
                    console.log('pay ' + res.data)
                  }
                })
              }
            }
          })
        }
      }
    });
  },

  //支付订单
  payOrder: function () {
    if (this.data.bill == 0) return;
    var that = this;
    //如果没有提交订单需要先提交订单
    if (that.data.isOrdered == false) {
      that.purchaseOrder(function(that){
        that.pay(that);
      });
    //否则直接提交订单
    } else {
      that.pay(that);
    }
  },

  checkRepeatOrder: function (tableList) {
    console.log('checkRepeatOrder')
    console.log('tableList')
    console.log(tableList)
    if (tableList.length == 0) return false;
    //如果当前订单没有更新，则不能重复下单
    var isRepeated = true;
    for (let i = 0; i < tableList.length; i++) {
      for (let j = 0; j < tableList[i].dish.length; j++) {
        var item = tableList[i].dish[j];
        if (item.orderedNumber == 0 || item.orderedNumber < item.number) {
          isRepeated = false;
          break;
        }
      }
    }
    return isRepeated;
  },

//获取该桌订单
  getTableOrder: function() {
    var that = this;

    wx.request({
      url: 'http://111.230.31.38:8080/restaurant/table/read',
      data: {
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Cookie': app.globalData.cookie
      },
      complete: function (res) {
        if (res.statusCode != 200) {
          console.log('error ' + res.errMsg)
          return;
        }
        if (res.data.indexOf('clear') > 0) {

          if (that.data.first) {
            wx.showToast({
              icon: 'success',
              title: "支付成功",
              duration: 1000
            })
            that.setData({
              first: false
            })
          }

          that.setData({
            tableList:[],
            bill: 0
          })
          return;
        }
        console.log(res.data)
        var data = res.data[0];
        var tableList = [];
        var bill = 0;
        for (var i = 0; i < data.length; i += 2) {
          if (data[i].customerId != app.globalData.openid) {
            var item = {
              dish: data[i].dish,
              customer_image: data[i + 1].customer_image,
              customer_name: data[i + 1].customer_name
            };
            if (item.dish.length != 0) {
              tableList.push(item);
              bill = bill + data[i].price
            }
          }
        }
        bill = bill+that.data.tolMoney
        var isRepeated = that.checkRepeatOrder(tableList);
        console.log('isOrdered ' + isRepeated);
        that.setData({
          tableList:tableList,
          isOrdered: isRepeated,
          bill:bill
        })
        console.log('bill '+that.data.bill)
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      CustomerID: app.globalData.openid,
      tableNum: app.globalData.tableNum,
      url: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    })

    console.log('customerID ' + app.globalData.openid)
    console.log('tableNum ' + app.globalData.tableNum)
  },

  onShow: function (options) {
    var that = this;
    //获取购物车
    wx.getStorage({
      key: 'cartList',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          cartList: res.data,
          deleteList: []
        })
      }
    })
    //获取个人订单总金额
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
        //console.log(res.data)
        that.setData({
          foodNumber: res.data
        })
        var id = setInterval(function () { that.getTableOrder() }, 5000);
        //console.log('id' + id)
        that.setData({
          id: id
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
      //console.log('id' + that.data.id)
      clearInterval(that.data.id);
  },

  onUnload: function() {
    wx.clearStorage();
  }

})
