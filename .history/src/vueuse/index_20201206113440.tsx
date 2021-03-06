import { defineComponent, ref, watch } from 'vue'
import { useVModel, debouncedWatch, ignorableWatch, pausableWatch, throttledWatch, when, useMouse } from '@vueuse/core'

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
                <span>debouncedWatch:watch的防抖功能</span>
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
                <span>pausableWatch:提供暂停和恢复watch监听的功能</span><br />
                <input type="text" value={valueRef.value} onChange={onChange} /><br />
                <button onClick={pause}>暂停watch监听</button>
                <button onClick={resume}>恢复watch监听</button>
            </div >
        )
    }
})

const ThrottledWatch = defineComponent({
    setup() {
        const trigger = ref(false)//用于触发watch
        const num = ref(0)
        throttledWatch(trigger, () => { num.value++ }, { throttle: 1000 })
        return () => (
            <div>
                <span>throttledWatch:watch的节流功能</span>
                <div>执行回调加一:{num.value}</div>
                <button onClick={() => { trigger.value = !trigger.value }}>触发watch</button>
            </div>
        )
    }
})

const When = defineComponent({
    setup() {

        const readyRef = ref(false)
        const num = ref(0)
        function onTrigger() {
            setTimeout(() => { readyRef.value = true }, 2000)
            when(readyRef).toBe(true).finally(() => {
                num.value = 10
            })
            when(num).toMatch(v => v > 0 && 10 >= v).finally(() => {
                alert(`readyRef:${readyRef.value}-num:${num.value}`)
            })
        }

        return () => (
            <div>
                <span>when:等待响应值等于(提供多种相等匹配函数)预期值后响应事件(可以设置等待超时)</span><br />
                <button onClick={onTrigger}>点击2秒后触发</button>
            </div>
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
    components: { UseVModel, DebouncedWatch, IgnorableWatch, PausableWatch, UseMouse, When },
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
                <UseVModel data={dataRef} /><br />
                <DebouncedWatch /><br />
                <IgnorableWatch /><br />
                <PausableWatch /><br />
                <ThrottledWatch /><br />
                <When /><br />
                <UseMouse /><br />
            </div>
        )
    }
})