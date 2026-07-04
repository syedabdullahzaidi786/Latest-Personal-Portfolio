'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, AdaptiveDpr, AdaptiveEvents, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

type TechItem = {
  name: string;
  category: string;
  color: string;
};

const techs: TechItem[] = [
  { name: 'OpenAI Agents SDK', category: 'AI & Agentic', color: '#3b82f6' },
  { name: 'MCP', category: 'AI & Agentic', color: '#b07cd8' },
  { name: 'RAG', category: 'AI & Agentic', color: '#3b82f6' },
  { name: 'Claude Code', category: 'AI & Agentic', color: '#d97757' },
  { name: 'Gemini', category: 'AI & Agentic', color: '#8ab4f8' },
  { name: 'Qdrant', category: 'AI & Agentic', color: '#ea2845' },
  { name: 'Chainlit', category: 'AI & Agentic', color: '#f9d44a' },
  { name: 'FastAPI', category: 'Backend', color: '#009688' },
  { name: 'PostgreSQL', category: 'Backend', color: '#4169E1' },
  { name: 'Neon', category: 'Backend', color: '#00e599' },
  { name: 'Kafka', category: 'Backend', color: '#6e6e6e' },
  { name: 'Docker', category: 'Backend', color: '#2496ed' },
  { name: 'Next.js', category: 'Frontend', color: '#ffffff' },
  { name: 'React', category: 'Frontend', color: '#58c4dc' },
  { name: 'TypeScript', category: 'Frontend', color: '#3178c6' },
  { name: 'Tailwind CSS', category: 'Frontend', color: '#06b6d4' },
  { name: 'Framer Motion', category: 'Frontend', color: '#0055ff' },
  { name: 'Three.js', category: 'Frontend', color: '#c8d6e5' },
  { name: 'Vercel', category: 'DevOps & Cloud', color: '#ffffff' },
  { name: 'Google Cloud', category: 'DevOps & Cloud', color: '#4285f4' },
  { name: 'Hugging Face', category: 'DevOps & Cloud', color: '#ffd21e' },
  { name: 'Kubernetes', category: 'DevOps & Cloud', color: '#326ce5' },
  { name: 'Python', category: 'Languages', color: '#f7df1e' },
  { name: 'JavaScript', category: 'Languages', color: '#f0db4f' },
  { name: 'Clerk', category: 'Auth & CMS', color: '#6c47ff' },
  { name: 'Sanity CMS', category: 'Auth & CMS', color: '#f97316' },
  { name: 'NPM', category: 'Open Source', color: '#cb3837' },
  { name: 'Figma', category: 'Design', color: '#a259ff' },
];

function groundLayout(samples: number, radius: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < samples; i++) {
    const t = (i + 1) / samples;
    const r = radius * Math.sqrt(t);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const y = Math.sin(theta * 2) * 0.15;
    positions.push([x, y, z]);
  }
  return positions;
}

function TechBall({
  tech,
  gridPos,
  mouse,
  index,
}: {
  tech: TechItem;
  gridPos: [number, number, number];
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const targetPos = useMemo(() => new THREE.Vector3(...gridPos), [gridPos]);
  const floatPhase = useMemo(() => index * 2.1, [index]);

  const labelOffset = useMemo(() => {
    const d = new THREE.Vector3(...gridPos).normalize().multiplyScalar(0.41);
    return [d.x, d.y, d.z] as [number, number, number];
  }, [gridPos]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const px = mouse.current.x * 0.3;
    const py = mouse.current.y * 0.3;
    const float = Math.sin(state.clock.elapsedTime * 0.4 + floatPhase) * 0.04;
    const dx = targetPos.x + px - groupRef.current.position.x;
    const dy = targetPos.y + py + float - groupRef.current.position.y;
    groupRef.current.position.x += dx * 0.04;
    groupRef.current.position.y += dy * 0.04;
  });

  const baseColor = tech.color === '#ffffff' ? '#a0a0a0' : tech.color;

  return (
    <group ref={groupRef} position={gridPos}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={hovered ? 0.8 : 0.08}
          roughness={0.15}
          metalness={0.2}
          clearcoat={0.85}
          clearcoatRoughness={0.2}
          envMapIntensity={1.0}
        />
      </mesh>
      <group position={labelOffset}>
        <Text
          fontSize={0.09}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.8}
          outlineWidth={0.014}
          outlineColor="#000000"
          outlineOpacity={0.85}
        >
          {tech.name}
        </Text>
      </group>
    </group>
  );
}

function ReducedMotionBall({ tech, gridPos }: { tech: TechItem; gridPos: [number, number, number] }) {
  const baseColor = tech.color === '#ffffff' ? '#a0a0a0' : tech.color;
  const labelOffset = useMemo(() => {
    const d = new THREE.Vector3(...gridPos).normalize().multiplyScalar(0.41);
    return [d.x, d.y, d.z] as [number, number, number];
  }, [gridPos]);

  return (
    <group position={gridPos}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.08}
          roughness={0.15}
          metalness={0.2}
          clearcoat={0.85}
          clearcoatRoughness={0.2}
          envMapIntensity={1.0}
        />
      </mesh>
      <group position={labelOffset}>
        <Text
          fontSize={0.09}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.8}
          outlineWidth={0.014}
          outlineColor="#000000"
          outlineOpacity={0.85}
        >
          {tech.name}
        </Text>
      </group>
    </group>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
      <ringGeometry args={[2.5, 5.5, 64]} />
      <meshBasicMaterial color="#3b82f6" opacity={0.03} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function TechCluster({ mouse, reducedMotion }: { mouse: React.MutableRefObject<{ x: number; y: number }>; reducedMotion: boolean }) {
  const positions = useMemo(() => groundLayout(techs.length, 4.5), []);

  return (
    <>
      <GroundPlane />
      {techs.map((tech, i) =>
        reducedMotion ? (
          <ReducedMotionBall key={tech.name} tech={tech} gridPos={positions[i]} />
        ) : (
          <TechBall key={tech.name} tech={tech} gridPos={positions[i]} mouse={mouse} index={i} />
        )
      )}
    </>
  );
}

function SceneInner({ reducedMotion }: { reducedMotion: boolean }) {
  const mouse = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    const move = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const leave = () => {
      mouse.current.x = 0;
      mouse.current.y = 0;
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 6, 4]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[-3, 2, -5]} intensity={0.3} color="#1d4ed8" />
      <directionalLight position={[2, 3, -6]} intensity={0.5} />
      <directionalLight position={[-2, 1, 5]} intensity={0.2} color="#3b82f6" />
      <Sparkles count={20} scale={8} size={0.03} speed={0.1} opacity={0.15} color="#ffffff" />
      <TechCluster mouse={mouse} reducedMotion={reducedMotion} />
    </>
  );
}

export function TechClusterScene() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 1.5, 7], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <SceneInner reducedMotion={reducedMotion} />
    </Canvas>
  );
}
