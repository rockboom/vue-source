import {initState} from './observer/index';
function Vue(options){ // 传入的数据选项
    this._init(options); // 初始化Vue 并且将用户选项传入
}

Vue.prototype._init = function (options){
    // vue初始化 this.options 表示的是vue中参数
    let vm = this;
    vm.$options = options;

    // MVVM原理 需要数据重新初始化
    initState(vm); // data computed watch
}
export default Vue