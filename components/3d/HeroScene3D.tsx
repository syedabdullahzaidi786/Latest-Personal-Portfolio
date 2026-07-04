'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { AstronautSuit, AstronautGlow } from '@/components/3d/Astronaut';

type MouseRef = { x: number; y: number; tx: number; ty: number };

function Stars({ count = 60, mouse }: { count?: number; mouse: MouseRef }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.2) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.00008;
      mouse.tx += (mouse.x - mouse.tx) * 0.2;
      mouse.ty += (mouse.y - mouse.ty) * 0.2;
      ref.current.position.x = mouse.tx * 0.5;
      ref.current.position.y = mouse.ty * 0.4;
    }
  });

  return (
    <Points ref={ref} positions={positions}>
      <PointMaterial transparent size={0.025} sizeAttenuation depthWrite={false} color="#ffffff" opacity={0.4} />
    </Points>
  );
}

export function BackgroundScene({ mouse }: { mouse: MouseRef }) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ width: '100%', height: '100%' }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <Stars mouse={mouse} />
    </Canvas>
  );
}

export function AstronautScene({ mouse }: { mouse: MouseRef }) {
  return (
    <Canvas camera={{ position: [0, 0.8, 6], fov: 45 }} style={{ width: '100%', height: '100%' }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-3, 2, 3]} intensity={0.5} color="#3b82f6" />
      <directionalLight position={[3, -2, 3]} intensity={0.3} color="#3b82f6" />
      <AstronautGlow />
      <AstronautSuit mouse={mouse} />
    </Canvas>
  );
}
