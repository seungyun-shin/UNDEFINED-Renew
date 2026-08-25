import { useEffect, useLayoutEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { icoTransition } from '../lib/icoBus'
import MagneticText from '../components/MagneticText'
import ScrollGauge from '../components/ScrollGauge'

// MagneticText가 만드는 글자 span(.magnetic-char)에 GSAP 진입 애니메이션을
// 걸고 나면, MagneticText 자신의 마우스 반발 루프가 같은 transform을 매
// 프레임 덮어써 애니메이션이 재생되지 않는다 — 이 시간이 지난 뒤에야
// MagneticText가 좌표를 재고 반발 루프를 시작하도록 넉넉히 잡는다.
const HERO_REVEAL_ACTIVATE_DELAY = 1900

// 마블 그라디언트/텍스처 클립 둘 다 시도했지만 "촌스럽다"는 피드백 —
// 이 페이지는 브라스 단색 포인트 하나로 절제하는 톤이라, 화려한 다색
// 텍스트 채우기 자체가 톤에 안 맞았다. 단색(.about-hero-role의 CSS
// color)으로 되돌림.

// 철학 문구 — 세 문장을 번호 없이 하나로 흐르는 글로 보여준다. 세그먼트로
// 나눠둔 이유는 강조 구절(accent)마다 다른 스타일을 입히면서도, 전체를
// 글자 단위로 쪼개 캐스케이드 애니메이션을 걸어야 하기 때문이다.
const PHILOSOPHY_SEGMENTS = [
    { text: 'Rather than the path I once believed would lead to happiness, I choose to focus on ' },
    { text: 'happiness itself', accent: true },
    { text: ". Independence isn't living alone — it's a state of setting " },
    { text: 'your own standards', accent: true },
    { text: ', making your own choices, and creating positive impact and value through your own agency. Rather than being consumed by technology itself, I want to use it to expand ' },
    { text: "people's choices", accent: true },
    { text: ' and help move life in a better direction.' },
]

// 세그먼트를 글자 단위로 평탄화 — 각 글자가 자기 세그먼트의 accent 여부를
// 그대로 물려받는다. 스페이스는 inline-block 안에서 폭이 0으로 접히는
// CSS 함정(MagneticText에서 이미 겪음)을 피하려고 줄바꿈 없는 공백으로.
const PHILOSOPHY_CHARS = PHILOSOPHY_SEGMENTS.flatMap((seg, si) =>
    seg.text.split('').map((ch, ci) => ({
        ch: ch === ' ' ? ' ' : ch,
        accent: !!seg.accent,
        key: `${si}-${ci}`,
    }))
)

// 일단 학교·회사 이력만. 특허/발표 등은 다음 세션에 추가 예정 —
// 지금은 순수 EDUCATION/CAREER 타임라인으로 단순하게 유지한다.
const TIMELINE = [
    { date: '2013.03 — 2020.08', type: 'EDUCATION', title: 'Hankuk University of Foreign Studies', desc: 'Major in Global Sports Industry, Computer Science' },
    { date: '2014.03 — 2015.03', type: 'INTERNSHIP', title: 'New York PYD Internship', desc: 'Multinational internship in New York / LA, USA' },
    { date: '2015.08 — 2017.05', type: 'MILITARY', title: 'Military Service', desc: 'Sergeant, Republic of Korea Army — honorably discharged' },
    { date: '2018.07 — 2018.09', type: 'INTERNSHIP', title: '2018 Asian Games — Jakarta-Palembang', desc: 'System operations support and interpretation, SsangYong Information & Communications Corp.' },
    { date: '2019.07 — 2022.06', type: 'CAREER', title: 'Chorok Soft', desc: 'AI Development Team — AI models for KORAIL train demand forecasting and sports posture analysis' },
    { date: '2022.07 — 2025.03', type: 'CAREER', title: 'emart24', desc: 'Big Data / AI Team — AI-based replenishment recommendation for stores nationwide, large-scale data pipeline optimization' },
    { date: '2025.03 — 2025.12', type: 'CAREER', title: 'HL Holdings', desc: 'DT Team — AI-based order forecasting model for imported auto parts' },
    { date: '2025.08 — Present', type: 'EDUCATION', title: 'Korea University Graduate School', desc: 'Big Data Convergence (M.S.)' },
    { date: '2026.01 — Present', type: 'CAREER', title: 'GS Retail', desc: 'Promotion Team — AI Multi-Agent Development, Workflow Automation, Data Analysis' },
]

const PATENTS = [
    { n: '01', title: 'Apparatus and Method for Comparing and Correcting Sports Posture Using Artificial Neural Network', desc: 'Registered as co-inventor', org: 'Ministry of Intellectual Property', orgKr: '지식재산처', date: '2021.10' },
    { n: '02', title: 'Method and Apparatus for Providing Deep Learning-Based Exercise Analysis and Sports Facility Recommendation Service', desc: 'Registered as co-inventor', org: 'Ministry of Intellectual Property', orgKr: '지식재산처', date: '2022.04' },
    { n: '03', title: 'Method and Apparatus for Providing Machine Learning-Based Cryptocurrency Analysis Service for Predicting Price and Trading Volume and Evaluating Value', desc: 'Registered as co-inventor', org: 'Ministry of Intellectual Property', orgKr: '지식재산처', date: '2023.06' },
]

// 어느 회사·어떤 시스템이었는지가 아니라, 사업적으로 무슨 일을 만들어냈는지만
// 한 문장씩 담는다 — 회사명/부서명/기술스택 언급 없이.
const IMPACT = [
    { num: '₩105M', tag: 'Revenue Generated', text: 'Revenue generated within 11 months by an AI-powered recommendation system used by 6,000+ independent store owners nationwide.' },
    { num: '₩9.6B', tag: 'Annual Savings Identified', text: 'Annual inventory and opportunity-cost savings identified through a demand-forecasting model.' },
    { num: '30 min', tag: 'Down from 200 Hrs/Month', text: 'A manual review process automated using a free, open-source AI model — cutting 200 hours of monthly work down to 30 minutes at zero added cost.' },
    { num: '640 hrs', tag: 'Saved per Month', text: 'A single AI system that automated a manual task across 1,200 people and 128 teams nationwide, eliminating around 640 hours of work a month and saving roughly ₩275M a year.' },
    { num: '90%', tag: 'Cost Reduction', text: 'Processing time and cloud costs cut on a data pipeline handling 100M+ records a day.' },
    { num: '20+', tag: 'AI Projects Delivered', text: 'Completed 20+ AI and machine learning projects across 4+ industries — from transportation and sports to finance and real estate.' },
]

function AboutScreen() {
    const wrapperRef = useRef(null)
    const contentRef = useRef(null)
    const philosophySectionRef = useRef(null)
    const timelineSectionRef = useRef(null)
    const timelineLineRef = useRef(null)
    const timelineActiveYearRef = useRef(null)
    const timelineActiveTitleRef = useRef(null)

    // 지구본/갤러리와 동일하게, 이 화면을 보는 동안 마블 배경 렌더 루프를 멈춘다.
    useEffect(() => {
        icoTransition('hide')
    }, [])

    // 타임라인 세로선이 스크롤 진행률만큼 위에서부터 "그려지는" 효과.
    // rAF 루프가 아니라 scroll 이벤트에서 바로 계산해서 딱 한 번만 스타일을
    // 쓴다(연속 애니메이션이 아니라 스크롤량에 직접 연동되는 값이라 rAF로
    // 매 프레임 다시 그릴 필요가 없다 — 필요할 때만 계산하는 게 더 싸다).
    useEffect(() => {
        const scrollEl = wrapperRef.current
        const section = timelineSectionRef.current
        const line = timelineLineRef.current
        if (!scrollEl || !section || !line) return

        function update() {
            const rect = section.getBoundingClientRect()
            const vh = window.innerHeight
            // sticky 연도가 "뷰포트 정중앙을 지나는 항목"을 기준으로 바뀌므로
            // (아래 IntersectionObserver, rootMargin -45%/-45%), 게이지도 같은
            // 기준(뷰포트 정중앙)으로 맞춘다 — 0% = 섹션 맨 위가 정중앙에 닿는
            // 시점, 100% = 섹션 맨 아래가 정중앙에 닿는 시점(마지막 항목이
            // sticky에 뜨는 시점). 기준점이 다르면(위/아래 끝 vs 정중앙) 같은
            // 스크롤량에도 두 게이지가 서로 다른 속도로 채워지는 것처럼 보인다.
            const pct = rect.height > 0
                ? Math.max(0, Math.min(1, (vh / 2 - rect.top) / rect.height))
                : 1
            line.style.height = `${(pct * 100).toFixed(2)}%`
        }
        update()
        scrollEl.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        return () => {
            scrollEl.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [])

    // 철학 문구 — MainScreen 인트로와 같은 글자 단위 캐스케이드(y+skewY+
    // power4.out)를, 페이지 로드 시가 아니라 스크롤로 화면에 들어오는
    // 시점에 한 번만 재생한다. useLayoutEffect로 미리 숨겨둬야(gsap.set)
    // 페인트 전에 감춰진 상태가 잡혀서, IntersectionObserver가 트리거하기
    // 전에 완성된 문장이 잠깐 보였다 사라지는 깜빡임이 없다.
    useLayoutEffect(() => {
        gsap.set('.about-philosophy .philo-char', { opacity: 0, y: 40, skewY: 5 })
    }, [])

    useEffect(() => {
        const el = philosophySectionRef.current?.querySelector('.about-philosophy')
        if (!el) return
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return
                    gsap.to('.about-philosophy .philo-char', {
                        opacity: 1, y: 0, skewY: 0,
                        duration: 1.1, ease: 'power4.out', stagger: { amount: 1.4 },
                    })
                    io.disconnect()
                })
            },
            { threshold: 0.3 }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    // 타임라인 항목들이 스크롤해서 뷰포트에 들어올 때 하나씩 떠오르며
    // 나타난다 — IntersectionObserver라 스크롤 이벤트마다 계산하지 않고
    // 뷰포트 진입/이탈 시점에만 반응해 가장 싸다.
    useEffect(() => {
        const items = timelineSectionRef.current?.querySelectorAll('.about-timeline-item')
        if (!items || items.length === 0) return
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('in')
                })
            },
            { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
        )
        items.forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [])

    // 옆에 고정된(sticky) 연도/직함 라벨이 지금 화면 중앙에 걸쳐있는 항목을
    // 따라간다. rootMargin으로 뷰포트 중앙 45%~55% 밴드만 감지 영역으로
    // 좁혀서, 그 밴드를 지나는 항목이 바뀔 때만 갱신된다 — React state로
    // 리렌더하지 않고 ref로 텍스트/opacity를 직접 써서 스크롤 중 리렌더
    // 비용이 없다.
    useEffect(() => {
        const items = timelineSectionRef.current?.querySelectorAll('.about-timeline-item')
        const yearEl = timelineActiveYearRef.current
        const titleEl = timelineActiveTitleRef.current
        if (!items || items.length === 0 || !yearEl || !titleEl) return

        // 연도가 바뀔 때 숫자가 기계식 카운터처럼 위로 굴러가며 다음 숫자로
        // 바뀌는 오도미터 효과. 자리(digit)별로 값이 실제로 달라질 때만
        // 굴린다 — 예를 들어 2022→2025는 앞 두 자리("20")는 그대로 두고
        // 뒤 두 자리만 굴러간다.
        function rollYear(newYear) {
            const slots = yearEl.querySelectorAll('.about-timeline-sticky-digit')
            newYear.split('').forEach((newDigit, i) => {
                const slot = slots[i]
                const current = slot?.querySelector('.digit-current')
                if (!current || current.textContent === newDigit) return
                // 이전 전환이 채 끝나기 전에 빠르게 스크롤해서 다시 호출되면
                // 남아있는 outgoing 잔상부터 정리해야 숫자가 겹쳐 보이지 않는다.
                slot.querySelectorAll('.digit-outgoing').forEach((el) => {
                    gsap.killTweensOf(el)
                    el.remove()
                })
                gsap.killTweensOf(current)
                const clone = current.cloneNode(true)
                clone.classList.remove('digit-current')
                clone.classList.add('digit-outgoing')
                slot.appendChild(clone)
                gsap.set(current, { y: '110%' })
                current.textContent = newDigit
                gsap.to(clone, { y: '-110%', duration: 0.5, ease: 'power2.inOut', onComplete: () => clone.remove() })
                gsap.to(current, { y: '0%', duration: 0.5, ease: 'power2.inOut' })
            })
        }

        function setActive(el) {
            rollYear(el.dataset.year)
            titleEl.style.opacity = 0
            requestAnimationFrame(() => {
                titleEl.textContent = el.dataset.title
                requestAnimationFrame(() => {
                    titleEl.style.opacity = 1
                })
            })
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target)
                })
            },
            { threshold: 0, rootMargin: '-45% 0px -45% 0px' }
        )
        items.forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [])

    // 히어로 캐스케이드 리빌 — MainScreen의 CREATOR/UNDEFINED 인트로와 같은
    // 스타일(글자 단위 stagger + y + skewY + power4.out, "아래에서 튀어
    // 오르는" 느낌)을, eyebrow → 이름 → 타이틀 → 문장 → SCROLL 순서로
    // 블록마다 시차를 두고 이어붙였다. useLayoutEffect라 페인트 전에
    // 초기 상태(투명·아래로 이동)가 잡혀서 깜빡임이 없다.
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline()
            tl.from('.about-eyebrow .magnetic-char', {
                y: 34, skewY: 6, opacity: 0, duration: 1.0, ease: 'power4.out', stagger: { amount: 0.3 },
            }, 0)
                .from('.about-hero-name .magnetic-char', {
                    y: 90, skewY: 7, opacity: 0, duration: 1.3, ease: 'power4.out', stagger: { amount: 0.45 },
                }, 0.15)
                .from('.about-hero-role .magnetic-char', {
                    y: 90, skewY: 7, opacity: 0, duration: 1.3, ease: 'power4.out', stagger: { amount: 0.45 },
                }, 0.32)
                .from('.about-hero-sub .magnetic-char', {
                    y: 34, skewY: 5, opacity: 0, duration: 1.0, ease: 'power4.out', stagger: { amount: 0.4 },
                }, 0.55)
                .from('.about-hero-sub-en .magnetic-char', {
                    y: 26, skewY: 4, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: { amount: 0.35 },
                }, 0.75)
                .from('.about-scroll-cue', {
                    y: 20, opacity: 0, duration: 0.8, ease: 'power4.out',
                }, 0.95)
        })
        return () => ctx.revert()
    }, [])

    // Lenis를 이 페이지의 스크롤 컨테이너에만 스코프해서 붙인다 — 사이트
    // 전체(지구본/갤러리)의 네이티브 스크롤 감각과 성능 특성을 건드리지
    // 않고, 이 페이지에서만 실험적으로 관성 스크롤을 적용해보기 위함이다.
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

    return (
        <div className="about-screen" ref={wrapperRef}>
            <ScrollGauge containerRef={wrapperRef} />
            <div className="about-content" ref={contentRef}>
                <div className="about-wrap">
                    <div className="about-hero">
                        <div className="about-eyebrow">
                            <MagneticText text="Data Scientist · AI Engineer · AI Service Builder" radius={30} strength={4} activateDelay={HERO_REVEAL_ACTIVATE_DELAY} />
                        </div>
                        <h1 className="about-hero-title about-hero-name">
                            <MagneticText text="Seungyun Shin" activateDelay={HERO_REVEAL_ACTIVATE_DELAY} />
                        </h1>
                        <div className="about-hero-title about-hero-role">
                            <MagneticText text="Independence Builder" activateDelay={HERO_REVEAL_ACTIVATE_DELAY} />
                        </div>
                        <p className="about-hero-sub">
                            <MagneticText text="데이터와 AI로 더 나은 삶의 방식을 만들고" radius={50} strength={7} activateDelay={HERO_REVEAL_ACTIVATE_DELAY} /><br />
                            <MagneticText text="스스로 가치를 창출하며 독립적인 삶을 구축합니다." radius={50} strength={7} activateDelay={HERO_REVEAL_ACTIVATE_DELAY} />
                        </p>
                        <p className="about-hero-sub-en">
                            <MagneticText text="Building a better way of life with data and AI," radius={40} strength={5} activateDelay={HERO_REVEAL_ACTIVATE_DELAY} /><br />
                            <MagneticText text="creating value on my own terms toward independence." radius={40} strength={5} activateDelay={HERO_REVEAL_ACTIVATE_DELAY} />
                        </p>
                        <div className="about-scroll-cue">
                            <span className="about-scroll-cue-pulse">SCROLL</span>
                        </div>
                    </div>

                    <section className="about-section" ref={timelineSectionRef}>
                        <div className="about-label">Timeline</div>
                        <div className="about-timeline-wrap">
                            <div className="about-timeline-sticky">
                                <div className="about-timeline-sticky-year" ref={timelineActiveYearRef}>
                                    {TIMELINE[0].date.slice(0, 4).split('').map((d, i) => (
                                        <span className="about-timeline-sticky-digit" key={i}>
                                            <span className="digit-current">{d}</span>
                                        </span>
                                    ))}
                                </div>
                                <div className="about-timeline-sticky-title" ref={timelineActiveTitleRef}>{TIMELINE[0].title}</div>
                            </div>
                            <div className="about-timeline">
                                <div className="about-timeline-track" />
                                <div className="about-timeline-progress" ref={timelineLineRef} />
                                {TIMELINE.map((t, i) => (
                                    <div className="about-timeline-item" key={i} data-year={t.date.slice(0, 4)} data-title={t.title}>
                                        <span className="about-timeline-ghost" aria-hidden="true">{t.date.slice(0, 4)}</span>
                                        <div className="about-timeline-node" />
                                        <div className="about-timeline-date">{t.date}</div>
                                        <div className="about-timeline-type">{t.type}</div>
                                        <h3>{t.title}</h3>
                                        <p>{t.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <div className="about-label">Patents</div>
                        {PATENTS.map((p) => (
                            <div className="about-row" key={p.n}>
                                <div className="about-row-num">{p.n}</div>
                                <div className="about-row-main">
                                    <div className="about-row-tag">Patent</div>
                                    <h3>{p.title}</h3>
                                    <p>{p.desc}</p>
                                </div>
                                <div className="about-row-meta">
                                    <b>{p.org}</b>
                                    <span className="about-row-meta-kr">{p.orgKr}</span>
                                    {p.date}
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="about-section">
                        <div className="about-label">Footprint</div>
                        <div className="about-impact-list">
                            {IMPACT.map((it, i) => (
                                <div className="about-impact-line" key={i}>
                                    <div className="about-impact-line-figure">
                                        <div className="about-impact-line-num">{it.num}</div>
                                        <div className="about-impact-line-tag">{it.tag}</div>
                                    </div>
                                    <p>{it.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="about-section about-philosophy-section" ref={philosophySectionRef}>
                        <div className="about-label">Compass</div>
                        <p className="about-philosophy">
                            {PHILOSOPHY_CHARS.map((c) => (
                                <span
                                    key={c.key}
                                    className={c.accent ? 'philo-char about-accent' : 'philo-char'}
                                    style={{ display: 'inline-block' }}
                                >
                                    {c.ch}
                                </span>
                            ))}
                        </p>
                    </section>

                    <section className="about-section about-contact-section">
                        <div className="about-label">Contact</div>
                        <footer className="about-contact-composition">
                            <p className="about-contact-lead">Feel free to reach out.</p>
                            <div className="about-sig">Shin SeungYun</div>
                            <div className="about-sig-sub">Data Scientist · AI Engineer — Seoul, Korea</div>
                            <a className="about-contact-email-link" href="mailto:seungyun-shin@gmail.com">
                                <span className="about-contact-email">seungyun-shin@gmail.com</span>
                            </a>
                        </footer>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default AboutScreen
