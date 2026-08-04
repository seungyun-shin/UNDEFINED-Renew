import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate, Link } from 'react-router-dom'

function MemoryPhotoGallery() {
    const location = useLocation()
    const navigate = useNavigate()
    const countryPoint = location.state?.countryPoint
    const accent = location.state?.accentColor || '#C9A063'

    const photos = countryPoint?.imgList || []
    const [lightboxIndex, setLightboxIndex] = useState(null)
    const touchStartX = useRef(null)
    const stripRef = useRef(null)

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

    // 트랙패드 없이 마우스 휠만 있는 데스크톱에서도 필름 스트립을
    // 좌우로 넘길 수 있도록 세로 휠 입력을 가로 스크롤로 바꿔준다.
    useEffect(() => {
        const el = stripRef.current
        if (!el) return
        const onWheel = (e) => {
            if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
            e.preventDefault()
            el.scrollLeft += e.deltaY
        }
        el.addEventListener('wheel', onWheel, { passive: false })
        return () => el.removeEventListener('wheel', onWheel)
    }, [photos.length])

    const scrollStrip = (dir) => {
        const el = stripRef.current
        if (!el) return
        const frame = el.querySelector('.filmstrip-frame')
        const step = frame ? frame.getBoundingClientRect().width + 4 : el.clientWidth * 0.8
        el.scrollBy({ left: dir * step, behavior: 'smooth' })
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
                <div className="filmstrip-section">
                    <div className="filmstrip-sprockets" aria-hidden="true" />

                    <div className="filmstrip" ref={stripRef}>
                        {photos.map((img, i) => (
                            <button
                                key={img.id}
                                className="filmstrip-frame"
                                onClick={() => setLightboxIndex(i)}
                            >
                                <img src={img.imgSrc} alt={`${countryPoint.name} ${i + 1}`} loading="lazy" />
                                <span className="frame-number">N° {String(i + 1).padStart(2, '0')}</span>
                            </button>
                        ))}
                    </div>

                    <div className="filmstrip-sprockets" aria-hidden="true" />

                    {photos.length > 1 && (
                        <>
                            <button className="filmstrip-nav prev" onClick={() => scrollStrip(-1)}>‹</button>
                            <button className="filmstrip-nav next" onClick={() => scrollStrip(1)}>›</button>
                        </>
                    )}
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
