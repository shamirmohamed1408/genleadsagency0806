import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DataClusters = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      sizes[i] = Math.random() * 0.05 + 0.02;
    }
    
    return { positions, sizes };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.15;
      
      // Subtle parallax
      particlesRef.current.rotation.z = mousePosition.current.x * 0.05;
      particlesRef.current.position.x = mousePosition.current.x * 0.3;
      particlesRef.current.position.y = mousePosition.current.y * 0.3;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#dcb95a"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const FlowingLines = () => {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const geometry = useMemo(() => {
    const lineCount = 15;
    const positions = new Float32Array(lineCount * 6);
    
    for (let i = 0; i < lineCount; i++) {
      const i6 = i * 6;
      const angle = (i / lineCount) * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      
      positions[i6] = Math.cos(angle) * radius;
      positions[i6 + 1] = Math.sin(angle) * radius;
      positions[i6 + 2] = -5 + Math.random() * 10;
      
      positions[i6 + 3] = Math.cos(angle + 0.5) * (radius + 1);
      positions[i6 + 4] = Math.sin(angle + 0.5) * (radius + 1);
      positions[i6 + 5] = -5 + Math.random() * 10;
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#eed68b"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

export const Services3D = () => {
  const handleMouseMove = (event: MouseEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const particlesRef = document.querySelector('canvas');
    if (particlesRef) {
      (particlesRef as any).mouseX = x;
      (particlesRef as any).mouseY = y;
    }
  };

  return (
    <div 
      className="w-full h-full"
      onMouseMove={handleMouseMove as any}
    >
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 50 }} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#dcb95a" />
        <DataClusters />
        <FlowingLines />
      </Canvas>
    </div>
  );
};
