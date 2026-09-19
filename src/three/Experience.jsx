import React from 'react'
import Deck from './Deck'
import projects from '../data/Projects'

const Experience = () => {
    return (
        <>
            {/* <mesh>
                <boxGeometry args={[1, 1, 1]}></boxGeometry>
                <meshBasicMaterial color="#00ff00"></meshBasicMaterial>
            </mesh> */}

            <Deck projects={projects} />
        </>
    )
}

export default Experience