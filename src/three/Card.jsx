import { useTexture } from '@react-three/drei'
import React from 'react'

const Card = ({project}) => {

    const texture = useTexture(project.thumbnail);

  return (
    <>
    <mesh>
        <planeGeometry/>
        <meshBasicMaterial/>
    </mesh>
    </>
  )
}

export default Card