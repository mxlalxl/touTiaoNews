// 封装中间件函数插件
const directiveObj = {
    install(Vue) {
        Vue.directive('fofo', {
            inserted(el) {
                // el在这里是原生的标签对象，input在其内部
                // 搜索页面el是div
                // 评论页面el时textarea
                // 知识点：原生DOM.nodeName 拿到标签名（注意：拿到的是大写的字符串）
                if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
                    el.focus()
                } else {
                    // el 本身不是输入框，尝试往里获取
                    const theInput = el.querySelector('input')
                    const theTextArea = el.querySelector('textarea')
                    if (theInput) theInput.focus()
                    if (theTextArea) theTextArea.focus()
                }
            },
            updated(el) {
                if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
                    el.focus()
                } else {
                    // el 本身不是输入框，尝试往里获取
                    const theInput = el.querySelector('input')
                    const theTextArea = el.querySelector('textarea')
                    if (theInput) theInput.focus()
                    if (theTextArea) theTextArea.focus()
                }
            },
        })
    }
}
export default directiveObj