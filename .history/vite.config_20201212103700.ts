/*
 * @Author: your name
 * @Date: 2020-12-05 21:12:41
 * @LastEditTime: 2020-12-05 21:13:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vueuse-study\vite.config.js
 */
const { resolve } = require('path')
export default {
    alias: {
        '/@/': resolve(__dirname, 'src')
    }
}