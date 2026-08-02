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
        }).to('.overlay-top', {
            duration: 0.6,
            scaleY: 0,
            ease: 'expo.inOut',
            stagger: { amount: 0.5 },
            transformOrigin: 'top',
        }, 2.1).from('.header-container', {
            duration: 1.6,
            y: -70,
            opacity: 0,
            ease: 'power4.out',
        }).to('.overlay-container', {
            opacity: 0,
            display: 'none',
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
        }).to('.overlay-bottom', {
            duration: 0.6,
            scaleY: 0,
            ease: 'expo.inOut',
            stagger: { amount: 0.5, from: 'end' },
            transformOrigin: 'bottom',
        }, 2.1).from('.mainfooter-container', {
            duration: 1.6,
            y: 70,
            opacity: 0,
            ease: 'power4.out',
        })

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
