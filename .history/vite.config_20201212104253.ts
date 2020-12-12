/*
 * @Author: your name
 * @Date: 2020-12-05 21:12:41
 * @LastEditTime: 2020-12-12 10:42:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vueuse-study\vite.config.js
 */
import { UserConfig } from 'vite'
import vueJsxPlugin from 'vite-plugin-vue-jsx'

const config: UserConfig = {
    plugins: [
        vueJsxPlugin()
    ],
}

export default config