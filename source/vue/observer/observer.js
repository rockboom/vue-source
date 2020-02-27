import {observe} from './index';
import {arrayMethods,observeArray} from './array'
import Dep from './dep'
export function defineReactive(data,key,value){ // 定义响应式的数据变化
    // vue 不支持ie8 及 ie8 以下的浏览器

    // 如果value 依旧是一个对象的话，需要深度观察 {msg:'hello'}
    observe(value); // 递归观察 {} arr [1,2,3]
    // 相同的属性用相同的dep
    let dep = new Dep(); // dep里可以搜集依赖，搜集的是watcher 每一个属性都增加一个dep实例
    Object.defineProperty(data,key,{
        // ** 依赖收集
        get(){ // 只要对这个属性进行了取值操作，就会将当前的watcher 存入进去
            // debugger
            if(Dep.target){ // 这次有值用的是渲染watcher
                // 我们希望存入的watcher不能重复，如果重复会造成更新时多次渲染
                dep.depend(); // 他想让dep中可以存 watcher，我还希望让这个watcher中也存放dep，实现一个多对多的关系
                // dep.addSub(Dep.target);
            }
            console.log('get data');
            return value;
        },
        // 通知依赖更新
        set(newValue){
            console.log('set data');
            if(value == newValue) return;
            observe(newValue); // 如果你设置的是一个对象的话，应该在监控这个新增的对象
            value = newValue;
            dep.notify();
        }
    })
}
class Observer{
    constructor(data){ // data就是定义的下vm._data
        // 将用户的数据使用defineProperty重新定义
        if(Array.isArray(data)){ // 重写push splice slice等数组方法
            // 只能拦截数组的方法，数组里面的每一项 还需要去观测一下
            data.__proto__ = arrayMethods; // 让数组 通过链来查找自己编写的原型链
            observeArray(data); //  观测数据中的每一项
        }else{
            this.walk(data);
        }
    }
    walk(data){
        let keys = Object.keys(data);
        for(let i = 0; i < keys.length; i++){
            let key = keys[i]; // 用户传入的key
            let value = data[key]; // 用户传入的值

            // 对每一个属性都重新用defineProperty
            defineReactive(data,key,value);
        }
    }
}

export default Observer;