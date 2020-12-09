import { defineComponent, CSSProperties, ref, watch } from 'vue'
import { useVModel, debouncedWatch, ignorableWatch, pausableWatch, throttledWatch, when, useCounter, useLocalStorage, useSessionStorage, useStorage, useToggle, useMouse, onClickOutside } from '@vueuse/core'
import { useGlobalState } from './useGlobalState'

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
        const numRef = ref(0)
        function onTrigger() {
            setTimeout(() => { readyRef.value = true }, 2000)
            when(readyRef).toBe(true).finally(() => {
                numRef.value = 10
            })
            when(numRef).toMatch(v => v > 0 && 10 >= v).finally(() => {
                alert(`readyRef:${readyRef.value}-numRef:${numRef.value}`)
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

const UseCounter = defineComponent({
    setup() {
        const { count, inc, dec, set, reset } = useCounter()
        return () => (
            <div>
                <span>useCounter:提供计算响应值(count)和计算的控制方法</span><br />
                <div>count={count.value}</div>
                <button onClick={() => inc()}>inc:(+1)</button>
                <button onClick={() => dec()}>dec:(-1)</button>
                <button onClick={() => { inc(5) }}>inc(5):(+5)</button>
                <button onClick={() => { dec(5) }}>dec(5):(-5)</button>
                <button onClick={() => { set(100) }}>set(100)</button>
                <button onClick={() => reset()}>reset</button>
                <button onClick={() => { reset(666) }}>reset(666)</button>
            </div>
        )
    }
})

const CreateGlobalState = defineComponent({
    setup() {
        const state = useGlobalState()

        return () => (
            <div>
                <span>createGlobalState:创建供全局使用的状态</span><br />
                <div>state.value:{state.value}</div>
                <button onClick={() => {
                    import('./useGlobalState').then(module => {
                        const state = module.useGlobalState()
                        state.value++
                    })
                }}>修改state的属性value</button>
            </div>
        )
    }
})

const UseLocalStorage = defineComponent({
    setup() {
        const storage = useLocalStorage('useLocalStorage', { value: 0 })
        // const storage2 = useLocalStorage('useLocalStorage', { value: 1 })
        watch(() => storage.value.value, () => {
            const str = `JSON.parse(localStorage.getItem('useLocalStorage').value=${(JSON.parse(localStorage.getItem('useLocalStorage')) as { value: number }).value}`
            alert(str)
        })
        return () => (
            <div>
                <span>useLocalStorage:从localStorage获取指定key的值,返回解析后ref包装好的值,如果不存在key就返回'defaultValue'被ref包装后的值,改变值将实时同步到localStorage</span><br />
                <div>storage.value:{storage.value.value}</div>
                {/* <div>storage2.value:{storage2.value.value}</div> */}
                <button onClick={() => { storage.value.value++ }}>修改storage.value</button>
                {/* <button onClick={() => { storage2.value.value++ }}>修改storage2.value</button> */}
                {/* <button onClick={() => { localStorage.setItem('useLocalStorage', JSON.stringify({ value: 66 })) }}>修改</button> */}
                <button onClick={() => storage.value.value = null}>移除key</button>
            </div>
        )
    }
})

const UseSessionStorage = defineComponent({
    setup() {
        const storage = useSessionStorage('useSessionStorage', { value: 0 })
        watch(() => storage.value.value, () => {
            const str = `JSON.parse(sessionStorage.getItem('useSessionStorage').value=${(JSON.parse(sessionStorage.getItem('useSessionStorage')) as { value: number }).value}`
            alert(str)
        })
        return () => (
            <div>
                <span>useSessionStorage:从sessionStorage获取指定key的值,返回解析后ref包装好的值,如果不存在key就返回'defaultValue'被ref包装后的值,改变值将实时同步到localStorage</span><br />
                <div>storage.value:{storage.value.value}</div>
                <button onClick={() => { storage.value.value++ }}>修改storage.value</button>
            </div>
        )
    }
})

const UseStorage = defineComponent({
    setup() {
        const storage = useStorage('useStorage', 0, sessionStorage)
        watch(storage, () => {
            alert(`localStorage.getItem('useStorage'):${localStorage.getItem('useStorage')}  sessionStorage.getItem('useStorage')):${sessionStorage.getItem('useStorage')}`)
        })
        return () => (
            <div>
                <span>useStorage:useLocalStorage和useSessionStorage的合并,通过第三个参数指定使用localStorage还是sessionStorage,不提供默认使用localStorage</span><br />
                <div>storage.value:{storage.value}</div>
                <button onClick={() => { storage.value++ }}>修改storage.value</button>
                <button onClick={() => storage.value = null}>移除key</button>
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

const UseToggle = defineComponent({
    setup() {
        const [checked, toggle] = useToggle()
        return () => (
            < div >
                <span>useToggle:提供boolean的切换功能</span><br />
                <input type="radio" name="toggle" checked={checked.value} onClick={toggle} /><br />
                <button onClick={toggle}>toggle</button>
            </div >
        )
    }
})

const OnClickOutside = defineComponent({
    setup() {
        const elRef = ref<Element>(null)
        const styleRef = ref<CSSProperties>({ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100px', height: '100px', backgroundColor: '#d3f261', display: 'none' })
        onClickOutside(elRef, () => { styleRef.value.display = 'none' })
        return () => (
            <div>
                <span>onClickOutside:监听点击在提供元素以外的地方时执行事件函数(在设置点击弹窗以外隐藏弹窗时很有用)</span><br />
                <div ref={elRef} style={styleRef.value} />
                <button disabled={styleRef.value.display !== 'none'} onClick={() => { styleRef.value.display = 'block' }}>显示隐藏的元素</button>
            </div>
        )
    }
})

export default defineComponent({
    name: 'VueuseStudy',
    components: {
        UseVModel, DebouncedWatch, IgnorableWatch, PausableWatch,
        UseMouse, When, UseCounter, CreateGlobalState, UseLocalStorage, UseSessionStorage, UseStorage, UseToggle, OnClickOutside
    },
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
                <UseCounter /><br />
                <UseMouse /><br />
                <CreateGlobalState /><br />
                <UseLocalStorage /><br />
                <UseSessionStorage /><br />
                <UseStorage /><br />
                <UseToggle /><br />
                <OnClickOutside />
            </div>
        )
    }
})