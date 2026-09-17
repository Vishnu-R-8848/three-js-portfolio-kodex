import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from '../three/Experience'
import projects from "../data/Projects.js"

const HomePage = () => {

    // console.log(projects)
    

    return (
        <div
            className='h-screen w-full bg-neutral-900 text-neutral-200'
        >
            <Canvas camera={{ position: [2, 2, 2], fov: 75 }}>
                <OrbitControls />
                <Experience />
            </Canvas>
        </div>
    )

}

export default HomePage