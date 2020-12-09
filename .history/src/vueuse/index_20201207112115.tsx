import { defineComponent, CSSProperties, ref, watch, unref, Ref } from 'vue'
import {
    useVModel, debouncedWatch, ignorableWatch, pausableWatch, throttledWatch, when,
    useCounter, useLocalStorage, useSessionStorage, useStorage, useToggle, useMouse,
    onClickOutside, onStartTyping, useBattery, useDeviceLight, useDeviceMotion, useDeviceOrientation,
    useDevicePixelRatio, useDocumentVisibility, useElementVisibility, useGeolocation, useIdle, useIntersectionObserver, useMouseInElement
} from '@vueuse/core'
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

const OnStartTyping = defineComponent({
    setup() {
        const elRef = ref<HTMLInputElement>(null)
        onStartTyping((k) => {
            alert(k.key)
        })
        return () => (
            <div>
                <span>onStartTyping:当用户开始在不可编辑的元素上输入时触发执行事件函数</span>
                <h3 style={{ margin: '3px 0' }}>在键盘上随意按给字母键触发事件</h3>
            </div>
        )
    }
})

const UseBattery = defineComponent({
    setup() {
        const { isSupported, charging, chargingTime, dischargingTime, level } = useBattery()
        // isSupported && watch(charging, () => {
        //     charging.value && alert('开始充电!')
        //     !charging.value && alert('充电停止!')
        // })
        return () => (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span>useBattery:提供有关系统电池电量的信息，并让你在电池电量或充电状态发生变化时发送事件通知你。
                    这可用于调整应用程序的资源使用情况，以在电池电量不足时减少电池电量消耗，或在电池用尽之前保存更改以防止数据丢失。</span>
                {
                    isSupported && (() => (
                        <div style={{ position: 'relative', width: '300px', height: '20px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                            <div style={{ position: 'absolute', width: `${level.value * 100}%`, height: '20px', borderRadius: '10px', backgroundColor: '#d3f261' }}>
                                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>{level.value * 100}%</span>
                            </div>
                        </div>
                    ))()
                }
            </div>
        )
    }
})

const UseDeviceLight = defineComponent({
    setup() {
        const light = useDeviceLight()
        return () => (
            <div>
                <span>useDeviceLight:向Web开发人员提供来自光电传感器或类似检测器的有关设备附近环境光水平的信息。例如，这对于基于当前环境光水平调整屏幕的亮度以节省能源或提供更好的可读性可能很有用。</span><br />
                <div>light:{light.value}</div>
            </div>
        )
    }
})

const UseDeviceMotion = defineComponent({
    setup() {
        const { acceleration, accelerationIncludingGravity, rotationRate, interval } = useDeviceMotion()
        return () => (
            <div>
                <span>useDeviceMotion:向Web开发人员提供有关设备位置和方向的更改速度的信息。</span><br />
                <span>acceleration:{JSON.stringify(unref(acceleration))}</span><br />
                <span>accelerationIncludingGravity:{JSON.stringify(unref(accelerationIncludingGravity))}</span><br />
                <span>acceleration:{JSON.stringify(unref(rotationRate))}</span><br />
                <span>interval:{unref(interval)}</span>
            </div>
        )
    }
})

const UseDeviceOrientation = defineComponent({
    setup() {
        const { isSupported, isAbsolute, alpha, beta, gamma } = useDeviceOrientation()
        return () => (
            <div>
                <span>useDeviceOrientation:向Web开发人员提供有关运行网页的设备的物理方向的信息。</span><br />
                <span>isSupported:{isSupported + ''}</span><br />
                <span>isAbsolute:{unref(isAbsolute)}</span><br />
                <span>alpha:{unref(alpha)}</span><br />
                <span>beta:{unref(beta)}</span><br />
                <span>gamma:{unref(gamma)}</span>
            </div>
        )
    }
})

const UseDevicePixelRatio = defineComponent({
    setup() {
        const { pixelRatio } = useDevicePixelRatio()
        return () => (
            <div>
                <span>useDevicePixelRatio:获取设备的像素比</span>
                <div>pixelRatio:{pixelRatio.value}</div>
            </div>
        )
    }
})

const UseDocumentVisibility = defineComponent({
    setup() {
        const visibility = useDocumentVisibility()
        const logsRef = ref<string[]>([])
        watch(visibility, () => { logsRef.value.push(`visibility:${visibility.value}`) })
        return () => (
            <div>
                <span>useDocumentVisibility:反应性追踪 document.visibilityState.(追踪显示器当前是否显示此页面)</span><br />
                <button onClick={() => { logsRef.value = [] }}>清除logs</button><br />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {
                        logsRef.value.map(v => (
                            <div>{v}</div>
                        ))
                    }
                </div>
            </div>
        )
    }
})

const UseElementVisibility = defineComponent({
    setup() {
        const elRef = ref<Element>(null)
        const visibility = useElementVisibility(elRef)
        const logsRef = ref<string[]>([])
        watch(visibility, () => { logsRef.value.push(`visibility:${visibility.value}`) })
        return () => (
            <div ref={elRef}>
                <span>useElementVisibility:跟踪元素在视口中的可见性。</span><br />
                <button onClick={() => { logsRef.value = [] }}>清除logs</button><br />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {
                        logsRef.value.map(v => (
                            <div>{v}</div>
                        ))
                    }
                </div>
            </div>
        )
    }
})

const UseGeolocation = defineComponent({
    setup() {
        const { isSupported, coords, locatedAt, error } = useGeolocation()
        return () => (
            <div>
                <span>useGeolocation:如果需要，它允许用户向Web应用程序提供其位置。出于隐私原因，系统要求用户允许其报告位置信息。</span><br />
                <span>isSupported:{isSupported + ''}</span><br />
                <span>coords:{JSON.stringify(unref(coords))}</span><br />
                <span>locatedAt:{locatedAt.value}</span><br />
                <span>error:{JSON.stringify(unref(error))}</span>
            </div>
        )
    }
})

const UseIdle = defineComponent({
    setup() {
        const { idle, lastActive } = useIdle(5000)
        const secondsRef = ref(5)
        let timeout: NodeJS.Timeout
        function reset() {
            secondsRef.value = 5
            timeout && clearInterval(timeout)
        }
        watch(lastActive, () => {
            reset()
            timeout = setInterval(() => { secondsRef.value-- }, 1000)
        })
        watch(idle, () => { idle.value && reset() })
        return () => (
            <div>
                <span>useIdle:跟踪用户是否处于非活动状态。</span>
                <div>闲置:{idle.value + ''}</div>
                <div>进入闲置状态倒计时:{secondsRef.value}s</div>
                <div>最后一次活动时间:{new Date(lastActive.value + 8 * 60 * 60 * 1000).toUTCString()}</div>
            </div>
        )
    }
})

const UseIntersectionObserver = defineComponent({
    setup() {
        const elRef = ref<Element>(null)
        const logsRef = ref<string[]>([])
        const { isSupported, stop } = useIntersectionObserver(elRef, ([{ isIntersecting }], o) => {
            logsRef.value.push(`visibility:${isIntersecting}`)
        })
        return () => (
            <div ref={elRef}>
                <span>useIntersectionObserver:检测目标元素的可见性。</span><br />
                <button onClick={() => { logsRef.value = [] }}>清除logs</button><br />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {
                        logsRef.value.map(v => (
                            <div>{v}</div>
                        ))
                    }
                </div>
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

const UseMouseInElement = defineComponent({
    setup() {
        const elRef = ref<Element>(null)

        //把对number类型get操作四舍五入为整数
        function numToInt(obj: Ref<any>) {
            return new Proxy(obj, {
                get(target, propKey, receiver) {
                    if (typeof target[propKey] === 'number') {
                        target[propKey] = Math.round(target[propKey])info
                    }
                    return target[propKey]
                }
            })
        }
        const info = useMouseInElement(elRef)
        Object.keys(info).forEach(k => { info[k] = numToInt(info[k]) })
        const { x, y, sourceType, elementHeight, elementWidth, elementX, elementY, elementPositionX, elementPositionY, isOutside, stop } = info

        return () => (
            <div>
                <span>useMouseInElement:返回与元素相关的反应性鼠标位置等信息</span>
                <div ref={elRef} style={{ width: '300px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'start', padding: '5px', backgroundColor: '#eaff8f', fontSize: '13px' }}>
                    <span>元素width:{elementWidth.value}</span>
                    <span>元素height:{elementHeight.value}</span>
                    <span>元素相对视窗左上角位置x:{elementPositionX.value}</span>
                    <span>元素相对视窗左上角位置y:{elementPositionY.value}</span>
                    <span>鼠标相对视窗左上角的x坐标:{x.value}</span>
                    <span>鼠标相对视窗左上角的y坐标:{y.value}</span>
                    <span>鼠标相对元素左上角的x坐标:{elementX.value}</span>
                    <span>鼠标相对元素左上角的y坐标:{elementY.value}</span>
                    <span>鼠标是否在元素外:{isOutside.value + ''}</span>
                    <span>sourceType:{sourceType.value}</span>
                </div>
            </div>
        )
    }
})

export default defineComponent({
    name: 'VueuseStudy',
    components: {
        UseVModel, DebouncedWatch, IgnorableWatch, PausableWatch, When, UseCounter,
        CreateGlobalState, UseLocalStorage, UseSessionStorage, UseStorage, UseToggle, OnClickOutside,
        OnStartTyping, UseBattery, UseDeviceLight, UseDeviceMotion, UseDeviceOrientation, UseDevicePixelRatio, UseDocumentVisibility,
        UseElementVisibility, UseGeolocation, UseIdle, UseIntersectionObserver, UseMouse, UseMouseInElement
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
                <CreateGlobalState /><br />
                <UseLocalStorage /><br />
                <UseSessionStorage /><br />
                <UseStorage /><br />
                <UseToggle /><br />
                <OnClickOutside /><br />
                <OnStartTyping /><br />
                <UseBattery /><br />
                <UseDeviceLight /><br />
                <UseDeviceMotion /><br />
                <UseDeviceOrientation /><br />
                <UseDevicePixelRatio /><br />
                <UseDocumentVisibility /><br />
                <UseElementVisibility /><br />
                <UseGeolocation /><br />
                <UseIdle /><br />
                <UseIntersectionObserver /><br />
                <UseMouse /><br />
                <UseMouseInElement /><br />
            </div>
        )
    }
})