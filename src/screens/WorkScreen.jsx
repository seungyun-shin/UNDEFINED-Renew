import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import { icoTransition } from '../lib/icoBus'
import ScrollGauge from '../components/ScrollGauge'
import { WORKS, WORK_CATS } from '../assets/data/works'
import { WORK_VIZ } from '../assets/data/workViz'

// WORK 인덱스 — 카드마다 그 프로젝트의 도식이 주인공이고, 제목·지표는 아래로
// 물러난다. 카드 크기는 전부 동일하게 2열로 — 크기를 섞으면 오히려 어수선해진다.
// 상단 필터로 종류별(에이전트/모델링/자동화/비전·NLP/데이터)로 좁혀 볼 수 있다.

function metricOf(w) {
    if (w.status) return w.status.label
    if (w.metrics) return w.metrics[0].num
    return ''
}
const isStatus = (s) => !/[0-9]/.test(s)
function capOf(w) {
    if (w.status) return w.status.cap
    if (w.metrics) return w.metrics[0].cap
    return w.period
}

function WorkScreen() {
    const wrapperRef = useRef(null)
    const contentRef = useRef(null)
    const gridRef = useRef(null)
    const [cat, setCat] = useState('all')

    const shown = useMemo(
        () => (cat === 'all' ? WORKS : WORKS.filter((w) => w.cat === cat)),
        [cat]
    )
    const countOf = (id) => (id === 'all' ? WORKS.length : WORKS.filter((w) => w.cat === id).length)

    useEffect(() => {
        icoTransition('hide')
    }, [])

    // 카드가 뷰포트에 들어올 때 나타나고, 그때 도식 애니메이션이 시작되도록
    // .in을 붙인다(처음부터 다 그려두면 스크롤 전에 끝나버린다).
    // 단 첫 4개는 관찰을 거치지 않고 바로 보여준다 — 2행째가 화면에 걸쳐만
    // 있으면 관찰 조건(18% 노출)을 못 넘겨 투명한 채로 남아 썰렁해 보였다.
    const EAGER = 4
    useEffect(() => {
        const cards = gridRef.current?.querySelectorAll('.wcard')
        if (!cards || cards.length === 0) return

        const rest = []
        cards.forEach((el, i) => {
            if (i < EAGER) el.classList.add('in')
            else rest.push(el)
        })
        if (rest.length === 0) return

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('in')
                        io.unobserve(e.target)
                    }
                })
            },
            { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
        )
        rest.forEach((el) => io.observe(el))
        return () => io.disconnect()
        // 필터가 바뀌면 카드가 새로 마운트되므로 관찰을 다시 건다.
    }, [cat])

    // About과 같은 이유로 Lenis를 이 페이지 스크롤 컨테이너에만 붙인다.
    useEffect(() => {
        if (!wrapperRef.current || !contentRef.current) return
        const lenis = new Lenis({ wrapper: wrapperRef.current, content: contentRef.current, duration: 1.1, smoothWheel: true })
        let rafId
        function raf(time) {
            lenis.raf(time)
            rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)
        return () => {
            cancelAnimationFrame(rafId)
            lenis.destroy()
        }
    }, [])

    return (
        <div className="about-screen work-screen" ref={wrapperRef}>
            <ScrollGauge containerRef={wrapperRef} />
            <div className="about-content" ref={contentRef}>
                <div className="work-wrap">
                    <div className="work-filter">
                        {WORK_CATS.map((c) => (
                            <button
                                type="button"
                                key={c.id}
                                className={c.id === cat ? 'wfilter is-on' : 'wfilter'}
                                onClick={() => setCat(c.id)}
                            >
                                {c.label}
                                <span className="wfilter-n">{countOf(c.id)}</span>
                            </button>
                        ))}
                    </div>

                    <div className="work-grid" ref={gridRef} key={cat}>
                        {shown.map((w) => {
                            const i = WORKS.indexOf(w)
                            const m = metricOf(w)
                            return (
                                <Link to={`/WorkScreen/${w.id}`} className="wcard" key={w.id}>
                                    {/* 목록에서는 "무엇을 해주는 서비스인지"가 먼저 와닿아야 한다 —
                                        서비스 흐름 도식이 있으면 그걸 쓰고, 없으면 기본 도식. */}
                                    <span className="wcard-viz">{WORK_VIZ[`${w.id}-service`] || WORK_VIZ[w.id]}</span>
                                    <span className="wcard-meta">
                                        <span className="wcard-l">
                                            <span className="wcard-tag">{w.tag}</span>
                                            <motion.span className="wcard-title" layoutId={`work-title-${w.id}`} layout="position">
                                                {w.title}
                                            </motion.span>
                                            <span className="wcard-brief">{w.brief}</span>
                                        </span>
                                        <span className="wcard-r">
                                            <span className={isStatus(m) ? 'wcard-num is-status' : 'wcard-num'}>{m}</span>
                                            <span className="wcard-cap">{capOf(w)}</span>
                                        </span>
                                    </span>
                                    <span className="wcard-idx">{String(i + 1).padStart(2, '0')}</span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="work-foot">
                        <span>{cat === 'all' ? `${WORKS.length} projects · 2019 — present` : `${shown.length} of ${WORKS.length} projects`}</span>
                        <Link to="/AboutMe">About →</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkScreen
