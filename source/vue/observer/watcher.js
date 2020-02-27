let id = 0; 
import { pushTarget, popTarget } from './dep'
import { util } from '../util';
class Watcher{ // 每一次产生一个watcher 都要有唯一的标识
    /**
     * 
     * @param {*} vm 当前组件的实例 new Vue
     * @param {*} exprOrFn 用户传入的可能是一个表达式 也有可能传入的是一个函数
     * @param {*} cb 用户传入的回调函数 vm.$watch('msg',cb);
     * @param {*} opts 一些其他参数
     */
    //          vm, msg,    (newValue,oldValue)=>{},     {user:true}
    constructor(vm,exprOrFn,cb=()=>{},opts={}){
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        if(typeof this.exprOrFn === 'function'){
            this.getter = exprOrFn; // getter就是new Watcher 传入的第二个参数
        }else{
            this.getter = function (){ 
                return util.getValue(vm, exprOrFn); // 如果调用此方法 会将vm上对应的表达式取出来
            }
        }
        if(opts.user){ // 标识是用户自己写的watcher
            this.user = true;
        }
        this.cb = cb;
        this.deps = [];
        this.depsId = new Set();
        this.opts = opts;
        this.id = id++;
        // 创建watcher的时候 先将表达式对应的值取出来(老值)
        this.value = this.get(); // 默认创建一个watcher 会调用自身的get方法
    }
    get(){
        // 渲染watcher Dep.target = watcher
        // msg变化了 需要让这个watcher重新执行
        pushTarget(this); 
        // 默认创建watcher 会执行此方法
        let value = this.getter(); // 让这个当前传入的函数执行
        popTarget();
        return value;
    }
    addDep(dep){ // 同一个watcher 不应该重复记录watcher 让dep和watcher互相记忆
        let id = dep.id; // msg 的 dep
        if(!this.depsId.has(id)){
            this.depsId.add(id);
            this.deps.push(id); // 就让watcher记住了当前的dep
            dep.addSub(this);
        }
    }
    update(){ // 如果立即调用get 会导致页面刷新 采取异步更新的方式
        queueWatcher(this);
    }
    run(){
        let value = this.get(); // 新值
        if(this.value !== value){
            this.cb(value,this.value);
        }
    }
}
let has = {};
let queue = [];
function flushQueue(){
    // 等待当前这一轮全部更新后 再去让watcher依次执行
    queue.forEach((watcher)=>watcher.run())
    has = {}; // 恢复正常 下一轮更新时继续使用
    queue = [];
}
function queueWatcher(watcher){ // 对重复的watcher进行过滤操作
    let id = watcher.id;
    if(has[id] == null){
        has[id] = true;
        queue.push(watcher); // 相同的watcher只会存一个到queue中

        // 延迟清空队列
        nextTick(flushQueue);
    }
}

// 异步方法会等待所有的同步方法执行完毕后调用此方法
let callbacks = [];
function flushCallbacks(){
    callbacks.forEach(cb=>cb());
}
function nextTick(cb){  // 当前的cb就是flushQueue
    callbacks.push(cb);

    // 要异步刷新这个callbacks，获取一个异步的方法 
    // 微任务：promise mutationObserver 宏任务：setImmediate setTimeout
    // 异步是分顺序执行的 会先执行promise mutationObserver setImmediate setTimeout

    let  timerFunc = ()=>{
        flushCallbacks();
    }
    if(Promise){ // then方法是异步的
        return Promise.resolve().then(timerFunc);
    }
    if(MutationObserver){ // mutationObserver 也是一个异步方法
        let observe = new MutationObserver(timerFunc);  // H5的api
        let textNode = document.createTextNode(1);
        observe.observe(textNode,{characterData:true});
        textNode.textContent = 2;
        return;
    }
    if(setImmediate){
        return setImmediate(timerFunc); // 性能比setTimeout
    }
    setTimeout(timerFunc,0)
}

// 等待页面更新再去 获取dom元素
// Vue.nextTick(()=>{

// })

// 渲染使用它 计算属性也要用到它 vm.watch 也用它
export default Watcher;