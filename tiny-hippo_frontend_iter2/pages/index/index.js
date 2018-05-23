<<<<<<< HEAD
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../images/1.jpg',
      '../../images/2.jpg',
      '../../images/3.jpg',
      '../../images/4.jpg',
      '../../images/5.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2500,
    duration: 1000,
    listData: [],
=======
const hSwiper = require('../../component/hSwiper/hSwiper.js');
Page({
	data: {
		//swiper插件变量
		hSwiperVar: {},
    menuSwiperVar: {},
    listData: [],
    foodTypes: 0,
>>>>>>> features/BeAShaper
    activeIndex: 0,
    toView: 'a1',
    scrollTop: 300,
    screenWidth: 667,
    showModalStatus: false,
    currentType: 0,
    currentIndex: 0,
    cartList: [],
    tolMoney: 0,
    foodNumber: 0,
<<<<<<< HEAD
    showCart: false,
    loading: false,
  },

  onLoad: function (options) {
    var that = this;
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    console.log(sysinfo)
    wx.request({
      /* 自己写的json数据的网址 */
      url: 'https://easy-mock.com/mock/5ab2750509c2ed0d826ee129/example/hippo',
=======
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
	onLoad: function (options) {
    var that = this;
    // var sysinfo = wx.getSystemInfoSync().windowHeight;
    // console.log(sysinfo)
    wx.request({
      /* 自己写的json数据的网址 */
      url: 'https://www.easy-mock.com/mock/5ab2750509c2ed0d826ee129/example/hippo',
>>>>>>> features/BeAShaper
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
<<<<<<< HEAD
        console.log(res)
        that.setData({
          listData: res.data,
          loading: true
        })
      }
    })
    
  },
  /**
   * 选择左侧菜单
   */
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      activeIndex: index,
      toView: 'a' + index
=======
        // console.log(res)
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
      reduceDistance: 80,
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
    var reduceDis = this.data.reduceDistance;
    this.setData({
      screenWidth : width,
      itemWidth: width - reduceDis
    })
    setInterval(function () {
      swiper.nextView();
    }, 2000); //循环时间 这里是1秒    

    setInterval(function () {
      swiper.moveViewTo(1);
    }, 12000); //循环时间 这里是1秒 
  },
  initialData : function() {
    var listData = this.data.listData;
    var count = listData.length;
    
    for (var i = 0; i < count; i++) {
      this.setData({
        ["foodTypeList.a"+i]: listData[i].foods.length, 
        ["styleValue." + i]: 2*(this.data.itemWidth+10),
        ["nowView." + i]:0
      })
    }
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
        that.changeFoodNum()    
      }      
    })

    wx.getStorage({
      key: 'tolMoney',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          tolMoney: res.data
        })
      }
    })

  },
  changeFoodNum:function() {
    var that = this
    var loading = that.data.loading
    if (!loading) {
      var listData = that.data.listData
      var foodNum = this.data.cartList.length
      var cartList = this.data.cartList

      var _type = 0
      var _index = 0

      for (var i = 0; i < foodNum; i++) {
        _type = cartList[i].type
        _index = cartList[i].index
        listData[_type].foods[_index].number = cartList[i].number
      }
      if (foodNum==0) {
        for (var i = 0; i < listData.length; i++) {
          for (var j = 0; j < listData[i].foods.length; j++) {
            listData[i].foods[j].number = 0;
          }
        }
      }
      that.setData({
        listData: listData
      })
    }
  },
  menuTouchstart : function(e) {
    // console.log(e)
    this.setData({
      startPos: e.touches[0].clientX,
      touchTime: e.timeStamp
    })
  },
  menuTouchmove : function(e) {
    // console.log(e)
    var self = this; 
    var id = e.currentTarget.dataset.type;
    this.setData({
      endPos: e.touches[0].clientX
    })
    var delta = self.data.endPos - self.data.startPos
    this.menuMovePos(id, delta);
  },
  menuTouchend : function (e) {
    // console.log(e)
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
    
    // var len = Math.ceil(this.data.listData[id].foods.length/2);
    var len = 2;

    var tempPos = this.data.nowTranX + x,
      count = len > 0 ? len : 1,
      minPos = -this.data.itemWidth * (count - 1)-20,
      maxPos = 20;
    // 最大的位置
    if (tempPos > maxPos) {
      tempPos = maxPos;
    }

    if (tempPos < minPos) {
      tempPos = minPos;
    }
    // console.log("tempPos="+tempPos)
    this.updateMoveAnimation(id, tempPos);
  },
  updateMoveAnimation : function(id, x) {
    // console.log(x)
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
    var maxIndex = 1;
    var indexView = this.data.nowView[id];
    // var maxIndex = this.data.listData[id].length - 1;
    // var indexView = Math.abs(Math.round(this.nowTranX / this.itemWidth /3));

    if (this.data.nowTranX > 0) {
      return 0;
    }
    indexView = indexView > 0 ? indexView : 0;
    indexView = indexView > maxIndex ? maxIndex : indexView;
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
    // console.log(index)
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
>>>>>>> features/BeAShaper
    })
  },
  /**
   * 右侧页面滚动
   */
  scroll: function (e) {
    var dis = e.detail.scrollTop
    var tab_height = 17;
    var content_height = 73;
    var listData = this.data.listData;
    var count = listData.length;
<<<<<<< HEAD
    
    var up = content_height * (listData[0].foods.length-1) + tab_height;
    var down = 0;
    var index = count-1;
    for (var i = 1; i < count; i++) {
          if (dis >= down && dis < up) {
            index = i-1;
            console.log(index);
            break;
          } else {
            down = up;
            up += content_height * (listData[i].foods.length) + tab_height;
          }
    }
    if (index >= count/2) {
=======

    var up = content_height * (listData[0].foods.length - 1) + tab_height;
    var down = 0;
    var index = count - 1;
    for (var i = 1; i < count; i++) {
      if (dis >= down && dis < up) {
        index = i - 1;
        // console.log(index);
        break;
      } else {
        down = up;
        up += content_height * (listData[i].foods.length) + tab_height;
      }
    }
    if (index >= count / 2) {
>>>>>>> features/BeAShaper
      wx.pageScrollTo({
        scrollTop: 100
      })
    }
    this.setData({
      activeIndex: index,
    })
  },
  /**
   * 添加到购物车
   */
  addToCart: function (e) {
<<<<<<< HEAD
=======
    // console.log(e)
>>>>>>> features/BeAShaper
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var selected_item = this.data.listData[type].foods[index];
<<<<<<< HEAD
    console.log(selected_item.number);
    var listData = this.data.listData;
    var number = selected_item.number+1;
=======
    // console.log(selected_item.number);
    var listData = this.data.listData;
    var number = selected_item.number + 1;
>>>>>>> features/BeAShaper
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
<<<<<<< HEAD
    
=======

>>>>>>> features/BeAShaper
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
        //break;
      }
    }
    if (unselected) {
      var addItem = {
        "name": a.listData[a.currentType].foods[a.currentIndex].name,
        "price": a.listData[a.currentType].foods[a.currentIndex].price,
        "number": number,
        "sum": a.listData[a.currentType].foods[a.currentIndex].price,
<<<<<<< HEAD
      }
      sum = a.tolMoney + a.listData[a.currentType].foods[a.currentIndex].price;
      
=======
        "type": type,
        "index": index
      }
      sum = a.tolMoney + a.listData[a.currentType].foods[a.currentIndex].price;

>>>>>>> features/BeAShaper
      cartList.push(addItem);
    }
    this.setData({
      cartList: cartList,
      tolMoney: sum,
      foodNumber: a.foodNumber + 1
    });
  },
  /*从图片处减少商品*/
<<<<<<< HEAD
  minusFromMenu: function(e) {
=======
  minusFromMenu: function (e) {
>>>>>>> features/BeAShaper
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var that = this;
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

    var cartList = this.data.cartList;
    var sum;
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].name == this.data.listData[type].foods[index].name) {
<<<<<<< HEAD
          sum = this.data.tolMoney - cartList[i].price;
          cartList[i].sum -= cartList[i].price;
          cartList[i].number == 1 ? cartList.splice(i, 1) : cartList[i].number--;
=======
        sum = this.data.tolMoney - cartList[i].price;
        cartList[i].sum -= cartList[i].price;
        cartList[i].number == 1 ? cartList.splice(i, 1) : cartList[i].number--;
>>>>>>> features/BeAShaper
      }
    }
    this.setData({
      listData: listData,
      cartList: cartList,
      tolMoney: sum,
      foodNumber: this.data.foodNumber - 1
    });
  },
<<<<<<< HEAD
  /**
   * 显示购物车
   */
  showCartList: function () {
    if (this.data.cartList.length != 0) {
      this.setData({
        showCart: !this.data.showCart,
      });
    }
  },
  /**
   * 清空购物车
   */
  clearCartList: function () {
    var listData = this.data.listData;
    for (var i = 0; i < listData.length; i++) {
      for (var j = 0; j < listData[i].foods.length; j++) {
          listData[i].foods[j].number = 0;
      }
    }
    this.setData({
      listData:listData,
      cartList: [],
      showCart: false,
      tolMoney: 0,
      foodNumber:0
    });
  },
  /**
   * 购物车中数量增加
   */
  addNumber: function (e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var cartList = this.data.cartList;
    var listData = this.data.listData;
    for (var i = 0; i < listData.length; i++) {
      for (var j = 0; j < listData[i].foods.length; j++) {
        if (cartList[index].name == listData[i].foods[j].name) {
          listData[i].foods[j].number++;
        }
      }
    }
    console.log(index)
    cartList[index].number++;
    var sum = this.data.tolMoney + cartList[index].price;
    cartList[index].sum += cartList[index].price;

    this.setData({
      listData:listData,
      cartList: cartList,
      tolMoney: sum,
      foodNumber: this.data.foodNumber + 1
    });
  },
  /**
   * 购物车中数量减少
   */
  decNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;
    var listData = this.data.listData;
    for (var i = 0; i < listData.length; i++) {
      for (var j = 0; j < listData[i].foods.length; j++) {
        if (cartList[index].name == listData[i].foods[j].name) {
          listData[i].foods[j].number--;
        }
      }
    }
    var sum = this.data.tolMoney - cartList[index].price;
    cartList[index].sum -= cartList[index].price;
    cartList[index].number == 1 ? cartList.splice(index, 1) : cartList[index].number--;
    this.setData({
      listData:listData,
      cartList: cartList,
      tolMoney: sum,
      showCart: cartList.length == 0 ? false : true,
      foodNumber: this.data.foodNumber - 1
    });
  },
  /**
   * 点击”选好了“跳转到结算页面
   */
  checkout: function () {
    if (this.data.sumMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList);
      wx.setStorageSync('tolMoney', this.data.tolMoney);
      wx.setStorageSync('foodNumber', this.data.foodNumber);
      wx.navigateTo({
        url: '../../pages/payment/payment'   // 结算页面地址
      })
    }
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

=======
  onHide: function () {
    if (this.data.sumMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList);
      wx.setStorageSync('tolMoney', this.data.tolMoney);
      wx.setStorageSync('foodNumber', this.data.foodNumber)
    }
>>>>>>> features/BeAShaper
  }
})