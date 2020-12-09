/*
 * @Author: your name
 * @Date: 2020-12-06 13:21:36
 * @LastEditTime: 2020-12-06 13:40:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vueuse-study\src\vueuse\useGlobalState.ts
 */
import { createGlobalState } from '@vueuse/core'

export const useGlobalState = createGlobalState<{ value: number }>(() => ({ value: 0 }))
