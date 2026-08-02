import { useEffect } from 'react'
import gsap from 'gsap'

import IntroOverlay from '../components/IntroOverlay'
import MainFooter from '../components/MainFooter'
import { icoTransition } from '../lib/icoBus'

// 글자 단위로 쪼개야 stagger가 "덩어리 슬라이드"가 아니라 글자 하나씩
// 캐스케이드로 들어오는 것처럼 보인다.
function splitChars(text) {
    return text.split('').map((ch, i) => (
        <span className="char" key={i}>{ch === ' ' ? ' ' : ch}</span>
    ))
}

function MainScreen() {

    useEffect(() => {
        icoTransition('reset')

        const ctx = gsap.context(() => {

        const tl = gsap.timeline()
        const tl2 = gsap.timeline()

        tl.from('.main-title .char', {
            duration: 1.4,
            y: 100,
            ease: 'power4.out',
            delay: 1,
            skewY: 7,
            stagger: { amount: 0.5 },
            opacity: 0,
        // 글자는 리듬감 있게 등장하고, 그 뒤에서 배경/헤더/푸터는 패널이
        // 걷히는 대신 아주 느리고 은은하게 스며나오도록 한다.
        }).to('.overlay-container', {
            duration: 2.8,
            opacity: 0,
            ease: 'sine.inOut',
        }, 1.2).set('.overlay-container', {
            display: 'none',
        }).from('.header-container', {
            duration: 1.6,
            y: -70,
            opacity: 0,
            ease: 'power4.out',
        })

        // UNDEFINED는 CREATOR보다 살짝 늦게 시작해 두 줄이 동시에 뜨는 대신
        // 어긋나는 리듬으로 들어온다.
        tl2.from('.sub-title .char', {
            duration: 1.4,
            y: 100,
            ease: 'power4.out',
            delay: 1.3,
            skewY: 7,
            stagger: { amount: 0.6 },
            opacity: 0,
        }).from('.mainfooter-container', {
            duration: 1.6,
            y: 70,
            opacity: 0,
            ease: 'power4.out',
        }, 4.15)

        })

        return () => ctx.revert()
    }, [])

    return (
        <>
            <IntroOverlay />
            <div className="main-title-section">
                <div className="main-text-container">
                    <div className="main-title-wraper">
                        <div className="main-title">{splitChars('CREATOR')}</div>
                    </div>
                    <div className="sub-title-wraper">
                        <div className="sub-title">{splitChars('UNDEFINED')}</div>
                    </div>
                </div>
            </div>
            <MainFooter />
        </>
    )
}

export default MainScreen
