// src/three/Card.jsx
import { useGSAP } from "@gsap/react"
import { useTexture } from "@react-three/drei"
import React, { useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"
import * as THREE from "three"

const Card = ({
  project,
  index,
  position = [0, 0, 0],
  hoveredIndex,
  setHoveredIndex,
  baseRotationY = 0,
}) => {
  const texture = useTexture(project.thumbnail)
  const navigate = useNavigate()
  const meshRef = useRef(null)

  const [width, height] = useMemo(() => {
    const img = texture.image
    const aspect = img ? img.width / img.height : 1.5
    const maxHeight = 2.4
    return [maxHeight * aspect, maxHeight]
  }, [texture])

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
    }),
    [texture]
  )

  const vertexShader = `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform sampler2D uTexture;
    varying vec2 vUv;
    void main(){
      vec4 color = texture2D(uTexture, vUv);
      gl_FragColor = color;
    }
  `

  const { contextSafe } = useGSAP({ scope: meshRef })

  const handlePointerOver = contextSafe((e) => {
    e.stopPropagation()
    setHoveredIndex(index)
    document.body.style.cursor = "pointer"

    gsap.to(meshRef.current.scale, {
      x: 1.1,
      y: 1.1,
      z: 1.1,
      duration: 0.4,
      ease: "power2.out",
    })
  })

  const handlePointerLeave = contextSafe((e) => {
    e.stopPropagation()
    setHoveredIndex(null)
    document.body.style.cursor = "default"

    gsap.to(meshRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.4,
      ease: "power2.out",
    })
  })

  const handleClick = (e) => {
    e.stopPropagation()
    navigate(`/projects/${project.slug}`)
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, baseRotationY, 0]}
      onPointerOver={handlePointerOver}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default Card