import { useState } from 'react'
import { Link } from 'react-router-dom'
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

    const onMenuClick = (mode) => {
        setClick(false)
        if (mode) icoTransition(mode)
    }

    return (
        <div className="header-wraper">
            <div className="header-container">
                <nav className="navbar">
                    <div className="logo">
                        <Link to="/" onClick={() => onMenuClick('reset')}>SEUNGYUN SHIN.</Link>
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
