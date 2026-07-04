'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Model({ mouse }: { mouse: { x: number; y: number } }) {
  const { scene, animations } = useGLTF('/models/astronaut.glb');
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { actions } = useAnimations(animations, groupRef);
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const mouseVec = useRef(new THREE.Vector2());
  const worldPos = useRef(new THREE.Vector3());
  const spring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();
        let parentHasGlass = false;
        let parent = mesh.parent;
        while (parent) {
          const pn = parent.name.toLowerCase();
          if (pn.includes('glass') || pn.includes('visor')) {
            parentHasGlass = true;
            break;
          }
          parent = parent.parent;
        }
        if (name.includes('visor') || name.includes('glass') || name.includes('helmet') || parentHasGlass) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: '#111827',
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 1.5,
            transparent: true,
            opacity: 0.95,
          });
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    const action = actions['metarig|walking(28)'];
    if (action) {
      action.reset().play();
      action.setEffectiveTimeScale(0.35);
    }
    return () => { action?.stop(); };
  }, [actions]);

  useFrame((state) => {
    if (!groupRef.current || !modelRef.current) return;

    const s = spring.current;
    const floatY = Math.sin(state.clock.elapsedTime * 0.7) * 0.1;

    if (groupRef.current.userData._baseY === undefined) {
      groupRef.current.userData._baseY = groupRef.current.position.y;
    }
    groupRef.current.position.y = groupRef.current.userData._baseY + floatY;

    mouseVec.current.set(mouse.x, mouse.y);
    raycaster.current.setFromCamera(mouseVec.current, state.camera);
    raycaster.current.ray.intersectPlane(plane.current, worldPos.current);

    const dx = worldPos.current.x;
    const dy = worldPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 1.5;

    if (dist < radius) {
      const targetRotX = Math.min(Math.max(dy * 0.12, -0.18), 0.18);
      const targetRotY = Math.min(Math.max(dx * 0.22, -0.35), 0.35);
      s.x += (targetRotX - s.x) * 0.06;
      s.y += (targetRotY - s.y) * 0.06;
    } else {
      s.x *= 0.94;
      s.y *= 0.94;
      if (Math.abs(s.x) < 0.003 && Math.abs(s.y) < 0.003) {
        s.x = 0; s.y = 0;
      }
    }

    modelRef.current.rotation.x = s.x;
    modelRef.current.rotation.y = s.y;

    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
      <group ref={groupRef} position={[0.5, -1.2, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{ uOpacity: { value: 0.12 } }}
          vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
          fragmentShader={`varying vec2 vUv;uniform float uOpacity;void main(){float d=distance(vUv,vec2(0.5));float a=smoothstep(0.5,0.0,d)*uOpacity;gl_FragColor=vec4(0.0,0.0,0.0,a);}`}
        />
      </mesh>
      <mesh ref={glowRef} position={[0, -0.2, 0]}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>
      <group ref={modelRef}>
        <primitive object={scene} scale={1.4} />
      </group>
    </group>
  );
}

export function AstronautSuit({ mouse }: { mouse: { x: number; y: number } }) {
  return <Model mouse={mouse} />;
}

export function AstronautGlow() {
  return null;
}

useGLTF.preload('/models/astronaut.glb');

export function Astronaut() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-4, 3, 4]} intensity={0.8} color="#3b82f6" />
        <directionalLight position={[4, -3, 4]} intensity={0.5} color="#3b82f6" />
        <directionalLight position={[0, 0.5, -3]} intensity={1.0} color="#3b82f6" />
        <pointLight position={[0, 4, 3]} intensity={0.6} color="#ffffff" />
        <pointLight position={[0, -4, 3]} intensity={0.3} color="#4a9eff" />
        <hemisphereLight args={['#3b82f6', '#0a0a1a', 0.3]} />
        <AstronautSuit mouse={{ x: 0, y: 0 }} />
      </Canvas>
    </div>
  );
}
