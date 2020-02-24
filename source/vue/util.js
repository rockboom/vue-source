// ?: 匹配不捕获 不捕获当前的分组
// + 至少一个
// ? 尽可能少匹配
// 源码里面的模板编译 也是基于正则的
const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export const util = {
    getValue(vm, expr) { // school.name
        let keys = expr.split('.'); // [school,name]
        return keys.reduce((memo, current) => { // reduce具备迭代的能力
            memo = memo[current]; // vm.school.name
            return memo;
        }, vm)
    },
    compilerText(node, vm) { // 编译文本 替换{{school.name}}
        node.textContent = node.textContent.replace(defaultRE, function (...args) {
            return util.getValue(vm, args[1]);
        })
    }
}

export function compiler(node, vm) { // node 就是文档碎片
    let childnodes = node.childNodes; // 只有第一次层 只有儿子 没有孙子
    // 将类数组转换成数组
    [...childnodes].forEach((child) => { // 一种是文本 一种是元素
        if (child.nodeType == 1) { // 1 元素   3 文本
            compiler(child, vm); // 编译当前元素的孩子节点
        } else if (child.nodeType == 3) {
            util.compilerText(child, vm);
        }
    })
}