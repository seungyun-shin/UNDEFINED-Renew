import { Suspense, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { OrbitControls, Stars, Loader } from '@react-three/drei'
import gsap from 'gsap'

import { icoTransition } from '../lib/icoBus'
import countryPointData from '../assets/data/countryPoint.json'
import planetGalleries from '../assets/data/planetGalleries.json'
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

// Card sizing + the screen regions the card must stay clear of (the header
// across the top, the destination list down the left).
const CARD_W = 260
const CARD_H = 116
const RESERVED_LEFT = 420
const RESERVED_TOP = 140
const EDGE_MARGIN = 24

// Project planet sits upper-left; raised well above the destination list so it
// projects into clear space rather than behind the list (which would eat the click).
const PROJECT_PLANET_POS = [-4.5, 4.6, -5]

// The connecting line is drawn in screen space as an L (left, then up) from
// the 3D ring's edge to the card. These are the card's screen offsets from the
// ring center, and how far in from the ring center the line starts (~ring edge).
const LEADER_DX = 168
const LEADER_DY = 128
const RING_EDGE = 15

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

// DOM overlay: the connecting line + caption card. The 3D ring (EarthModel)
// hands us its projected screen position (rx, ry) every frame; from that we
// draw an L-shaped leader — left from the ring's edge, then up into the card —
// as a thin glowing SVG polyline, and hang the card above it. The line "draws
// in" via a single eased stroke-dashoffset sweep (left then up in one motion).
const PlaceCard = forwardRef(function PlaceCard({ onView, mobile }, ref) {
    const [state, setState] = useState(null) // { point, color, rx, ry, visible }
    const [draw, setDraw] = useState(0)       // 0..1 line-draw progress
    const [revealed, setRevealed] = useState(false)
    const drawTween = useRef(null)

    useImperativeHandle(ref, () => ({
        reveal(point, color, rx, ry) {
            drawTween.current?.kill()
            setRevealed(false)
            setDraw(0)
            setState({ point, color, rx, ry, visible: true })
            const p = { d: 0 }
            drawTween.current = gsap.to(p, {
                d: 1,
                duration: 0.8,
                ease: 'power2.inOut',
                onUpdate: () => setDraw(p.d),
                onComplete: () => setRevealed(true),
            })
        },
        track(rx, ry, visible) {
            setState((s) => (s ? { ...s, rx, ry, visible } : s))
        },
        hide() {
            drawTween.current?.kill()
            setState(null)
            setDraw(0)
            setRevealed(false)
        },
    }))

    if (!state) return null
    const { point, color, rx, ry, visible } = state

    // Mobile: pin the card just above the horizontal reel (map-app pin-card
    // style) so it stays close to what was just tapped, instead of floating
    // near the header with no visible link to the selected point. No
    // screen-space leader line on mobile — the 3D ring marks the point.
    if (mobile) {
        return (
            <div
                className={revealed && visible ? 'place-card place-card-mobile revealed' : 'place-card place-card-mobile'}
                style={{ '--accent': color }}
            >
                <img src={thumbnailOf(point)} alt="" />
                <div className="place-card-body">
                    <p className="place-card-name">{point.name}</p>
                    <button className="place-card-view" onClick={() => onView(point)}>사진 보기 →</button>
                </div>
            </div>
        )
    }

    // card sits up-and-left of the ring, clamped clear of the header + list
    let cardCenterX = rx - LEADER_DX
    let cardBottomY = ry - LEADER_DY
    let left = cardCenterX - CARD_W / 2
    let top = cardBottomY - CARD_H
    left = Math.max(RESERVED_LEFT, Math.min(left, window.innerWidth - CARD_W - EDGE_MARGIN))
    top = Math.max(RESERVED_TOP, Math.min(top, window.innerHeight - CARD_H - EDGE_MARGIN))
    cardCenterX = left + CARD_W / 2
    cardBottomY = top + CARD_H

    // L path: ring edge → left to elbow → up to card's bottom-center
    const start = { x: rx - RING_EDGE, y: ry }
    const elbow = { x: cardCenterX, y: ry }
    const end = { x: cardCenterX, y: cardBottomY }
    const total = Math.hypot(elbow.x - start.x, elbow.y - start.y) + Math.hypot(end.x - elbow.x, end.y - elbow.y)
    const dashoffset = total * (1 - draw)
    const points = `${start.x},${start.y} ${elbow.x},${elbow.y} ${end.x},${end.y}`

    return (
        <>
            <svg className="leader-svg" style={{ opacity: visible ? 1 : 0 }}>
                <polyline className="leader-glow" points={points}
                    style={{ stroke: color, strokeDasharray: total, strokeDashoffset: dashoffset }} />
                <polyline className="leader-core" points={points}
                    style={{ stroke: color, strokeDasharray: total, strokeDashoffset: dashoffset }} />
            </svg>
            <div
                className={revealed && visible ? 'place-card revealed' : 'place-card'}
                style={{ left, top, '--accent': color }}
            >
                <img src={thumbnailOf(point)} alt="" />
                <div className="place-card-body">
                    <p className="place-card-name">{point.name}</p>
                    <button className="place-card-view" onClick={() => onView(point)}>사진 보기 →</button>
                </div>
            </div>
        </>
    )
})

function Marker({ point, active, color, onEnter, onLeave, onClick, hitScale = 1 }) {
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
            {/* generous invisible hit target — separate from the small visible dot;
                enlarged on touch where fingers need a bigger tap zone */}
            <mesh onClick={onClick} onPointerOver={onEnter} onPointerOut={onLeave}>
                <sphereGeometry args={[0.09 * hitScale, 8, 8]} />
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

function EarthModel({ countryInfo, countryInfoName, activeId, activeColor, overlayRef, onPointPick, isMobile }) {

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

    // 3D targeting ring at the active point. base is world-space; ringScale is
    // gsap-driven; the DOM overlay draws the line + card off the ring's screen pos.
    const leaderRingRef = useRef()
    const leaderVisibleRef = useRef(false)
    const leaderBase = useRef(new THREE.Vector3())
    const leaderRingScale = useRef(0)

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
        leaderVisibleRef.current = false

        const worldPos = markerPosition(point).applyMatrix4(earthRef.current.matrixWorld)
        flyCameraTo(camera, controlsRef, worldPos, () => {
            leaderBase.current.copy(markerPosition(point).applyMatrix4(earthRef.current.matrixWorld))
            leaderRingScale.current = 0
            leaderVisibleRef.current = true

            // ring blooms first (3D), then the DOM overlay draws the L-line + card
            const anim = { ring: 0 }
            gsap.timeline()
                .to(anim, { ring: 1, duration: 0.5, ease: 'power2.out', onUpdate: () => { leaderRingScale.current = anim.ring } })
                .add(() => {
                    const scr = projectToScreen(leaderBase.current, camera, size)
                    overlayRef.current?.reveal(point, activeColor, scr.x, scr.y)
                }, '-=0.1')
        })
    }, [activeId])

    // Every frame: keep the 3D ring pinned to the point and feed its projected
    // screen position to the DOM overlay (which draws the connecting line + card).
    // Everything hides when the point rotates to the far side of the globe.
    useFrame(() => {
        if (!leaderVisibleRef.current) {
            if (leaderRingRef.current) leaderRingRef.current.visible = false
            return
        }

        const base = leaderBase.current
        const facing = base.clone().normalize().dot(camera.position.clone().normalize()) > 0.12

        if (leaderRingRef.current) {
            leaderRingRef.current.visible = facing
            leaderRingRef.current.position.copy(base)
            leaderRingRef.current.lookAt(camera.position)
            leaderRingRef.current.scale.setScalar(Math.max(leaderRingScale.current * 0.075, 0.0001))
        }

        const scr = projectToScreen(base, camera, size)
        overlayRef.current?.track(scr.x, scr.y, facing)
    })

    const showName = (name) => {
        countryInfo.current.style.display = 'flex'
        countryInfoName.current.innerHTML = `<div class="country-name-show-up">${name}</div>`
    }

    const infoShowingUp = (e) => showName(e.object.userData.name)

    const infoShowingDown = () => {
        countryInfo.current.style.display = 'none'
    }


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

            {/* 3D targeting ring at the active point — glows with the same
                additive material as the globe markers. The connecting line +
                card are the DOM overlay (see PlaceCard), driven off this ring's
                projected screen position. */}
            <mesh ref={leaderRingRef} visible={false} renderOrder={10}>
                <ringGeometry args={[0.86, 1, 48]} />
                <meshBasicMaterial color={activeColor} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>

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
                        onClick={() => onPointPick(point)}
                        onEnter={() => showName(point.name)}
                        onLeave={infoShowingDown}
                        hitScale={isMobile ? 1.7 : 1}
                    />
                ))}
            </mesh>

            {/* Project planet — opens its own photo gallery, same as a travel point.
                Raised from y=2 to clear the (now wider) destination list, which
                otherwise sits on top of it in the DOM and swallows the click. */}
            <mesh
                position={PROJECT_PLANET_POS}
                onClick={() => navigate('/MemoryPhotoGallery', { state: { countryPoint: planetGalleries.project } })}
                ref={projectPlanetCover}
            >
                <icosahedronGeometry args={[1.35, 1]} />
                <meshPhongMaterial map={landscape} opacity={0.7} depthWrite={true} transparent={true} side={THREE.DoubleSide} />
            </mesh>
            <mesh
                position={PROJECT_PLANET_POS}
                ref={projectPlanet}
                userData={{ name: 'Project' }}
                onPointerOver={infoShowingUp}
                onPointerOut={infoShowingDown}
            >
                <icosahedronGeometry args={[1.3, 1]} />
                <meshPhongMaterial color={0xffffff} opacity={1} side={THREE.DoubleSide} />
            </mesh>

            {/* Appreciate planet — opens its own photo gallery, same as a travel point */}
            <mesh
                position={[9, -3, -3]}
                onClick={() => navigate('/MemoryPhotoGallery', { state: { countryPoint: planetGalleries.appreciate } })}
                ref={thanksPlanetCover}
            >
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
// matchMedia-backed "simple layout" flag that re-renders on viewport changes.
// Threshold is 1200px, not a typical 900px phone breakpoint: the desktop
// up-left card + L-shaped leader line needs real room (left list ~420px +
// leftward offset ~300px) to stay left of the point. Below ~1100px viewport
// width the clamp that keeps the card clear of the list pushes it past the
// point's x position, flipping the line to the right — an inversion, not
// just a squeeze. 1200px keeps a safety margin above that flip threshold.
function useIsMobile() {
    const [mobile, setMobile] = useState(
        typeof window !== 'undefined' && window.matchMedia('(max-width: 1200px)').matches
    )
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 1200px)')
        const onChange = () => setMobile(mq.matches)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])
    return mobile
}

// be a duplicate, inconsistent affordance for the same action.
// Desktop: fixed left column, grouped by region. Mobile: a horizontal photo
// reel pinned to the bottom (covers less of the globe than a full sheet).
function DestinationList({ activeId, activeColor, onSelect, mobile }) {
    if (mobile) {
        return (
            <nav className="destination-strip">
                {countryPoints.map((point) => {
                    const active = activeId === point._id
                    return (
                        <button
                            key={point._id}
                            className={active ? 'strip-item active' : 'strip-item'}
                            style={active ? { '--accent': activeColor } : undefined}
                            onClick={() => onSelect(point)}
                        >
                            <img src={thumbnailOf(point)} alt="" loading="lazy" />
                            <span>{point.name}</span>
                        </button>
                    )
                })}
            </nav>
        )
    }

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
    // The hint shows on entry, then fades on the first interaction (a selection
    // or a drag) — so it invites without lingering as permanent chrome.
    const [hintOn, setHintOn] = useState(true)
    const isMobile = useIsMobile()

    useEffect(() => {
        icoTransition('hide')
        gsap.to('.earthContainer', { duration: 1, opacity: 1, delay: 0.5 })

        return () => {
            icoTransition('show')
        }
    }, [])

    const handleSelect = (point) => {
        setHintOn(false)
        setActiveColor(randomHighlight())
        setActiveId(point._id)
    }

    // On touch there's no hover, so tapping a globe point selects it (fly +
    // ring + card) rather than jumping straight to the gallery; the card's
    // "사진 보기" then navigates. On desktop, a direct-click shortcut stays.
    const handlePointPick = (point) => {
        if (isMobile) handleSelect(point)
        else navigate('/MemoryPhotoGallery', { state: { countryPoint: point, accentColor: activeColor } })
    }

    return (
        <div className="earthContainer" onPointerDown={() => setHintOn(false)}>
            <DestinationList
                activeId={activeId}
                activeColor={activeColor}
                onSelect={handleSelect}
                mobile={isMobile}
            />

            <PlaceCard
                ref={overlayRef}
                mobile={isMobile}
                onView={(point) => navigate('/MemoryPhotoGallery', { state: { countryPoint: point, accentColor: activeColor } })}
            />

            <div className="country-info-show" ref={countryInfo}>
                <div className="name-info" ref={countryInfoName}></div>
            </div>

            {/* Minimal entry hint — invites, then fades on first interaction */}
            <div className={hintOn ? 'earth-hint' : 'earth-hint hidden'}>
                <span className="earth-hint-lead">SELECT A DESTINATION</span>
                <span className="earth-hint-sub">여행지를 선택하거나 지구를 돌려보세요</span>
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
                        onPointPick={handlePointPick}
                        isMobile={isMobile}
                    />
                </Suspense>
            </Canvas>
            <Loader />
        </div>
    )
}

export default EarthScreen
