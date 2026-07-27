import { Suspense, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
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

// Curated accent set — one is picked at random per selection so the active
// point pops against the cream/dark scene, but every option was chosen to sit
// in the same tonal family (kept away from the earlier "26 arbitrary colors"
// problem, which read as tacky rather than designed). Desaturated antique-
// metal tones — brass / terracotta / verdigris / dusty mauve — read as part
// of the site's dark-navy + cream palette instead of generic web accents.
const HIGHLIGHT_PALETTE = ['#C9A063', '#B5654A', '#6E8F82', '#93748F']

function randomHighlight() {
    return HIGHLIGHT_PALETTE[Math.floor(Math.random() * HIGHLIGHT_PALETTE.length)]
}

// Card placement: keep clear of the destination list (left ~340px) and the
// header (top ~140px), and flip to whichever side of the point has more room
// so the card stays fully on screen regardless of where on the globe the
// point sits.
const CARD_W = 260
const CARD_H = 168
const RESERVED_LEFT = 360
const RESERVED_TOP = 140
const EDGE_MARGIN = 24

// flyCameraTo always brings the selected point to the dead center of the
// screen, so a point's on-screen position never varies enough to make a
// quadrant-based left/right choice meaningful — it was always resolving to
// the same side. The card sits to the upper-left of the point instead, which
// stays clear of the list/header by construction; the clamp below is just a
// safety net for extreme zoom levels.
function placeCard(px, py, viewportW, viewportH) {
    let x = px - 46 - CARD_W
    let y = py - 30 - CARD_H

    x = Math.max(RESERVED_LEFT, Math.min(x, viewportW - CARD_W - EDGE_MARGIN))
    y = Math.max(RESERVED_TOP, Math.min(y, viewportH - CARD_H - EDGE_MARGIN))

    return { x, y }
}

// Closest point on the card's rectangle to the marker, so the leader line
// points at the card's edge instead of cutting through its middle.
function nearestEdgePoint(px, py, cardX, cardY) {
    return {
        x: Math.max(cardX, Math.min(px, cardX + CARD_W)),
        y: Math.max(cardY, Math.min(py, cardY + CARD_H)),
    }
}

// Orbits the camera (not the globe) to face a point, preserving the current
// zoom distance. Interpolating the position directly (lerp) would cut a
// straight chord through the sphere and change the zoom mid-flight, so this
// slerps the direction instead — identity-to-rotQuat by t parametrizes the
// shortest arc, which keeps the camera at a constant distance throughout.
function flyCameraTo(camera, controls, worldPos, onComplete, duration = 1.6) {
    const distance = camera.position.length()
    const startDir = camera.position.clone().normalize()
    const endDir = worldPos.clone().normalize()
    const rotQuat = new THREE.Quaternion().setFromUnitVectors(startDir, endDir)
    const proxy = { t: 0 }

    gsap.to(proxy, {
        t: 1,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => {
            const stepQuat = new THREE.Quaternion().slerp(rotQuat, proxy.t)
            camera.position.copy(startDir.clone().applyQuaternion(stepQuat).multiplyScalar(distance))
            camera.lookAt(0, 0, 0)
            controls.current?.update()
        },
        onComplete,
    })
}

// Same outward nudge the marker sprite uses (see Marker below) — shared so
// the leader line always starts exactly at the visible dot, not the raw
// surface point.
function markerPosition(point) {
    return new THREE.Vector3(point.x, point.y, point.z).multiplyScalar(1.04)
}

function projectToScreen(worldPos, camera, size) {
    const v = worldPos.clone().project(camera)
    return {
        x: (v.x * 0.5 + 0.5) * size.width,
        y: (-v.y * 0.5 + 0.5) * size.height,
    }
}

// DOM overlay (outside the Canvas) showing a dashed leader line from the
// active point's live screen position to a photo card. EarthModel drives it
// imperatively every frame — see reveal()/track()/hide() — rather than via
// React state, so tracking the point during camera drag doesn't re-render
// the destination list 60 times a second.
const PlaceCard = forwardRef(function PlaceCard({ onView }, ref) {
    const [state, setState] = useState(null) // { point, color, card:{x,y}, edge:{x,y} }
    const [revealed, setRevealed] = useState(false)
    const lastMarkerRef = useRef({ x: 0, y: 0 })

    useImperativeHandle(ref, () => ({
        reveal(point, color, px, py) {
            // Card starts centered on the point and travels there in two legs —
            // sideways first, then up into its final resting spot — rather than
            // just fading in at rest. The leader line's edge is recomputed every
            // step so it stays glued to wherever the card currently is.
            const finalCard = placeCard(px, py, window.innerWidth, window.innerHeight)
            const startCard = { x: px - CARD_W / 2, y: py - CARD_H / 2 }

            lastMarkerRef.current = { x: px, y: py }
            setState({
                point,
                color,
                card: startCard,
                edge: nearestEdgePoint(px, py, startCard.x, startCard.y),
            })
            setRevealed(true)

            const proxy = { ...startCard }
            const updateFrame = () =>
                setState((s) => (s ? { ...s, card: { x: proxy.x, y: proxy.y }, edge: nearestEdgePoint(px, py, proxy.x, proxy.y) } : s))

            gsap.timeline()
                .to(proxy, { x: finalCard.x, duration: 0.42, ease: 'power2.inOut', onUpdate: updateFrame })
                .to(proxy, { y: finalCard.y, duration: 0.36, ease: 'power2.out', onUpdate: updateFrame })
        },
        track(px, py, visible) {
            if (!visible) {
                setState(null)
                setRevealed(false)
                return
            }
            setState((s) => {
                if (!s) return s
                const dx = px - lastMarkerRef.current.x
                const dy = py - lastMarkerRef.current.y
                lastMarkerRef.current = { x: px, y: py }
                const card = { x: s.card.x + dx, y: s.card.y + dy }
                return { ...s, card, edge: nearestEdgePoint(px, py, card.x, card.y) }
            })
        },
        hide() {
            setState(null)
            setRevealed(false)
        },
    }))

    if (!state) return null
    const { point, color, card, edge } = state
    const marker = lastMarkerRef.current

    return (
        <>
            <svg className="place-card-line-layer">
                <line
                    x1={marker.x}
                    y1={marker.y}
                    x2={edge.x}
                    y2={edge.y}
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                />
            </svg>
            <div
                className={revealed ? 'place-card revealed' : 'place-card'}
                style={{ left: card.x, top: card.y, borderColor: color }}
            >
                <img src={thumbnailOf(point)} alt="" />
                <div className="place-card-body">
                    <p className="place-card-name">{point.name}</p>
                    <button className="place-card-view" style={{ color }} onClick={() => onView(point)}>
                        사진 보기 →
                    </button>
                </div>
            </div>
        </>
    )
})

function Marker({ point, active, color, onEnter, onLeave, onClick }) {
    const spriteRef = useRef()
    const texture = useMemo(() => glowDotTexture(), [])

    // A flat sprite has zero depth extent, so sitting exactly on the earth's
    // surface (same radius) z-fights against it almost everywhere — the same
    // failure mode the dot-matrix globe hit earlier. The old marker was a
    // small 3D sphere whose outward half naturally poked past the surface;
    // nudging the sprite outward by ~4% of the radius reproduces that margin.
    const position = useMemo(() => markerPosition(point).toArray(), [point])

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        const base = active ? 0.16 : 0.09
        const pulse = active ? 1 + Math.sin(t * 2) * 0.08 : 1
        spriteRef.current.scale.setScalar(base * pulse)
    })

    return (
        <group position={position}>
            {/* generous invisible hit target — separate from the small visible dot */}
            <mesh onClick={onClick} onPointerOver={onEnter} onPointerOut={onLeave}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <sprite ref={spriteRef}>
                <spriteMaterial
                    map={texture}
                    color={active ? color : '#dfd3c3'}
                    opacity={active ? 1 : 0.8}
                    transparent
                    depthWrite={false}
                    toneMapped={false}
                />
            </sprite>
        </group>
    )
}

function EarthModel({ countryInfo, countryInfoName, activeId, activeColor, overlayRef }) {

    const navigate = useNavigate()
    const { camera, size } = useThree()

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
    const controlsRef = useRef()

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
    // flies the camera to face that point — the globe itself stays put, so
    // the background stars and the two side planets visibly shift too,
    // reading as "your viewpoint moved" rather than "the world spun". Once
    // the flight lands, reveal the leader line + photo card at that point.
    useEffect(() => {
        if (activeId == null) return
        const point = countryPoints.find((p) => p._id === activeId)
        if (!point) return

        autoRotate.current = false
        overlayRef.current?.hide()

        const worldPos = markerPosition(point).applyMatrix4(earthRef.current.matrixWorld)
        flyCameraTo(camera, controlsRef, worldPos, () => {
            const landedPos = markerPosition(point).applyMatrix4(earthRef.current.matrixWorld)
            const screen = projectToScreen(landedPos, camera, size)
            overlayRef.current?.reveal(point, activeColor, screen.x, screen.y)
        })
    }, [activeId])

    // Keeps the leader line + card pinned to the point every frame — so a
    // manual drag after landing moves them together instead of leaving them
    // stranded — and hides them if the point rotates out of view.
    useFrame(() => {
        if (activeId == null || !earthRef.current) return
        const point = countryPoints.find((p) => p._id === activeId)
        if (!point) return

        const worldPos = markerPosition(point).applyMatrix4(earthRef.current.matrixWorld)
        const facingCamera = worldPos.clone().normalize().dot(camera.position.clone().normalize()) > 0.12

        if (facingCamera) {
            const screen = projectToScreen(worldPos, camera, size)
            overlayRef.current?.track(screen.x, screen.y, true)
        } else {
            overlayRef.current?.track(0, 0, false)
        }
    })

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
                ref={controlsRef}
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
                        color={activeColor}
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

// The "photo view" action now lives on the floating card next to the globe
// point (see PlaceCard) — keeping a second copy of that link here would just
// be a duplicate, inconsistent affordance for the same action.
function DestinationList({ activeId, activeColor, onSelect }) {
    return (
        <nav className="destination-list">
            {REGIONS.map((region) => (
                <div key={region.name} className="destination-group">
                    <p className="destination-group-title">{region.name}</p>
                    {countryPoints.slice(region.range[0], region.range[1] + 1).map((point) => {
                        const active = activeId === point._id
                        return (
                            <div
                                key={point._id}
                                className={active ? 'destination-item active' : 'destination-item'}
                                style={active ? { '--accent': activeColor } : undefined}
                            >
                                <button className="destination-item-main" onClick={() => onSelect(point)}>
                                    <img src={thumbnailOf(point)} alt="" loading="lazy" />
                                    <span>{point.name}</span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            ))}
        </nav>
    )
}

function EarthScreen() {

    const navigate = useNavigate()
    const countryInfo = useRef()
    const countryInfoName = useRef()
    const overlayRef = useRef()
    const [activeId, setActiveId] = useState(null)
    const [activeColor, setActiveColor] = useState(HIGHLIGHT_PALETTE[0])

    useEffect(() => {
        icoTransition('hide')
        gsap.to('.earthContainer', { duration: 1, opacity: 1, delay: 0.5 })

        return () => {
            icoTransition('show')
        }
    }, [])

    const handleSelect = (point) => {
        setActiveColor(randomHighlight())
        setActiveId(point._id)
    }

    return (
        <div className="earthContainer">
            <DestinationList activeId={activeId} activeColor={activeColor} onSelect={handleSelect} />

            <PlaceCard
                ref={overlayRef}
                onView={(point) => navigate('/MemoryPhotoGallery', { state: { countryPoint: point } })}
            />

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

            {/* near/far tightened from R3F's default (0.1/1000) — that huge a range
                left too little depth-buffer precision at the globe's distance,
                which is why the marker sprites z-fought against the earth surface */}
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], near: 0.5, far: 40 }}>
                <Suspense fallback={null}>
                    <EarthModel
                        countryInfo={countryInfo}
                        countryInfoName={countryInfoName}
                        activeId={activeId}
                        activeColor={activeColor}
                        overlayRef={overlayRef}
                    />
                </Suspense>
            </Canvas>
            <Loader />
        </div>
    )
}

export default EarthScreen
