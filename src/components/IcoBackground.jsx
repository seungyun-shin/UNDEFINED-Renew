import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import { icoVertex, icoFragment, icoFragmentLines, PostProcessing } from '../shaders/icoshadren'
import { onIcoTransition } from '../lib/icoBus'
import landscape from '../assets/textures/skytexture.jpg'

function IcoBackground() {

    const containerRef = useRef()

    useEffect(() => {
        const container = containerRef.current

        const scene = new THREE.Scene()

        // 레티나(DPR 2)에서 풀스크린 포스트 패스가 4배 픽셀을 처리하며 프레임이 떨어진다.
        // 배경은 블러+그레인이 덮어서 1.5 상한으로도 시각 차이가 없다. (AA도 그레인이 대체)
        const DPR = Math.min(window.devicePixelRatio, 1.5)

        const renderer = new THREE.WebGLRenderer({ antialias: false })
        renderer.setPixelRatio(DPR)
        renderer.setSize(window.innerWidth, window.innerHeight * 1.5)
        renderer.setClearColor(0x111111, 1)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        container.appendChild(renderer.domElement)

        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000)
        camera.position.set(0, 0, 1.7)

        const mouseCmove = { x: 0, y: 0 }
        const targetPos = { x: 0, y: 0 }

        let time = 0
        let mouse = 0
        let lastX = 0
        let speed = 0
        let running = true
        let paused = false
        let icoScale = 1
        let composer, customPass, ico, icoLines, material, materialLines

        const texture = new THREE.TextureLoader().load(landscape, (t) => {
            t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping
        })

        const geometry = new THREE.IcosahedronGeometry(0.60, 2)
        const length = geometry.attributes.position.array.length

        const bary = []
        for (let i = 0; i < length / 3; i++) {
            bary.push(0, 0, 1, 0, 1, 0, 1, 0, 0)
        }
        geometry.setAttribute('aBary', new THREE.BufferAttribute(new Float32Array(bary), 3))

        const uniforms = () => ({
            time: { value: 0 },
            landscape: { value: texture },
            resolution: { value: new THREE.Vector4() },
            mouse: { value: 0 },
        })

        material = new THREE.ShaderMaterial({
            fragmentShader: icoFragment,
            vertexShader: icoVertex,
            uniforms: uniforms(),
            side: THREE.DoubleSide,
        })

        materialLines = new THREE.ShaderMaterial({
            fragmentShader: icoFragmentLines,
            vertexShader: icoVertex,
            uniforms: uniforms(),
            side: THREE.DoubleSide,
        })

        ico = new THREE.Mesh(geometry, material)
        icoLines = new THREE.Mesh(geometry, materialLines)
        scene.add(ico)

        composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))

        customPass = new ShaderPass(PostProcessing)
        customPass.uniforms['resolution'].value = new THREE.Vector2(window.innerWidth, window.innerHeight)
        customPass.uniforms['resolution'].value.multiplyScalar(DPR)
        customPass.uniforms['noiseblur'].value = 1
        composer.addPass(customPass)

        const onMouseMove = (e) => {
            speed = Math.sqrt((e.pageX - lastX) ** 2 + (e.pageX - lastX) ** 2) * 0.003
            lastX = e.pageX
            mouseCmove.x = (e.clientX / window.innerWidth) * 2 - 1
            mouseCmove.y = -(e.clientY / window.innerHeight) * 2 + 1

            targetPos.x = mouseCmove.x * 0.039
            targetPos.y = mouseCmove.y * 0.039
        }

        const onMouseOut = () => {
            speed = 0
            lastX = 0
        }

        // 터치 디바이스는 mousemove 이벤트가 없어 대리석 굴곡이 전혀 반응하지
        // 않았다. 손가락 드래그를 마우스 이동과 동일하게 speed로 환산한다.
        const onTouchMove = (e) => {
            const touch = e.touches[0]
            if (!touch) return
            speed = Math.sqrt((touch.pageX - lastX) ** 2 + (touch.pageX - lastX) ** 2) * 0.003
            lastX = touch.pageX
            mouseCmove.x = (touch.clientX / window.innerWidth) * 2 - 1
            mouseCmove.y = -(touch.clientY / window.innerHeight) * 2 + 1

            targetPos.x = mouseCmove.x * 0.039
            targetPos.y = mouseCmove.y * 0.039
        }

        const onTouchEnd = () => {
            speed = 0
            lastX = 0
        }

        // FOV(70°)는 세로 기준 고정값이라, 세로로 긴 화면(좁은 aspect)일수록
        // 가로 시야가 좁아져 같은 크기의 구가 가로 폭을 훨씬 많이 채운다.
        // scale을 aspect에 정비례시키면 "구 지름 / 가로 시야폭" 비율이
        // 화면비와 무관하게 항상 일정해진다 (가로 채움 비율 고정).
        const getIcoScale = (width, height) => {
            const aspect = width / height
            if (aspect >= 1) return 1
            return THREE.MathUtils.clamp(aspect * 1.2, 0.35, 1)
        }

        const resize = () => {
            const width = container.offsetWidth
            const height = container.offsetHeight
            renderer.setSize(width, height)
            composer.setSize(width, height)
            camera.aspect = width / height
            camera.updateProjectionMatrix()

            icoScale = getIcoScale(width, height)
            ico.scale.setScalar(icoScale)
            icoLines.scale.setScalar(icoScale)
        }

        const render = () => {
            if (!running) return

            if (paused) {
                window.requestAnimationFrame(render)
                return
            }

            time += 0.001
            // 입력이 없어도(특히 로드 직후 모바일) 표면이 완전히 매끈해지지 않도록
            // 은은한 앰비언트 굴곡을 깔아두고, 그 위에 마우스/터치 반응을 더한다.
            const idle = 0.12 + Math.sin(time * 0.7) * 0.06
            mouse -= (mouse - (idle + speed)) * 0.005
            speed *= 0.99

            // 목표 위치로 즉시 대입하지 않고 매 프레임 조금씩 따라가게 한다.
            // 마우스는 이동이 연속적이라 체감상 차이가 없지만, 터치는 손가락이
            // 착지한 첫 지점부터 이미 먼 좌표라 즉시 대입하면 순간이동처럼 보였다.
            ico.position.x += (targetPos.x - ico.position.x) * 0.08
            ico.position.y += (targetPos.y - ico.position.y) * 0.08
            icoLines.position.copy(ico.position)

            scene.rotation.x = -time * 6
            scene.rotation.y = time * 6
            // 카메라와의 거리가 진동하며 겉보기 크기도 같이 요동친다. 모바일에서는
            // 이 진동이 기준 크기보다 "커지는" 쪽으로 가는 순간에 화면을 꽉 채우는
            // 것처럼 보였다 — 앞으로 나오는 방향은 아예 막고, 뒤로 물러나는
            // 방향만 허용해 기준 크기를 절대 넘지 않게 한다.
            const zPulse = 0.2 * Math.sin(time * 3)
            scene.position.z = icoScale < 1 ? Math.min(zPulse * icoScale, 0) : zPulse

            customPass.uniforms.time.value = time
            customPass.uniforms.howmuchrgbshifticanhaz.value = mouse / 5

            material.uniforms.time.value = time
            material.uniforms.mouse.value = mouse
            materialLines.uniforms.time.value = time
            materialLines.uniforms.mouse.value = mouse

            composer.render()
            window.requestAnimationFrame(render)
        }

        // camera dive + blur transitions, same values as the original site
        const offTransition = onIcoTransition((mode) => {
            if (mode === 'zoom' || mode === 'zoomHide') {
                ico.visible = mode === 'zoom'
                icoLines.visible = mode === 'zoom'
                gsap.to(camera.position, { duration: 3, z: 0.3 })
                gsap.to(customPass.uniforms['noiseblur'], { duration: 3, value: mode === 'zoom' ? 17.0 : 37.0 })
            }
            if (mode === 'reset') {
                ico.visible = true
                icoLines.visible = true
                gsap.to(camera.position, { duration: 3, z: 1.7 })
                gsap.to(customPass.uniforms['noiseblur'], { duration: 3, value: 1.0 })
            }
            if (mode === 'hide') {
                // 페이드아웃이 끝나면 GPU 렌더링도 멈춘다 (지구본 화면과의 이중 렌더링 방지)
                gsap.to(container, {
                    duration: 1, opacity: 0, display: 'none',
                    onComplete: () => { paused = true },
                })
            }
            if (mode === 'show') {
                paused = false
                gsap.to(container, { duration: 1, opacity: 1, display: 'flex' })
            }
        })

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseout', onMouseOut)
        document.addEventListener('touchmove', onTouchMove, { passive: true })
        document.addEventListener('touchend', onTouchEnd)
        window.addEventListener('resize', resize)

        resize()
        render()

        return () => {
            running = false
            offTransition()
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseout', onMouseOut)
            document.removeEventListener('touchmove', onTouchMove)
            document.removeEventListener('touchend', onTouchEnd)
            window.removeEventListener('resize', resize)
            geometry.dispose()
            material.dispose()
            materialLines.dispose()
            texture.dispose()
            renderer.dispose()
            container.removeChild(renderer.domElement)
        }
    }, [])

    return <div ref={containerRef} id="mesh-container"></div>
}

export default IcoBackground
