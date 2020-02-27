import Observer from './observer';
export function initState(vm){
    // 做不同的初始化工作
    let opts = vm.$options;
    if (opts.data) {
        initData(vm); // 初始化数据
    }
    if (opts.computed) {
        initComputed(vm); // 初始化计算属性
    }
    if (opts.watch) {
        initWatch(vm); // 初始化watch
    }
}

export function observe(data){
    // 不是对象或者是null 就不用执行后面的逻辑
    if(typeof data != 'object' || data == null) return;
    if(data.__ob__){  // 已经被监控过了
        return data.__ob__;
    }
    return new Observer(data);
}
function proxy(vm,source,key){ // 代理数据 vm.msg =  vm._data.msg
    // vm.msg = 'hello'
    // vm._data.msg = 'hello'
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key];
        },
        set(newValue){
            vm[source][key] = newValue;
        }
    })
}
function initData(vm){ // 将用户传入的数据 通过defineProperty重新定义
    let data = vm.$options.data; // 用户传入的data
    data  = vm._data = typeof data == 'function' ? data.call(vm) : data || {};

    for(let key in data){
        proxy(vm,'_data',key); // 会将对vm上的取值操作和赋值操作代理给vm._data属性
    }
    observe(data); // 观察数据
}

function initComputed(){

}

function initWatch(){

}
