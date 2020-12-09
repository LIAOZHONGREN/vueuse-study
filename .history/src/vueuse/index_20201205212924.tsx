import { defineComponent, ref, watch } from 'vue'
import { useVModel, debouncedWatch, ignorableWatch, useMouse } from '@vueuse/core'

const UseVModel = defineComponent({
    props: { data: String },
    setup(props, { emit }) {
        const data = useVModel(props, 'data', emit)
        function onclick() {
            data.value = 'foo'
            console.log(data.value)
        }
        return () => (
            <div>
                <span>测试使用useVModel(报错)</span>
                <div>data:{data.value}</div>
                <button onClick={onclick}>改变data</button>
            </div>
        )
    }
})

const DebouncedWatch = defineComponent({
    setup() {
        const trigger = ref(false)//用于触发watch
        const num = ref(0)
        debouncedWatch(trigger, () => { num.value++ }, { debounce: 500 })
        return () => (
            <div>
                <span>DebouncedWatch:触发watch后提供设置延时执行回调函数的功能</span>
                <div>执行回调加一:{num.value}</div>
                <button onClick={() => { trigger.value = !trigger.value }}>触发watch</button>
            </div>
        )
    }
})

const IgnorableWatch = defineComponent({
    setup() {
        const trigger = ref(false)//用于触发watch
        const num = ref(0)
        const { ignoreUpdates } = ignorableWatch(trigger, () => { num.value++ })
        return { num, ignoreUpdates: () => { ignoreUpdates(() => { trigger.value = !trigger.value }) }, updata: () => { trigger.value = !trigger.value } }
    },
    render() {
        const { num, ignoreUpdates, updata } = this
        return (
            <div>
                <span>ignorableWatch:</span>
                <div>执行回调加一:{num}</div>
                <button onClick={updata}>触发watch</button>
                <button onClick={ignoreUpdates}>不触发watch</button>
            </div>
        )
    }
})

const UseMouse = defineComponent({
    setup() {
        const { x, y } = useMouse({ touch: false })
        return () => (
            <div>x:{x.value}-y:{y.value}</div>
        )
    }
})

export default defineComponent({
    name: 'VueuseStudy',
    components: { UseVModel, DebouncedWatch, IgnorableWatch, UseMouse },
    setup() {
        const data = ref('ooo')
        watch(data, (n, o) => {
            console.log(n)
        })
        return () => (
            <div>
                <UseVModel data={data.value} />
                <DebouncedWatch />
                <IgnorableWatch />
                <UseMouse />
            </div>
        )
    }
})