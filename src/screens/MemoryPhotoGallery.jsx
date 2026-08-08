import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { icoTransition } from '../lib/icoBus'

function toThumb(src) {
    return src.replace('/1170/', '/300/')
}

// .gallery-tile:nth-child(7n+1)/(11n+5) CSS 리듬과 반드시 같은 식이어야 한다.
// nth-child는 이름 카드(첫 번째 자식)까지 포함해서 세므로, 사진 배열의
// 0-based 인덱스 i는 DOM 위치 i+2에 해당한다 — 그래서 오프셋이 이렇게 어긋난다.
function isLargeTile(i) {
    return i % 7 === 6 || i % 11 === 3
}

function MemoryPhotoGallery() {
    const location = useLocation()
    const navigate = useNavigate()
    const countryPoint = location.state?.countryPoint
    const accent = location.state?.accentColor || '#C9A063'

    const photos = countryPoint?.imgList || []
    const [lightboxIndex, setLightboxIndex] = useState(null)
    const touchStartX = useRef(null)

    // 지구본 화면과 동일하게, 이 화면을 보는 동안 마블 배경 렌더 루프를
    // 멈춘다 — 안 그러면 화면엔 안 보여도 GPU가 계속 마블을 그리고 있었다.
    // 언마운트 시 'show'는 호출하지 않는다 — 마블이 필요한 화면(MainScreen)이
    // 자기 마운트 시점에 스스로 복구를 요청하는 쪽이 AnimatePresence
    // 크로스페이드 타이밍 경합에 안전하다 (EarthScreen과 동일한 이유).
    useEffect(() => {
        icoTransition('hide')
    }, [])

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

            {/* 히어로 배너 없이, 장소 이름을 사진들과 같은 그리드 타일 하나로
            통합한다 — "배너 + 콘텐츠"라는 흔한 템플릿 구조 자체를 없앤다.
            카드 배경엔 mainImg를 깔고, 메인페이지와 같은 mix-blend-mode로
            이름을 얹어서 밋밋한 flat 카드보다 존재감을 준다. */}
            <div className="gallery-grid">
                <div
                    className="gallery-id-card"
                    style={countryPoint.mainImg ? { backgroundImage: `url(${countryPoint.mainImg})` } : undefined}
                >
                    <h1>{countryPoint.name}</h1>
                    {photos.length > 0 && <span className="gallery-count">{photos.length} PHOTOS</span>}
                </div>

                {photos.map((img, i) => {
                    // 12장마다 한 번씩 그리드를 깨고 화면 폭 전체를 쓰는
                    // 사진을 끼워 스크롤에 숨 쉬는 지점을 만든다.
                    const isBreakout = photos.length > 8 && (i + 1) % 12 === 0
                    // 큰 타일(2x2 등)에 작은 썸네일을 늘려 쓰면 흐릿해진다 —
                    // 크게 표시되는 타일은 원본을 쓴다.
                    const useFullRes = isBreakout || isLargeTile(i)
                    return (
                        <button
                            key={img.id}
                            className={isBreakout ? 'gallery-tile gallery-breakout' : 'gallery-tile'}
                            onClick={() => setLightboxIndex(i)}
                        >
                            <img
                                src={useFullRes ? img.imgSrc : toThumb(img.imgSrc)}
                                alt={`${countryPoint.name} ${i + 1}`}
                                loading="lazy"
                            />
                            <span className="gallery-index">{String(i + 1).padStart(2, '0')} / {photos.length}</span>
                        </button>
                    )
                })}
            </div>

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
