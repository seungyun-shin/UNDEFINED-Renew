import { useEffect } from 'react'
import gsap from 'gsap'

import IntroOverlay from '../components/IntroOverlay'
import MainFooter from '../components/MainFooter'
import { icoTransition } from '../lib/icoBus'

function MainScreen() {

    useEffect(() => {
        icoTransition('reset')

        const ctx = gsap.context(() => {

        const tl = gsap.timeline()
        const tl2 = gsap.timeline()

        tl.from('.main-title', {
            duration: 1.8,
            y: 100,
            ease: 'power4.out',
            delay: 1,
            skewY: 7,
            stagger: { amount: 0.3 },
            opacity: 0,
        }).to('.overlay-top', {
            duration: 0.6,
            scaleY: 0,
            ease: 'expo.inOut',
            stagger: 0.4,
            transformOrigin: 'top',
        }).from('.header-container', {
            duration: 1.6,
            y: -70,
            opacity: 0,
            ease: 'power4.out',
        }).to('.overlay-container', {
            opacity: 0,
            display: 'none',
        })

        tl2.from('.sub-title', {
            duration: 1.8,
            y: 100,
            ease: 'power4.out',
            delay: 1,
            skewY: 7,
            stagger: { amount: 0.3 },
            opacity: 0,
        }).to('.overlay-bottom', {
            duration: 0.6,
            scaleY: 0,
            ease: 'expo.inOut',
            stagger: 0.4,
            transformOrigin: 'bottom',
        }).from('.mainfooter-container', {
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
                        <div className="main-title">CREATOR</div>
                    </div>
                    <div className="sub-title-wraper">
                        <div className="sub-title">UNDEFINED</div>
                    </div>
                </div>
            </div>
            <MainFooter />
        </>
    )
}

export default MainScreen
