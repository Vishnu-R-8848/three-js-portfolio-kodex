// src/three/Deck.jsx
import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import Card from './Card'

const RADIUS = 4.5; // Circle radius
const AUTO_SPEED = 0.15; // Idle rotation speed
const WHEEL_SENSITIVITY = 0.002;
const DAMPING = 0.95;

const Deck = ({ projects }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const groupRef = useRef(null)
  const velocity = useRef(0)

  const count = projects.length

  // Wheel scroll interaction
  useEffect(() => {
    const handleWheel = (e) => {
      velocity.current += e.deltaY * WHEEL_SENSITIVITY
    }
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  // Animation frame loop
  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Apply scroll velocity with damping
    groupRef.current.rotation.y += velocity.current
    velocity.current *= DAMPING

    // Auto-rotate when not hovering any card
    if (hoveredIndex === null) {
      groupRef.current.rotation.y += AUTO_SPEED * delta
    }
  })

  return (
    <group ref={groupRef}>
      {projects.map((project, index) => {
        // Calculate circular distribution on X and Z
        const angle = (index / count) * Math.PI * 2
        const x = Math.sin(angle) * RADIUS
        const z = Math.cos(angle) * RADIUS

        // Face outward along the circle normal
        const cardRotationY = angle

        return (
          <Card
            project={project}
            key={project.id}
            index={index}
            position={[x, 0, z]}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            baseRotationY={cardRotationY}
          />
        )
      })}
    </group>
  )
}

export default Deck