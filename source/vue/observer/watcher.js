let id = 0; 
import { pushTarget, popTarget } from './dep'
class Watcher{ // 每一次产生一个watcher 都要有唯一的标识
    /**
     * 
     * @param {*} vm 当前组件的实例 new Vue
     * @param {*} exprOrFn 用户传入的可能是一个表达式 也有可能传入的是一个函数
     * @param {*} cb 用户传入的回调函数 vm.$watch('msg',cb);
     * @param {*} opts 一些其他参数
     */
    constructor(vm,exprOrFn,cb=()=>{},opts={}){
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        if(typeof this.exprOrFn === 'function'){
            this.getter = exprOrFn; // getter就是new Watcher 传入的第二个参数
        }
        this.cb = cb;
        this.deps = [];
        this.depsId = new Set();
        this.opts = opts;
        this.id = id++;

        this.get(); // 默认创建一个watcher 会调用自身的get方法
    }
    get(){
        // 渲染watcher Dep.target = watcher
        // msg变化了 需要让这个watcher重新执行
        pushTarget(this); 
        // 默认创建watcher 会执行此方法
        this.getter(); // 让这个当前传入的函数执行
        popTarget();
    }
    addDep(dep){ // 同一个watcher 不应该重复记录watcher 让dep和watcher互相记忆
        let id = dep.id; // msg 的 dep
        if(!this.depsId.has(id)){
            this.depsId.add(id);
            this.deps.push(id); // 就让watcher记住了当前的dep
            dep.addSub(this);
        }
    }
    update(){
        this.get();
    }

}

// 渲染使用它 计算属性也要用到它 vm.watch 也用它
export default Watcher;