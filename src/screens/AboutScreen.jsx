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
    { text: ', making your own choices, and creating positive impact and value through your own power. Rather than being consumed by technology itself, I want to use it to expand ' },
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
    { date: '2013.03', type: 'EDUCATION', title: '한국외국어대학교 입학', desc: '글로벌스포츠산업학과, 컴퓨터공학 부전공' },
    { date: '2019.07', type: 'CAREER', title: '초록소프트 입사', desc: 'AI개발팀 — 열차 수요 예측, 스포츠 자세 분석 모델 개발' },
    { date: '2022.07', type: 'CAREER', title: '이마트24 입사', desc: '빅데이터/AI팀 — 전국 6,000개 점포 발주 추천 서비스 개발' },
    { date: '2025.03', type: 'CAREER', title: 'HL홀딩스 입사', desc: 'DT팀 — 해외 수입 자동차 부품 발주량 예측 모델 개발' },
    { date: '2025.08', type: 'EDUCATION', title: '고려대학교 대학원 입학', desc: '빅데이터융합학과 석사과정' },
    { date: '2026.01', type: 'CAREER', title: 'GS리테일 입사', desc: '프로모션팀 — Text-to-SQL 멀티 에이전트 설계' },
]

// 예전 Career에 쓰던 "번호 + 큰 제목 + 설명 + 우측 메타" 레이아웃(.about-row)을
// 재사용 — 모양만 먼저 보는 용도, 정확한 항목 구성은 다음에 다듬는다.
const RECOGNITION = [
    { n: '01', title: '스포츠 자세 비교·교정', desc: '인공신경망 기반 스포츠 자세 비교·교정 특허 공동 발명자 등록.', org: '대한민국특허청', date: '2021.10' },
    { n: '02', title: '운동 분석·시설 추천', desc: '딥러닝 기반 운동 분석·시설 추천 특허 공동 발명자 등록.', org: '대한민국특허청', date: '2022.04' },
    { n: '03', title: '암호화폐 분석 서비스', desc: '기계학습 기반 암호화폐 분석 서비스 특허 공동 발명자 등록.', org: '대한민국특허청', date: '2023.06' },
    { n: '04', title: '데이터분석 준전문가', desc: 'ADsP — 데이터 분석 기초 역량 자격 취득.', org: '데이터산업진흥원', date: '2025.06' },
    { n: '05', title: 'Machine Learning / Data Viz', desc: 'Stanford ML, Michigan Data Visualization 과정 수료.', org: 'Coursera', date: '2019 — 2020' },
]

const IMPACT = [
    { num: '96억', label: '발주량 예측 모델로 확인한 연간 재고·기회 손실 개선 효과' },
    { num: '80억', label: '경쟁사 분석 기반 손익 개선안 — 제시 후 TF팀 구성으로 이어짐' },
    { num: '1억 500만', label: '전국 점포 AI 추천 서비스, 11개월 운영 매출 (팀 최초 서비스화 사례)' },
    { num: '90%↓', label: '일 1억 건 데이터 파이프라인의 처리 시간·클라우드 비용 절감' },
    { num: '3건', label: '인공신경망·딥러닝·머신러닝 기반 서비스 특허 공동 발명자 등록' },
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
            const total = rect.height + vh
            const progressed = vh - rect.top
            const pct = Math.max(0, Math.min(1, progressed / total))
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

        function setActive(el) {
            yearEl.style.opacity = 0
            titleEl.style.opacity = 0
            requestAnimationFrame(() => {
                yearEl.textContent = el.dataset.year
                titleEl.textContent = el.dataset.title
                requestAnimationFrame(() => {
                    yearEl.style.opacity = 1
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

                    <section className="about-section about-philosophy-section" ref={philosophySectionRef}>
                        <div className="about-label">Philosophy</div>
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

                    <section className="about-section" ref={timelineSectionRef}>
                        <div className="about-label">Timeline</div>
                        <div className="about-timeline-wrap">
                            <div className="about-timeline-sticky">
                                <div className="about-timeline-sticky-year" ref={timelineActiveYearRef}>{TIMELINE[0].date}</div>
                                <div className="about-timeline-sticky-title" ref={timelineActiveTitleRef}>{TIMELINE[0].title}</div>
                            </div>
                            <div className="about-timeline">
                                <div className="about-timeline-track" />
                                <div className="about-timeline-progress" ref={timelineLineRef} />
                                {TIMELINE.map((t, i) => (
                                    <div className="about-timeline-item" key={i} data-year={t.date} data-title={t.title}>
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
                        <div className="about-label">Recognition</div>
                        {RECOGNITION.map((r) => (
                            <div className="about-row" key={r.n}>
                                <div className="about-row-num">{r.n}</div>
                                <div className="about-row-main">
                                    <h3>{r.title}</h3>
                                    <p>{r.desc}</p>
                                </div>
                                <div className="about-row-meta">
                                    <b>{r.org}</b>{r.date}
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="about-section">
                        <div className="about-label">Impact</div>
                        <div className="about-impact-list">
                            {IMPACT.map((it) => (
                                <div className="about-impact-row" key={it.num}>
                                    <div className="about-impact-num">{it.num}</div>
                                    <div className="about-impact-label">{it.label}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="about-section">
                        <div className="about-label">Credentials</div>
                        <div className="about-cred-grid">
                            <div>
                                <h4>Education</h4>
                                <ul>
                                    <li><b>고려대학교 대학원</b><span>빅데이터융합학과 석사 · 재학중</span></li>
                                    <li><b>한국외국어대학교</b><span>글로벌스포츠산업 / 컴퓨터공학</span></li>
                                </ul>
                            </div>
                            <div>
                                <h4>Patents</h4>
                                <ul>
                                    <li><b>스포츠 자세 비교·교정</b><span>대한민국특허청 · 2021.10</span></li>
                                    <li><b>운동 분석·시설 추천</b><span>대한민국특허청 · 2022.04</span></li>
                                    <li><b>암호화폐 분석 서비스</b><span>대한민국특허청 · 2023.06</span></li>
                                </ul>
                            </div>
                            <div>
                                <h4>Certification</h4>
                                <ul>
                                    <li><b>데이터분석 준전문가(ADsP)</b><span>2025.06</span></li>
                                    <li><b>Stanford ML / Michigan Data Viz</b><span>Coursera</span></li>
                                    <li><b>뉴욕·LA 어학연수 및 다국적 인턴십</b><span>PYD · 2014 — 2015</span></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <footer className="about-footer">
                        <div className="about-sig">Shin SeungYun</div>
                        <div className="about-sig-sub">Data Scientist · AI Engineer — Seoul, Korea</div>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default AboutScreen
