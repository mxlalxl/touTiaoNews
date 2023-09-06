// 基于vant进行二次封装
import { Toast } from 'vant'
export default ({ type, message }) => {
    if (type === 'danger' || type === 'warning') {
        type = 'fail' //Toast失败的类型叫fail
    }
    Toast({
        type,
        message
    })
}