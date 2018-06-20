index.js需要配合在以下函数加上一些判断和相应处理：

```javascript
addToCart: function (e) {
   
   ...
  
   if (unselected) {
      var addItem = {
        "name": a.listData[a.currentType].foods[a.currentIndex].name,
        "price": a.listData[a.currentType].foods[a.currentIndex].price,
        "number": number,
        "sum": a.listData[a.currentType].foods[a.currentIndex].price,
        "type": type,
        "index": index,
        
        //这里要加一个变量，记录该菜品已下单的数量
        "orderedNumber": 0
      }
    
    ...
    
  },
  
  /*从图片处减少商品*/
  minusFromMenu: function (e) {
    
    ...
    
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].name == this.data.listData[type].foods[index].name) {
        
        //这里要加一个判断， 选中的菜品的数量不能小于已经下单的该菜品的数量
        if (cartList[i].orderedNumber != 0 && cartList[i].orderedNumber == cartList[i].number) {
          wx.showModal({
            title: "提示",
            content: "该商品不能再减少哦~",
            showCancel: false,
          })
          return;
        }

        ...

  },
```
