import { useEffect, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import { icoTransition } from '../lib/icoBus'
import ScrollGauge from '../components/ScrollGauge'
import { WORKS, findWork } from '../assets/data/works'
import { WORK_VIZ } from '../assets/data/workViz'

// 데이터 문자열의 **...** 를 강조로 바꾼다 — 데이터 파일에 JSX를 섞지 않기 위해.
function emph(text) {
    return text.split('**').map((s, i) => (i % 2 ? <strong key={i}>{s}</strong> : s))
}

// 제목은 목록에서 날아오고(layoutId), 나머지는 그 뒤를 따라 순서대로 떠오른다.
const rise = (delay) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
})

function WorkDetailScreen() {
    const { id } = useParams()
    const work = findWork(id)
    const wrapperRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        icoTransition('hide')
    }, [])

    useEffect(() => {
        if (!wrapperRef.current || !contentRef.current) return
        const lenis = new Lenis({
            wrapper: wrapperRef.current,
            content: contentRef.current,
            duration: 1.1,
            smoothWheel: true,
        })
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

    if (!work) return <Navigate to="/WorkScreen" replace />

    const idx = WORKS.indexOf(work)
    const prev = WORKS[idx - 1]
    const next = WORKS[idx + 1]

    return (
        <div className="about-screen" ref={wrapperRef}>
            <ScrollGauge containerRef={wrapperRef} />
            <div className="about-content" ref={contentRef}>
                <div className="about-wrap">
                    <section className="about-section work-detail">
                        <motion.div {...rise(0.1)}><Link to="/WorkScreen" className="work-back">← All Work</Link></motion.div>

                        <motion.div className="work-detail-head" {...rise(0.15)}>
                            <span className="work-row-idx">{String(idx + 1).padStart(2, '0')}</span>
                            <span className="work-row-period">{work.period}</span>
                        </motion.div>

                        <motion.div className="work-detail-metrics" {...rise(0.25)}>
                            {work.status ? (
                                <div>
                                    <div className="work-detail-status">{work.status.label}</div>
                                    <div className="work-detail-num-cap">{work.status.cap}</div>
                                </div>
                            ) : work.metrics?.map((m) => (
                                <div key={m.num}>
                                    <div className={m.long ? 'work-detail-num work-detail-num--long' : 'work-detail-num'}>{m.num}</div>
                                    <div className="work-detail-num-cap">{m.cap}</div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div className="work-row-tag" {...rise(0.3)}>{work.tag}</motion.div>
                        <motion.h1 className="work-detail-title" layoutId={`work-title-${work.id}`} layout="position"
                            transition={{ type: 'spring', stiffness: 220, damping: 30 }}>{work.title}</motion.h1>
                        <motion.p className="work-detail-brief" {...rise(0.4)}>{work.brief}</motion.p>

                        {/* 서비스 흐름("무엇을 해주나")과 아키텍처("어떻게 만들었나")를
                            좌우로 나란히. 서비스 도식이 없는 프로젝트는 기본 도식 하나만. */}
                        <motion.div className={WORK_VIZ[`${work.id}-service`] ? 'work-detail-viz is-pair' : 'work-detail-viz'} {...rise(0.48)}>
                            {WORK_VIZ[`${work.id}-service`] && (
                                <figure className="wdv">
                                    <div className="wdv-frame">{WORK_VIZ[`${work.id}-service`]}</div>
                                    <figcaption className="wdv-cap">Service flow — ask in plain language, get an answer</figcaption>
                                </figure>
                            )}
                            <figure className="wdv">
                                <div className="wdv-frame">{WORK_VIZ[work.id]}</div>
                                <figcaption className="wdv-cap">Architecture — how it is built</figcaption>
                            </figure>
                        </motion.div>

                        <motion.div className="work-detail-cols" {...rise(0.6)}>
                            <div className="work-sub">
                                <div className="work-sub-label">Key Results</div>
                                <ul className="work-list">
                                    {work.results.map((r, i) => <li key={i}>{emph(r)}</li>)}
                                </ul>
                            </div>
                            <div className="work-sub">
                                <div className="work-sub-label">Implementation</div>
                                <ul className="work-list">
                                    {work.impl.map((r, i) => <li key={i}>{emph(r)}</li>)}
                                </ul>
                            </div>
                        </motion.div>

                        <motion.nav className="work-detail-nav" {...rise(0.72)}>
                            {prev
                                ? <Link to={`/WorkScreen/${prev.id}`} className="work-detail-nav-link"><span className="work-detail-nav-cap">← Previous</span><span>{prev.title}</span></Link>
                                : <span />}
                            {next
                                ? <Link to={`/WorkScreen/${next.id}`} className="work-detail-nav-link work-detail-nav-link--next"><span className="work-detail-nav-cap">Next →</span><span>{next.title}</span></Link>
                                : <span />}
                        </motion.nav>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default WorkDetailScreen
