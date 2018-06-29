//获取应用实例
const app = getApp()

//cart.js
Page({
  data: {
    tolMoney: 0,

    cartList: [],
    notOrderList: [],
    orderedList: [],

    tableList:[],
    tableOrderedList:[],
    notOrderTableList: [],
    
    deleteList: [],

    foodNumber: 0,

    isOrdered: false,
    isPost: false,
    payment: 0,

    url: '',
    nickName: '',
    CustomerID: '',
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

    var payment = that.data.payment;

    if (payment%2 == 1) {
      payment = payment+1;
    }
    that.setData({
      cartList: cartList,
      tolMoney: tolMoney,
      foodNumber: foodNumber,
      //能否加菜,false则可以
      isOrdered: false,
      payment: payment
    })
    that.postOrder();
  },

  postOrder: function() {
    var that = this;

    if (app.globalData.openid == '') {
      console.log('empty customerID')
      return;
    }
    if (app.globalData.cookie == '') {
      console.log('empty cookie')
      return;
    }
    //重新record
    wx.request({
      url: 'http://111.230.31.38:8080/api/restaurant/customer/record',
      data: {
        'table': parseInt(app.globalData.tableNum),
        'customerId': app.globalData.openid,
        'customerName': app.globalData.userInfo.nickName,
        'customerImageUrl': app.globalData.userInfo.avatarUrl
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
        //console.log('re record')
        console.log(res.data);

        //发送个人订单
        wx.request({
          url: 'http://111.230.31.38:8080/api/restaurant/customer/edit',
          data: that.createOrderJson(),
          method: "PUT",
          header: {
            'content-type': 'application/json',
            'Cookie': app.globalData.cookie
          },
          complete: function (res) {
            if (res.statusCode != 200) {
              console.log('error ' + res.errMsg)
              return;
            }
            console.log(res.data);
            //console.log(that.data.tableList)
          }
        })
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
        "dishId": cartList[i].dishId,
        "categoryId": cartList[i].categoryId,
        "name": cartList[i].name,
        "price": cartList[i].price,
        "number": cartList[i].number,
        "imageUrl": '',
        "orderedNumber": cartList[i].orderedNumber
      }
      dishList.push(item);
    };
    //时间参数
    var d = new Date();
    var time = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + 'T' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds() + 'Z';
    
    var orderObject = {
      'orderInfo': {
        "orderId": 0,
        "table": parseInt(app.globalData.tableNum),
        "dish": dishList,
        "requirement":  app.globalData.details,
        "totalPrice": that.data.tolMoney,
        "customerId": app.globalData.openid,
        "time":time,
        'paymentStatus': that.data.payment,
        "cookingStatus": "todo"
      }
    };
    console.log('post personal')
    console.log(orderObject);
    return orderObject;
  },

  orderPersonal: function(maxPayment) {
    var that = this;
    var orderedList = that.data.cartList;
    for (var i = 0; i < orderedList.length; i++) {
      orderedList[i].orderedNumber = orderedList[i].number;
    }
    that.setData({
      isOrdered: true,
      isPost: true,
      payment: maxPayment, 
      details: '',
      cartList: orderedList,
    })
    that.postOrder();
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
            var maxPayment = that.getMaxpayment(that.data.tableList);
            if (maxPayment%2 == 0) {
              maxPayment = maxPayment+1;
            }
            that.orderPersonal(maxPayment);
            
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
                  url: 'http://111.230.31.38:8080/api/restaurant/table/payment',
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
                    that.setData({
                      cartList: [],
                      deleteList: [],
                      tableList: [],
                      tolMoney: 0,
                      bill: 0,
                      isPost: false,
                      isOrdered: false,
                      payment: 0,
                      foodNumber: 0,
                      first: true
                    })
                    //that.getTableOrder();
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
      that.purchaseOrder(function(that) {
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
    if (this.data.bill == 0) return false;
    //如果当前订单没有更新，则不能重复下单
    var isRepeated = true;

    for (let i = 0; i < tableList.length; i++) {
      for (let j = 0; j < tableList[i].dish.length; j++) {
        var item = tableList[i].dish[j];
        if (item.orderedNumber == 0 || item.orderedNumber < item.number) {
          isRepeated = false;
        }
      }
    }
    
    return isRepeated;
  },

getMaxpayment: function (tableList) {
  var maxPayment = 0;
  for (var i = 0; i < tableList.length; i++) {
    if (tableList[i].paymentStatus > maxPayment) {
      maxPayment = tableList[i].paymentStatus;
    }
  }
  return maxPayment;
},

//获取该桌订单
  getTableOrder: function() {
    var that = this;

    wx.request({
      url: 'http://111.230.31.38:8080/api/restaurant/table/read',
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
          console.log('error ' + res.errMsg)
          that.setData({
            bill: that.data.tolMoney
          })
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
            cartList:[],
            deleteList:[],
            tableList:[],
            foodNumber : 0,
            isPost: false,
            isOrdered: false,
            tolMoney: 0,
            payment:0,
            bill: 0
          })
          return;
        }
        var data = res.data;
        var tableList = [];
        var totalOrder = [];
        var bill = 0;
        var maxPayment = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].orderInfo != "" && data[i].orderInfo.dish.length != 0) {
            var item = {
              customerId: data[i].orderInfo.customerId,
              dish: data[i].orderInfo.dish,
              customer_image: data[i].customer_image,
              customer_name: data[i].customer_name,
              paymentStatus: data[i].orderInfo.paymentStatus
            };
            if (data[i].orderInfo.paymentStatus > maxPayment) {
              maxPayment = data[i].orderInfo.paymentStatus;
            }
            if (data[i].orderInfo.customerId != app.globalData.openid) {
              tableList.push(item);
            }
            bill = bill + data[i].orderInfo.totalPrice;
            totalOrder.push(item);
          }
        }

        var isRepeated;

        if (maxPayment%2 == 1) {
          if (that.data.payment != maxPayment) {
            that.orderPersonal(maxPayment);
          }
          isRepeated = true;
        } else if (maxPayment == 0) {
          isRepeated = false;
        } else {
          isRepeated = that.checkRepeatOrder(totalOrder);
        }

        that.setData({
          tableList:tableList,
          isOrdered: isRepeated,
          bill:bill
        })
        console.log('payment' + that.data.payment)
        console.log('bill ' + that.data.bill)
        console.log('isOrdered ' + isRepeated);
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
        //console.log(res.data)

        that.setData({
          cartList: res.data,
          deleteList: [],
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

        that.getTableOrder();
        var id = setInterval(function () { that.getTableOrder() }, 3000);
        console.log('id' + id)
        that.setData({
          id: id
        })
      },
    });

    wx.getStorage({
      key: 'payment',
      success: function (res) {
        that.setData({
          payment: res.data
        })
      }
    })
    
  },
  
  onHide: function () {
      var that = this;
      var mergedList = that.data.cartList.concat(that.data.deleteList);
      //console.log(mergedList);
      wx.setStorageSync('cartList', mergedList);
      wx.setStorageSync('tolMoney', this.data.tolMoney);
      wx.setStorageSync('foodNumber', this.data.foodNumber);
      wx.setStorageSync('payment', this.data.payment);
      //console.log('id' + that.data.id)
      clearInterval(that.data.id);
  },

  onUnload: function() {
    wx.clearStorage();
  }

})
