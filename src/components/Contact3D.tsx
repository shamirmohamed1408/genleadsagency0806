import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const EnergyWave = () => {
  const waveRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 8, 50, 40);
    return geo;
  }, []);

  const shader = useMemo(() => ({
    vertexShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        
        vec3 pos = position;
        float wave1 = sin(pos.x * 1.5 + uTime * 0.5) * 0.3;
        float wave2 = sin(pos.y * 1.2 + uTime * 0.3) * 0.2;
        pos.z = wave1 + wave2;
        
        vElevation = pos.z;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform float uTime;
      
      void main() {
        float strength = (vElevation + 0.5) * 0.8;
        vec3 color1 = vec3(0.863, 0.725, 0.353); // #dcb95a
        vec3 color2 = vec3(0.933, 0.839, 0.545); // #eed68b
        vec3 finalColor = mix(color1, color2, strength);
        
        float alpha = 0.15 + strength * 0.1;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    uniforms: {
      uTime: { value: 0 }
    }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    if (waveRef.current) {
      waveRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={waveRef} geometry={geometry} rotation={[-Math.PI * 0.3, 0, Math.PI * 0.15]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
        uniforms={shader.uniforms}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const GoldenParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 12;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.getElapsedTime() + positions[i]) * 0.002;
        positions[i] += Math.cos(state.clock.getElapsedTime() * 0.5 + positions[i + 1]) * 0.001;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Parallax
      particlesRef.current.rotation.x = mousePosition.current.y * 0.05;
      particlesRef.current.rotation.y = mousePosition.current.x * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#dcb95a"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const Contact3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 3]} intensity={0.6} color="#dcb95a" />
        <EnergyWave />
        <GoldenParticles />
      </Canvas>
    </div>
  );
};
