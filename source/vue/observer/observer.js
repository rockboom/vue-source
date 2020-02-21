import {observe} from './index';
import {arrayMethods,observeArray} from './array'
export function defineReactive(data,key,value){ // 定义响应式的数据变化
    // vue 不支持ie8 及 ie8 以下的浏览器

    // 如果value 依旧是一个对象的话，需要深度观察 {msg:'hello'}
    observe(value); // 递归观察
    Object.defineProperty(data,key,{
        get(){
            console.log('get data');
            return value;
        },
        set(newValue){
            console.log('set data');
            if(value == newValue) return;
            observe(newValue); // 如果你设置的是一个对象的话，应该在监控这个新增的对象
            value = newValue;
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
            defineReactive(data,key,value);
        }
    }
}

export default Observer;