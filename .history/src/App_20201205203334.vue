<template>
  <div>x:{{ x }}-y{{ y }}</div>
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
