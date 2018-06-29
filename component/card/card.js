// components/card/card.js
Component({

  properties: {
    title: {
      type: String
    },
    tag: {
      type: String
    },
    image: {
      type: String
    },
    recommendationId: {
      type: Number
    }

  },

  data: {
    loading: false
  },

  methods: {
    
  },

  attached: function(options) {
    // var that = this
    // wx.request({
    //   url: "https://easy-mock.com/mock/5afbe65c3e9a2302b68981e5/dish?dishId=" + this.properties.dishId,
    //   method: 'GET',
    //   data: {},
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       dish: res.data.data,
    //       loading: true
    //     })
    //   }
    // })
  }
})
