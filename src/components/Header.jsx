import { useState } from 'react'
import { Link } from 'react-router-dom'
import { icoTransition } from '../lib/icoBus'

const MENUS = [
    { label: 'WORK', to: '/WorkScreen', mode: 'zoom' },
    { label: 'SHOP', to: '/ShopScreen', mode: 'zoom' },
    { label: 'RECORD', to: '/RecordScreen', mode: 'zoom' },
    { label: 'MEMORY', to: '/MemoryScreen', mode: 'zoomHide' },
    { label: 'ABOUT', to: '/AboutMe', mode: 'zoomHide' },
    { label: 'Login', to: '/login', mode: 'zoom' },
]

function Header() {
    const [click, setClick] = useState(false)

    const onMenuClick = (mode) => {
        setClick(false)
        icoTransition(mode)
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
