import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate, Link } from 'react-router-dom'

function toThumb(src) {
    return src.replace('/1170/', '/300/')
}

function MemoryPhotoGallery() {
    const location = useLocation()
    const navigate = useNavigate()
    const countryPoint = location.state?.countryPoint
    const accent = location.state?.accentColor || '#C9A063'

    const photos = countryPoint?.imgList || []
    const [lightboxIndex, setLightboxIndex] = useState(null)
    const touchStartX = useRef(null)

    const closeLightbox = () => setLightboxIndex(null)
    const prevPhoto = () => setLightboxIndex((i) => (i - 1 + photos.length) % photos.length)
    const nextPhoto = () => setLightboxIndex((i) => (i + 1) % photos.length)

    // 라이트박스가 열려있는 동안 배경 스크롤을 막고, 키보드로도 넘길 수 있게.
    useEffect(() => {
        if (lightboxIndex === null) return

        document.body.style.overflow = 'hidden'
        const onKey = (e) => {
            if (e.key === 'Escape') closeLightbox()
            if (e.key === 'ArrowLeft') prevPhoto()
            if (e.key === 'ArrowRight') nextPhoto()
        }
        window.addEventListener('keydown', onKey)

        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKey)
        }
    }, [lightboxIndex, photos.length])

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(dx) > 50) (dx > 0 ? prevPhoto() : nextPhoto())
        touchStartX.current = null
    }

    if (!countryPoint) {
        return (
            <div className="memory-gallery">
                <h1>MEMORY</h1>
                <p>지구본의 포인트를 클릭해서 들어와주세요. <Link to="/MemoryScreen" style={{ color: '#dfd3c3' }}>← Back to Earth</Link></p>
            </div>
        )
    }

    return (
        <div className="memory-gallery" style={{ '--accent': accent }}>
            {/* 전역 Header가 .overall-Layout(z-index:199)보다 위(200)라, 이 안의
            버튼은 z-index를 얼마로 두든 헤더 왼쪽 여백 아래 깔려 클릭이 먹지
            않았다. body로 포탈해서 그 스태킹 컨텍스트를 벗어난다. */}
            {createPortal(
                <button className="gallery-back" style={{ '--accent': accent }} onClick={() => navigate('/MemoryScreen')}>← EARTH</button>,
                document.body
            )}

            {countryPoint.mainImg && (
                <div className="gallery-hero">
                    <img src={countryPoint.mainImg} alt={countryPoint.name} />
                    <div className="gallery-hero-overlay">
                        <h1>{countryPoint.name}</h1>
                        {photos.length > 0 && <span className="gallery-count">{photos.length} PHOTOS</span>}
                    </div>
                </div>
            )}

            {photos.length > 0 && (
                <div className="gallery-grid">
                    {photos.map((img, i) => {
                        // 12장마다 한 번씩 그리드를 깨고 화면 폭 전체를 쓰는
                        // 사진을 끼워 스크롤에 숨 쉬는 지점을 만든다.
                        const isBreakout = photos.length > 8 && (i + 1) % 12 === 0
                        return (
                            <button
                                key={img.id}
                                className={isBreakout ? 'gallery-cell gallery-breakout' : 'gallery-cell'}
                                onClick={() => setLightboxIndex(i)}
                            >
                                <img
                                    src={isBreakout ? img.imgSrc : toThumb(img.imgSrc)}
                                    alt={`${countryPoint.name} ${i + 1}`}
                                    loading="lazy"
                                />
                                <span className="gallery-index">{String(i + 1).padStart(2, '0')} / {photos.length}</span>
                            </button>
                        )
                    })}
                </div>
            )}

            {lightboxIndex !== null && createPortal(
                // 전역 Header가 .overall-Layout(z-index:199)보다 위(200)에 고정돼
                // 있어서, 이 안에 렌더링하면 z-index를 아무리 올려도 라이트박스가
                // 헤더 뒤로 깔린다. body로 포탈해서 그 스태킹 컨텍스트를 벗어난다.
                <div className="gallery-lightbox" style={{ '--accent': accent }} onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>×</button>

                    {photos.length > 1 && (
                        <button
                            className="lightbox-nav prev"
                            onClick={(e) => { e.stopPropagation(); prevPhoto() }}
                        >‹</button>
                    )}

                    <img
                        className="lightbox-img"
                        src={photos[lightboxIndex].imgSrc}
                        alt={`${countryPoint.name} ${lightboxIndex + 1}`}
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    />

                    {photos.length > 1 && (
                        <button
                            className="lightbox-nav next"
                            onClick={(e) => { e.stopPropagation(); nextPhoto() }}
                        >›</button>
                    )}

                    <span className="lightbox-counter">{lightboxIndex + 1} / {photos.length}</span>
                </div>,
                document.body
            )}
        </div>
    )
}

export default MemoryPhotoGallery
