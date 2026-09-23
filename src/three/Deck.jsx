import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import Card from "./Card";

const RADIUS = 4.5;
const AUTO_SPEED = 0.15;
const WHEEL_SENSITIVITY = 0.002;
const DAMPING = 0.92;

const Deck = ({ projects }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const groupRef = useRef(null);
  const velocity = useRef(0);

  const count = projects.length;

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      velocity.current += (e.deltaY || e.deltaX) * WHEEL_SENSITIVITY;
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Apply scroll momentum
    groupRef.current.rotation.y += velocity.current;
    velocity.current *= DAMPING;

    // Idle spin when no card is hovered
    if (hoveredIndex === null) {
      groupRef.current.rotation.y += AUTO_SPEED * delta;
    }
  });

  return (
    <group ref={groupRef}>
      {projects.map((project, index) => {
        const angle = (index / count) * Math.PI * 2;
        const x = Math.sin(angle) * RADIUS;
        const z = Math.cos(angle) * RADIUS;

        return (
          <Card
            project={project}
            key={project.id}
            index={index}
            position={[x, 0, z]}
            baseRotationY={angle}
            velocity={velocity}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        );
      })}
    </group>
  );
};

export default Deck;