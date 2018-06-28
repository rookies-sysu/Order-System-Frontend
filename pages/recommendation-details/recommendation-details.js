// pages/recommendation-details/recommendation-details.js
Page({

  data: {
    recommendation: {},
    recommendation_id: {},
    cartList: [],
    tolMoney: 0
  },

  onLoad: function (options) {
    var width = wx.getSystemInfoSync().windowWidth
    this.setData({
      window_width: width
    })
    
    var that = this
    wx.request({
      url: "http://111.230.31.38:8080/restaurant/recommendation",
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        let temp = res.data[options.recommendationId - 1]
        wx.getStorage({
          key: 'cartList',
          success: function (res2) {
            for (let i = 0; i < temp.details.length; i++) {
              temp.details[i].dish.number = 0
              temp.details[i].dish.index = i
              for (let j = 0; j < res2.data.length; j++) {
                if (res2.data[j].name == temp.details[i].dish.name) {
                  temp.details[i].dish.number = res2.data[j].number
                }
              }
            }

            that.setData({
              recommendation: temp,
              cartList: res2.data
            })
          },
          fail: function () {
            that.setData({
              recommendation: res.data[options.recommendationId - 1],
              cartList: []
            })
          }
        })

        wx.getStorage({
          key: 'tolMoney',
          success: function (res) {
            that.setData({
              tolMoney: res.data
            })
          },
          fail: function () {
            that.setData({
              tolMoney: 0
            })
          }
        })
      }
    })
  },

  addToCart: function (e) {
    let index = e.currentTarget.dataset.index
    let dish = e.currentTarget.dataset.dish
    let category = e.currentTarget.dataset.category

    let recommendation_temp = this.data.recommendation
    let cartList_temp = this.data.cartList

    let flag = 0
    recommendation_temp.details[index].dish.number += 1  // update page
    for (let i = 0; i < cartList_temp.length; i++) {
      if (cartList_temp[i].name == recommendation_temp.details[index].dish.name) {
        cartList_temp[i].number = cartList_temp[i].number + 1  // update cartlist
        cartList_temp[i].sum = cartList_temp[i].number * cartList_temp[i].price
        break
      }
    }

    if (flag == 0) {  // new dish
      cartList_temp.push({
        "name": recommendation_temp.details[index].dish.name,
        "price": recommendation_temp.details[index].dish.price,
        "number": recommendation_temp.details[index].dish.number,
        "sum": recommendation_temp.details[index].dish.number * recommendation_temp.details[index].dish.price,
        "type": category,
        "index": dish
      })
    }

    this.setData({
      recommendation: recommendation_temp,
      cartList: cartList_temp,
      tolMoney: this.data.tolMoney + recommendation_temp.details[index].dish.price
    })
    
    wx.setStorageSync('cartList', this.data.cartList)
    wx.setStorageSync('tolMoney', this.data.tolMoney)
  },

  minusFromMenu: function (e) {
    let index = e.currentTarget.dataset.index
    let dish = e.currentTarget.dataset.dish
    let category = e.currentTarget.dataset.category

    let recommendation_temp = this.data.recommendation
    let cartList_temp = this.data.cartList

    recommendation_temp.details[index].dish.number -= 1  // update page

    this.setData({
      recommendation: recommendation_temp
    })
  },

  onHide: function () {
    console.log(this.data.cartList)
    console.log('hh')
    wx.setStorageSync('cartList', this.data.cartList)
    wx.setStorageSync('tolMoney', this.data.tolMoney)
  }
})