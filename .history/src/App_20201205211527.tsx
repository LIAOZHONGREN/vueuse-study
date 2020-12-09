<!--
 * @Author: your name
 * @Date: 2020-12-05 20:29:17
 * @LastEditTime: 2020-12-05 20:44:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vueuse-study\src\App.vue
-->
<template>
  <div>x:{{ x }}-y:{{ y }}</div>
</template>

<script>
import { useMouse } from "@vueuse/core";

export default {
  name: "App",
  setup() {
    const { x, y } = useMouse({ touch: false });
    return { x, y };
  },
};
</script>
