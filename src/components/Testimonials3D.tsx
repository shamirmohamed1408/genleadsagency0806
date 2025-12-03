import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NeuralNetwork = () => {
  const networkRef = useRef<THREE.Group>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const network = useMemo(() => {
    const nodes = 30;
    const nodePositions = new Float32Array(nodes * 3);
    const lines: number[] = [];
    
    // Create nodes
    for (let i = 0; i < nodes; i++) {
      const i3 = i * 3;
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      nodePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      nodePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      nodePositions[i3 + 2] = radius * Math.cos(phi);
    }
    
    // Create connections
    for (let i = 0; i < nodes; i++) {
      for (let j = i + 1; j < nodes; j++) {
        const dx = nodePositions[i * 3] - nodePositions[j * 3];
        const dy = nodePositions[i * 3 + 1] - nodePositions[j * 3 + 1];
        const dz = nodePositions[i * 3 + 2] - nodePositions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < 2) {
          lines.push(
            nodePositions[i * 3], nodePositions[i * 3 + 1], nodePositions[i * 3 + 2],
            nodePositions[j * 3], nodePositions[j * 3 + 1], nodePositions[j * 3 + 2]
          );
        }
      }
    }
    
    return { nodePositions, lines: new Float32Array(lines) };
  }, []);

  useFrame((state) => {
    if (networkRef.current) {
      networkRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
      networkRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.06) * 0.1;
      
      // Parallax
      networkRef.current.position.x = mousePosition.current.x * 0.2;
      networkRef.current.position.y = mousePosition.current.y * 0.2;
    }
  });

  return (
    <group ref={networkRef}>
      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={network.nodePositions.length / 3}
            array={network.nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#dcb95a"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
      
      {/* Connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={network.lines.length / 3}
            array={network.lines}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#eed68b"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

const PulsingGlow = () => {
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      glowRef.current.scale.set(scale, scale, scale);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.05 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02;
    }
  });

  return (
    <mesh ref={glowRef}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshBasicMaterial
        color="#dcb95a"
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export const Testimonials3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 45 }} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.4} color="#dcb95a" />
        <NeuralNetwork />
        <PulsingGlow />
      </Canvas>
    </div>
  );
};
