import Vue from 'vue'

let vm = new Vue({
    el:'#app',
    data(){
        return {
            msg:'hello',
            school:{name:'fz',age:10},
            arr:[1,2,3]
        }
    },
    computed:{

    },
    watch:{

    }
})
// vm.msg = vm._data.msg; // 代理
console.log(vm._data.msg);
console.log(vm.msg = 100);
console.log(vm.msg);