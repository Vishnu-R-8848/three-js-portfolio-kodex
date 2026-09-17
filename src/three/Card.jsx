import { useTexture } from '@react-three/drei'
import React, { useMemo } from 'react'

const Card = ({project}) => {

    const texture = useTexture(project.thumbnail);

    useMemo(()=>{
        const img = texture.image;
        const aspect = img ? img.width / img.height : 1;
        
    })

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