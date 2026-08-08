import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import IcoBackground from './components/IcoBackground'
import Header from './components/Header'
import PageTransition from './components/PageTransition'
import MainScreen from './screens/MainScreen'
import EarthScreen from './screens/EarthScreen'
import MemoryPhotoGallery from './screens/MemoryPhotoGallery'
import UpdatingScreen from './screens/UpdatingScreen'

function App() {
    const location = useLocation()

    return (
        <>
            <IcoBackground />
            <Header />
            <div className="overall-Layout">
                {/* mode를 지정하지 않으면(default) 나가는 화면과 들어오는 화면이
                동시에 겹쳐 애니메이션되어 진짜 크로스페이드가 된다. Routes에
                location.pathname을 key로 줘야 AnimatePresence가 라우트 변경을
                감지해서 언마운트를 늦춘다. */}
                {/* initial=false: 첫 로드 시엔 PageTransition의 진입 페이드를
                건너뛴다. MainScreen은 자체 인트로(오버레이+타이틀 캐스케이드)가
                따로 있어서, 거기에 또 페이드를 겹치면 불필요하게 두 번 겹친다.
                실제 라우트 이동일 때만 크로스페이드가 걸리면 된다. */}
                <AnimatePresence initial={false}>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageTransition><MainScreen /></PageTransition>} />
                        <Route path="/MemoryScreen" element={<PageTransition><EarthScreen /></PageTransition>} />
                        <Route path="/MemoryPhotoGallery" element={<PageTransition><MemoryPhotoGallery /></PageTransition>} />
                        {/* 아직 리뉴얼 전 페이지들은 원본의 UpdatingScreen 문구로 대체 */}
                        <Route path="*" element={<PageTransition><UpdatingScreen /></PageTransition>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </>
    )
}

export default App
