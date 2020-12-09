import { defineComponent, ref, watch } from 'vue'
import { useVModel, debouncedWatch, ignorableWatch, pausableWatch, useMouse } from '@vueuse/core'

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
        debouncedWatch(trigger, () => { num.value++ }, { debounce: 1000 })
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
                <span>ignorableWatch:提供忽略特定的source改变不触发watch的功能</span>
                <div>执行回调加一:{num}</div>
                <button onClick={updata}>触发watch</button>
                <button onClick={ignoreUpdates}>不触发watch</button>
            </div>
        )
    }
})

const PausableWatch = defineComponent({
    setup() {
        const valueRef = ref('')
        const { pause, stop, resume } = pausableWatch(valueRef, () => { console.log(valueRef.value) })
        function onChange(e: Event) {
            valueRef.value = e.target.value
        }
        return () => (
            <div>
                <span>pausableWatch:提供暂停和恢复watch监听的功能</span></br>
                <input type="text" value={valueRef.value} onChange={onChange} />
                </br>
                <button onClick={pause}>暂停</button>
                <button onClick={resume}>恢复</button>
            </div >
        )
    }
})

const UseMouse = defineComponent({
    setup() {
        const { x, y } = useMouse({ touch: false })
        return () => (
            <div>
                <span>useMouse:实时监听鼠标相对网页窗口的位置坐标</span>
                <div>x:{x.value}-y:{y.value}</div>
            </div>
        )
    }
})

export default defineComponent({
    name: 'VueuseStudy',
    components: { UseVModel, DebouncedWatch, IgnorableWatch, PausableWatch, UseMouse },
    setup() {
        const dataRef = ref('ooo')
        watch(dataRef, (n, o) => {
            console.log(n)
        })
        return { dataRef }
    },
    render() {
        const { dataRef } = this
        return (
            <div>
                <UseVModel data={dataRef} />
                <DebouncedWatch />
                <IgnorableWatch />
                <PausableWatch />
                <UseMouse />
            </div>
        )
    }
})