import { useEffect, useRef } from 'react'

// bouayaben.com에서 본 "커서에 가까운 글자일수록 반대 방향으로 밀려나는"
// 효과. 글자 하나하나를 span으로 쪼개고, 각 글자의 정지 위치와 커서 사이
// 거리에 반비례하는 반발력을 매 프레임 lerp로 보간해 적용한다(레퍼런스도
// CSS transition이 아니라 이 방식이었다 — transitionDuration:0 확인함).
export function splitChars(text) {
    return text.split('').map((ch, i) => (
        <span className="magnetic-char" key={i} style={{ display: 'inline-block' }}>
            {/* inline-block 안에 스페이스 하나만 있으면 "줄 시작/끝 공백"으로
            취급돼 폭이 0으로 접힌다 — 줄바꿈 없는 공백( )을 써서 폭을 보존. */}
            {ch === ' ' ? ' ' : ch}
        </span>
    ))
}

// activateDelay: 이 글자들에 GSAP 진입 애니메이션(캐스케이드 팝업)이 걸려
// 있을 때, 그게 끝나기 전까지는 이 컴포넌트가 transform을 전혀 건드리지
// 않는다 — 둘 다 같은 .magnetic-char의 transform을 매 프레임 쓰려고 하면
// 서로 덮어써서 GSAP 애니메이션이 아예 재생이 안 되거나 뚝뚝 끊긴다.
// 지연 시간이 지난 뒤에야 정지 좌표를 재고 마우스 반발 루프를 시작한다.
export default function MagneticText({ text, className, radius = 160, strength = 22, activateDelay = 0 }) {
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        // 터치 기기(호버 없음)나 모션 최소화 설정에서는 그냥 정지 텍스트로 둔다.
        if (window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return

        const chars = Array.from(container.querySelectorAll('.magnetic-char'))
        const state = chars.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }))
        let rects = []
        let mouseX = -9999
        let mouseY = -9999
        let rafId = null
        let activateTimer = null
        let cancelled = false

        function measure() {
            rects = chars.map((el) => {
                // 지금 적용 중인 transform은 잠깐 제거하고 실제 정지 위치를 잰다 —
                // 안 그러면 이미 밀려난 상태의 좌표를 "정지 위치"로 착각하게 된다.
                const prev = el.style.transform
                el.style.transform = 'none'
                const r = el.getBoundingClientRect()
                el.style.transform = prev
                return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }
            })
        }

        function onMove(e) {
            mouseX = e.clientX
            mouseY = e.clientY
        }
        function onLeave() {
            mouseX = -9999
            mouseY = -9999
        }

        function tick() {
            for (let i = 0; i < chars.length; i++) {
                const dx = rects[i].cx - mouseX
                const dy = rects[i].cy - mouseY
                const dist = Math.hypot(dx, dy)
                if (dist < radius) {
                    const falloff = 1 - dist / radius
                    const push = falloff * strength
                    const norm = dist < 0.01 ? 1 : dist
                    state[i].tx = (dx / norm) * push
                    state[i].ty = (dy / norm) * push
                } else {
                    state[i].tx = 0
                    state[i].ty = 0
                }
                state[i].x += (state[i].tx - state[i].x) * 0.18
                state[i].y += (state[i].ty - state[i].y) * 0.18
                chars[i].style.transform = `translate(${state[i].x.toFixed(2)}px, ${state[i].y.toFixed(2)}px)`
            }
            rafId = requestAnimationFrame(tick)
        }

        function activate() {
            if (cancelled) return
            measure()
            tick()
            window.addEventListener('mousemove', onMove, { passive: true })
            window.addEventListener('resize', measure)
            container.addEventListener('mouseleave', onLeave)
        }

        if (activateDelay > 0) activateTimer = setTimeout(activate, activateDelay)
        else activate()

        return () => {
            cancelled = true
            if (rafId) cancelAnimationFrame(rafId)
            if (activateTimer) clearTimeout(activateTimer)
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('resize', measure)
            container.removeEventListener('mouseleave', onLeave)
        }
    }, [text, radius, strength, activateDelay])

    return (
        <span className={className} ref={containerRef}>
            {splitChars(text)}
        </span>
    )
}
