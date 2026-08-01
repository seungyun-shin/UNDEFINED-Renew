import { Suspense, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { OrbitControls, Stars, Loader, Line } from '@react-three/drei'
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

// The 3D leader lifts off the point toward this world-space offset, expressed
// in the camera's up/left basis at reveal time so it reads as "up and to the
// left" on screen (into the clear area where the card sits). Rigid in world
// space afterwards, so the whole pin tilts naturally as the camera orbits.
const LEADER_LEFT = 0.95
const LEADER_UP = 0.8

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
// DOM caption card only — the leader line + targeting ring now live in the 3D
// scene (see LeaderPin) so they share the globe's glowing material. The card
// stays DOM so the photo and text render crisply; it just follows the line's
// 3D endpoint, projected to screen each frame.
const PlaceCard = forwardRef(function PlaceCard({ onView }, ref) {
    // (nx, ny) = the leader's endpoint node in screen space; the card hangs
    // above it with its bottom-center meeting the node.
    const [state, setState] = useState(null) // { point, color, nx, ny, visible }
    const [revealed, setRevealed] = useState(false)

    useImperativeHandle(ref, () => ({
        show(point, color, nx, ny) {
            setState({ point, color, nx, ny, visible: true })
            setRevealed(true)
        },
        move(nx, ny, visible) {
            setState((s) => (s ? { ...s, nx, ny, visible } : s))
        },
        hide() {
            setState(null)
            setRevealed(false)
        },
    }))

    if (!state) return null
    const { point, color, nx, ny, visible } = state

    // clamp so the card never rides under the header or the destination list
    let left = nx - CARD_W / 2
    let top = ny - CARD_H - 14
    left = Math.max(RESERVED_LEFT, Math.min(left, window.innerWidth - CARD_W - EDGE_MARGIN))
    top = Math.max(RESERVED_TOP, Math.min(top, window.innerHeight - CARD_H - EDGE_MARGIN))

    return (
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

    // 3D leader (targeting ring + glowing line + node) that annotates the active
    // point. Base/end are world-space; progress/ringScale are gsap-driven; the
    // DOM card follows the projected end via overlayRef.
    const leaderRingRef = useRef()
    const leaderGlowRef = useRef()
    const leaderCoreRef = useRef()
    const leaderNodeRef = useRef()
    const leaderVisibleRef = useRef(false)
    const leaderBase = useRef(new THREE.Vector3())
    const leaderEnd = useRef(new THREE.Vector3())
    const leaderProgress = useRef(0)
    const leaderRingScale = useRef(0)
    const leaderTip = useMemo(() => new THREE.Vector3(), [])
    const nodeTexture = useMemo(() => glowDotTexture(), [])

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
            // Anchor the leader in world space at the point, offset up-and-left
            // in the camera's current basis so it projects into the clear area.
            const base = markerPosition(point).applyMatrix4(earthRef.current.matrixWorld)
            const camRight = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).normalize()
            const camUp = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1).normalize()
            const offset = camRight.multiplyScalar(-LEADER_LEFT).add(camUp.multiplyScalar(LEADER_UP))

            leaderBase.current.copy(base)
            leaderEnd.current.copy(base.clone().add(offset))
            leaderProgress.current = 0
            leaderRingScale.current = 0
            leaderVisibleRef.current = true

            const anim = { prog: 0, ring: 0 }
            gsap.timeline()
                .to(anim, { ring: 1, duration: 0.5, ease: 'power2.out', onUpdate: () => { leaderRingScale.current = anim.ring } }, 0)
                .to(anim, { prog: 1, duration: 0.9, ease: 'power2.inOut', onUpdate: () => { leaderProgress.current = anim.prog } }, 0.15)
                .add(() => {
                    const scr = projectToScreen(leaderEnd.current, camera, size)
                    overlayRef.current?.show(point, activeColor, scr.x, scr.y)
                })
        })
    }, [activeId])

    // Every frame: keep the 3D leader (ring/line/node) pinned to the point and
    // the DOM card following the leader's projected endpoint. Both hide when the
    // point rotates to the far side of the globe.
    useFrame(() => {
        if (!leaderVisibleRef.current) return

        const base = leaderBase.current
        const end = leaderEnd.current
        const tip = leaderTip.copy(base).lerp(end, leaderProgress.current)

        const facing = base.clone().normalize().dot(camera.position.clone().normalize()) > 0.12

        if (leaderRingRef.current) {
            leaderRingRef.current.visible = facing
            leaderRingRef.current.position.copy(base)
            leaderRingRef.current.lookAt(camera.position)
            leaderRingRef.current.scale.setScalar(Math.max(leaderRingScale.current * 0.16, 0.0001))
        }
        const positions = [base.x, base.y, base.z, tip.x, tip.y, tip.z]
        if (leaderGlowRef.current) {
            leaderGlowRef.current.visible = facing
            leaderGlowRef.current.geometry.setPositions(positions)
        }
        if (leaderCoreRef.current) {
            leaderCoreRef.current.visible = facing
            leaderCoreRef.current.geometry.setPositions(positions)
        }
        if (leaderNodeRef.current) {
            leaderNodeRef.current.visible = facing
            leaderNodeRef.current.position.copy(tip)
        }

        const scr = projectToScreen(end, camera, size)
        overlayRef.current?.move(scr.x, scr.y, facing)
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

            {/* 3D leader — shares the glowing/additive look of the globe markers
                so the annotation feels part of the same world, not a UI overlay.
                Positions are driven imperatively in useFrame above. */}
            <group>
                <mesh ref={leaderRingRef} visible={false} renderOrder={10}>
                    <ringGeometry args={[0.9, 1, 48]} />
                    <meshBasicMaterial color={activeColor} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} side={THREE.DoubleSide} />
                </mesh>
                <Line ref={leaderGlowRef} points={[[0, 0, 0], [0, 0, 0]]} color={activeColor} lineWidth={6} transparent opacity={0.22} depthWrite={false} depthTest={false} toneMapped={false} renderOrder={10} visible={false} />
                <Line ref={leaderCoreRef} points={[[0, 0, 0], [0, 0, 0]]} color={activeColor} lineWidth={2} transparent opacity={1} depthWrite={false} depthTest={false} toneMapped={false} renderOrder={11} visible={false} />
                <sprite ref={leaderNodeRef} scale={0.12} visible={false} renderOrder={12}>
                    <spriteMaterial map={nodeTexture} color={activeColor} transparent depthWrite={false} depthTest={false} toneMapped={false} />
                </sprite>
            </group>

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
