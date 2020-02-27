// 主要是拦截用户的push pop shift unshift reverse sort splice
// 只重写会改变原数组的方法
import {
    observe
} from './index';
// 先获取老的数组的方法，只改写这7个方法
let oldArrayProtoMethods = Array.prototype;

// 拷贝一个新的对象，可以查找到老的方法
export let arrayMethods = Object.create(oldArrayProtoMethods);
let methods = [
    'pop',
    'push',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]
export function observeArray(inserted){ // 要循环数组 依次对数组中的每一项进行观测
    for(let i = 0; i <inserted.length; i++){
        observe(inserted[i]); // 没有 对数组的索引进行监控
    }
}
export function dependArray(value){ // 递归收集数组中的依赖
    for(let i = 0;  i < value.length ; i++){
        let currentItem = value[i]; // 有可能也是一个数组 [[[[[[]]]]]]
        currentItem.__ob__ && currentItem.__ob__.dep.depend()
        if(Array.isArray(currentItem)){
            dependArray(currentItem); // 不停的收集 数组中的依赖关系
        }
    }
}
methods.forEach((method)=>{
    arrayMethods[method] = function (...args){ // 函数劫持 切片编程
        let r = oldArrayProtoMethods[method].apply(this, args);
        // todo
        let inserted;
        switch(method){ // 只对 新增的属性 进行再次观察 其他方法没有新增属性
            case 'psuh':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2); // 获取splice新增的内容
            default:
                break;
        }
        if(inserted) observeArray(inserted);
        console.log('array update');
        this.__ob__.dep.notify(); // **通知视图更新
        return r;
    }
})

