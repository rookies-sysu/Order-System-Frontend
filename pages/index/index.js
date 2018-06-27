const hSwiper = require('../../component/hSwiper/hSwiper.js');
//获取应用实例
const app = getApp()

Page({
	data: {
		//swiper插件变量
		hSwiperVar: {},
    menuSwiperVar: {},
    listData: [],
    foodTypes: 0,
    activeIndex: 0,
    screenWidth: 667,
    showModalStatus: false,
    currentType: 0,
    currentIndex: 0,
    cartList: [],
    tolMoney: 0,
    foodNumber: 0,
    loading: true,
    foodTypeList : {},
    styleValue:{},
    screenWidth:0,
    reduceDistance:60,
    itemWidth:0,
    startPos:0,
    touchTime:0,
    endPos:0,
    nowTranX:0,
    nowView:{},
    // 视图过度动画实例
    swiperAnmiation : {}
	},
	onLoad: function () {
    var that = this;

    wx.request({
      /* 自己写的json数据的网址 */
      url: 'https://www.easy-mock.com/mock/5ab2750509c2ed0d826ee129/example/hippo',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          listData: res.data,
          loading: false,
        })
        that.initialData()
      }
    });
    
	},
	onReady: function() {
    var swiper = new hSwiper({
      reduceDistance: this.data.reduceDistance,
      varStr: 'hSwiperVar',

      list: [
        'http://wx4.sinaimg.cn/mw690/006fVSiZgy1frempiddekj30hm0bjjsm.jpg',
        'http://wx2.sinaimg.cn/mw690/006fVSiZgy1frempm4glyj30hj0bqq3j.jpg',
        'http://wx2.sinaimg.cn/mw690/006fVSiZgy1frempq3e2ij30hm0b1q3o.jpg',
        'http://wx4.sinaimg.cn/mw690/006fVSiZgy1fremptogetj30jy0daq3w.jpg',
        'http://wx3.sinaimg.cn/mw690/006fVSiZgy1fremq3kke4j30jv0ceab7.jpg',
        'http://wx4.sinaimg.cn/mw690/006fVSiZgy1frempiddekj30hm0bjjsm.jpg',
        'http://wx2.sinaimg.cn/mw690/006fVSiZgy1frempm4glyj30hj0bqq3j.jpg']
    });
    
    var width = wx.getSystemInfoSync().windowWidth;
    this.setData({
      screenWidth : width,
      itemWidth: width - this.data.reduceDistance
    })
    setInterval(function () {
      swiper.nextView();
    }, 2000);    

    setInterval(function () {
      swiper.moveViewTo(0);
    }, 10000); 
  },
  initialData : function() {
    var listData = this.data.listData;
    var count = listData.length;
    for (var i = 0; i < count; i++) {
      this.setData({
        ["foodTypeList.a"+i]: listData[i].foods.length, 
        ["styleValue." + i]: 2*(this.data.itemWidth+10),
        ["nowView." + i]: 0
      })
    }
  }, 
  onShow: function (options) {
    var that = this
    wx.getStorage({
      key: 'cartList',
      success: function (res) {
        that.setData({
          cartList: res.data
        })
        that.changeFoodNum();
      }
    })

    wx.getStorage({
      key: 'tolMoney',
      success: function (res) {
        that.setData({
          tolMoney: res.data
        })
      }
    })

    wx.getStorage({
      key: 'foodNumber',
      success: function (res) {
        that.setData({
          foodNumber: res.data
        })
      }
    })

  },
  changeFoodNum:function() {
    var that = this
    var loading = that.data.loading
    if (!loading) {
      var listData = that.data.listData
      var cartList = that.data.cartList
      var foodNum = cartList.length;

      var _type = 0
      var _index = 0
      for (var i = 0; i < foodNum; i++) {
        _type = cartList[i].type
        _index = cartList[i].index
        listData[_type].foods[_index].number = cartList[i].number
        if (cartList[i].number == 0) {
          cartList.splice(i, 1);
          // 删除元素后需要调整下标位置
          i = i - 1;
          foodNum = foodNum - 1;
          listData[_type].foods[_index].number = 0;
        }
      }
      if (foodNum == 0) {
        for (var i = 0, len = listData.length; i < len; i++) {
          for (var j = 0, _len = listData[i].foods.length; j < _len; j++) {
            listData[i].foods[j].number = 0;
          }
        }
      }
      that.setData({
        listData: listData,
      })
    }
  },
  menuTouchstart : function(e) {
    this.setData({
      startPos: e.touches[0].clientX,
      touchTime: e.timeStamp
    })
  },
  menuTouchmove : function(e) {
    var self = this; 
    var id = e.currentTarget.dataset.type;
    this.setData({
      endPos: e.touches[0].clientX
    })
    var delta = self.data.endPos - self.data.startPos
    this.menuMovePos(id, delta);
  },
  menuTouchend : function (e) {
    var self = this;
    var id = e.currentTarget.dataset.type;
    var delta = e.changedTouches[0].clientX - self.data.startPos
    var times = e.timeStamp - self.data.touchTime,
      distance = Math.abs(delta);

    if (times < 500 && distance > 50) {
      if (!((e.changedTouches[0].clientX - self.data.startPos) > 0)) {
         this.nextView(id);
      } else {
         this.preView(id);
      }
    } else if(distance > 0) {
      this.menuMovePos(id, delta);
      var nowtranX = this.data.nowTranX
      var endpos = self.data.endPos
      var startpos = self.data.startPos
      this.setData({
        endPos: e.changedTouches[0].clientX,
        nowTranX: nowtranX + (endpos - startpos)
      })
      self.moveViewTo(id, self.getNowView(id));
    }
  },
  menuMovePos : function (id, x) {
    var tempPos = this.data.nowTranX + x,
      minPos = - this.data.itemWidth - 20,
      maxPos = 20;
    // 最大的位置
    if (tempPos > maxPos) {
      tempPos = maxPos;
    }
    if (tempPos < minPos) {
      tempPos = minPos;
    }
    this.updateMoveAnimation(id, tempPos);
  },
  updateMoveAnimation : function(id, x) {
    var animation = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })
    animation.translateX(x).translate3d(0).step();
    this.setData({
      ["swiperAnmiation." + id]: animation.export()
    })
  },
  getNowView : function(id) {
    var indexView = this.data.nowView[id];
    if (this.data.nowTranX > 0) {
      return 0;
    }
    indexView = indexView > 0 ? indexView : 0;
    return indexView;
  },
  nextView : function(id) {
    var index = parseInt(this.data.nowView[id]) + 1;
    index = index > 1 ? 1 : index;
    this.setData({
      ["nowView." + id]: index
    })
    this.moveViewTo(id, index);
    return index;
  },
  preView : function(id) {
    var index = this.data.nowView[id] - 1;
    index = index < 0 ? 0 : index;
    this.setData({
      ["nowView." + id]: index
    })
    this.moveViewTo(id, index);
    return index;
  },
  moveViewTo: function(id, viewIndex) {
    this.setData({
      nowTranX: viewIndex == 1 ? -(this.data.itemWidth) * viewIndex-5 : (this.data.itemWidth) * viewIndex,
      ["nowView." + id]: viewIndex
    })
    this.updateViewAnimation(id, this.data.nowTranX);
  },

  updateViewAnimation: function (id, x) {
    var animation = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 300,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    animation.translateX(x).translate3d(0).step();
    this.setData({
      ["swiperAnmiation." + id]: animation.export()
    })
  },
  
  //生成个人订单
  createOrderJson: function () {
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

  //提交个人订单
  postOrder: function () {
    var that = this;

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
        console.log(res)
        if (res.statusCode != 200) {
          console.log('error ' + res.errMsg)
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
      }
    })
  },
  
  /**
   * 添加到购物车
   */

  addToCart: function (e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var selected_item = this.data.listData[type].foods[index];
    var listData = this.data.listData;
    var number = selected_item.number + 1;
    for (var i = 0; i < listData.length; i++) {
      for (var j = 0; j < listData[i].foods.length; j++) {
        if (listData[i].foods[j].name == selected_item.name) {
          listData[i].foods[j].number = number;
        }
      }
    }

    this.setData({
      currentType: type,
      currentIndex: index,
      listData: listData
    });

    var a = this.data;
    var unselected = true;
    var cartList = this.data.cartList;
    var sum;
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].name == selected_item.name) {
        sum = this.data.tolMoney + selected_item.price;
        cartList[i].sum += selected_item.price;
        cartList[i].number += 1;
        unselected = false;
      }
    }
    if (unselected) {
      var addItem = {
        "name": a.listData[a.currentType].foods[a.currentIndex].name,
        "price": a.listData[a.currentType].foods[a.currentIndex].price,
        "number": number,
        "sum": a.listData[a.currentType].foods[a.currentIndex].price,
        "type": type,
        "index": index,
        //该菜品已下单数量
        "orderedNumber": 0
      }
      sum = a.tolMoney + a.listData[a.currentType].foods[a.currentIndex].price;
      cartList.push(addItem);
    }
    this.setData({
      cartList: cartList,
      tolMoney: sum,
      foodNumber: a.foodNumber + 1
    });

    that.postOrder();
  },
  /*从图片处减少商品*/
  minusFromMenu: function (e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var that = this;

    var cartList = this.data.cartList;
    var sum;

    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].name == this.data.listData[type].foods[index].name) {
        
        //选中的菜品的数量不能小于已经下单的该菜品的数量
        if (cartList[i].orderedNumber != 0 && cartList[i].orderedNumber == cartList[i].number) {
          wx.showModal({
            title: "提示",
            content: "该商品不能再减少哦~",
            showCancel: false,
          })
          return;
        }

        sum = this.data.tolMoney - cartList[i].price;
        cartList[i].sum -= cartList[i].price;
        cartList[i].number == 1 ? cartList.splice(i, 1) : cartList[i].number--;
      }
    }

    var selected_item = this.data.listData[type].foods[index];

    var listData = this.data.listData;
    var number = selected_item.number - 1;
    for (var i = 0; i < listData.length; i++) {
      for (var j = 0; j < listData[i].foods.length; j++) {
        if (listData[i].foods[j].name == selected_item.name) {
          listData[i].foods[j].number = number;
        }
      }
    }

    this.setData({
        listData: listData,
        cartList: cartList,
        tolMoney: sum,
        foodNumber: this.data.foodNumber - 1
    });

    that.postOrder();
    
  },
  onHide: function () {
    if (this.data.tolMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList);
      wx.setStorageSync('tolMoney', this.data.tolMoney);
      wx.setStorageSync('foodNumber', this.data.foodNumber);
    }
  }
})