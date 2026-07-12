import { useLocation, Link } from 'react-router-dom'

// Minimal gallery stub: renders the photos attached to the clicked point
// (original site's MemoryPhotoGallery equivalent)
function MemoryPhotoGallery() {
    const location = useLocation()
    const countryPoint = location.state?.countryPoint

    if (!countryPoint) {
        return (
            <div className="memory-gallery">
                <h1>MEMORY</h1>
                <p>지구본의 포인트를 클릭해서 들어와주세요. <Link to="/MemoryScreen" style={{ color: '#dfd3c3' }}>← Back to Earth</Link></p>
            </div>
        )
    }

    return (
        <div className="memory-gallery">
            <h1>{countryPoint.name}</h1>
            <div className="grid">
                {countryPoint.mainImg && <img src={countryPoint.mainImg} alt={countryPoint.name} />}
                {(countryPoint.imgList || []).map((img) => (
                    <img key={img.id} src={img.imgSrc} alt={`${countryPoint.name}-${img.id}`} loading="lazy" />
                ))}
            </div>
        </div>
    )
}

export default MemoryPhotoGallery
