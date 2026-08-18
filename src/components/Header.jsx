import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { icoTransition } from '../lib/icoBus'

// 갤러리/ABOUT처럼 실제로 세로 스크롤이 있는 페이지에서만: 아래로 스크롤하면
// 헤더가 위로 슬라이드아웃되고, 위로 스크롤하면 다시 나타난다. 두 화면 다
// position:fixed + 자체 overflow-y(About은 Lenis)로 스크롤되는 컨테이너라
// window가 아니라 그 컨테이너에 직접 리스너를 건다. 페이지 맨 위 근처에서는
// 방향과 무관하게 항상 보이게 해서 "처음엔 살짝 내렸는데 바로 숨는" 어색함을
// 막는다.
const SCROLL_HIDE_SELECTORS = {
    '/MemoryPhotoGallery': '.memory-gallery',
    '/AboutMe': '.about-screen',
}

// MEMORY는 EarthScreen이 마운트되면서 자기 hide 트랜지션을 직접 거는데,
// 여기서 zoomHide까지 같이 쏘면 막 시작된 다이브 애니메이션을 EarthScreen의
// hide가 곧바로 덮어써버려 두 트랜지션이 충돌했다. mode를 비워서 EarthScreen
// 쪽 트랜지션 하나만 걸리게 한다.
const MENUS = [
    { label: 'WORK', to: '/WorkScreen', mode: 'zoom' },
    { label: 'SHOP', to: '/ShopScreen', mode: 'zoom' },
    { label: 'RECORD', to: '/RecordScreen', mode: 'zoom' },
    { label: 'MEMORY', to: '/MemoryScreen', mode: null },
    { label: 'ABOUT', to: '/AboutMe', mode: 'zoomHide' },
    { label: 'Login', to: '/login', mode: 'zoom' },
]

function Header() {
    const [click, setClick] = useState(false)
    const [hidden, setHidden] = useState(false)
    const location = useLocation()
    const isGallery = location.pathname === '/MemoryPhotoGallery'

    const onMenuClick = (mode) => {
        setClick(false)
        if (mode) icoTransition(mode)
    }

    useEffect(() => {
        const selector = SCROLL_HIDE_SELECTORS[location.pathname]
        if (!selector) { setHidden(false); return }

        const el = document.querySelector(selector)
        if (!el) return

        let lastY = el.scrollTop
        const onScroll = () => {
            const y = el.scrollTop
            const delta = y - lastY
            lastY = y
            if (y < 80) setHidden(false)
            else if (delta > 4) setHidden(true)
            else if (delta < -4) setHidden(false)
        }
        el.addEventListener('scroll', onScroll, { passive: true })
        return () => el.removeEventListener('scroll', onScroll)
    }, [location.pathname])

    // 메뉴가 열려있는데 헤더가 숨겨지면 메뉴만 화면 위쪽 허공에 뜬 것처럼
    // 보이므로, 숨겨질 땐 열린 메뉴도 같이 닫는다.
    useEffect(() => {
        if (hidden) setClick(false)
    }, [hidden])

    return (
        <div className={hidden ? 'header-wraper header-hidden' : 'header-wraper'}>
            <div className="header-container">
                <nav className="navbar">
                    <div className="logo">
                        {/* 갤러리 화면에서는 화면 크기와 무관하게 로고 자리를
                        "← EARTH" 알약 버튼으로 대체한다 — 예전엔 별도의 fixed
                        버튼을 화면 좌상단에 따로 띄웠는데, 로고랑 겹쳐 보이는
                        문제가 있었다. 알약 스타일은 그대로 유지(global.css).
                        motion.div로 감싸 opacity만 페이드하는 이유: 로고와
                        알약은 폰트크기/패딩/테두리가 전혀 다른 박스라, 같은
                        <a> 엘리먼트를 재사용하며 그 값들을 보간하면(예전
                        .header-wraper a의 1s 트랜지션) 커졌다 작아지는
                        것처럼 어색해 보였다. mode="wait"라 겹치지 않고
                        먼저 사라진 뒤에 다음 게 나타난다. */}
                        <AnimatePresence mode="wait">
                            {isGallery ? (
                                <motion.div
                                    key="gallery-back"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <Link to="/MemoryScreen" className="logo-gallery-back" onClick={() => onMenuClick(null)}>← EARTH</Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="home"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <Link to="/" className="logo-home" onClick={() => onMenuClick('reset')}>SEUNGYUN SHIN.</Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="menu-icon" onClick={() => setClick(!click)}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>

                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        {MENUS.map((menu) => (
                            <li className="nav-item" key={menu.label}>
                                <Link
                                    to={menu.to}
                                    className="nav-links"
                                    onClick={() => onMenuClick(menu.mode)}
                                >
                                    {menu.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Header
