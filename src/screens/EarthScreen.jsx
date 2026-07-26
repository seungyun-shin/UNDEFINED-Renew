import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { OrbitControls, Stars, Loader } from '@react-three/drei'
import gsap from 'gsap'

import { icoTransition } from '../lib/icoBus'
import countryPointData from '../assets/data/countryPoint.json'
import { glowDotTexture } from '../lib/glowDot'

import EarthDayMap from '../assets/textures/2k_earth_daymap.jpg'
import EarthNormalMap from '../assets/textures/2k_earth_normal_map.jpg'
import EarthSpecularMap from '../assets/textures/2k_earth_specular_map.jpg'
import EarthCloudMap from '../assets/textures/2k_earth_clouds.jpg'
import Landscape from '../assets/textures/skytexture.png'
import Landscape2 from '../assets/textures/test2.jpg'

// lat/lon → position on the sphere surface (radius 2), same math as the original
const countryPoints = countryPointData.map((p) => {
    const lat = parseFloat(p.lat)
    const lon = parseFloat(p.lon)
    const latTransit = lat * (Math.PI / 180)
    const lonTransit = -lon * (Math.PI / 180)
    return {
        ...p,
        lat,
        lon,
        x: Math.cos(latTransit) * Math.cos(lonTransit) * 2,
        y: Math.sin(latTransit) * 2,
        z: Math.cos(latTransit) * Math.sin(lonTransit) * 2,
    }
})

// countryPoint.json is stored in rough journey order — group it into legs for
// the destination list: 0-15 South America · 16-50 USA · 51-61 Europe · 62-65 SEA
const REGIONS = [
    { name: 'SOUTH AMERICA', range: [0, 15] },
    { name: 'USA', range: [16, 50] },
    { name: 'EUROPE', range: [51, 61] },
    { name: 'SOUTHEAST ASIA', range: [62, 65] },
]

function thumbnailOf(point) {
    const src = point.imgList?.[0]?.imgSrc || point.mainImg || ''
    return src.replace('/1170/', '/300/')
}

// Minimal rotation that brings a local-space point to face wherever the
// camera currently is (read live, since OrbitControls lets the user orbit
// freely). A Y-only rotation only fixes longitude — a point at high latitude
// (e.g. Paris, 48°N) would still end up near the top rim instead of centered,
// so this aligns the full 3D direction instead.
function facingQuaternion(x, y, z, cameraPosition) {
    const pointDir = new THREE.Vector3(x, y, z).normalize()
    const cameraDir = cameraPosition.clone().normalize()
    return new THREE.Quaternion().setFromUnitVectors(pointDir, cameraDir)
}

function Marker({ point, active, onEnter, onLeave, onClick }) {
    const spriteRef = useRef()
    const texture = useMemo(() => glowDotTexture(), [])

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        const base = active ? 0.16 : 0.09
        const pulse = active ? 1 + Math.sin(t * 2) * 0.08 : 1
        spriteRef.current.scale.setScalar(base * pulse)
    })

    return (
        <group position={[point.x, point.y, point.z]}>
            {/* generous invisible hit target — separate from the small visible dot */}
            <mesh onClick={onClick} onPointerOver={onEnter} onPointerOut={onLeave}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <sprite ref={spriteRef}>
                <spriteMaterial
                    map={texture}
                    color={active ? '#fff6ea' : '#dfd3c3'}
                    opacity={active ? 1 : 0.8}
                    transparent
                    depthWrite={false}
                    toneMapped={false}
                />
            </sprite>
        </group>
    )
}

function EarthModel({ countryInfo, countryInfoName, activeId }) {

    const navigate = useNavigate()
    const { camera } = useThree()

    const [colorMap, normalMap, specularMap, cloudsMap, landscape, landscape2] = useLoader(
        TextureLoader,
        [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudMap, Landscape, Landscape2]
    )

    const earthRef = useRef()
    const cloudeRef = useRef()
    const thanksPlanet = useRef()
    const projectPlanet = useRef()
    const thanksPlanetCover = useRef()
    const projectPlanetCover = useRef()
    const autoRotate = useRef(true)

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime()

        if (autoRotate.current) {
            earthRef.current.rotation.y = elapsedTime / 25
        }
        cloudeRef.current.rotation.y = elapsedTime / 27

        thanksPlanet.current.rotation.y = -elapsedTime / 13
        thanksPlanet.current.rotation.x = elapsedTime / 16
        thanksPlanetCover.current.rotation.y = -elapsedTime / 13
        thanksPlanetCover.current.rotation.x = elapsedTime / 16

        projectPlanet.current.rotation.y = elapsedTime / 13
        projectPlanet.current.rotation.x = -elapsedTime / 23
        projectPlanetCover.current.rotation.y = elapsedTime / 13
        projectPlanetCover.current.rotation.x = -elapsedTime / 23
    })

    // Selecting a destination from the list stops the idle auto-rotate and
    // snaps the globe to face that point instead.
    useEffect(() => {
        if (activeId == null) return
        const point = countryPoints.find((p) => p._id === activeId)
        if (!point) return

        autoRotate.current = false

        const startQuat = earthRef.current.quaternion.clone()
        const endQuat = facingQuaternion(point.x, point.y, point.z, camera.position)
        const tmpQuat = new THREE.Quaternion()
        const proxy = { t: 0 }

        gsap.to(proxy, {
            t: 1,
            duration: 1.6,
            ease: 'power3.inOut',
            onUpdate: () => {
                tmpQuat.slerpQuaternions(startQuat, endQuat, proxy.t)
                earthRef.current.quaternion.copy(tmpQuat)
            },
        })
    }, [activeId])

    const showName = (name) => {
        countryInfo.current.style.display = 'flex'
        countryInfoName.current.innerHTML = `<div class="country-name-show-up">${name}</div>`
    }

    const infoShowingUp = (e) => showName(e.object.userData.name)

    const infoShowingDown = () => {
        countryInfo.current.style.display = 'none'
    }

    useEffect(() => {
        gsap.to('.guide-container', {
            duration: 1,
            opacity: 1,
            ease: 'power3.inOut',
        })
    }, [])

    return (
        <>
            <ambientLight intensity={1} />
            <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade={true} />
            <OrbitControls
                enableZoom={true}
                enablePan={true}
                zoomSpeed={0.6}
                panSpeed={0.5}
                rotateSpeed={0.4}
                maxDistance={19}
                minDistance={3}
            />

            <mesh ref={cloudeRef} position={[0, 0, 0]}>
                <sphereGeometry args={[2.05, 32, 32]} />
                <meshPhongMaterial map={cloudsMap} opacity={0.39} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
            </mesh>

            <mesh ref={earthRef} position={[0, 0, 0]}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshPhongMaterial specularMap={specularMap} />
                <meshStandardMaterial map={colorMap} normalMap={normalMap} metalness={0.39} roughness={0.7} />

                {countryPoints.map((point) => (
                    <Marker
                        key={point._id}
                        point={point}
                        active={activeId === point._id}
                        onClick={() => navigate('/MemoryPhotoGallery', { state: { countryPoint: point } })}
                        onEnter={() => showName(point.name)}
                        onLeave={infoShowingDown}
                    />
                ))}
            </mesh>

            {/* Project planet */}
            <mesh position={[-9, 2, -6]} onClick={() => navigate('/SSYProject')} ref={projectPlanetCover}>
                <icosahedronGeometry args={[1.35, 1]} />
                <meshPhongMaterial map={landscape} opacity={0.7} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
            </mesh>
            <mesh
                position={[-9, 2, -6]}
                ref={projectPlanet}
                userData={{ name: 'Project' }}
                onPointerOver={infoShowingUp}
                onPointerOut={infoShowingDown}
            >
                <icosahedronGeometry args={[1.3, 1]} />
                <meshPhongMaterial color={0xffffff} opacity={1} side={THREE.DoubleSide} />
            </mesh>

            {/* Thanks planet */}
            <mesh position={[9, -3, -3]} onClick={() => navigate('/warningscreen')} ref={thanksPlanetCover}>
                <tetrahedronGeometry args={[1.5, 3]} />
                <meshPhongMaterial map={landscape2} opacity={0.7} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
            </mesh>
            <mesh
                position={[9, -3, -3]}
                ref={thanksPlanet}
                userData={{ name: 'Appreciate' }}
                onPointerOver={infoShowingUp}
                onPointerOut={infoShowingDown}
            >
                <tetrahedronGeometry args={[1.45, 3]} />
                <meshPhongMaterial color={0x000000} opacity={1} side={THREE.DoubleSide} />
            </mesh>
        </>
    )
}

function DestinationList({ activeId, onSelect }) {
    const navigate = useNavigate()

    return (
        <nav className="destination-list">
            {REGIONS.map((region) => (
                <div key={region.name} className="destination-group">
                    <p className="destination-group-title">{region.name}</p>
                    {countryPoints.slice(region.range[0], region.range[1] + 1).map((point) => {
                        const active = activeId === point._id
                        return (
                            <div key={point._id} className={active ? 'destination-item active' : 'destination-item'}>
                                <button className="destination-item-main" onClick={() => onSelect(point)}>
                                    <img src={thumbnailOf(point)} alt="" loading="lazy" />
                                    <span>{point.name}</span>
                                </button>
                                {active && (
                                    <button
                                        className="destination-item-view"
                                        onClick={() => navigate('/MemoryPhotoGallery', { state: { countryPoint: point } })}
                                    >
                                        사진 보기 →
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            ))}
        </nav>
    )
}

function EarthScreen() {

    const countryInfo = useRef()
    const countryInfoName = useRef()
    const [activeId, setActiveId] = useState(null)

    useEffect(() => {
        icoTransition('hide')
        gsap.to('.earthContainer', { duration: 1, opacity: 1, delay: 0.5 })

        return () => {
            icoTransition('show')
        }
    }, [])

    return (
        <div className="earthContainer">
            <DestinationList activeId={activeId} onSelect={(point) => setActiveId(point._id)} />

            <div className="country-info-show" ref={countryInfo}>
                <div className="name-info" ref={countryInfoName}></div>
            </div>

            <div className="guide-container">
                <div className="guide-info">
                    <span>Click the Points or Planet</span>
                    <div className="mouse_scroll">
                        <div className="mouse">
                            <div className="wheel"></div>
                        </div>
                        <div>
                            <span className="m_scroll_arrows unu"></span>
                            <span className="m_scroll_arrows doi"></span>
                            <span className="m_scroll_arrows trei"></span>
                        </div>
                    </div>
                </div>
            </div>

            <Canvas dpr={[1, 1.5]}>
                <Suspense fallback={null}>
                    <EarthModel countryInfo={countryInfo} countryInfoName={countryInfoName} activeId={activeId} />
                </Suspense>
            </Canvas>
            <Loader />
        </div>
    )
}

export default EarthScreen
