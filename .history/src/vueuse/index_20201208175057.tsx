import { defineComponent, CSSProperties, ref, watch, unref, Ref, nextTick, computed } from 'vue'
import {
    useVModel,
    debouncedWatch, ignorableWatch, pausableWatch, throttledWatch, when,
    useCounter, useLocalStorage, useSessionStorage, useStorage, useToggle, onClickOutside, onStartTyping, useBattery, useDeviceLight, useDeviceMotion, useDeviceOrientation, useDevicePixelRatio, useDocumentVisibility, useElementVisibility, useGeolocation, useIdle, useIntersectionObserver, useMouse, useMouseInElement, useNetwork, useOnline, usePageLeave, useParallax, useWindowScroll, useWindowSize,
    useBrowserLocation, useClipboard, useCssVar, useElementSize, useEventListener, useFavicon, useFullscreen, useMediaQuery, useMutationObserver, usePermission, usePreferredLanguages, useResizeObserver, useTitle,
    useRafFn, useTimestamp, useTransition, TransitionPresets, useInterval, useIntervalFn, useTimeout, useTimeoutFn,
    asyncComputed, useAsyncState, useRefHistory

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
                <span>是否支持:{isSupported + ''}</span><br />
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
                        logsRef.value.map((v,i) => (
                            <div key={i}>{v}</div>
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
                        logsRef.value.map((v,i) => (
                            <div key={i}>{v}</div>
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
                <span>是否支持:{isSupported + ''}</span><br />
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
                        logsRef.value.map((v,i) => (
                            <div key={i}>{v}</div>
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
                        target[propKey] = Math.round(target[propKey])
                    }
                    return target[propKey]
                }
            })
        }
        const info = useMouseInElement(elRef)
        Object.keys(info).forEach(k => { info[k] = numToInt(info[k]) })
        const { x, y, sourceType, elementHeight, elementWidth, elementX, elementY, elementPositionX, elementPositionY, isOutside, stop } = info

        return () => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>useMouseInElement:返回与元素相关的反应性鼠标位置等信息</span>
                <div ref={elRef} style={{ width: '300px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'start', padding: '5px', backgroundColor: '#eaff8f', fontSize: '13px' }}>
                    <span>元素width:{elementWidth.value}</span>
                    <span>元素height:{elementHeight.value}</span>
                    <span>元素相对页面左上角位置x:{elementPositionX.value}</span>
                    <span>元素相对页面左上角位置y:{elementPositionY.value}</span>
                    <span>鼠标相对页面左上角的x坐标:{x.value}</span>
                    <span>鼠标相对页面左上角的y坐标:{y.value}</span>
                    <span>鼠标相对元素左上角的x坐标:{elementX.value}</span>
                    <span>鼠标相对元素左上角的y坐标:{elementY.value}</span>
                    <span>鼠标是否在元素外:{isOutside.value + ''}</span>
                    <span>sourceType:{sourceType.value}</span>
                </div>
            </div>
        )
    }
})

const UseNetwork = defineComponent({
    setup() {
        const { isSupported, isOnline, offlineAt, downlink, downlinkMax, effectiveType, saveData, type } = useNetwork()
        return () => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>useNetwork:反应性网络状态。网络信息API按照常规连接类型（例如，“ wifi”，“蜂窝”等）提供有关系统连接的信息。这可用于根据用户的连接选择高清晰度内容或低清晰度内容。</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', padding: '5px', backgroundColor: '#bae7ff', fontSize: '13px' }}>
                    <span>是否支持:{isSupported + ''}</span>
                    <span>是否在线:{isOnline.value + ''}</span>
                    <span>上次网络连接以来的时间:{offlineAt.value && new Date(offlineAt.value + 8 * 60 * 60 * 1000).toUTCString()}</span>
                    <span>下载速度:{downlink.value}Mbps</span>
                    {downlinkMax.value && <span v-show={downlinkMax.value ?? true}>最大下载速度:{downlinkMax.value}Mbps</span>}
                    <span>网络速度类型:{effectiveType.value}</span>
                    <span>是否激活了数据保护程序模式:{saveData.value + ''}</span>
                    <span>连接/网络类型:{type.value}</span>
                </div>
            </div>
        )
    }
})

const UseOnline = defineComponent({
    setup() {
        const online = useOnline()
        return () => (
            <div>
                <span>useOnline:反应性在线状态。(useNetwork有包括网络在线属性)</span>
                <div>网络是否在线:{online.value + ''}</div>
            </div>
        )
    }
})

const UsePageLeave = defineComponent({
    setup() {
        const isLeave = usePageLeave()
        return () => (
            <div>
                <span>usePageLeave:显示鼠标是否离开页面的反应状态。</span><br />
                <span>鼠标是否离开网页:{isLeave.value + ''}</span>
            </div>
        )
    }
})

const UseParallax = defineComponent({
    setup() {
        const elRef = ref<Element>(null)
        const { roll, tilt, source } = useParallax(elRef)
        return () => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>useParallax:</span>
                <div ref={elRef} style={{ width: '100px', height: '100px', backgroundColor: '#eaff8f' }}></div>
            </div>
        )
    }
})

const UseWindowScroll = defineComponent({
    setup() {
        const { x, y } = useWindowScroll()
        return () => (
            <div>
                <span>useWindowScroll:反应窗口滚动</span>
                <div style={{ position: 'fixed', right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    <span>x:{x.value}</span><br />
                    <span>y:{Math.round(y.value)}</span>
                </div>
            </div>
        )
    }
})

const UseWindowSize = defineComponent({
    setup() {
        const { width, height } = useWindowSize()
        return () => (
            <div>
                <span>useWindowSize:反应视窗尺寸</span><br />
                <span>width:{width.value}</span><br />
                <span>height:{height.value}</span>
            </div>
        )
    }
})

const UseBrowserLocation = defineComponent({
    setup() {
        const location = useBrowserLocation()
        return () => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>useBrowserLocation:反应性当前网页的location</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', padding: '5px', backgroundColor: '#bae7ff', fontSize: '13px' }}>
                    {Object.keys(location.value).map(k => (
                        <span key={k}>{`${k}:${location.value[k]}`}</span>
                    ))}
                </div>
            </div>
        )
    }
})

const UseClipboard = defineComponent({
    setup() {
        const { isSupported, text, copy } = useClipboard()
        const inputRef = ref('')
        return () => (
            <div>
                <span>useClipboard:反应性剪贴板API。</span><br />
                <span>复制的内容:{text.value}</span><br />
                <input type="text" onChange={e => { inputRef.value = e.target.value }} placeholder='输入要复制到剪切板的文本' /><br />
                <button onClick={() => { copy(inputRef.value) }}>copy</button>
            </div>
        )
    }
})

const UseCssVar = defineComponent({
    setup() {
        const elRef = ref<Element>(null)
        const color = useCssVar('--color', elRef)
        function switchColor() {
            color.value = color.value === '#df8543' ? '#7fa998' : '#df8543'
        }
        return () => (
            <div>
                <span>useCssVar:没效果</span>
                <p ref={elRef} style='--color:#7fa998; color: var(--color);'>Sample text, {color.value}</p>
                <button onClick={switchColor}>Switch Color</button>
            </div>
        )
    },
})

const UseElementSize = defineComponent({
    setup() {
        const elRef = ref<Element>(null)
        const { width, height } = useElementSize(elRef)
        return () => (
            <div>
                <span>useElementSize:返回元素的宽高响应值</span><br />
                <textarea ref={elRef} style={{ resize: 'both', backgroundColor: 'rgba(0,0,0,0)', padding: '5px', border: '1px solid rgba(0,0,0,0.2)', width: '200px' }} disabled={true}>
                    width: {width.value}, height: {height.value}
                </textarea>
            </div>
        )
    }
})

const UseEventListener = defineComponent({
    setup() {
        const elRef = ref<Element>(null)
        nextTick(() => {
            elRef.value && useEventListener(elRef.value, 'click', () => { alert('你点击了我!') })
        })
        return () => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>useEventListener:轻松使用EventListener。在组件安装时使用addEventListener进行注册，在组件卸载时自动移除注销事件。默认添加事件的对象为window</span>
                <div ref={elRef} style={{ width: '100px', height: '100px', backgroundColor: '#eaff8f', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    点击我
                </div>
            </div>
        )
    }
})

const UseFavicon = defineComponent({
    setup() {
        const icons = ['爱宠0.png', '爱宠1.png', '爱宠2.png']
        const typeRef = ref(icons[0])
        useFavicon(typeRef, { baseUrl: '@/assets/' })
        return () => (
            <div>
                <span>useFavicon:提供响应式切换favicon(网页图标)的功能</span><br />
                <button onClick={() => { typeRef.value = icons[(icons.indexOf(typeRef.value) + 1) % icons.length] }}>切换favicon</button>
            </div>
        )
    }
})

const UseFullscreen = defineComponent({
    setup() {
        const elRef = ref<Element>(null)
        const { isFullscreen, enter, exit, toggle } = useFullscreen(elRef)
        return () => (
            <div>
                <span>useFullscreen:响应式全屏API。它添加了一些方法以全屏模式显示特定的Element（及其子代），并在不再需要时退出全屏模式。</span><br />
                <div ref={elRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#eaff8f' }}>
                    <button onClick={enter}>进入全屏</button>
                    <button onClick={exit}>退出全屏</button>
                    <button onClick={toggle}>toggle</button>
                </div>
            </div>
        )
    }
})

const UseMediaQuery = defineComponent({
    setup() {
        const is = useMediaQuery('(min-width:1024px)')
        return () => (
            <div>
                <span>useMediaQuery:响应式媒体查询。创建MediaQueryList对象后，您可以检查查询结果或在结果更改时接收通知。</span><br />
                <span>当前网页宽度是否小于1024px:{!is.value + ''}</span>
            </div>
        )
    }
})

const UseMutationObserver = defineComponent({
    setup() {
        const elRef = ref<Element>(null)
        const logsRef = ref<string[]>([])
        const [checked, toggle] = useToggle(false)
        const { isSupported, stop } = useMutationObserver(elRef, (mutations, observer) => {
            alert(`当前子节点个数为${mutations[0].target.childNodes.length}`)
        }, { childList: true })//childList:设置观察元素子节点列表的变化
        return () => (
            <div>
                <span>useMutationObserver:观察指定元素的更改变化.可以观察指定元素的属性,子节点列表,子节点元素的更改变化等(通过配置设置)</span><br />
                <button onClick={() => { logsRef.value = [] }}>移除所有子节点</button>
                <button onClick={() => { logsRef.value.push(Math.random() * 10) }}>添加节点</button><br />
                <div ref={elRef} style={{ display: 'flex', flexDirection: 'column' }}>
                    {
                        logsRef.value.map((v,i) => (
                            <div key={i}>{v}</div>
                        ))
                    }
                </div>
            </div>
        )
    }
})

const UsePermission = defineComponent({
    setup() {
        const microphoneAccess = usePermission('microphone')//判断当前页面对麦克风的权限状态
        return () => (
            <div>
                <span>usePermission:获取页面访问指定设备的权限的响应式状态值</span><br />
                <span>当前页面对麦克风的权限状态:{microphoneAccess.value}</span>
            </div>
        )
    }
})

const UsePreferredLanguages = defineComponent({
    setup() {
        const languages = usePreferredLanguages()
        return () => (
            <div>
                <span>usePreferredLanguages:它为Web开发人员提供了有关用户首选语言的信息。例如，这对于基于用户的偏好语言来调整用户界面的语言以提供更好的体验可能是有用的。</span><br />
                <span>首选语言集:{JSON.stringify(languages.value)}</span>
            </div>
        )
    }
})

const UseResizeObserver = defineComponent({
    setup() {
        const elRef = ref<Element>(null)
        const text = ref('')
        const { isSupported, stop } = useResizeObserver(elRef, (entries) => {
            const entry = entries[0]
            const { width, height } = entry.contentRect
            text.value = `width: ${width}, height: ${height}`
        })
        return () => (
            <div>
                <span>useResizeObserver:观察元素的大小变化</span><br />
                <textarea ref={elRef} style={{ resize: 'both', backgroundColor: 'rgba(0,0,0,0)', padding: '5px', border: '1px solid rgba(0,0,0,0.2)', width: '200px' }} disabled={true}>
                    {text.value}
                </textarea>
            </div>
        )
    }
})

const UseTitle = defineComponent({
    setup() {
        const pageTitle = useTitle()
        return () => (
            <div>
                <span>useTitle:响应式的设置页面标题</span><br />
                <input type="text" name="页面标题输入" value={pageTitle.value} onChange={e => { pageTitle.value = e.target.value }} />
            </div>
        )
    }
})

const UseRafFn = defineComponent({
    setup() {
        const countRef = ref(0)
        const { pause, resume, isActive } = useRafFn(() => { countRef.value++ }, { immediate: false })
        return () => (
            <div>
                <span>useRafFn:调用函数requestAnimationFrame。具有暂停和恢复的控制。</span><br />
                <h2 style={{ margin: '3px 0' }}>count:{countRef.value}</h2>
                <button onClick={resume} disabled={isActive.value}>开始</button>
                <button onClick={pause} disabled={!isActive.value}>暂停</button>
            </div>
        )
    }
})

const UseTimestamp = defineComponent({
    setup() {
        const { pause, resume, isActive, timestamp } = useTimestamp({ offset: 8 * 60 * 60 * 1000 })

        return () => (
            <div>
                <span>useTimestamp:响应式的时间戳,提供暂停和恢复等控制方法,可以用于快速的实现时钟和计时器等功能</span><br />
                <h2 style={{ margin: '3px 0' }}>Now:{new Date(timestamp.value).toUTCString()}</h2>
            </div>
        )
    }
})

const UseTransition = defineComponent({
    setup() {
        const targetNumRef = ref(0)
        const easeInOutCubic = useTransition(targetNumRef, { duration: 1000, transition: TransitionPresets.easeInOutCubic })
        const easeInOutBack = useTransition(targetNumRef, { duration: 1500, transition: TransitionPresets.easeInOutBack })
        return () => (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span>useTransition:通过配置变化曲线和变化时间从0到指定值或从指定值到0.可以用于很方便的实现动画曲线</span>
                <button onClick={() => { targetNumRef.value = targetNumRef.value == 1 ? 0 : 1 }}>transition</button>
                <div style={{ position: 'relative', width: '300px', height: '20px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ position: 'absolute', width: `${easeInOutCubic.value * 100}%`, height: '20px', borderRadius: '10px', backgroundColor: '#d3f261' }}>
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>{Math.round(easeInOutCubic.value * 100)}%</span>
                    </div>
                </div>
                <div style={{ width: '30px', height: '30px', backgroundColor: '#91d5ff', transform: `translateX(${easeInOutCubic.value * 300}px) rotate(${225 * easeInOutBack.value}deg)` }} />
            </div>
        )
    }
})

const UseInterval = defineComponent({
    setup() {
        const { start, stop, isActive, pause, resume, counter } = useInterval(500, false)
        return () => (
            <div>
                <span>useInterval:响应式计数器在指定间隔时间增加.提供开始,终止,暂停,恢复等控制函数</span><br />
                <h2 style={{ margin: '3px 0' }}>count:{counter.value}</h2>
                <button onClick={resume} disabled={isActive.value}>开始</button>
                <button onClick={pause} disabled={!isActive.value}>暂停</button>
            </div>
        )
    }
})

const UseIntervalFn = defineComponent({
    setup() {
        const text = ref('......')
        const { pause, resume } = useIntervalFn(() => {
            text.value = new Array(text.value.length % 6 + 1).fill('.').join('')
        }, 1000)
        return () => (
            <div>
                <span>useIntervalFn:指定间隔时间执行回调函数.提供开始,终止,暂停,恢复等控制函数</span><br />
                <h1 style={{ margin: '0px 0' }}>{text.value}</h1>
            </div>
        )
    }
})

const UseTimeout = defineComponent({
    setup() {
        const { ready, isActive, start, stop } = useTimeout(1000, false)
        return () => (
            <div>
                <span>useTimeout:在给定时间后使用控件更新值。</span><br />
                <h2 style={{ margin: '3px 0' }}>ready:{ready.value + ''}</h2>
                <button onClick={start} disabled={isActive.value}>开始</button>
                <button onClick={stop} disabled={!isActive.value}>暂停</button>
            </div>
        )
    }
})

const UseTimeoutFn = defineComponent({
    setup() {
        const { pause, resume, counter, isActive } = useInterval(1000, false)
        const { start, stop } = useTimeoutFn(() => {
            pause()
            stop()
            counter.value = 0
            alert('时间到!')
        }, 10000, false)
        return () => (
            <div>
                <span>useTimeoutFn:包装setTimeout的控件。</span><br />
                <h2 style={{ margin: '3px 0' }}>倒计时:{10 - counter.value}</h2>
                <button onClick={() => { resume(); start() }} disabled={isActive.value}>开始</button>
            </div>
        )
    }
})

const AsyncComputed = defineComponent({
    setup() {
        const randomNumRef = ref(0)
        const isAwaitRef = ref(false)
        const com = asyncComputed<number>(async () => {
            console.log(randomNumRef.value)
            return await new Promise((resolve, reject) => { setTimeout(() => { resolve(randomNumRef.value) }, 2000) })
        }, null, isAwaitRef)
        return () => (
            <div>
                <span>asyncComputed:computed的异步功能.</span><br />
                <span>异步计算获取到的随机数:{com.value}</span><br />
                <button onClick={() => { randomNumRef.value = Math.floor(Math.random() * 100) }} disabled={isAwaitRef.value}>产生随机数</button>
            </div>
        )
    }
})

const UseAsyncState = defineComponent({
    setup() {
        const { state, ready } = useAsyncState<string>(new Promise(resolve => { setTimeout(() => resolve('ok'), 5000) }), 'await', 1000/**延时*/, err => { console.log(err) })
        return () => (
            <div>
                <span>useAsyncState:响应式异步状态。一旦完成，将不会阻止你的设置功能，并且会触发更改。</span><br />
                <span>ready:{ready.value + ''}</span><br />
                <span>state:{state.value}</span>
            </div>
        )
    }
})

const UseRefHistory = defineComponent({
    setup() {
        const randomNumRef = ref(0)
        const { history, undo, redo, canUndo, canRedo } = useRefHistory(randomNumRef,)
        return () => (
            <div>
                <span>useRefHistory:</span><br />
                <button onClick={() => { randomNumRef.value = Math.floor(Math.random() * 100) }}>产生随机数</button><br />
                <button onClick={undo} disabled={!canUndo.value}>undo</button>
                <button onClick={redo} disabled={!canRedo.value}>redo</button><br />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {
                        history.value.map((v,i) => (
                            <span key={i}>{v.snapshot}</span>
                        ))
                    }
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
        UseElementVisibility, UseGeolocation, UseIdle, UseIntersectionObserver, UseMouse, UseMouseInElement, UseNetwork, UseOnline, UsePageLeave,
        UseParallax, UseWindowScroll, UseWindowSize, UseBrowserLocation, UseClipboard, UseCssVar, UseElementSize, UseEventListener, UseFavicon, UseFullscreen,
        UseMediaQuery, UseMutationObserver, UsePermission, UsePreferredLanguages, UseResizeObserver, UseTitle, UseRafFn, UseTimestamp, UseTransition, UseInterval, UseIntervalFn,
        UseTimeout, UseTimeoutFn, AsyncComputed, UseAsyncState,UseRefHistory
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
                <UseNetwork /><br />
                <UseOnline /><br />
                <UsePageLeave /><br />
                <UseParallax /><br />
                <UseWindowScroll /><br />
                <UseWindowSize /><br />
                <UseBrowserLocation /><br />
                <UseClipboard /><br />
                <UseCssVar /><br />
                <UseElementSize /><br />
                <UseEventListener /><br />
                <UseFavicon /><br />
                <UseFullscreen /><br />
                <UseMediaQuery /><br />
                <UseMutationObserver /><br />
                <UsePermission /><br />
                <UsePreferredLanguages /><br />
                <UseResizeObserver /><br />
                <UseTitle /><br />
                <UseRafFn /><br />
                <UseTimestamp /><br />
                <UseTransition /><br />
                <UseInterval /><br />
                <UseIntervalFn /><br />
                <UseTimeout /><br />
                <UseTimeoutFn /><br />
                <AsyncComputed /><br />
                <UseAsyncState /><br/>
                <UseRefHistory/>
            </div>
        )
    }
})