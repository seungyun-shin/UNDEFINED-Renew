import { Routes, Route } from 'react-router-dom'

import IcoBackground from './components/IcoBackground'
import Header from './components/Header'
import MainScreen from './screens/MainScreen'
import EarthScreen from './screens/EarthScreen'
import MemoryPhotoGallery from './screens/MemoryPhotoGallery'
import UpdatingScreen from './screens/UpdatingScreen'

function App() {
    return (
        <>
            <IcoBackground />
            <Header />
            <div className="overall-Layout">
                <Routes>
                    <Route path="/" element={<MainScreen />} />
                    <Route path="/MemoryScreen" element={<EarthScreen />} />
                    <Route path="/MemoryPhotoGallery" element={<MemoryPhotoGallery />} />
                    {/* 아직 리뉴얼 전 페이지들은 원본의 UpdatingScreen 문구로 대체 */}
                    <Route path="*" element={<UpdatingScreen />} />
                </Routes>
            </div>
        </>
    )
}

export default App
