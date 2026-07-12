import { Suspense, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { OrbitControls, Stars, Loader } from '@react-three/drei'
import gsap from 'gsap'

import { icoTransition } from '../lib/icoBus'
import countryPointData from '../assets/data/countryPoint.json'

// 2K로 다운스케일한 텍스처 (8K 원본은 GPU 업로드 스터터와 VRAM 수백 MB 점유의 원인)
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

function EarthModel({ countryInfo, countryInfoName }) {

    const navigate = useNavigate()

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

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime()

        earthRef.current.rotation.y = elapsedTime / 25
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

    const infoShowingUp = (e) => {
        countryInfo.current.style.display = 'flex'
        countryInfoName.current.innerHTML = `<div class="country-name-show-up">${e.object.userData.name}</div>`
    }

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
                <meshStandardMaterial map={colorMap} normalMap={normalMap} metalness={0.39} roughness={0.7} />

                {countryPoints.map((countryPoint) => (
                    <mesh
                        position={[countryPoint.x, countryPoint.y, countryPoint.z]}
                        rotation={[0.0, -countryPoint.lon, countryPoint.lat - Math.PI * 0.5]}
                        onClick={() => navigate('/MemoryPhotoGallery', { state: { countryPoint } })}
                        userData={{ name: countryPoint.name }}
                        onPointerOver={infoShowingUp}
                        onPointerOut={infoShowingDown}
                        key={countryPoint._id}
                    >
                        <sphereGeometry args={[0.02, 32, 32]} />
                        <meshBasicMaterial color={countryPoint.color} />
                    </mesh>
                ))}
            </mesh>

            {/* Project planet */}
            <mesh
                position={[-9, 2, -6]}
                onClick={() => navigate('/SSYProject')}
                ref={projectPlanetCover}
            >
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
            <mesh
                position={[9, -3, -3]}
                onClick={() => navigate('/warningscreen')}
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

function EarthScreen() {

    const countryInfo = useRef()
    const countryInfoName = useRef()

    useEffect(() => {
        icoTransition('hide')
        gsap.to('.earthContainer', { duration: 1, opacity: 1, delay: 0.5 })

        return () => {
            icoTransition('show')
        }
    }, [])

    return (
        <div className="earthContainer">
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
                    <EarthModel countryInfo={countryInfo} countryInfoName={countryInfoName} />
                </Suspense>
            </Canvas>
            <Loader />
        </div>
    )
}

export default EarthScreen
