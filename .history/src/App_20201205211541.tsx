import { defineComponent } from "vue";
import VueuseStudy from './vueuse/index'

export default defineComponent({
  name: "App",
  components: { VueuseStudy },
  setup() {
    return () => (
      <div>
        <VueuseStudy />
      </div>
    )
  },
});
