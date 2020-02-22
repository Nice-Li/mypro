import { h, init} from 'snabbdom'
const patch = init([
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
])
function Vue(options){
  this._init(options)
}
Vue.prototype._init = function(options){
  var opt = this.$opt = options;
  this.initData(opt)

  this.initMethod(opt)

  this.observe(this.$opt.data)
  this.$mount(opt.el)
}
Vue.prototype.$mount = function(el){
  var vnode = this.$opt.render.call(this)
  patch(document.querySelector(el), vnode)
  this._vnode = vnode

}
Vue.prototype.initData = function(options){
  var data = options.data;
  
  var keys = Object.keys(data)
  var len = keys.length;
  while(len --){
    const key = keys[len]
    Object.defineProperty(this, key, {
      enumerable:true,
      configurable:true,
      get(){
        // console.log('vm_get')
        return data[key]
      },
      set(_val){
        data[key] = _val
        this.updata()
      }
    })
  }

}
Vue.prototype.initMethod = function(options){
  var method = options.methods;
  for(var prop in method){
    this[prop] = method[prop].bind(this)
  }
}
Vue.prototype.updata = function(){
  var _vnode = this._vnode
  var vnode = this.$opt.render.call(this)
  patch(_vnode , vnode)
  this._vnode = vnode
}
Vue.prototype.observe = function(data){

  if(data && typeof data !== 'object'){
    return;
  } 
  var that = this;
  for(var prop in data){
    let val = data[prop]
    this.observe(val)
    Object.defineProperty(data, prop, {
      enumerable:true,
      configurable:true,
      get(){
        // console.log('data-get')
        return val
      },
      set(_val){
        val = _val
        that.updata()
      }
    })
  }
}
var vm = new Vue({
  el: '#app',
  data: {
    msg: 'hello',
    num:1,
    a:{
      x:2
    }

  },
  methods:{
    add(){
      console.log('add')
      this.num ++
      this.a.x ++
    },
    dec(){
      this.num --
    },
    changeText(){
      this.msg = this.msg + this.num
    }
  },
  render() {
    return h('div', {}, [
      h('span', {}, this.msg),
      h('button', {on: {click: this.add}}, this.a.x),
      h('button', {on: {click: this.dec}}, this.num),
      h('button', {on: {click: this.changeText}},'change')]
    );
  },
})
console.log(vm)
