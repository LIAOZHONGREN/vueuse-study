import { defineComponent } from "vue";
import { useMouse } from '@vueuse/core'
//import VueuseStudy from './vueuse/index'

export default defineComponent({
  name: "App", 
  setup() {

    const { x, y } = useMouse({ touch: false })

    return () => (
      <div>
        x:{x.value}-y:{y.value}
      </div>
    )
  },
});
