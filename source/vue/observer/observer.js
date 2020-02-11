import {observe} from './index';
export function defineReactive(data,key,value){ // 定义响应式的数据变化
    // vue 不支持ie8 及 ie8 以下的浏览器

    // 如果value 依旧是一个对象的话，需要深度观察 {msg:'hello'}
    observe(value); // 递归观察
    Object.defineProperty(data,key,{
        get(){
            return value;
        },
        set(newValue){
            if(value == newValue) return;
            value = newValue;
        }
    })
}
class Observer{
    constructor(data){ // data就是定义的下vm._data
        // 将用户的数据使用defineProperty重新定义
        this.walk(data);
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