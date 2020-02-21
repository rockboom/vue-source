import Vue from 'vue'

let vm = new Vue({
    el:'#app',
    data(){
        return {
            msg:'hello',
            school:{name:'fz',age:10},
            arr:[1,2,3,{a:1}]
        }
    },
    computed:{

    },
    watch:{

    }
})

/**
 * 测试对象数据劫持的代码
 */

// vm.msg = vm._data.msg; // 代理
// console.log(vm._data.msg);
// console.log(vm.msg = 100);
// console.log(vm.msg);


/**
 * 测试数据劫持的代码
 */

// 原理是对原生的 push 方法进行劫持
// console.log(vm.arr.push(123));

// 如果新增的属性 也是对象类型 我们需要对这个对象 也进行观察 observe
// console.log(vm.arr.push({a:1}),vm.arr[3].a);
console.log(vm.arr[3]['a'] = 100);

// 什么样的数组会被观测到 

// 缺点
// arr = [0,1,2] arr[0] = 100 observe 不能直接改变索引不能被检测到 
// [1,2,3].length-- 数组长度的变化没有监控

// 优点
// [{a:1}] // 内部会对数组里面的对象进行监控
// [].push / shift / unshift 这些方法可以监控 vm.$set 内部调用的就是数组的splice