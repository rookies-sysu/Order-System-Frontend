* [React](#React)
    * [Flux](#Flux)
* [Vue](#Vue)
    * [vuex](#vuex)

<h2 id="React">React</h2>

#### 背景

Facebook认为MVC无法满足他们的扩展需求，由于他们非常巨大的代码库和庞大的组织，使得MVC很快变得非常复复杂，每当需要添加一项新的功能或特性时，系统的复杂度就成级数增长，非常难以理解和调试，特别是模型和视图间可能存在的双向数据流动。

React解决的问题：
> We built React to solve one problem: building large applications with data that changes over time.


#### 介绍

React 的核心思想是：封装组件。
各个组件维护自己的状态和 UI，当状态变更，自动重新渲染整个组件。基于这种方式的一个直观感受就是我们不再需要不厌其烦地来回查找某个 DOM 元素，然后操作 DOM 去更改 UI。
React 大体包含下面这些概念：

* 组件
* JSX
* Virtual DOM
* Data Flow

#### 简单组件例子

```
import React, { Component } from 'react';
import { render } from 'react-dom';

class HelloMessage extends Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

// 加载组件到 DOM 元素 mountNode
render(<HelloMessage name="John" />, mountNode);
```

**组件**

React 应用都是构建在组件之上。
上面的 `HelloMessage` 就是一个 React 构建的组件，最后一句 `render` 会把这个组件显示到页面上的某个元素 `mountNode` 里面，显示的内容就是 `<div>Hello John</div>`。

props 是组件包含的两个核心概念之一，另一个是 state。可以把 props 看作是组件的配置属性，在组件内部是不变的，只是在调用这个组件的时候传入不同的属性（比如这里的 name）来定制显示这个组件。

**JSX**

从上面的代码可以看到将 HTML 直接嵌入了 JS 代码里面，这个就是 React 提出的一种叫 JSX 的语法，这应该是最开始接触 React 最不能接受的设定之一，因为前端被“表现和逻辑层分离”这种思想“洗脑”太久了。

**Virtual DOM**

当组件状态 state 有更改的时候，React 会自动调用组件的 render 方法重新渲染整个组件的 UI。
如果真的这样大面积的操作 DOM，性能会是一个很大的问题，所以 React 实现了一个`Virtual DOM`，组件 DOM 结构就是映射到这个 Virtual DOM 上，React 在这个 Virtual DOM 上实现了一个 `diff` 算法，当要重新渲染组件的时候，会通过 diff 寻找到要变更的 DOM 节点，再把这个修改更新到浏览器实际的 DOM 节点上，所以实际上不是真的渲染整个 DOM 树。这个 Virtual DOM 是一个纯粹的 JS 数据结构，所以性能会比原生 DOM 快很多。

**Data Flow**

“单向数据绑定”是 React 推崇的一种应用架构的方式，当应用足够复杂时才能体会到它的好处。

<h2 id="Flux">Flux</h2>

#### 介绍

React 本身只涉及UI层，如果搭建大型应用，必须搭配一个前端框架。即**React + 前端框架**才能基本满足需要。
Facebook官方使用的是 Flux 框架。React 标榜自己是 MVC 里面 V 的部分，那么 Flux 就相当于添加 M 和 C 的部分。使用 Flux 组织代码和安排内部逻辑，使得应用更易于开发和维护，它跟MVC 架构是同一类东西，但是更加简单和清晰。它利用单向数据流的方式来组合React中的视图组件。

Flux将一个应用分成四个部分：

* View：视图层，React 组件，这一层可以看作 controller-views，作为视图同时响应用户交互
* Action（动作）：视图层发出的消息（比如mouseClick）
* Dispatcher（派发器）：用来接收Actions、执行回调函数，处理动作分发，维护 Store 之间的依赖关系
* Store（数据层）：数据和逻辑部分，用来存放应用的状态，一旦发生变动，就提醒Views要更新页面

<img src="http://wx3.sinaimg.cn/mw690/006fVSiZgy1frwknt8h0kj31040jon0q.jpg">

**单向数据流**

单项数据流的运作机制：

```
Action -> Dispatcher -> Store -> View
```

整个流程如下：

* 首先要有 action，通过定义一些 action creator 方法根据需要创建 Action 提供给 dispatcher
* View 层通过用户交互（比如 onClick）会触发 Action
* Dispatcher 会分发触发的 Action 给所有注册的 Store 的回调函数
Store 回调函数根据接收的 Action 更新自身数据之后会触发一个 change 事件通知 View 数据更改了
* View 会监听这个 change 事件，拿到对应的新数据并调用 setState 更新组件 UI
* 所有的状态都由 Store 来维护，通过 Action 传递数据，构成了如上所述的单向数据流循环，所以应用中的各部分分工就相当明确，高度解耦了。

简单描述即：

* 用户访问 View
* View 发出用户的 Action
* Dispatcher 收到 Action，要求 Store 进行相应的更新
* Store 更新后，发出一个"change"事件
* View 收到"change"事件后，更新页面

这种单向数据流使得整个系统都是透明可预测的。

#### Action
每个Action都是一个对象，包含一个actionType属性（说明动作的类型）和一些其他属性（用来传递数据）。

```
// actions/ButtonActions.js
var AppDispatcher = require('../dispatcher/AppDispatcher');

var ButtonActions = {
  addNewItem: function (text) {
    AppDispatcher.dispatch({
      actionType: 'ADD_NEW_ITEM',
      text: text
    });
  },
};
```

上面代码中，`ButtonActions.addNewItem`方法使用`AppDispatcher`，把动作`ADD_NEW_ITEM`派发到Store。

#### Dispatcher

Dispatcher 的作用是将 Action 派发到 Store。可以把它看作一个路由器，负责在 View 和 Store 之间，建立 Action 的正确传递路线。注意，Dispatcher 只能有一个，而且是全局的。


```
// dispatcher/AppDispatcher.js
var ListStore = require('../stores/ListStore');

AppDispatcher.register(function (action) {
  switch(action.actionType) {
    case 'ADD_NEW_ITEM':
      ListStore.addNewItemHandler(action.text);
      ListStore.emitChange();
      break;
    default:
      // no op
  }
})
```

上面代码中，Dispatcher收到`ADD_NEW_ITEM`动作，就会执行回调函数，对`ListStore`进行操作。
注意，Dispatcher 只用来派发 Action，不应该有其他逻辑。

#### Store

Store 保存整个应用的状态，它的角色有点像 MVC 架构之中的Model 。

```
// stores/ListStore.js
var ListStore = {
  items: [],

  getAll: function() {
    return this.items;
  },

  addNewItemHandler: function (text) {
    this.items.push(text);
  },

  emitChange: function () {
    this.emit('change');
  }
};

module.exports = ListStore;
```

上面代码中，`ListStore.items`用来保存条目，`ListStore.getAll()`用来读取所有条目，`ListStore.emitChange()`用来发出一个"change"事件。

由于 Store 需要在变动后向 View 发送"change"事件，因此它必须实现事件接口。

```
// stores/ListStore.js
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ListStore = assign({}, EventEmitter.prototype, {
  items: [],

  getAll: function () {
    return this.items;
  },

  addNewItemHandler: function (text) {
    this.items.push(text);
  },

  emitChange: function () {
    this.emit('change');
  },

  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }
});
```
上面代码中，ListStore继承了`EventEmitter.prototype`，因此就能使用`ListStore.on()`和`ListStore.emit()`，来监听和触发事件了。

Store 更新后（`this.addNewItemHandler()`）发出事件（`this.emitChange()`），表明状态已经改变。 View 监听到这个事件，就可以查询新的状态，更新页面了。

#### View

View 监听 Store 的 change 事件。

```
// components/MyButtonController.jsx
var React = require('react');
var ListStore = require('../stores/ListStore');
var ButtonActions = require('../actions/ButtonActions');
var MyButton = require('./MyButton');

var MyButtonController = React.createClass({
  getInitialState: function () {
    return {
      items: ListStore.getAll()
    };
  },

  componentDidMount: function() {
    ListStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ListStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState({
      items: ListStore.getAll()
    });
  },

  createNewItem: function (event) {
    ButtonActions.addNewItem('new item');
  },

  render: function() {
    return <MyButton
      items={this.state.items}
      onClick={this.createNewItem}
    />;
  }
});
```

上面代码中，可以看到当MyButtonController 发现 Store 发出 change 事件，就会调用 `this._onChange` 更新组件状态，从而触发重新渲染。

<h2 id="Vue">Vue</h2>

#### 介绍

很多传统的服务端代码放在了浏览器中，这样就产生了成千上万行的JavaScript代码，它们连接了各式各样的HTML和CSS文件，但缺乏正规的组织形式。

<img src="http://wx2.sinaimg.cn/mw690/006fVSiZgy1frwkmq6snzj30ok0nqgx0.jpg" width=50%>
<img src="http://wx2.sinaimg.cn/mw690/006fVSiZgy1frwkmvavc2j30og0nqqgr.jpg" width=50%>

Vue是一款较友好、多用途的JavaScript框架，它能够帮助构建可维护性和可测试性更强的代码库。和许多其他前端框架一样，Vue允许将一个网页分割成可复用的组件，每个组件都包含属于自己的HTMLCSS和JavaScript用来渲染网页中相应的地方。

<img src="http://wx2.sinaimg.cn/mw690/006fVSiZgy1frwkn4zpu4j30tq0m4n7j.jpg" width=50%>

Vue.js 的核心是一个允许采用简洁的模板语法来声明式地将数据渲染进 DOM 的系统：

```
<div id="app">
  {{ message }}
</div>
```
```
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```

<img src="http://wx3.sinaimg.cn/mw690/006fVSiZgy1frwkn8i6a2j30lm05qt8p.jpg">

<h2 id="vuex">Vue中的状态管理：Vuex</h2>

> Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

```
const store = new Vuex.Store({
    state: {
        name: 'weish',
        age: 22
    },
    getters: {
        personInfo(state) {
            return `My name is ${state.name}, I am ${state.age}`;
        }
    }
    mutations: {
        SET_AGE(state, age) {
            commit(age, age);
        }
    },
    actions: {
        nameAsyn({commit}) {
            setTimeout(() => {
                commit('SET_AGE', 18);
            }, 1000);
        }
    },
    modules: {
        a: modulesA
    }
}

```

这个就是最基本也是完整的vuex代码。

<img src="http://wx2.sinaimg.cn/mw690/006fVSiZgy1frwkneg7axj30m80hhmya.jpg">

状态管理包含以下几部分：

* store：相当于一个容器，；它是响应式的在全局都可以使用它；一个应用里只能定义一个 store 容器。
* state：这里对象里面放了各种状态（变量）
* mutations：唯一用来修改状态的回调函数，但不支持异步操作
* actions：包含异步操作，提交 mutations 来修改状态
* getters：在组件内部获取 store 中状态的函数
* module：将 store 分割成不同的模块

完整的 Vuex 动作是这样的：

* Components( 组件 )中 methods 里面一个方法 dispatch （调用）Actions
* Actions 然后 commit 对应的Mutations
* 只有 Mutations 可以操作 State 中的状态数据，状态一改变，组件中就重新渲染。

路线：C——>A——>M——>S——>C。

#### store

用一个对象就包含了全部的应用层级状态，它作为一个“唯一数据源 (SSOT)”而存在。

#### state

state负责存储整个应用的状态数据，一般需要在使用的时候在根节点注入store对象，后期就可以使用`this.$store.state`直接获取状态。

#### getter

作用上相当于store的计算属性，用来包装state，把原始state包装（对store.state做简单计算，比如filter, count, find等等）成视图展示需要的形式

#### mutations

mutations的中文意思是“变化”，负责更新state，mutation都是同步操作，commit mutation下一行state就更新完了。
预先注册在store中，每次commit时查mutation表，执行对应的state更新函数。
注意，要求mutation必须是同步的，否则调试工具拿不到正确的状态快照（如果异步修改状态的话），会破坏状态追踪。

#### actions

用来应对异步场景，作为mutation的补充。
Vuex相当于把Flux里的action按同步异步分为mutation和action。
action不像mutation一样直接修改state，而是通过commit mutation来间接修改，也就是说只有mutation对应原子级的状态更新操作
action里可以有异步操作，设计上故意把异步作为action和同步的mutation分开。

#### module

由于vue中使用单一的状态树，当管理的项目中大型的时候，所有的状态都集中在一个对象中会变得比较复杂，难以管理，显得项目比较臃肿。为了解决这些问题，模块化机制，用来拆分组织store。每个模块都有自己的state、mutation、action、getter。
提供namespaced选项，注册时把模块路径作为前缀。模块内不用带命名空间，模块外（业务或者其它模块）需要带命名空间。这样命名空间就变成了一个开关选项，对store部分没有任何影响

