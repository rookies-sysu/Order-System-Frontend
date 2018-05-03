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
    showCart: false,
    loading: false,
    tableNum: undefined,
  },

  onLoad: function (options) {

  var scene = options.tableNum
  console.log(scene);
  this.setData({
    tableNum:scene,
  })
    var that = this;
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    console.log(sysinfo)
    wx.request({
      /* 自己写的json数据的网址 */
      url: //'https://easy-mock.com/mock/5ab2750509c2ed0d826e//e129/example/hippo',
      'http://111.230.31.38:5000/',
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
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var selected_item = this.data.listData[type].foods[index];
    console.log(selected_item.number);
    var listData = this.data.listData;
    var number = selected_item.number+1;
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
        //break;
      }
    }
    if (unselected) {
      var addItem = {
        "name": a.listData[a.currentType].foods[a.currentIndex].name,
        "price": a.listData[a.currentType].foods[a.currentIndex].price,
        "number": number,
        "sum": a.listData[a.currentType].foods[a.currentIndex].price,
      }
      sum = a.tolMoney + a.listData[a.currentType].foods[a.currentIndex].price;
      
      cartList.push(addItem);
    }
    this.setData({
      cartList: cartList,
      tolMoney: sum,
      foodNumber: a.foodNumber + 1
    });
  },
  /*从图片处减少商品*/
  minusFromMenu: function(e) {
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
          sum = this.data.tolMoney - cartList[i].price;
          cartList[i].sum -= cartList[i].price;
          cartList[i].number == 1 ? cartList.splice(i, 1) : cartList[i].number--;
      }
    }
    this.setData({
      listData: listData,
      cartList: cartList,
      tolMoney: sum,
      foodNumber: this.data.foodNumber - 1
    });
  },
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
        url: ''   // 结算页面地址
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

  }
})