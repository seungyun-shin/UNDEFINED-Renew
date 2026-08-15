import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { icoTransition } from '../lib/icoBus'

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
    const location = useLocation()
    const isGallery = location.pathname === '/MemoryPhotoGallery'

    const onMenuClick = (mode) => {
        setClick(false)
        if (mode) icoTransition(mode)
    }

    return (
        <div className="header-wraper">
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
