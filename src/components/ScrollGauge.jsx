import { useEffect, useRef } from 'react'

// 네이티브 스크롤바를 숨긴 페이지(About, 갤러리)에서 대신 쓰는 커스텀
// 스크롤 진행 표시. Lenis가 wrapper 엘리먼트에 실제 scroll 이벤트를 쏴주기
// 때문에(Header.jsx의 숨김 로직과 같은 전제), 여기서도 평범한 scroll
// 리스너로 진행률만 계산해서 채움 높이에 반영한다 — rAF 루프 필요 없다.
export default function ScrollGauge({ containerRef }) {
    const fillRef = useRef(null)

    useEffect(() => {
        const el = containerRef.current
        const fill = fillRef.current
        if (!el || !fill) return

        function update() {
            const max = el.scrollHeight - el.clientHeight
            const pct = max > 0 ? el.scrollTop / max : 0
            fill.style.height = `${(Math.max(0, Math.min(1, pct)) * 100).toFixed(2)}%`
        }
        update()
        el.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        return () => {
            el.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [containerRef])

    return (
        <div className="scroll-gauge" aria-hidden="true">
            <div className="scroll-gauge-track" />
            <div className="scroll-gauge-fill" ref={fillRef} />
        </div>
    )
}
