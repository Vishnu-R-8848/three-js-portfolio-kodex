import React, { useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";

// Exact mentor shader string
const vertexShader = `
  varying vec2 vUv;
  uniform float uVelocity;

  void main() {
    vUv = uv;

    vec3 transformed = position;

    // Normalize X to -1 -> 1
    float x = position.y;

    // Bell curve
    // Highest in the center, fades towards the edges
    float bell = exp(-x * x * 2.0);

    // Velocity controls the strength of the curve
    float curveStrength = uVelocity * 0.4;

    transformed.x -= bell * curveStrength;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    float gray = dot(texture.rgb, vec3(0.229, 0.585, 0.114));
    vec3 result = mix(vec3(gray), texture.rgb, 0.5);
    gl_FragColor = vec4(result, texture.a);
  }
`;

const Card = ({
  project,
  index,
  position = [0, 0, 0],
  baseRotationY = 0,
  velocity,
  hoveredIndex,
  setHoveredIndex,
}) => {
  const texture = useTexture(project.thumbnail);
  const navigate = useNavigate();
  const meshRef = useRef(null);

  const [width, height] = useMemo(() => {
    const img = texture.image;
    const aspect = img ? img.width / img.height : 1.4;
    const maxHeight = 2.4;
    return [maxHeight * aspect, maxHeight];
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uVelocity: { value: 0.0 },
    }),
    [texture]
  );

  const { contextSafe } = useGSAP({ scope: meshRef });

  const handlePointerOver = contextSafe((e) => {
    e.stopPropagation();
    setHoveredIndex(index);
    document.body.style.cursor = "pointer";

    gsap.to(meshRef.current.scale, {
      x: 1.08,
      y: 1.08,
      z: 1.08,
      duration: 0.35,
      ease: "power2.out",
    });
  });

  const handlePointerLeave = contextSafe((e) => {
    e.stopPropagation();
    setHoveredIndex(null);
    document.body.style.cursor = "default";

    gsap.to(meshRef.current.scale, {
      x: 1.0,
      y: 1.0,
      z: 1.0,
      duration: 0.35,
      ease: "power2.out",
    });
  });

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/projects/${project.slug}`);
  };

  useFrame(() => {
    if (velocity?.current !== undefined) {
      uniforms.uVelocity.value = velocity.current;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, baseRotationY, 0]}
      onPointerOver={handlePointerOver}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {/* 32x32 segments allow the vertices to flex */}
      <planeGeometry args={[width, height, 32, 32]} />
      <shaderMaterial
        key={width}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Card;