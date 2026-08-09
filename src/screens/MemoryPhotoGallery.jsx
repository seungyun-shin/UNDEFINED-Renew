import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { icoTransition } from '../lib/icoBus'

// 화면 폭에 따른 그리드 열 수 — CSS .gallery-grid의 브레이크포인트(900px)와 반드시 같아야 한다.
function useGalleryCols() {
    const [cols, setCols] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches ? 2 : 4
    )
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)')
        const onChange = () => setCols(mq.matches ? 2 : 4)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])
    return cols
}

// CSS grid-auto-flow:dense + nth-child 비대칭 리듬은 큰/세로 타일과 풀와이드
// 브레이크아웃이 맞물릴 때 중간에 빈 칸을 남길 수 있었다 (풀와이드는 반드시
// "완전히 빈 줄"에서만 시작 가능한데, 바로 앞 타일들이 그 줄을 딱 맞게
// 채우지 못하면 dense도 못 채우는 죽은 칸이 생김). 대신 여기서 칸 점유를
// 직접 시뮬레이션해서 각 타일의 grid-column/row를 정확히 계산한다 —
// 풀와이드는 항상 진짜로 빈 줄을 찾아서 시작하므로 빈 칸이 원천적으로 없다.
function layoutGallery(count, cols) {
    const occ = []
    const ensureRow = (r) => { while (occ.length <= r) occ.push(new Array(cols).fill(false)) }
    const fits = (r, c, w, h) => {
        if (c + w > cols) return false
        ensureRow(r + h - 1)
        for (let rr = r; rr < r + h; rr++) {
            for (let cc = c; cc < c + w; cc++) {
                if (occ[rr][cc]) return false
            }
        }
        return true
    }
    const occupy = (r, c, w, h) => {
        ensureRow(r + h - 1)
        for (let rr = r; rr < r + h; rr++) {
            for (let cc = c; cc < c + w; cc++) occ[rr][cc] = true
        }
    }
    // 읽기 순서(왼→오, 위→아래)로 가장 먼저 비어있는 칸을 찾는다. 항상 진짜
    // 빈 칸에서 시작하므로 최소 1x1은 반드시 들어갈 자리가 보장된다 — 이전
    // 버전의 버그는 "원하는 크기(2x2 등)가 안 맞으면 다음 칸으로 건너뛰기"였는데,
    // 그러면 건너뛴 칸 자체가 아무것도 못 받고 영구히 비어버렸다.
    const nextFreeCell = (startR, startC) => {
        let r = startR, c = startC
        while (!fits(r, c, 1, 1)) {
            c++
            if (c >= cols) { c = 0; r++ }
        }
        return { r, c }
    }
    const layout = []
    let cursorRow = 0, cursorCol = 0
    let sinceBreakout = 0

    for (let i = 0; i < count; i++) {
        sinceBreakout++
        const isLast = i === count - 1
        const eligibleForBreakout = isLast || count <= 2 || (count > 8 && sinceBreakout >= 12)

        // "풀와이드로 만들고 싶다"는 후보일 뿐 — 실제로는 지금 커서 위치가
        // 정말로 빈 줄의 시작(칸0)일 때만 확정한다. 아니라면(줄이 아직 안
        // 끝났으면) 이번 사진은 그냥 보통 타일로 채우고, sinceBreakout은
        // 그대로 유지해 다음 사진에서 다시 시도한다 — 그래야 풀와이드
        // 직전 줄이 어중간하게 비는 일이 없다. (마지막 사진이 줄 중간에
        // 걸리면 그냥 보통 타일로 끝난다 — 빈 칸보다는 훨씬 낫다.)
        const peek = nextFreeCell(cursorRow, cursorCol)
        const canBreakoutHere = eligibleForBreakout && peek.c === 0 && fits(peek.r, 0, cols, 3)

        let spot, w, h
        if (canBreakoutHere) {
            spot = peek
            w = cols; h = 3
            sinceBreakout = 0
        } else {
            spot = peek
            w = 1; h = 1
            // 리듬에 맞는 큰/세로 타일은 지금 찾은 그 칸에서 실제로 맞을 때만 적용하고,
            // 안 맞으면 1x1로 낮춘다 — 절대 이 칸을 비워두고 건너뛰지 않는다.
            if (i % 7 === 0 && fits(spot.r, spot.c, 2, 2)) { w = 2; h = 2 }
            else if (i % 11 === 4 && fits(spot.r, spot.c, 1, 2)) { w = 1; h = 2 }
        }

        occupy(spot.r, spot.c, w, h)
        layout.push({ colStart: spot.c + 1, rowStart: spot.r + 1, w, h })

        cursorRow = spot.r
        cursorCol = spot.c
    }

    return layout
}

function MemoryPhotoGallery() {
    const location = useLocation()
    const navigate = useNavigate()
    const countryPoint = location.state?.countryPoint
    const accent = location.state?.accentColor || '#C9A063'

    const photos = countryPoint?.imgList || []
    const [lightboxIndex, setLightboxIndex] = useState(null)
    const touchStartX = useRef(null)
    const cols = useGalleryCols()
    const layout = useMemo(() => layoutGallery(photos.length, cols), [photos.length, cols])

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

            {/* 카드 없이, 그리드 시작 전 헤더 아래 빈 공간에 타이포그래피만
            — 사이트 전체에서 써온 Romelio로, 별도 배경/테두리 없이. */}
            <div className="gallery-title">
                <h1>{countryPoint.name}</h1>
                {photos.length > 0 && <span className="gallery-count">{photos.length} PHOTOS</span>}
            </div>

            <div className="gallery-grid">
                {photos.map((img, i) => {
                    const cell = layout[i]
                    return (
                        <button
                            key={img.id}
                            className="gallery-tile"
                            style={{
                                gridColumn: `${cell.colStart} / span ${cell.w}`,
                                gridRow: `${cell.rowStart} / span ${cell.h}`,
                            }}
                            onClick={() => setLightboxIndex(i)}
                        >
                            {/* 타일 크기와 무관하게 항상 원본(1170px) — loading="lazy"라
                            스크롤해서 보이는 만큼만 점진적으로 받아오므로, 화면에 안
                            보이는 사진들 때문에 처음부터 무거워지진 않는다. */}
                            <img
                                src={img.imgSrc}
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
