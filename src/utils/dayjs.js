// import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh'

import relativeTime from 'dayjs/plugin/relativeTime'

// JSDOC注释，文档注释
/**
 * ...多久之前
 * @param {*} 之前的时间
 * @returns 系统时间到之前指定时间的距离值
 */

export const timeAgo = (targetTime) => {
    //  格式化时间
    dayjs.extend(relativeTime)
    dayjs.locale('zh')
    var a = dayjs()
    var b = dayjs(targetTime)
    return a.to(b)
}

export const formateDate = (dateObj) => {
    return dayjs(dateObj).format('YYYY-MM-DD')
}